# Pollux Palette

**Gemini Material You Theme** — standalone WebExtension for Firefox (Desktop & Mobile) that brings dynamic Material You (Monet) theming and native Material 3 styling to Gemini Web (`gemini.google.com`) and the One Google Account widget (`ogs.google.com`).

---

## Features

- **Zero-dependency Color Engine (`material-color.js`)**: Pure Vanilla JS sRGB / CIE XYZ / CIE L\*a\*b\* tonal palette generator.
- **Monet Eras (`2021` & `2026` Approx.) & 6 M3 Schemes**:
  - `Monet 2021 (AOSP)`: Follows documented Android 12 `ColorScheme.kt` chroma ratios.
  - `Monet 2026 (Approx.)`: Cleanroom algorithmic approximation inspired by Material 3 Expressive higher vibrancy *(see Disclaimer below)*.
  - Schemes: `Tonal Spot`, `Rainbow`, `Vibrant`, `Expressive`, `Neutral`, `Fidelity`.
- **Light & Dark Modes + Pywalfox Sync**: Toggle Light/Dark live or pull your active Firefox/Pywalfox theme seed color.
- **Color Wheel, Presets & `+` Custom Presets**:
  - 8 built-in seeds (`Sakura`, `Lavender`, `Emerald`, `Ocean`, `Amber`, `Berry`, `Nord`, `Slate`).
  - One-click `+` chip adds the current `Active Seed` as a persistent custom preset (with remove `×` button and parity-responsive 1/2-column width).
- **Pick from Wallpaper (`popup/picker.html`)**: Drop or paste an image to extract its dominant seed color and apply the Monet palette.
- **User Query Edit Mode (`Canon` vs `Legacy`)**: Live switch between the unified Monet bubble (`Canon`) and native Gemini wide edit form (`Legacy`), scoped with native CSS `@scope`.
- **Power Toggle + Zero FOUC**: Header power button enables/disables extension theming and reloads open `gemini.google.com` tabs; styles apply at `document_start` via `document.adoptedStyleSheets`.
- **Full Surface Coverage**: Styles main chat, React/StyleX islands (`/library` and Search Chats modal), menus, tooltips, bottom sheets, code blocks, and the One Google account popup.

---

## Installation

### Firefox Desktop:
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select `dist/gemini-monet.xpi` (or `manifest.json` from this folder).
4. Open [gemini.google.com](https://gemini.google.com) and click the extension icon in your toolbar to customize colors.

### Firefox Android (Nightly / Beta):
1. Enable Debug mode in Firefox Settings (tap Firefox logo 5 times).
2. Install via Custom Add-on Collection or USB debugging via `about:debugging`.

---

## Build

To re-package `.xpi` and `.zip`:
```bash
python3 build.py
```
Output artifacts are generated in `dist/`.

---

## License & Attribution

Licensed under the **[Apache License 2.0](LICENSE)**. See [NOTICE](NOTICE) for full third-party attribution.

- **UI Icons**: Vector SVG `<path>` icons in the popup and wallpaper picker use **Google Material Symbols Rounded** (`google/material-design-icons`, Apache License 2.0).
- **Color Constants**: `Monet 2021` references public tonal chroma constants from the **Android Open Source Project (AOSP)** (`ColorScheme.kt`, Apache License 2.0).

## Disclaimer

- **Unofficial Project**: Pollux Palette is an independent, unofficial extension and is **not** affiliated with, endorsed by, or sponsored by Google LLC. "Google", "Gemini", "Material You", and "Material Design" are trademarks or service marks of Google LLC.
- **"Monet 2026" Mode**: Google has not published an official algorithm under the name "Monet 2026". This option is an independent algorithmic approximation inspired by Material 3 Expressive dynamic color concepts and is explicitly labeled as an approximation both in source code and UI.
- **Zero Google Proprietary Assets**: No proprietary Google stylesheets, scripts, or copyrighted images are bundled inside this extension.
