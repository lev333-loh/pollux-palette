# Pollux Palette

**Gemini Material You Theme** — standalone WebExtension for Firefox (Desktop & Mobile) that brings dynamic Material You (Monet) theming and native Material 3 styling to Gemini Web (`gemini.google.com`) and the One Google Account widget (`ogs.google.com`).

---

## Features

- **Zero-dependency Color Engine (`material-color.js`)**: Pure Vanilla JS sRGB / CIE XYZ / CIE L\*a\*b\* tonal palette generator.
- **Monet Eras (`2021` & `2026` Approx.) & 7 M3 Schemes**:
  - `Monet 2021 (AOSP)`: Follows documented Android 12 `ColorScheme.kt` chroma ratios.
  - `Monet 2026 (Approx.)`: Cleanroom algorithmic approximation inspired by Material 3 Expressive higher vibrancy *(see Disclaimer below)*.
  - Schemes: `Tonal Spot`, `Rainbow`, `Vibrant`, `Expressive`, `Neutral`, `Fidelity`, `Monochrome`.
- **Light & Dark Modes + Pywalfox Sync**: Toggle Light/Dark live or pull your active Firefox/Pywalfox theme seed color.
- **Color Wheel, Presets & `+` Custom Presets**:
  - 9 built-in presets (`Sakura`, `Lavender`, `Emerald`, `Ocean`, `Amber`, `Berry`, `Nord`, `Slate`, plus standalone `Monochrome`).
  - One-click `+` chip adds the current `Active Seed` as a persistent custom preset (with remove `×` button and parity-responsive 1/2-column width).
- **Pick from Wallpaper (`popup/picker.html`)**: Drop or paste an image to extract its dominant seed color and apply the Monet palette.
- **User Query Edit Mode (`Canon` vs `Legacy`)**: Live switch between the unified Monet bubble (`Canon`) and native Gemini wide edit form (`Legacy`), scoped with native CSS `@scope`.
- **Power Toggle + Zero FOUC**: Header power button enables/disables extension theming and reloads open `gemini.google.com` tabs; styles apply at `document_start` via `document.adoptedStyleSheets`.
- **Full Surface Coverage**: Styles main chat, React/StyleX islands (`/library` and Search Chats modal), menus, tooltips, bottom sheets, code blocks, and the One Google account popup.

---

## Installation

### Permanent Install (No Temporary Reloading Required)

> **Why a signed `.xpi` or ESR/Dev build is required:** Standard **Firefox Release** checks Mozilla cryptographic signatures on `.xpi` packages and ignores `xpinstall.signatures.required` overrides for unsigned files.

#### Option A — Any Release Firefox (Desktop & Android) via Free Self-Signed `.xpi` *(Recommended)*
1. Build the clean release bundle:
   ```bash
   python3 build.py
   ```
2. Submit `dist/pollux-palette-1.0.0-amo.zip` to Mozilla Add-ons using the **Unlisted ("On your own")** channel — either:
   - **Web upload:** open [Mozilla Add-ons Developer Hub](https://addons.mozilla.org/developers/addon/submit/distribution), choose **"On your own"**, upload `dist/pollux-palette-1.0.0-amo.zip`, and download the signed `.xpi`.
   - **CLI signing:** create API keys at [AMO API Keys](https://addons.mozilla.org/developers/addon/api/key/) and run:
     ```bash
     AMO_JWT_ISSUER="your-issuer" AMO_JWT_SECRET="your-secret" python3 build.py --sign
     ```
     Signed `.xpi` packages are saved to `dist/signed/`.
3. In Firefox, open `about:addons`, click the gear icon, select **"Install Add-on From File..."**, and choose the signed `.xpi`. It persists permanently across restarts.

#### Option B — Firefox ESR / Developer Edition / Nightly / LibreWolf (Unsigned Direct Install)
1. Open `about:config` and set `xpinstall.signatures.required` to `false`.
2. Open `about:addons`, click the gear icon, select **"Install Add-on From File..."**, and choose `dist/pollux-palette-1.0.0-unsigned.xpi`.

### Temporary Install (Development / Testing)

- **Firefox Desktop:** Open `about:debugging#/runtime/this-firefox` -> **"Load Temporary Add-on..."** -> select `manifest.json` (or `dist/pollux-palette-1.0.0-unsigned.xpi`).
- **Firefox Android (Nightly / Beta):** Enable Debug mode in Firefox Settings (tap Firefox logo 5 times) and install via Custom Add-on Collection or USB `about:debugging`.

---

## Build

Package unsigned `.xpi` and AMO upload `.zip` into `dist/`:
```bash
python3 build.py
```

Package and validate strictly clean release files with `web-ext lint`:
```bash
python3 build.py --lint
```

Generated artifacts in `dist/`:
- `dist/pollux-palette-1.0.0-unsigned.xpi` — standalone unsigned `.xpi` (ESR / Developer Edition / Nightly / LibreWolf / debugging).
- `dist/pollux-palette-1.0.0-amo.zip` — clean archive containing strictly runtime files + `LICENSE` + `NOTICE` for AMO Unlisted or Listed submission.
- `dist/gemini-monet.xpi`, `dist/gemini-monet.zip` — compatibility aliases matching legacy filenames.

For public AMO Listed submission instructions and store metadata, see [PUBLISHING_AMO.md](PUBLISHING_AMO.md) and [amo-metadata.json](amo-metadata.json).

---

## License & Attribution

Licensed under the **[Apache License 2.0](LICENSE)**. See [NOTICE](NOTICE) for full third-party attribution.

- **UI Icons**: Vector SVG `<path>` icons in the popup and wallpaper picker use **Google Material Symbols Rounded** (`google/material-design-icons`, Apache License 2.0).
- **Color Constants**: `Monet 2021` references public tonal chroma constants from the **Android Open Source Project (AOSP)** (`ColorScheme.kt`, Apache License 2.0).

## Disclaimer

- **Unofficial Project**: Pollux Palette is an independent, unofficial extension and is **not** affiliated with, endorsed by, or sponsored by Google LLC. "Google", "Gemini", "Material You", and "Material Design" are trademarks or service marks of Google LLC.
- **"Monet 2026" Mode**: Google has not published an official algorithm under the name "Monet 2026". This option is an independent algorithmic approximation inspired by Material 3 Expressive dynamic color concepts and is explicitly labeled as an approximation both in source code and UI.
- **Zero Google Proprietary Assets**: No proprietary Google stylesheets, scripts, or copyrighted images are bundled inside this extension.
