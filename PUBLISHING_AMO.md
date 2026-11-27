# Publishing Pollux Palette on Mozilla Add-ons (Listed / AMO)

Ready-to-submit checklist for the public Mozilla Add-ons (`addons.mozilla.org`) **Listed ("On this site")** catalog.

## 1. Pre-flight Build & Lint

Generate the clean release bundle and validate with zero warnings:

```bash
python3 build.py --lint
```

Upload archive: `dist/pollux-palette-1.0.0-amo.zip` (18 runtime + license files; dev scripts and markdown docs are excluded).

---

## 2. Submit via AMO Developer Hub (Web) or CLI

### Option A — Web UI (Recommended for first Listed upload + screenshots)
1. Open [Mozilla Add-ons Developer Hub](https://addons.mozilla.org/developers/addon/submit/distribution).
2. Choose **"On this site"** (Listed).
3. Select compatibility: **Firefox** & **Firefox for Android** (`strict_min_version` `140.0` / `142.0` is already set in `manifest.json`).
4. Upload `dist/pollux-palette-1.0.0-amo.zip`.
5. When asked **"Do You Need to Submit Source Code?"**, choose **No** (all JS/CSS is readable, unbundled, and unminified).
6. Fill the store fields from `amo-metadata.json`:
   - **Name**: `Pollux Palette`
   - **Summary**: `Gemini Material You Theme — dynamic Material 3 (Monet) theming and native styling for Gemini Web.`
   - **Categories**: `Appearance` (both Firefox & Android)
   - **License**: `Apache License 2.0`
   - **Homepage**: `https://github.com/lev333-loh/pollux-palette`
   - **Support URL**: `https://github.com/lev333-loh/pollux-palette/issues`
   - **Description & Reviewer Notes**: copy `description["en-US"]` and `version.approval_notes` from `amo-metadata.json`.
7. Attach **2–4 screenshots** before finishing the public listing.

### Option B — CLI Submission (`web-ext sign --channel listed`)
Create API credentials at [AMO API Keys](https://addons.mozilla.org/developers/addon/api/key/), then run:

```bash
AMO_JWT_ISSUER="your-issuer" AMO_JWT_SECRET="your-secret" python3 build.py --sign --channel listed
```

`build.py` automatically passes `--amo-metadata amo-metadata.json` and `--approval-timeout 0` (so CLI returns once AMO accepts the upload into the human review queue). Afterwards, upload screenshots on your add-on's **Edit Listing** page in AMO Developer Hub.

---

## 3. Clean Screenshot Checklist (Privacy First!)

Before capturing screenshots of `gemini.google.com` + popup for the public AMO page:
- **Collapse the sidebar** (or use a clean/test Google account) so personal chat titles, email/avatar, and bottom location ("Defined from home address...") are **not visible**.
- Suggested 4 shots (`1280x800` or `16:10` / `16:9` PNG):
  1. **Dark Mode Chat + Popup**: `Monet 2021` or `Monet 2026 (Approx.)`, Sakura/Lavender seed, showing custom themed bubbles & extension popup.
  2. **Light Mode + Scheme Comparison**: Light palette (e.g., Ocean / Emerald + Expressive scheme).
  3. **Library / Search Modal**: Highlighting styled React/StyleX surfaces (`/library` or Search Chats dialog).
  4. **Wallpaper Color Picker**: `popup/picker.html` extracting a seed color from an abstract wallpaper (use CC0 / your own artwork).
