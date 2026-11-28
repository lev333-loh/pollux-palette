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

  function buildMonochromeTheme(is2026) {
    const gray = (L) => toneToHex(L, 0, 0);
    return {
      light: {
        surface: gray(is2026 ? 99 : 98),
        surfaceDim: gray(is2026 ? 86 : 87),
        surfaceBright: gray(is2026 ? 99 : 98),
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: gray(is2026 ? 97 : 96),
        surfaceContainer: gray(94),
        surfaceContainerHigh: gray(is2026 ? 91 : 92),
        surfaceContainerHighest: gray(is2026 ? 88 : 89),
        surfaceVariant: gray(is2026 ? 88 : 89),
        onSurface: gray(is2026 ? 6 : 10),
        onSurfaceVariant: gray(is2026 ? 28 : 32),
        primary: gray(is2026 ? 0 : 20),
        onPrimary: "#FFFFFF",
        primaryContainer: gray(is2026 ? 85 : 86),
        onPrimaryContainer: gray(is2026 ? 5 : 10),
        secondary: gray(is2026 ? 24 : 32),
        onSecondary: "#FFFFFF",
        secondaryContainer: gray(is2026 ? 88 : 89),
        onSecondaryContainer: gray(is2026 ? 10 : 14),
        tertiary: gray(is2026 ? 36 : 42),
        onTertiary: "#FFFFFF",
        tertiaryContainer: gray(is2026 ? 90 : 91),
        onTertiaryContainer: gray(is2026 ? 12 : 16),
        outline: gray(is2026 ? 45 : 50),
        outlineVariant: gray(is2026 ? 78 : 80),
        inverseSurface: gray(is2026 ? 14 : 18),
        inverseOnSurface: gray(is2026 ? 97 : 95),
        inversePrimary: gray(is2026 ? 90 : 84),
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
      },
      dark: {
        surface: gray(is2026 ? 6 : 10),
        surfaceDim: gray(is2026 ? 4 : 8),
        surfaceBright: gray(is2026 ? 22 : 24),
        surfaceContainerLowest: gray(is2026 ? 3 : 6),
        surfaceContainerLow: gray(is2026 ? 8 : 11),
        surfaceContainer: gray(is2026 ? 12 : 15),
        surfaceContainerHigh: gray(is2026 ? 16 : 19),
        surfaceContainerHighest: gray(is2026 ? 20 : 23),
        surfaceVariant: gray(is2026 ? 25 : 28),
        onSurface: gray(is2026 ? 94 : 91),
        onSurfaceVariant: gray(is2026 ? 78 : 76),
        primary: gray(is2026 ? 100 : 92),
        onPrimary: gray(is2026 ? 0 : 12),
        primaryContainer: gray(is2026 ? 24 : 28),
        onPrimaryContainer: gray(is2026 ? 98 : 94),
        secondary: gray(is2026 ? 84 : 80),
        onSecondary: gray(is2026 ? 14 : 18),
        secondaryContainer: gray(is2026 ? 22 : 25),
        onSecondaryContainer: gray(is2026 ? 96 : 92),
        tertiary: gray(is2026 ? 74 : 70),
        onTertiary: gray(is2026 ? 14 : 18),
        tertiaryContainer: gray(is2026 ? 26 : 30),
        onTertiaryContainer: gray(is2026 ? 94 : 90),
        outline: gray(is2026 ? 55 : 58),
        outlineVariant: gray(is2026 ? 28 : 30),
        inverseSurface: gray(is2026 ? 94 : 91),
        inverseOnSurface: gray(is2026 ? 14 : 18),
        inversePrimary: gray(is2026 ? 25 : 35),
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFDAD6",
      },
    };
  }

  function mixRgb(c1, c2, t) {
    const k = Math.max(0, Math.min(1, t));
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * k),
      Math.round(c1[1] + (c2[1] - c1[1]) * k),
      Math.round(c1[2] + (c2[2] - c1[2]) * k),
    ];
  }

  function rgbTupleToHex(rgb) {
    return "#" + rgb.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function relLum(rgb) {
    return 0.2126 * rgbToLinear(rgb[0]) + 0.7152 * rgbToLinear(rgb[1]) + 0.0722 * rgbToLinear(rgb[2]);
  }

  function contrastRatio(a, b) {
    const l1 = relLum(a);
    const l2 = relLum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  function ensureContrastOnBg(fgRgb, bgRgb, towardRgb, minRatio) {
    if (contrastRatio(fgRgb, bgRgb) >= minRatio) return fgRgb;
    for (let step = 1; step <= 24; step++) {
      const candidate = mixRgb(fgRgb, towardRgb, step / 24);
      if (contrastRatio(candidate, bgRgb) >= minRatio) return candidate;
    }
    return towardRgb;
  }

  function pickReadableText(bgRgb, seedRgb, minRatio) {
    const lightOpt = ensureContrastOnBg(mixRgb(seedRgb, [255, 255, 255], 0.92), bgRgb, [255, 255, 255], minRatio);
    const darkOpt = ensureContrastOnBg(mixRgb(seedRgb, [0, 0, 0], 0.92), bgRgb, [0, 0, 0], minRatio);
    return contrastRatio(lightOpt, bgRgb) >= contrastRatio(darkOpt, bgRgb) ? lightOpt : darkOpt;
  }

  function buildDirectLinearTheme(seedRgb, is2026) {
    const BLACK = [0, 0, 0];
    const WHITE = [255, 255, 255];

    const lSurf = mixRgb(seedRgb, WHITE, is2026 ? 0.90 : 0.93);
    const lSurfCont = mixRgb(seedRgb, WHITE, is2026 ? 0.83 : 0.86);
    const lSurfHigh = mixRgb(seedRgb, WHITE, is2026 ? 0.78 : 0.82);
    const lOnSurf = ensureContrastOnBg(mixRgb(seedRgb, BLACK, 0.84), lSurf, BLACK, 8.0);
    const lPrim = ensureContrastOnBg(seedRgb, lSurf, BLACK, 4.8);
    const lPrimCont = ensureContrastOnBg(mixRgb(seedRgb, WHITE, is2026 ? 0.60 : 0.68), BLACK, WHITE, 7.2);
    const lSec = ensureContrastOnBg(mixRgb(seedRgb, BLACK, 0.25), lSurf, BLACK, 4.5);
    const lSecCont = ensureContrastOnBg(mixRgb(seedRgb, WHITE, is2026 ? 0.66 : 0.73), BLACK, WHITE, 7.2);
    const lTert = ensureContrastOnBg(mixRgb(seedRgb, BLACK, 0.35), lSurf, BLACK, 4.5);
    const lTertCont = ensureContrastOnBg(mixRgb(seedRgb, WHITE, is2026 ? 0.72 : 0.78), BLACK, WHITE, 7.2);
    const lInvSurf = mixRgb(seedRgb, BLACK, 0.84);

    const dSurf = mixRgb(seedRgb, BLACK, is2026 ? 0.84 : 0.88);
    const dSurfCont = mixRgb(seedRgb, BLACK, is2026 ? 0.77 : 0.81);
    const dSurfHigh = mixRgb(seedRgb, BLACK, is2026 ? 0.72 : 0.76);
    const dOnSurf = ensureContrastOnBg(mixRgb(seedRgb, WHITE, 0.86), dSurf, WHITE, 8.0);
    const dPrim = ensureContrastOnBg(seedRgb, dSurf, WHITE, 4.8);
    const dPrimCont = ensureContrastOnBg(mixRgb(seedRgb, BLACK, is2026 ? 0.45 : 0.55), WHITE, BLACK, 7.2);
    const dSec = ensureContrastOnBg(mixRgb(seedRgb, WHITE, 0.32), dSurf, WHITE, 4.5);
    const dSecCont = ensureContrastOnBg(mixRgb(seedRgb, BLACK, is2026 ? 0.48 : 0.56), WHITE, BLACK, 7.2);
    const dTert = ensureContrastOnBg(mixRgb(seedRgb, WHITE, 0.48), dSurf, WHITE, 4.5);
    const dTertCont = ensureContrastOnBg(mixRgb(seedRgb, BLACK, is2026 ? 0.52 : 0.60), WHITE, BLACK, 7.2);
    const dInvSurf = mixRgb(seedRgb, WHITE, 0.88);

    return {
      light: {
        surface: rgbTupleToHex(lSurf),
        surfaceDim: rgbTupleToHex(mixRgb(seedRgb, WHITE, is2026 ? 0.78 : 0.82)),
        surfaceBright: rgbTupleToHex(mixRgb(seedRgb, WHITE, is2026 ? 0.93 : 0.96)),
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: rgbTupleToHex(mixRgb(seedRgb, WHITE, is2026 ? 0.87 : 0.90)),
        surfaceContainer: rgbTupleToHex(lSurfCont),
        surfaceContainerHigh: rgbTupleToHex(lSurfHigh),
        surfaceContainerHighest: rgbTupleToHex(mixRgb(seedRgb, WHITE, is2026 ? 0.73 : 0.77)),
        surfaceVariant: rgbTupleToHex(mixRgb(seedRgb, WHITE, is2026 ? 0.72 : 0.76)),
        onSurface: rgbTupleToHex(lOnSurf),
        onSurfaceVariant: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, BLACK, 0.58), lSurfHigh, BLACK, 4.8)),
        primary: rgbTupleToHex(lPrim),
        onPrimary: rgbTupleToHex(pickReadableText(lPrim, seedRgb, 7.0)),
        primaryContainer: rgbTupleToHex(lPrimCont),
        onPrimaryContainer: rgbTupleToHex(pickReadableText(lPrimCont, seedRgb, 7.0)),
        secondary: rgbTupleToHex(lSec),
        onSecondary: rgbTupleToHex(pickReadableText(lSec, seedRgb, 7.0)),
        secondaryContainer: rgbTupleToHex(lSecCont),
        onSecondaryContainer: rgbTupleToHex(pickReadableText(lSecCont, seedRgb, 7.0)),
        tertiary: rgbTupleToHex(lTert),
        onTertiary: rgbTupleToHex(pickReadableText(lTert, seedRgb, 7.0)),
        tertiaryContainer: rgbTupleToHex(lTertCont),
        onTertiaryContainer: rgbTupleToHex(pickReadableText(lTertCont, seedRgb, 7.0)),
        outline: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, BLACK, 0.35), lSurf, BLACK, 3.0)),
        outlineVariant: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, WHITE, is2026 ? 0.62 : 0.68), lSurfCont, BLACK, 1.45)),
        inverseSurface: rgbTupleToHex(lInvSurf),
        inverseOnSurface: rgbTupleToHex(pickReadableText(lInvSurf, seedRgb, 7.0)),
        inversePrimary: rgbTupleToHex(ensureContrastOnBg(seedRgb, lInvSurf, WHITE, 4.5)),
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
      },
      dark: {
        surface: rgbTupleToHex(dSurf),
        surfaceDim: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.88 : 0.91)),
        surfaceBright: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.70 : 0.75)),
        surfaceContainerLowest: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.90 : 0.93)),
        surfaceContainerLow: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.82 : 0.86)),
        surfaceContainer: rgbTupleToHex(dSurfCont),
        surfaceContainerHigh: rgbTupleToHex(dSurfHigh),
        surfaceContainerHighest: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.66 : 0.71)),
        surfaceVariant: rgbTupleToHex(mixRgb(seedRgb, BLACK, is2026 ? 0.62 : 0.68)),
        onSurface: rgbTupleToHex(dOnSurf),
        onSurfaceVariant: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, WHITE, 0.65), dSurfHigh, WHITE, 4.8)),
        primary: rgbTupleToHex(dPrim),
        onPrimary: rgbTupleToHex(pickReadableText(dPrim, seedRgb, 7.0)),
        primaryContainer: rgbTupleToHex(dPrimCont),
        onPrimaryContainer: rgbTupleToHex(pickReadableText(dPrimCont, seedRgb, 7.0)),
        secondary: rgbTupleToHex(dSec),
        onSecondary: rgbTupleToHex(pickReadableText(dSec, seedRgb, 7.0)),
        secondaryContainer: rgbTupleToHex(dSecCont),
        onSecondaryContainer: rgbTupleToHex(pickReadableText(dSecCont, seedRgb, 7.0)),
        tertiary: rgbTupleToHex(dTert),
        onTertiary: rgbTupleToHex(pickReadableText(dTert, seedRgb, 7.0)),
        tertiaryContainer: rgbTupleToHex(dTertCont),
        onTertiaryContainer: rgbTupleToHex(pickReadableText(dTertCont, seedRgb, 7.0)),
        outline: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, WHITE, 0.30), dSurf, WHITE, 3.0)),
        outlineVariant: rgbTupleToHex(ensureContrastOnBg(mixRgb(seedRgb, BLACK, is2026 ? 0.52 : 0.58), dSurfCont, WHITE, 1.45)),
        inverseSurface: rgbTupleToHex(dInvSurf),
        inverseOnSurface: rgbTupleToHex(pickReadableText(dInvSurf, seedRgb, 7.0)),
        inversePrimary: rgbTupleToHex(ensureContrastOnBg(seedRgb, dInvSurf, BLACK, 4.5)),
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFDAD6",
      },
    };
  }

  function generateM3Palette(seedHex, scheme, era) {
    scheme = (scheme || "tonal_spot").toLowerCase();
    era = (era || (scheme === "monet_2026" ? "2026" : "2021")).toString().toLowerCase();
    const is2026 = era.includes("2026") || scheme === "monet_2026";
    const isMonochrome = scheme === "monochrome";
    const isDirect = scheme === "direct";

    const [r, g, b] = hexToRgb(seedHex || "#814F70");
    const tones = [0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    if (isDirect) {
      const seedRgb = [r, g, b];
      const directRes = buildDirectLinearTheme(seedRgb, is2026);
      tones.forEach((t) => {
        const hexStep = rgbTupleToHex(
          t <= 500
            ? mixRgb([0, 0, 0], seedRgb, t / 500)
            : mixRgb(seedRgb, [255, 255, 255], (t - 500) / 500)
        );
        directRes[`a1_${t}`] = hexStep;
        directRes[`a2_${t}`] = hexStep;
        directRes[`a3_${t}`] = hexStep;
        directRes[`n1_${t}`] = hexStep;
        directRes[`n2_${t}`] = hexStep;
      });
      return directRes;
    }

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
        if (is2026) {
          const [a1x, a1y] = rotateLab(h, 0, Math.max(68, c * 1.35));
          const [a2x, a2y] = rotateLab(h, 0, 28);
          const [a3x, a3y] = rotateLab(h, rad60, 36);
          const [n1x, n1y] = rotateLab(h, 0, 7);
          const [n2x, n2y] = rotateLab(h, 0, 11);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          const [a1x, a1y] = rotateLab(h, 0, Math.max(48, c));
          const [a2x, a2y] = rotateLab(h, 0, 18);
          const [a3x, a3y] = rotateLab(h, rad60, 26);
          const [n1x, n1y] = rotateLab(h, 0, 4);
          const [n2x, n2y] = rotateLab(h, 0, 7);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
      case "vibrant": { // M3 Vibrant (яскравий, насичений)
        if (is2026) {
          const [a1x, a1y] = rotateLab(h, 0, Math.max(76, c * 1.5));
          const [a2x, a2y] = rotateLab(h, 0, 32);
          const [a3x, a3y] = rotateLab(h, rad60, 42);
          const [n1x, n1y] = rotateLab(h, 0, 8);
          const [n2x, n2y] = rotateLab(h, 0, 14);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          const [a1x, a1y] = rotateLab(h, 0, Math.max(56, c * 1.15));
          const [a2x, a2y] = rotateLab(h, 0, 24);
          const [a3x, a3y] = rotateLab(h, rad60, 32);
          const [n1x, n1y] = rotateLab(h, 0, 6);
          const [n2x, n2y] = rotateLab(h, 0, 10);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
      case "expressive": { // M3 Expressive (виразний, сміливий зсув)
        if (is2026) {
          const [a1x, a1y] = rotateLab(h, rad120, Math.max(58, c * 1.25));
          const [a2x, a2y] = rotateLab(h, rad120, 30);
          const [a3x, a3y] = rotateLab(h, rad240, 44);
          const [n1x, n1y] = rotateLab(h, rad120, 8);
          const [n2x, n2y] = rotateLab(h, rad120, 14);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          const [a1x, a1y] = rotateLab(h, rad120, Math.max(42, c));
          const [a2x, a2y] = rotateLab(h, rad120, 20);
          const [a3x, a3y] = rotateLab(h, rad240, 28);
          const [n1x, n1y] = rotateLab(h, rad120, 6);
          const [n2x, n2y] = rotateLab(h, rad120, 10);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
      case "neutral": { // M3 Neutral (нейтральний, спокійний)
        if (is2026) {
          const [a1x, a1y] = rotateLab(h, 0, 16);
          const [a2x, a2y] = rotateLab(h, 0, 10);
          const [a3x, a3y] = rotateLab(h, 0, 18);
          const [n1x, n1y] = rotateLab(h, 0, 4);
          const [n2x, n2y] = rotateLab(h, 0, 6);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          const [a1x, a1y] = rotateLab(h, 0, 12);
          const [a2x, a2y] = rotateLab(h, 0, 8);
          const [a3x, a3y] = rotateLab(h, 0, 12);
          const [n1x, n1y] = rotateLab(h, 0, 3);
          const [n2x, n2y] = rotateLab(h, 0, 4);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
      case "fidelity": { // M3 Fidelity (точний колір)
        if (is2026) {
          const [a1x, a1y] = [a * 1.15, bVal * 1.15];
          const [a2x, a2y] = rotateLab(h, 0, Math.max(22, c * 0.55));
          const [a3x, a3y] = rotateLab(h, rad60, Math.max(28, c * 0.8));
          const [n1x, n1y] = rotateLab(h, 0, Math.min(8, c * 0.15));
          const [n2x, n2y] = rotateLab(h, 0, Math.min(14, c * 0.25));
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          const [a1x, a1y] = [a, bVal];
          const [a2x, a2y] = rotateLab(h, 0, Math.max(16, c * 0.45));
          const [a3x, a3y] = rotateLab(h, rad60, Math.max(20, c * 0.65));
          const [n1x, n1y] = rotateLab(h, 0, Math.min(6, c * 0.12));
          const [n2x, n2y] = rotateLab(h, 0, Math.min(10, c * 0.20));
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
      case "monet_2021": { // Monet 2021 (Android 12 Original AOSP ColorScheme)
        // Специфікація AOSP frameworks/base/packages/SystemUI/monet/src/com/android/systemui/monet/ColorScheme.kt
        // Константи: ACCENT1_CHROMA = 48.0, ACCENT2_CHROMA = 16.0, ACCENT3_CHROMA = 32.0 (hue + 60 deg),
        //            NEUTRAL1_CHROMA = 4.0, NEUTRAL2_CHROMA = 8.0
        const [a1x, a1y] = rotateLab(h, 0, Math.max(48, c));
        const [a2x, a2y] = rotateLab(h, 0, 16);
        const [a3x, a3y] = rotateLab(h, rad60, 32);
        const [n1x, n1y] = rotateLab(h, 0, 4);
        const [n2x, n2y] = rotateLab(h, 0, 8);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "monet_2026": { // Monet 2026 (Приближення / Approximation на базі Material 3 Expressive / High Vibrancy)
        // УВАГА: Офіційний алгоритм Monet 2026 не опублікований Google;
        // дана реалізація є алгоритмічним наближенням (approximation) на базі M3 Expressive / Dynamic Color
        // і не повинна видаватися за точну копію.
        const [a1x, a1y] = rotateLab(h, 0, Math.max(72, c * 1.4));
        const [a2x, a2y] = rotateLab(h, 0, Math.max(28, c * 0.6));
        const [a3x, a3y] = rotateLab(h, rad120, Math.max(42, c * 0.8));
        const [n1x, n1y] = rotateLab(h, 0, 5);
        const [n2x, n2y] = rotateLab(h, 0, 12);
        a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
        n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        break;
      }
      case "monochrome": { // M3 Monochrome (чистий ахроматичний ЧБ-режим, chroma = 0)
        a1_a = 0; a1_b = 0; a2_a = 0; a2_b = 0; a3_a = 0; a3_b = 0;
        n1_a = 0; n1_b = 0; n2_a = 0; n2_b = 0;
        break;
      }
      case "tonal_spot":
      default: { // M3 Tonal Spot (дефолт Android Monet, керується ерою 2021 або 2026)
        if (is2026) {
          const [a1x, a1y] = rotateLab(h, 0, Math.max(48, c * 1.15));
          const [a2x, a2y] = rotateLab(h, 0, 20);
          const [a3x, a3y] = rotateLab(h, rad60, 28);
          const [n1x, n1y] = rotateLab(h, 0, 6);
          const [n2x, n2y] = rotateLab(h, 0, 10);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        } else {
          // Канонічний M3 Tonal Spot: делікатний, спокійний пастельний баланс
          const [a1x, a1y] = rotateLab(h, 0, Math.max(36, c));
          const [a2x, a2y] = rotateLab(h, 0, 16);
          const [a3x, a3y] = rotateLab(h, rad60, 24);
          const [n1x, n1y] = rotateLab(h, 0, 6);
          const [n2x, n2y] = rotateLab(h, 0, 8);
          a1_a = a1x; a1_b = a1y; a2_a = a2x; a2_b = a2y; a3_a = a3x; a3_b = a3y;
          n1_a = n1x; n1_b = n1y; n2_a = n2x; n2_b = n2y;
        }
        break;
      }
    }

    const mapTones = (t) => t === 50 ? 5 : t / 10;

    const res = isMonochrome ? buildMonochromeTheme(is2026) : {
      light: {
        surface: toneToHex(98, n1_a, n1_b),
        surfaceDim: toneToHex(87, n1_a, n1_b),
        surfaceBright: toneToHex(98, n1_a, n1_b),
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: toneToHex(96, n1_a, n1_b),
        surfaceContainer: toneToHex(94, n1_a, n1_b),
        surfaceContainerHigh: toneToHex(92, n1_a, n1_b),
        surfaceContainerHighest: toneToHex(90, n1_a, n1_b),
        surfaceVariant: toneToHex(90, n2_a, n2_b),
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
        inverseSurface: toneToHex(20, n1_a, n1_b),
        inverseOnSurface: toneToHex(95, n1_a, n1_b),
        inversePrimary: toneToHex(80, a1_a, a1_b),
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
        surfaceVariant: toneToHex(30, n2_a, n2_b),
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
        inverseSurface: toneToHex(90, n1_a, n1_b),
        inverseOnSurface: toneToHex(20, n1_a, n1_b),
        inversePrimary: toneToHex(40, a1_a, a1_b),
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
