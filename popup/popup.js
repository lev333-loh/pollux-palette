"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const activeDot = document.getElementById("activeColorDot");
  const activeHex = document.getElementById("activeHex");
  const colorPicker = document.getElementById("colorPicker");
  const presetsGrid = document.getElementById("presetsGrid");
  const pywalfoxBtn = document.getElementById("pywalfoxBtn");
  const openPickerBtn = document.getElementById("openPickerBtn");
  const popupCard = document.getElementById("popupCard");
  const schemeSelect = document.getElementById("schemeSelect");

  let currentSeed = "#814F70";
  let currentPreset = "sakura";
  let currentScheme = "tonal_spot";

  // Load current settings
  browser.storage.local.get(["seedColor", "presetName", "schemeStyle"], (res) => {
    currentSeed = res.seedColor || "#814F70";
    currentPreset = res.presetName || "sakura";
    currentScheme = res.schemeStyle || "tonal_spot";
    if (schemeSelect) schemeSelect.value = currentScheme;
    updateActiveUI(currentSeed, currentPreset);
  });

  function updateActiveUI(hex, preset) {
    activeDot.style.backgroundColor = hex;
    activeHex.textContent = hex.toUpperCase();
    colorPicker.value = hex;

    if (preset === "pywalfox") {
      pywalfoxBtn.classList.add("active");
    } else {
      pywalfoxBtn.classList.remove("active");
    }

    document.querySelectorAll(".preset-chip").forEach((chip) => {
      if (chip.getAttribute("data-name") === preset) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  function applySeed(hex, presetName, scheme) {
    currentSeed = hex;
    currentPreset = presetName;
    currentScheme = scheme || (schemeSelect && schemeSelect.value) || currentScheme || "tonal_spot";
    if (schemeSelect) schemeSelect.value = currentScheme;

    updateActiveUI(hex, presetName);
    const palette = MaterialColor.generateM3Palette(hex, currentScheme);

    browser.runtime.sendMessage({
      type: "UPDATE_PALETTE",
      seedColor: hex,
      presetName: presetName,
      schemeStyle: currentScheme,
      palette: palette,
    });
  }

  if (schemeSelect) {
    schemeSelect.addEventListener("change", (e) => {
      applySeed(currentSeed, currentPreset, e.target.value);
    });
  }

  // Preset chips click
  presetsGrid.addEventListener("click", (e) => {
    const chip = e.target.closest(".preset-chip");
    if (!chip) return;
    const color = chip.getAttribute("data-color");
    const name = chip.getAttribute("data-name");
    applySeed(color, name);
  });

  // Custom color picker input
  colorPicker.addEventListener("input", (e) => {
    applySeed(e.target.value, "custom");
  });

  // Pywalfox Sync
  pywalfoxBtn.addEventListener("click", async () => {
    try {
      if (browser.theme && browser.theme.getCurrent) {
        const theme = await browser.theme.getCurrent();
        const colors = theme && theme.colors;
        const pywalColor = colors && (colors.accentcolor || colors.toolbar_field_focus || colors.toolbar || colors.frame);
        if (pywalColor) {
          applySeed(pywalColor, "pywalfox");
          return;
        }
      }
    } catch (e) {
      console.warn("Pywalfox theme query error", e);
    }
    // Fallback if pywalfox theme not active in browser yet
    applySeed("#FFB4A8", "pywalfox");
  });

  // Open full-screen picker tab (where file dialog never closes popup!)
  openPickerBtn.addEventListener("click", () => {
    browser.tabs.create({
      url: browser.runtime.getURL("popup/picker.html"),
    });
  });

  // Helper to process image file from drop or paste
  function processDroppedImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const domColor = MaterialColor.extractDominantColor(img);
        applySeed(domColor, "wallpaper");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Drag & drop support directly on popup window
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    processDroppedImage(file);
  });

  // Clipboard paste support (Ctrl+V)
  window.addEventListener("paste", (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    for (const item of items || []) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        processDroppedImage(file);
        break;
      }
    }
  });
});
