/**
 * Pollux Palette — Gemini Material You Theme (Background Worker)
 * Manages active Monet palette & broadcasts updates to Gemini tabs.
 */
"use strict";

const DEFAULT_SEED = "#814F70"; // Sakura Monet default

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(["seedColor", "activePalette", "monetEra", "themeMode", "pluginEnabled", "editModeStyle"], (res) => {
    const patch = {};
    if (!res.seedColor || !res.activePalette) {
      const palette = MaterialColor.generateM3Palette(DEFAULT_SEED, "tonal_spot", "2021");
      patch.seedColor = DEFAULT_SEED;
      patch.presetName = "sakura";
      patch.schemeStyle = "tonal_spot";
      patch.monetEra = "2021";
      patch.themeMode = "dark";
      patch.activePalette = palette;
    }
    if (typeof res.pluginEnabled !== "boolean") patch.pluginEnabled = true;
    if (!res.editModeStyle) patch.editModeStyle = "canon";
    if (Object.keys(patch).length) browser.storage.local.set(patch);
  });
});

function broadcastToGeminiTabs(payload) {
  browser.tabs.query({ url: "*://gemini.google.com/*" }, (tabs) => {
    for (const tab of tabs || []) {
      browser.tabs.sendMessage(tab.id, payload).catch(() => {});
    }
  });
}

function broadcastPalette(palette, themeMode) {
  broadcastToGeminiTabs({
    type: "PALETTE",
    palette: palette,
    themeMode: themeMode,
  });
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "UPDATE_PALETTE") {
    browser.storage.local.set({
      seedColor: msg.seedColor,
      presetName: msg.presetName,
      schemeStyle: msg.schemeStyle,
      monetEra: msg.monetEra || "2021",
      themeMode: msg.themeMode || "dark",
      activePalette: msg.palette,
    });
    broadcastPalette(msg.palette, msg.themeMode || "dark");
    sendResponse({ ok: true });
    return true;
  }

  if (msg && msg.type === "SET_ENABLED") {
    const enabled = Boolean(msg.enabled);
    browser.storage.local.set({ pluginEnabled: enabled }, () => {
      broadcastToGeminiTabs({ type: "SET_ENABLED", enabled });
      browser.tabs.query({ url: "*://gemini.google.com/*" }, (tabs) => {
        for (const tab of tabs || []) {
          if (tab && typeof tab.id === "number") {
            browser.tabs.reload(tab.id).catch(() => {});
          }
        }
      });
      sendResponse({ ok: true, enabled });
    });
    return true;
  }

  if (msg && msg.type === "SET_EDIT_MODE") {
    const editModeStyle = msg.editModeStyle === "legacy" ? "legacy" : "canon";
    browser.storage.local.set({ editModeStyle }, () => {
      broadcastToGeminiTabs({ type: "SET_EDIT_MODE", editModeStyle });
      sendResponse({ ok: true, editModeStyle });
    });
    return true;
  }

  if (msg && msg.type === "GET_PALETTE") {
    browser.storage.local.get(
      ["activePalette", "seedColor", "schemeStyle", "monetEra", "themeMode", "pluginEnabled", "editModeStyle"],
      (res) => {
        let pal = res.activePalette;
        if (!pal) {
          pal = MaterialColor.generateM3Palette(
            res.seedColor || DEFAULT_SEED,
            res.schemeStyle || "tonal_spot",
            res.monetEra || "2021"
          );
          browser.storage.local.set({ activePalette: pal });
        }
        sendResponse({
          palette: pal,
          themeMode: res.themeMode || "dark",
          pluginEnabled: res.pluginEnabled !== false,
          editModeStyle: res.editModeStyle === "legacy" ? "legacy" : "canon",
        });
      }
    );
    return true;
  }

  return false;
});

// Auto-sync with Pywalfox / Firefox theme changes
if (browser.theme && browser.theme.onUpdated) {
  browser.theme.onUpdated.addListener(async () => {
    browser.storage.local.get(["presetName", "schemeStyle", "monetEra", "themeMode"], async (res) => {
      if (res && res.presetName === "pywalfox") {
        try {
          const theme = await browser.theme.getCurrent();
          const colors = theme && theme.colors;
          const pywalColor = colors && (colors.accentcolor || colors.toolbar_field_focus || colors.toolbar || colors.frame);
          if (pywalColor) {
            const palette = MaterialColor.generateM3Palette(
              pywalColor,
              res.schemeStyle || "tonal_spot",
              res.monetEra || "2021"
            );
            browser.storage.local.set({
              seedColor: pywalColor,
              presetName: "pywalfox",
              activePalette: palette,
            });
            broadcastPalette(palette, res.themeMode || "dark");
          }
        } catch (e) {
          console.warn("Pywalfox auto-update error", e);
        }
      }
    });
  });
}
