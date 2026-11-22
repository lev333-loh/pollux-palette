# Gemini Monet — Firefox Extension 🌸

Standalone WebExtension for Firefox (Desktop & Mobile) that injects full Google **Material You (Monet)** dynamic theming into **Gemini Web** (`gemini.google.com`).

---

## Features

- **Dynamic Material 3 Color Science**: Built-in zero-dependency HCT / CAM16 mathematical palette generator.
- **Color Picker & Presets**:
  - 🌸 **Sakura** (`#814F70`)
  - 🪻 **Lavender** (`#6750A4`)
  - 🌿 **Emerald** (`#2E6C4C`)
  - 🌊 **Ocean** (`#006495`)
  - 🌅 **Amber** (`#8C5000`)
  - 🫐 **Berry** (`#984061`)
  - ❄️ **Nord** (`#5E81AC`)
  - 🖤 **Slate / Pitch** (`#3B5998`)
  - 🎨 **Custom Color Wheel**
- **Pick from Wallpaper**: Upload any wallpaper/image, and the extension extracts the dominant seed color and computes the full Monet tonal palette.
- **Native Material 3 Look & Feel**:
  - 28px card radius on mode menu and overlays
  - Vibrant selection pills (`primaryContainer` / `onPrimaryContainer`)
  - High-performance 180ms drawer transitions
  - Custom code blocks, themed inputs, and floating user query bubbles
- **Zero FOUC (Flash of Unstyled Content)**: Uses modern `document.adoptedStyleSheets` at `document_start` with local storage caching.

---

## Installation

### Firefox Desktop:
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select `dist/gemini-monet.xpi` (or `manifest.json` from this folder).
4. Open [gemini.google.com](https://gemini.google.com) and click the extension icon in your toolbar to customize colors!

### Firefox Android (Nightly / Beta):
1. Enable Debug mode in Firefox Settings (tap Firefox logo 5 times).
2. Install via Custom Add-on Collection or USB debugging via `about:debugging`.

---

## Build

To re-package the `.xpi` and `.zip`:
```bash
python3 build.py
```
Output files will be generated in `dist/`.
