"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const previewBox = document.getElementById("previewBox");
  const imagePreview = document.getElementById("imagePreview");
  const extractedDot = document.getElementById("extractedDot");
  const extractedHex = document.getElementById("extractedHex");
  const applyBtn = document.getElementById("applyBtn");
  const statusMsg = document.getElementById("statusMsg");

  let currentHex = "#814F70";

  function processImageFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imagePreview.src = e.target.result;
        currentHex = MaterialColor.extractDominantColor(img);
        extractedDot.style.backgroundColor = currentHex;
        extractedHex.textContent = currentHex.toUpperCase();
        previewBox.style.display = "flex";
        statusMsg.style.display = "none";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener("change", (e) => {
    processImageFile(e.target.files && e.target.files[0]);
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    processImageFile(file);
  });

  applyBtn.addEventListener("click", () => {
    browser.storage.local.get(["schemeStyle", "monetEra", "themeMode"], (res) => {
      const scheme = (res && res.schemeStyle) || "rainbow";
      const era = (res && res.monetEra) || "2021";
      const themeMode = (res && res.themeMode) || "dark";
      const palette = MaterialColor.generateM3Palette(currentHex, scheme, era);
      browser.runtime.sendMessage({
        type: "UPDATE_PALETTE",
        seedColor: currentHex,
        presetName: "wallpaper",
        schemeStyle: scheme,
        monetEra: era,
        themeMode: themeMode,
        palette: palette,
      }).then(() => {
        statusMsg.style.display = "flex";
      });
    });
  });
});
