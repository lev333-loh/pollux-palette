#!/usr/bin/env python3
"""Package, lint, and optionally self-sign Pollux Palette for Firefox."""

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

INCLUDE_FILES = (
    "manifest.json",
    "background.js",
    "content.js",
    "inject.css",
    "theme-map.json",
    "material-color.js",
    "LICENSE",
    "NOTICE",
)
INCLUDE_DIRS = ("icons", "popup")
SKIP_SUFFIXES = (".bak", ".pyc", ".swp")
SKIP_NAMES = {".DS_Store", "__pycache__"}


def read_manifest(root: Path) -> dict:
    """Load manifest.json and verify required metadata."""
    with (root / "manifest.json").open("r", encoding="utf-8") as fh:
        return json.load(fh)


def collect_entries(root: Path) -> list[tuple[Path, str]]:
    """Collect sorted (source_path, archive_relpath) pairs for distribution."""
    entries: list[tuple[Path, str]] = []
    for rel in INCLUDE_FILES:
        src = root / rel
        if not src.is_file():
            raise FileNotFoundError(f"Required package file missing: {src}")
        entries.append((src, rel))

    for d in INCLUDE_DIRS:
        base = root / d
        if not base.is_dir():
            raise FileNotFoundError(f"Required package directory missing: {base}")
        for src in sorted(base.rglob("*")):
            if not src.is_file():
                continue
            if src.name in SKIP_NAMES or src.suffix in SKIP_SUFFIXES:
                continue
            if any(part in SKIP_NAMES for part in src.parts):
                continue
            entries.append((src, src.relative_to(root).as_posix()))

    entries.sort(key=lambda item: item[1])
    return entries


def file_sha256(path: Path) -> str:
    """Compute lowercase SHA-256 hex digest for a file."""
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def write_archive(target: Path, entries: list[tuple[Path, str]]) -> None:
    """Create a ZIP/XPI package containing strictly the release entries."""
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as zf:
        for src, arc_name in entries:
            zf.write(src, arc_name)
    print(f"Built: {target} ({target.stat().st_size} bytes, sha256={file_sha256(target)[:12]}...)")


def stage_entries(entries: list[tuple[Path, str]], stage_dir: Path) -> None:
    """Copy clean release entries into a temporary staging directory."""
    for src, arc_name in entries:
        dst = stage_dir / arc_name
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def find_web_ext() -> str:
    """Locate the web-ext binary or abort with installation guidance."""
    path = shutil.which("web-ext")
    if not path:
        print("Error: 'web-ext' CLI not found in PATH.", file=sys.stderr)
        sys.exit(1)
    return path


def run_lint(entries: list[tuple[Path, str]]) -> int:
    """Run web-ext lint strictly against the clean staged release tree."""
    web_ext = find_web_ext()
    with tempfile.TemporaryDirectory(prefix="pollux-lint-") as tmp:
        stage_dir = Path(tmp)
        stage_entries(entries, stage_dir)
        cmd = [web_ext, "lint", "--source-dir", str(stage_dir), "--warnings-as-errors"]
        return subprocess.run(cmd, check=False).returncode


def run_sign(
    entries: list[tuple[Path, str]],
    signed_dir: Path,
    channel: str,
    api_key: str | None,
    api_secret: str | None,
    metadata_path: Path | None = None,
) -> int:
    """Submit the clean staged extension to Mozilla AMO for signing."""
    if not api_key or not api_secret:
        print(
            "Error: AMO credentials missing.\n"
            "Set AMO_JWT_ISSUER and AMO_JWT_SECRET (from https://addons.mozilla.org/developers/addon/api/key/)\n"
            "or pass --api-key and --api-secret, or upload dist/*-amo.zip manually at:\n"
            "https://addons.mozilla.org/developers/addon/submit/distribution",
            file=sys.stderr,
        )
        return 1

    if metadata_path is not None and not metadata_path.is_file():
        print(f"Error: AMO metadata file not found: {metadata_path}", file=sys.stderr)
        return 1

    web_ext = find_web_ext()
    signed_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="pollux-sign-") as tmp:
        stage_dir = Path(tmp)
        stage_entries(entries, stage_dir)
        cmd = [
            web_ext,
            "sign",
            "--no-input",
            "--source-dir",
            str(stage_dir),
            "--artifacts-dir",
            str(signed_dir),
            "--channel",
            channel,
            "--api-key",
            api_key,
            "--api-secret",
            api_secret,
        ]
        if channel == "listed":
            cmd.extend(["--approval-timeout", "0"])
        if metadata_path is not None:
            cmd.extend(["--amo-metadata", str(metadata_path)])
        return subprocess.run(cmd, check=False).returncode


def build(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build Pollux Palette Firefox packages.")
    parser.add_argument("--lint", action="store_true", help="Run web-ext lint on clean staged release files.")
    parser.add_argument("--sign", action="store_true", help="Sign clean package via web-ext sign (AMO).")
    parser.add_argument(
        "--channel",
        default="unlisted",
        choices=("unlisted", "listed"),
        help="AMO distribution channel when --sign is used (default: unlisted).",
    )
    parser.add_argument(
        "--metadata",
        type=Path,
        default=None,
        help="Path to --amo-metadata JSON (defaults to amo-metadata.json for --channel listed).",
    )
    parser.add_argument("--api-key", default=os.environ.get("AMO_JWT_ISSUER"), help="AMO API JWT issuer.")
    parser.add_argument("--api-secret", default=os.environ.get("AMO_JWT_SECRET"), help="AMO API JWT secret.")
    args = parser.parse_args(argv)

    root = Path(__file__).resolve().parent
    dist_dir = root / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)

    manifest = read_manifest(root)
    version = manifest["version"]
    entries = collect_entries(root)

    targets = [
        dist_dir / f"pollux-palette-{version}-unsigned.xpi",
        dist_dir / f"pollux-palette-{version}-amo.zip",
        dist_dir / "gemini-monet.xpi",
        dist_dir / "gemini-monet.zip",
    ]
    for target in targets:
        write_archive(target, entries)

    if args.lint:
        rc = run_lint(entries)
        if rc != 0:
            return rc

    if args.sign:
        metadata_path = args.metadata
        if metadata_path is None and args.channel == "listed":
            default_meta = root / "amo-metadata.json"
            if default_meta.is_file():
                metadata_path = default_meta
        return run_sign(entries, dist_dir / "signed", args.channel, args.api_key, args.api_secret, metadata_path)

    return 0


if __name__ == "__main__":
    raise SystemExit(build())
