"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const activeDot = document.getElementById("activeColorDot");
  const activeHex = document.getElementById("activeHex");
  const presetsGrid = document.getElementById("presetsGrid");
  const pywalfoxBtn = document.getElementById("pywalfoxBtn");
  const openPickerBtn = document.getElementById("openPickerBtn");
  const schemeContainer = document.getElementById("schemeContainer");
  const schemeTrigger = document.getElementById("schemeTrigger");
  const schemeTriggerPath = document.getElementById("schemeTriggerPath");
  const schemeTriggerLabel = document.getElementById("schemeTriggerLabel");
  const schemeMenu = document.getElementById("schemeMenu");
  const eraControl = document.getElementById("eraControl");
  const era2021Btn = document.getElementById("era2021Btn");
  const era2026Btn = document.getElementById("era2026Btn");
  const editModeControl = document.getElementById("editModeControl");
  const editCanonBtn = document.getElementById("editCanonBtn");
  const editLegacyBtn = document.getElementById("editLegacyBtn");
  const powerToggleBtn = document.getElementById("powerToggleBtn");
  const popupCard = document.getElementById("popupCard");
  const addPresetChip = document.getElementById("addPresetChip");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeTogglePath = document.getElementById("themeTogglePath");

  const ICON_CLOSE = "M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z";

  const ICON_DARK_MODE = "M480-120q-150 0-255-105T120-480q0-135 79.5-229T408-830q20-5 34-1t22 15q8 10 7.5 25t-8.5 35q-9 23-14 47t-5 49q0 90 63 153t153 63q25 0 48.5-4.5T754-461q22-8 38-7t26 9q10 8 13 23t-2 36q-27 121-121 200.5T480-120Zm0-60q109 0 190-67.5T771-406q-25 11-53.5 16.5T660-384q-115 0-195.5-80.5T384-660q0-24 5-51.5t18-62.5q-98 27-162.5 109.5T180-480q0 125 87.5 212.5T480-180Zm-4-297Z";
  const ICON_LIGHT_MODE = "M579-380.76q41-40.77 41-99Q620-538 579.24-579q-40.77-41-99-41Q422-620 381-579.24q-41 40.77-41 99Q340-422 380.76-381q40.77 41 99 41Q538-340 579-380.76ZM338.5-338.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM70-450q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32Q57.25-510 70-510h100q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H70Zm720 0q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h100q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H790ZM458.5-768.63Q450-777.25 450-790v-100q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v100q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63Zm0 720Q450-57.25 450-70v-100q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v100q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63ZM240-678l-57-56q-9-9-8.63-21.6.37-12.61 8.53-21.5 8.89-8.9 21.5-8.9 12.6 0 21.6 9l56 57q8 9 8 21t-8 20.5q-8 8.5-20.5 8.5t-21.5-8Zm494 495-56-57q-8-9-8-21.38 0-12.37 8.5-20.62 8.5-9 20.5-9t21 9l57 56q9 9 8.63 21.6-.37 12.61-8.53 21.5-8.89 8.9-21.5 8.9-12.6 0-21.6-9Zm-56-495q-9-9-9-21t9-21l56-57q9-9 21.6-8.63 12.61.37 21.5 8.53 8.9 8.89 8.9 21.5 0 12.6-9 21.6l-57 56q-8 8-20.36 8-12.37 0-21.64-8ZM182.9-182.9q-8.9-8.89-8.9-21.5 0-12.6 9-21.6l57-56q8.8-9 20.9-9 12.1 0 20.71 9 9.39 9 9.39 21t-9 21l-56 57q-9 9-21.6 8.63-12.61-.37-21.5-8.53ZM480-480Z";

  // Custom Color Wheel elements
  const customToggleBtn = document.getElementById("customToggleBtn");
  const customPickerPanel = document.getElementById("customPickerPanel");
  const wheelWrapper = document.getElementById("wheelWrapper");
  const colorWheelCanvas = document.getElementById("colorWheelCanvas");
  const wheelHandle = document.getElementById("wheelHandle");
  const valueSlider = document.getElementById("valueSlider");
  const customHexInput = document.getElementById("customHexInput");
  const customHexPreview = document.getElementById("customHexPreview");

  let currentSeed = "#814F70";
  let currentPreset = "sakura";
  let currentScheme = "tonal_spot";
  let currentEra = "2021";
  let currentThemeMode = "dark";
  let currentEditModeStyle = "canon";
  let isPluginEnabled = true;
  let customPresets = [];

  // Color Wheel & HSV state
  const WHEEL_SIZE = 180;
  const WHEEL_CENTER = WHEEL_SIZE / 2;
  const WHEEL_RADIUS = 80;
  let currentH = 320;
  let currentS = 0.4;
  let currentV = 0.5;
  let isWheelInitialized = false;

  function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return [h, s, v];
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function hexToRgb(hex) {
    hex = (hex || "").replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length !== 6) return null;
    const num = parseInt(hex, 16);
    if (isNaN(num)) return null;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function drawColorWheel() {
    if (!colorWheelCanvas) return;
    const ctx = colorWheelCanvas.getContext("2d");
    const imgData = ctx.createImageData(WHEEL_SIZE, WHEEL_SIZE);
    const data = imgData.data;

    for (let y = 0; y < WHEEL_SIZE; y++) {
      for (let x = 0; x < WHEEL_SIZE; x++) {
        const dx = x - WHEEL_CENTER;
        const dy = y - WHEEL_CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= WHEEL_RADIUS) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const sat = dist / WHEEL_RADIUS;
          const [r, g, b] = hsvToRgb(angle, sat, 1.0);

          let alpha = 255;
          if (dist > WHEEL_RADIUS - 1.5) {
            alpha = Math.max(0, Math.min(255, Math.round((WHEEL_RADIUS - dist + 0.5) * 255)));
          }

          const idx = (y * WHEEL_SIZE + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = alpha;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function updateHandleAndSlider(hex) {
    if (wheelHandle) {
      const rad = currentH * Math.PI / 180;
      const dist = currentS * WHEEL_RADIUS;
      const mx = WHEEL_CENTER + dist * Math.cos(rad);
      const my = WHEEL_CENTER + dist * Math.sin(rad);
      wheelHandle.style.left = mx + "px";
      wheelHandle.style.top = my + "px";
      wheelHandle.style.backgroundColor = hex;
    }

    if (valueSlider) {
      const [pureR, pureG, pureB] = hsvToRgb(currentH, currentS, 1.0);
      valueSlider.style.background = `linear-gradient(to right, #000000, rgb(${pureR}, ${pureG}, ${pureB}))`;
    }

    if (customHexInput && document.activeElement !== customHexInput) {
      customHexInput.value = hex.replace("#", "");
    }
    if (customHexPreview) {
      customHexPreview.style.backgroundColor = hex;
    }
  }

  function syncPickerToHex(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    currentH = h;
    currentS = s;
    currentV = v;
    if (valueSlider) {
      valueSlider.value = Math.round(v * 100);
    }
    updateHandleAndSlider(hex);
  }

  function applyFromWheel() {
    const [r, g, b] = hsvToRgb(currentH, currentS, currentV);
    const hex = rgbToHex(r, g, b);
    updateHandleAndSlider(hex);
    applySeed(hex, "custom");
  }

  function handleWheelPointer(e) {
    if (!wheelWrapper) return;
    const rect = wheelWrapper.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const dx = px - WHEEL_CENTER;
    const dy = py - WHEEL_CENTER;
    const dist = Math.min(WHEEL_RADIUS, Math.sqrt(dx * dx + dy * dy));
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
    currentH = angle;
    currentS = dist / WHEEL_RADIUS;
    applyFromWheel();
  }

  if (wheelWrapper) {
    wheelWrapper.addEventListener("pointerdown", (e) => {
      wheelWrapper.setPointerCapture(e.pointerId);
      handleWheelPointer(e);

      function onPointerMove(evt) {
        handleWheelPointer(evt);
      }
      function onPointerUp(evt) {
        wheelWrapper.removeEventListener("pointermove", onPointerMove);
        wheelWrapper.removeEventListener("pointerup", onPointerUp);
      }
      wheelWrapper.addEventListener("pointermove", onPointerMove);
      wheelWrapper.addEventListener("pointerup", onPointerUp);
    });
  }

  if (valueSlider) {
    valueSlider.addEventListener("input", () => {
      currentV = parseInt(valueSlider.value, 10) / 100;
      applyFromWheel();
    });
  }

  if (customHexInput) {
    customHexInput.addEventListener("input", (e) => {
      const clean = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
      if (clean.length === 6) {
        const hex = "#" + clean.toUpperCase();
        syncPickerToHex(hex);
        applySeed(hex, "custom");
      }
    });

    customHexInput.addEventListener("blur", () => {
      customHexInput.value = currentSeed.replace("#", "");
    });
  }

  if (customToggleBtn && customPickerPanel) {
    customToggleBtn.addEventListener("click", () => {
      const isOpen = customPickerPanel.style.display !== "none";
      if (isOpen) {
        customPickerPanel.style.display = "none";
      } else {
        customPickerPanel.style.display = "flex";
        if (!isWheelInitialized) {
          drawColorWheel();
          isWheelInitialized = true;
        }
        syncPickerToHex(currentSeed);
      }
    });
  }

  function updateEraUI(era) {
    currentEra = era === "2026" ? "2026" : "2021";
    if (era2021Btn && era2026Btn) {
      if (currentEra === "2026") {
        era2026Btn.classList.add("active");
        era2021Btn.classList.remove("active");
      } else {
        era2021Btn.classList.add("active");
        era2026Btn.classList.remove("active");
      }
    }
  }

  function updateEditModeUI(style) {
    currentEditModeStyle = style === "legacy" ? "legacy" : "canon";
    if (editCanonBtn && editLegacyBtn) {
      editCanonBtn.classList.toggle("active", currentEditModeStyle === "canon");
      editLegacyBtn.classList.toggle("active", currentEditModeStyle === "legacy");
    }
  }

  function updatePowerUI(enabled) {
    isPluginEnabled = enabled !== false;
    if (powerToggleBtn) {
      powerToggleBtn.classList.toggle("active", isPluginEnabled);
      powerToggleBtn.setAttribute("aria-pressed", isPluginEnabled ? "true" : "false");
      powerToggleBtn.title = isPluginEnabled
        ? "Плагін увімкнено — натисни, щоб вимкнути і оновити Gemini"
        : "Плагін вимкнено — натисни, щоб увімкнути і оновити Gemini";
    }
    if (popupCard) {
      popupCard.classList.toggle("is-plugin-disabled", !isPluginEnabled);
    }
  }

  function createSvgIcon(pathD) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 -960 960 960");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", pathD);
    svg.appendChild(p);
    return svg;
  }

  function renderCustomPresets(justAddedHex) {
    if (!presetsGrid || !addPresetChip) return;
    presetsGrid.querySelectorAll(".custom-preset-chip").forEach((el) => el.remove());

    for (const item of customPresets) {
      const hex = (item.color || "").toUpperCase();
      const chip = document.createElement("div");
      chip.className = "preset-chip custom-preset-chip" + (justAddedHex === hex ? " just-added" : "");
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      chip.setAttribute("data-color", hex);
      chip.setAttribute("data-name", hex);

      const dot = document.createElement("span");
      dot.className = "chip-dot";
      dot.style.background = hex;

      const label = document.createElement("span");
      label.className = "custom-preset-label";
      label.textContent = hex;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "chip-remove";
      removeBtn.setAttribute("aria-label", `Remove ${hex}`);
      removeBtn.title = "Видалити пресет";
      removeBtn.setAttribute("data-remove-color", hex);
      removeBtn.appendChild(createSvgIcon(ICON_CLOSE));

      chip.appendChild(dot);
      chip.appendChild(label);
      chip.appendChild(removeBtn);
      presetsGrid.insertBefore(chip, addPresetChip);
    }

    const totalPresets = presetsGrid.querySelectorAll(".preset-chip").length;
    addPresetChip.classList.toggle("span-2", totalPresets % 2 === 0);
  }

  function updateSchemeUI(scheme) {
    currentScheme = scheme || "tonal_spot";
    if (!schemeMenu) return;
    const options = schemeMenu.querySelectorAll(".scheme-option");
    let matched = null;
    options.forEach((opt) => {
      const isMatch = opt.getAttribute("data-value") === currentScheme;
      opt.classList.toggle("active", isMatch);
      opt.setAttribute("aria-selected", isMatch ? "true" : "false");
      if (isMatch) matched = opt;
    });
    if (!matched && options.length) {
      matched = options[0];
      matched.classList.add("active");
    }
    if (matched) {
      const lbl = matched.querySelector("span");
      const path = matched.querySelector("path");
      if (schemeTriggerLabel && lbl) schemeTriggerLabel.textContent = lbl.textContent;
      if (schemeTriggerPath && path) schemeTriggerPath.setAttribute("d", path.getAttribute("d") || "");
    }
  }

  function setSchemeMenuOpen(open) {
    if (!schemeMenu || !schemeTrigger) return;
    schemeMenu.hidden = !open;
    schemeTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function applyMonetThemeToPopup(palette, mode) {
    if (!palette) return;
    const p = (mode === "light" ? palette.light : palette.dark) || palette.dark || {};
    const root = document.documentElement;
    root.style.setProperty("--p-surface", p.surface || (mode === "light" ? "#F8F1F5" : "#1E1A1D"));
    root.style.setProperty("--p-surface-container", p.surfaceContainer || (mode === "light" ? "#EDE2E8" : "#251F23"));
    root.style.setProperty("--p-surface-container-high", p.surfaceContainerHigh || (mode === "light" ? "#E7DCE2" : "#2E282C"));
    root.style.setProperty("--p-surface-container-highest", p.surfaceContainerHighest || (mode === "light" ? "#E1D6DC" : "#383136"));
    root.style.setProperty("--p-on-surface", p.onSurface || (mode === "light" ? "#201A1D" : "#EDE0E4"));
    root.style.setProperty("--p-on-surface-variant", p.onSurfaceVariant || (mode === "light" ? "#796E74" : "#B2A3A9"));
    root.style.setProperty("--p-primary", p.primary || "#814F70");
    root.style.setProperty("--p-on-primary", p.onPrimary || "#FFFFFF");
    root.style.setProperty("--p-primary-container", p.primaryContainer || (mode === "light" ? "#FFD8ED" : "#4A3343"));
    root.style.setProperty("--p-on-primary-container", p.onPrimaryContainer || (mode === "light" ? "#340B29" : "#FFFFFF"));
    root.style.setProperty("--p-secondary", p.secondary || "#725668");
    root.style.setProperty("--p-on-secondary", p.onSecondary || "#FFFFFF");
    root.style.setProperty("--p-secondary-container", p.secondaryContainer || (mode === "light" ? "#F5E4EB" : "#332B30"));
    root.style.setProperty("--p-on-secondary-container", p.onSecondaryContainer || (mode === "light" ? "#2B1423" : "#F8DCED"));
    root.style.setProperty("--p-outline", p.outline || "#82737C");
    root.style.setProperty("--p-outline-variant", p.outlineVariant || (mode === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"));
  }

  function updateThemeUI(mode) {
    currentThemeMode = mode === "light" ? "light" : "dark";
    document.body.classList.toggle("light-mode", currentThemeMode === "light");
    if (themeTogglePath) {
      themeTogglePath.setAttribute("d", currentThemeMode === "light" ? ICON_DARK_MODE : ICON_LIGHT_MODE);
    }
    if (themeToggleBtn) {
      themeToggleBtn.title = currentThemeMode === "light"
        ? "Переключити на темний режим"
        : "Переключити на світлий режим";
    }
  }

  // Load current settings
  browser.storage.local.get(
    ["seedColor", "presetName", "schemeStyle", "monetEra", "themeMode", "pluginEnabled", "editModeStyle", "customPresets"],
    (res) => {
      currentSeed = res.seedColor || "#814F70";
      currentPreset = res.presetName || "sakura";
      currentScheme = res.schemeStyle || "tonal_spot";
      currentEra = res.monetEra || "2021";
      currentThemeMode = res.themeMode || "dark";
      customPresets = Array.isArray(res.customPresets) ? res.customPresets : [];
      updatePowerUI(res.pluginEnabled !== false);
      updateEditModeUI(res.editModeStyle || "canon");
      updateSchemeUI(currentScheme);
      updateEraUI(currentEra);
      updateThemeUI(currentThemeMode);
      renderCustomPresets(null);
      updateActiveUI(currentSeed, currentPreset);

      const initialPalette = MaterialColor.generateM3Palette(currentSeed, currentScheme, currentEra);
      applyMonetThemeToPopup(initialPalette, currentThemeMode);

      // Initial draw of color wheel
      if (!isWheelInitialized) {
        drawColorWheel();
        isWheelInitialized = true;
      }
      syncPickerToHex(currentSeed);
    }
  );

  function updateActiveUI(hex, preset) {
    if (activeDot.style.backgroundColor) {
      activeDot.classList.remove("is-pulsing");
      void activeDot.offsetWidth;
      activeDot.classList.add("is-pulsing");
    }
    activeDot.style.backgroundColor = hex;
    activeHex.textContent = hex.toUpperCase();

    if (customToggleBtn) {
      if (preset === "custom") {
        customToggleBtn.classList.add("active");
      } else {
        customToggleBtn.classList.remove("active");
      }
    }

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

    syncPickerToHex(hex);
  }

  function applySeed(hex, presetName, scheme, era, mode) {
    currentSeed = hex;
    currentPreset = presetName;
    currentScheme = scheme || currentScheme || "tonal_spot";
    if (era) {
      currentEra = era;
    }
    if (mode) {
      currentThemeMode = mode;
      updateThemeUI(currentThemeMode);
    }
    updateEraUI(currentEra);
    updateSchemeUI(currentScheme);

    updateActiveUI(hex, presetName);
    const palette = MaterialColor.generateM3Palette(hex, currentScheme, currentEra);
    applyMonetThemeToPopup(palette, currentThemeMode);

    browser.runtime.sendMessage({
      type: "UPDATE_PALETTE",
      seedColor: hex,
      presetName: presetName,
      schemeStyle: currentScheme,
      monetEra: currentEra,
      themeMode: currentThemeMode,
      palette: palette,
    });
  }

  if (powerToggleBtn) {
    powerToggleBtn.addEventListener("click", () => {
      const nextEnabled = !isPluginEnabled;
      updatePowerUI(nextEnabled);
      browser.runtime.sendMessage({ type: "SET_ENABLED", enabled: nextEnabled });
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const nextMode = currentThemeMode === "dark" ? "light" : "dark";
      updateThemeUI(nextMode);
      browser.storage.local.set({ themeMode: nextMode });
      applySeed(currentSeed, currentPreset, currentScheme, currentEra, nextMode);
    });
  }

  if (schemeTrigger && schemeMenu) {
    schemeTrigger.addEventListener("click", () => {
      setSchemeMenuOpen(schemeMenu.hidden);
    });
    schemeMenu.addEventListener("click", (e) => {
      const opt = e.target.closest(".scheme-option");
      if (!opt) return;
      const val = opt.getAttribute("data-value");
      setSchemeMenuOpen(false);
      if (val && val !== currentScheme) {
        applySeed(currentSeed, currentPreset, val);
      }
    });
    document.addEventListener("click", (e) => {
      if (schemeContainer && !schemeContainer.contains(e.target)) {
        setSchemeMenuOpen(false);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setSchemeMenuOpen(false);
    });
  }

  if (eraControl) {
    eraControl.addEventListener("click", (e) => {
      const btn = e.target.closest(".era-btn");
      if (!btn) return;
      const selectedEra = btn.getAttribute("data-era");
      if (selectedEra && selectedEra !== currentEra) {
        applySeed(currentSeed, currentPreset, currentScheme, selectedEra);
      }
    });
  }

  if (editModeControl) {
    editModeControl.addEventListener("click", (e) => {
      const btn = e.target.closest(".era-btn[data-edit-mode]");
      if (!btn) return;
      const mode = btn.getAttribute("data-edit-mode");
      if (mode && mode !== currentEditModeStyle) {
        updateEditModeUI(mode);
        browser.runtime.sendMessage({ type: "SET_EDIT_MODE", editModeStyle: currentEditModeStyle });
      }
    });
  }

  // Preset chips click, add "+", and remove "x"
  presetsGrid.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".chip-remove");
    if (removeBtn) {
      e.stopPropagation();
      const rmHex = (removeBtn.getAttribute("data-remove-color") || "").toUpperCase();
      customPresets = customPresets.filter((item) => (item.color || "").toUpperCase() !== rmHex);
      browser.storage.local.set({ customPresets });
      renderCustomPresets(null);
      updateActiveUI(currentSeed, currentPreset === rmHex ? "custom" : currentPreset);
      return;
    }

    const addBtn = e.target.closest("#addPresetChip");
    if (addBtn) {
      const hex = (currentSeed || "#814F70").toUpperCase();
      const existingDefault = Array.from(presetsGrid.querySelectorAll(".preset-chip:not(.custom-preset-chip)"))
        .find((el) => (el.getAttribute("data-color") || "").toUpperCase() === hex);
      if (existingDefault) {
        applySeed(hex, existingDefault.getAttribute("data-name"));
        return;
      }
      const existingCustom = customPresets.find((item) => (item.color || "").toUpperCase() === hex);
      if (!existingCustom) {
        customPresets.push({ color: hex, name: hex });
        browser.storage.local.set({ customPresets });
        renderCustomPresets(hex);
      }
      applySeed(hex, hex);
      return;
    }

    const chip = e.target.closest(".preset-chip");
    if (!chip) return;
    const color = chip.getAttribute("data-color");
    const name = chip.getAttribute("data-name");
    applySeed(color, name);
  });

  presetsGrid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const chip = e.target.closest(".custom-preset-chip");
    if (!chip || e.target.closest(".chip-remove")) return;
    e.preventDefault();
    applySeed(chip.getAttribute("data-color"), chip.getAttribute("data-name"));
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
