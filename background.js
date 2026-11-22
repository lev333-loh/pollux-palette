/**
 * Gemini Monet Background Worker
 * Manages active Monet palette & broadcasts updates to Gemini tabs.
 */
"use strict";

const DEFAULT_SEED = "#814F70"; // Sakura Monet default

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(["seedColor", "activePalette"], (res) => {
    if (!res.seedColor || !res.activePalette) {
      const palette = MaterialColor.generateM3Palette(DEFAULT_SEED);
      browser.storage.local.set({
        seedColor: DEFAULT_SEED,
        presetName: "sakura",
        activePalette: palette,
      });
    }
  });
});

function broadcastPalette(palette) {
  browser.tabs.query({ url: "*://gemini.google.com/*" }, (tabs) => {
    for (const tab of tabs || []) {
      browser.tabs.sendMessage(tab.id, {
        type: "PALETTE",
        palette: palette,
      }).catch(() => {});
    }
  });
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "UPDATE_PALETTE") {
    browser.storage.local.set({
      seedColor: msg.seedColor,
      presetName: msg.presetName,
      schemeStyle: msg.schemeStyle,
      activePalette: msg.palette,
    });
    broadcastPalette(msg.palette);
    sendResponse({ ok: true });
    return true;
  }

  if (msg && msg.type === "GET_PALETTE") {
    browser.storage.local.get(["activePalette", "seedColor", "schemeStyle"], (res) => {
      let pal = res.activePalette;
      if (!pal) {
        pal = MaterialColor.generateM3Palette(res.seedColor || DEFAULT_SEED, res.schemeStyle || "tonal_spot");
        browser.storage.local.set({ activePalette: pal });
      }
      sendResponse({ palette: pal });
    });
    return true;
  }

  return false;
});

// Auto-sync with Pywalfox / Firefox theme changes
if (browser.theme && browser.theme.onUpdated) {
  browser.theme.onUpdated.addListener(async () => {
    browser.storage.local.get(["presetName"], async (res) => {
      if (res && res.presetName === "pywalfox") {
        try {
          const theme = await browser.theme.getCurrent();
          const colors = theme && theme.colors;
          const pywalColor = colors && (colors.accentcolor || colors.toolbar_field_focus || colors.toolbar || colors.frame);
          if (pywalColor) {
            const palette = MaterialColor.generateM3Palette(pywalColor);
            browser.storage.local.set({
              seedColor: pywalColor,
              presetName: "pywalfox",
              activePalette: palette,
            });
            broadcastPalette(palette);
          }
        } catch (e) {
          console.warn("Pywalfox auto-update error", e);
        }
      }
    });
  });
}
