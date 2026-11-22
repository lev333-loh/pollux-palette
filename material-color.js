/**
 * Material 3 / Monet Color Utilities (Pure Vanilla JS, 0 dependencies)
 * Converts any seed HEX color into a full Material You dynamic palette (Light & Dark).
 */
(function (global) {
  "use strict";

  function hexToRgb(hex) {
    let c = hex.replace("#", "").trim();
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function rgbToLinear(v) {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function linearToRgb(v) {
    v = Math.max(0, Math.min(1, v));
    const res = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(255, res * 255)));
  }

  function rgbToXyz(r, g, b) {
    const lr = rgbToLinear(r), lg = rgbToLinear(g), lb = rgbToLinear(b);
    return [
      lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375,
      lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750,
      lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041,
    ];
  }

  function xyzToRgb(x, y, z) {
    const lr = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
    const lg = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
    const lb = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;
    return [linearToRgb(lr), linearToRgb(lg), linearToRgb(lb)];
  }

  function xyzToLab(x, y, z) {
    const xn = 0.95047, yn = 1.0, zn = 1.08883;
    let fx = x / xn, fy = y / yn, fz = z / zn;
    const eps = 216 / 24389, kappa = 24389 / 27;
    fx = fx > eps ? Math.cbrt(fx) : (kappa * fx + 16) / 116;
    fy = fy > eps ? Math.cbrt(fy) : (kappa * fy + 16) / 116;
    fz = fz > eps ? Math.cbrt(fz) : (kappa * fz + 16) / 116;
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  function labToXyz(L, a, b) {
    const xn = 0.95047, yn = 1.0, zn = 1.08883;
    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;
    const eps = 216 / 24389, kappa = 24389 / 27;
    const x = Math.pow(fx, 3) > eps ? Math.pow(fx, 3) : (116 * fx - 16) / kappa;
    const y = L > kappa * eps ? Math.pow((L + 16) / 116, 3) : L / kappa;
    const z = Math.pow(fz, 3) > eps ? Math.pow(fz, 3) : (116 * fz - 16) / kappa;
    return [x * xn, y * yn, z * zn];
  }

  function toneToHex(L, a, b) {
    L = Math.max(0, Math.min(100, L));
    let scale = 1.0;
    for (let iter = 0; iter < 16; iter++) {
      const curA = a * scale, curB = b * scale;
      const [x, y, z] = labToXyz(L, curA, curB);
      const lr = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
      const lg = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
      const lb = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;
      if (lr >= -0.001 && lr <= 1.001 && lg >= -0.001 && lg <= 1.001 && lb >= -0.001 && lb <= 1.001) {
        const [r, g, bVal] = xyzToRgb(x, y, z);
        return "#" + [r, g, bVal].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
      }
      scale *= 0.75;
    }
    const [x, y, z] = labToXyz(L, 0, 0);
    const [r, g, bVal] = xyzToRgb(x, y, z);
    return "#" + [r, g, bVal].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function generateM3Palette(seedHex, scheme) {
    scheme = (scheme || "tonal_spot").toLowerCase();
    const [r, g, b] = hexToRgb(seedHex || "#814F70");
    const [x, y, z] = rgbToXyz(r, g, b);
    const [, a, bVal] = xyzToLab(x, y, z);
    const c = Math.sqrt(a * a + bVal * bVal);
    const h = Math.atan2(bVal, a);

    function rotateLab(baseH, deltaRad, chroma) {
      const newH = baseH + deltaRad;
      return [chroma * Math.cos(newH), chroma * Math.sin(newH)];
    }

    let a1_a, a1_b, a2_a, a2_b, a3_a, a3_b, n1_a, n1_b, n2_a, n2_b;
    const rad60 = Math.PI / 3;
    const rad120 = (2 * Math.PI) / 3;
    const rad240 = (4 * Math.PI) / 3;

    switch (scheme) {
      case "rainbow": { // M3 Rainbow (як у Noctalia / KDE Plasma)
        const [a1x, a1y] = rotateLab(h, 0, Math.max(48, c));
        const [a2x, a2y] = rotateLab(h, 0, 20);
        const [a3x, a3y] = rotateLab(h, rad60, 28);
        const [n1x, n1y] = rotateLab(h, 0, 6);
        const [n2x, n2y] = rotateLab(h, 0, 8);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "vibrant": { // M3 Vibrant (яскравий, насичений)
        const [a1x, a1y] = rotateLab(h, 0, Math.max(65, c * 1.3));
        const [a2x, a2y] = rotateLab(h, 0, 28);
        const [a3x, a3y] = rotateLab(h, rad60, 36);
        const [n1x, n1y] = rotateLab(h, 0, 10);
        const [n2x, n2y] = rotateLab(h, 0, 14);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "expressive": { // M3 Expressive (виразний, сміливий зсув)
        const [a1x, a1y] = rotateLab(h, rad120, Math.max(45, c));
        const [a2x, a2y] = rotateLab(h, rad120, 24);
        const [a3x, a3y] = rotateLab(h, rad240, 32);
        const [n1x, n1y] = rotateLab(h, rad120, 8);
        const [n2x, n2y] = rotateLab(h, rad120, 12);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "neutral": { // M3 Neutral (нейтральний, спокійний)
        const [a1x, a1y] = rotateLab(h, 0, 14);
        const [a2x, a2y] = rotateLab(h, 0, 8);
        const [a3x, a3y] = rotateLab(h, 0, 16);
        const [n1x, n1y] = rotateLab(h, 0, 3);
        const [n2x, n2y] = rotateLab(h, 0, 5);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "fidelity": { // M3 Fidelity (точний колір)
        const [a1x, a1y] = [a, bVal];
        const [a2x, a2y] = rotateLab(h, 0, Math.max(16, c * 0.45));
        const [a3x, a3y] = rotateLab(h, rad60, Math.max(20, c * 0.65));
        const [n1x, n1y] = rotateLab(h, 0, Math.min(8, c * 0.15));
        const [n2x, n2y] = rotateLab(h, 0, Math.min(12, c * 0.25));
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "tonal_spot":
      default: { // M3 Tonal Spot (дефолт Android Monet)
        const [a1x, a1y] = rotateLab(h, 0, Math.max(36, c));
        const [a2x, a2y] = rotateLab(h, 0, 16);
        const [a3x, a3y] = rotateLab(h, rad60, 24);
        const [n1x, n1y] = rotateLab(h, 0, 6);
        const [n2x, n2y] = rotateLab(h, 0, 8);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
    }

    const tones = [0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const mapTones = (t) => t === 50 ? 5 : t / 10;

    const res = {
      light: {
        surface: toneToHex(98, n1_a, n1_b),
        surfaceDim: toneToHex(87, n1_a, n1_b),
        surfaceBright: toneToHex(98, n1_a, n1_b),
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: toneToHex(96, n1_a, n1_b),
        surfaceContainer: toneToHex(94, n1_a, n1_b),
        surfaceContainerHigh: toneToHex(92, n1_a, n1_b),
        surfaceContainerHighest: toneToHex(90, n1_a, n1_b),
        onSurface: toneToHex(10, n1_a, n1_b),
        onSurfaceVariant: toneToHex(30, n2_a, n2_b),
        primary: toneToHex(40, a1_a, a1_b),
        onPrimary: "#FFFFFF",
        primaryContainer: toneToHex(90, a1_a, a1_b),
        onPrimaryContainer: toneToHex(10, a1_a, a1_b),
        secondary: toneToHex(40, a2_a, a2_b),
        onSecondary: "#FFFFFF",
        secondaryContainer: toneToHex(90, a2_a, a2_b),
        onSecondaryContainer: toneToHex(10, a2_a, a2_b),
        tertiary: toneToHex(40, a3_a, a3_b),
        onTertiary: "#FFFFFF",
        tertiaryContainer: toneToHex(90, a3_a, a3_b),
        onTertiaryContainer: toneToHex(10, a3_a, a3_b),
        outline: toneToHex(50, n2_a, n2_b),
        outlineVariant: toneToHex(80, n2_a, n2_b),
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
      },
      dark: {
        surface: toneToHex(10, n1_a, n1_b),
        surfaceDim: toneToHex(8, n1_a, n1_b),
        surfaceBright: toneToHex(24, n1_a, n1_b),
        surfaceContainerLowest: toneToHex(6, n1_a, n1_b),
        surfaceContainerLow: toneToHex(10, n1_a, n1_b),
        surfaceContainer: toneToHex(14, n1_a, n1_b),
        surfaceContainerHigh: toneToHex(18, n1_a, n1_b),
        surfaceContainerHighest: toneToHex(22, n1_a, n1_b),
        onSurface: toneToHex(90, n1_a, n1_b),
        onSurfaceVariant: toneToHex(80, n2_a, n2_b),
        primary: toneToHex(80, a1_a, a1_b),
        onPrimary: toneToHex(20, a1_a, a1_b),
        primaryContainer: toneToHex(30, a1_a, a1_b),
        onPrimaryContainer: toneToHex(90, a1_a, a1_b),
        secondary: toneToHex(80, a2_a, a2_b),
        onSecondary: toneToHex(20, a2_a, a2_b),
        secondaryContainer: toneToHex(30, a2_a, a2_b),
        onSecondaryContainer: toneToHex(90, a2_a, a2_b),
        tertiary: toneToHex(80, a3_a, a3_b),
        onTertiary: toneToHex(20, a3_a, a3_b),
        tertiaryContainer: toneToHex(30, a3_a, a3_b),
        onTertiaryContainer: toneToHex(90, a3_a, a3_b),
        outline: toneToHex(60, n2_a, n2_b),
        outlineVariant: toneToHex(30, n2_a, n2_b),
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFDAD6",
      },
    };

    // Fill direct tonal steps a1_..., a2_..., n1_... for compatibility with content.js
    tones.forEach((t) => {
      const L = mapTones(t);
      res[`a1_${t}`] = toneToHex(L, a1_a, a1_b);
      res[`a2_${t}`] = toneToHex(L, a2_a, a2_b);
      res[`a3_${t}`] = toneToHex(L, a3_a, a3_b);
      res[`n1_${t}`] = toneToHex(L, n1_a, n1_b);
      res[`n2_${t}`] = toneToHex(L, n2_a, n2_b);
    });

    return res;
  }

  function extractDominantColor(imgElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = Math.min(imgElement.naturalWidth || 100, 100));
    const h = (canvas.height = Math.min(imgElement.naturalHeight || 100, 100));
    ctx.drawImage(imgElement, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
      const cr = data[i], cg = data[i + 1], cb = data[i + 2];
      // Skip extreme dark or extreme light
      const bright = (cr + cg + cb) / 3;
      if (bright > 25 && bright < 235) {
        r += cr;
        g += cg;
        b += cb;
        count++;
      }
    }
    if (count === 0) return "#814F70";
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  global.MaterialColor = {
    generateM3Palette,
    extractDominantColor,
  };
})(typeof window !== "undefined" ? window : globalThis);
