/* Pollux Palette — Gemini Material You Theme (document_start, gemini.google.com). */
(function () {
  "use strict";

  // Safety guard: NEVER modify Google Account login/password pages
  if (typeof location !== "undefined" && location.hostname === "accounts.google.com") {
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("/signin") || path.includes("/servicelogin") || path.includes("/v3/") || path.includes("/identifier") || path.includes("/challenge")) {
      return; // Do NOT touch authentication pages
    }
  }

  const isOgs = typeof location !== "undefined" && location.hostname === "ogs.google.com";
  const STYLE_ID = "gemini-monet-style";
  const LS_DISABLED_KEY = "gemini-monet-disabled";
  const LS_EDIT_MODE_KEY = "gemini-monet-edit-mode";

  let isPluginEnabled = true;
  let currentEditModeStyle = "canon";

  // Synchronous boot hint on same origin to avoid 1-frame flash when disabled or in legacy edit mode
  try {
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem(LS_DISABLED_KEY) === "1") {
        isPluginEnabled = false;
        document.documentElement.dataset.monetDisabled = "1";
      }
      if (localStorage.getItem(LS_EDIT_MODE_KEY) === "legacy") {
        currentEditModeStyle = "legacy";
        document.documentElement.dataset.monetEditMode = "legacy";
      }
    }
  } catch (e) {}

  function hexToRgbTuple(hex) {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return null;
    let clean = hex.slice(1);
    if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
    if (clean.length !== 6) return null;
    const n = parseInt(clean, 16);
    if (Number.isNaN(n)) return null;
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }

  const THEME_MAP = {
    "surface": [
      "--gem-sys-color--surface",
      "--bard-color-synthetic--chat-window-surface",
      "--bard-color-remy-surface",
      "--lumi-sys-color--surface",
      "--lumi-sys-color--surface-background",
      "--mat-sys-surface",
      "--mat-sys-background",
      "--mat-app-background-color",
      "--gm3-sys-color-surface",
      "--gm3-sys-color-background",
      "--xhrugro"
    ],
    "surfaceBright": [
      "--gem-sys-color--surface-bright",
      "--lumi-sys-color--surface-bright"
    ],
    "surfaceDim": [
      "--gem-sys-color--surface-dim",
      "--lumi-sys-color--surface-dim"
    ],
    "surfaceContainerLowest": [
      "--gem-sys-color--surface-container-lowest",
      "--gm3-sys-color-surface-container-lowest",
      "--x1rx2a60",
      "--x12ijoim"
    ],
    "surfaceContainerLow": [
      "--gem-sys-color--surface-container-low",
      "--gm3-sys-color-surface-container-low",
      "--xes8i4n",
      "--xzkn3nr",
      "--xyj9pdk"
    ],
    "surfaceContainer": [
      "--gem-sys-color--surface-container",
      "--bard-color-synthetic--chat-window-surface-container",
      "--bard-color-sidenav-background-mobile",
      "--bard-color-mode-switcher-container",
      "--mat-sidenav-container-background-color",
      "--mat-sidenav-content-background-color",
      "--lumi-sys-color--surface-accent",
      "--lumi-surface-control",
      "--gm3-sys-color-surface-container",
      "--mdc-dialog-container-color",
      "--mat-dialog-container-color",
      "--x1lxru9b",
      "--x1diqisq"
    ],
    "surfaceContainerHigh": [
      "--gem-sys-color--surface-container-high",
      "--bard-color-synthetic--chat-window-surface-container-high",
      "--bard-color-sidenav-background-desktop",
      "--lumi-sys-color--code-background",
      "--mat-menu-container-color",
      "--gm3-sys-color-surface-container-high",
      "--x1oyaoqk"
    ],
    "surfaceContainerHighest": [
      "--gem-sys-color--surface-container-highest",
      "--bard-color-synthetic--chat-window-surface-container-highest",
      "--gm3-sys-color-surface-container-highest",
      "--xr86lwc"
    ],
    "surfaceVariant": [
      "--gem-sys-color--surface-variant",
      "--gm3-sys-color-surface-variant"
    ],
    "onSurface": [
      "--gem-sys-color--on-surface",
      "--lumi-sys-color--on-surface",
      "--mat-sidenav-container-text-color",
      "--mat-sidenav-content-text-color",
      "--mat-app-text-color",
      "--mat-menu-item-label-text-color",
      "--lumi-sys-color--code-primary-text",
      "--gm3-sys-color-on-surface",
      "--gm3-sys-color-on-background",
      "--mdc-dialog-subhead-color",
      "--mat-dialog-subhead-color",
      "--x13pcbat",
      "--xjzgp2m",
      "--x183vj29"
    ],
    "onSurfaceVariant": [
      "--gem-sys-color--on-surface-variant",
      "--lumi-sys-color--on-surface-variant",
      "--lumi-text-muted",
      "--gem-sys-color--on-surface-low",
      "--bard-color-sidenav-tile-text-aurora",
      "--bard-color-sidenav-mobile-controls",
      "--gm3-sys-color-on-surface-variant",
      "--mdc-dialog-supporting-text-color",
      "--mat-dialog-supporting-text-color",
      "--xxvc16v",
      "--xzzcrc8"
    ],
    "primary": [
      "--gem-sys-color--primary",
      "--lumi-sys-color-acc-color--accent-fixed",
      "--mat-menu-item-icon-color",
      "--gm3-sys-color-primary",
      "--gm3-sys-color-primary-variant",
      "--x1uyhldl"
    ],
    "onPrimary": [
      "--gem-sys-color--on-primary",
      "--gm3-sys-color-on-primary",
      "--x1fm5spw"
    ],
    "primaryContainer": [
      "--gem-sys-color--primary-container",
      "--bard-color-custom-primary-container",
      "--lumi-sys-color-acc-color--accent-container",
      "--lumi-sys-color-acc-color--accent",
      "--bard-color-sidenav-tile-background-aurora",
      "--mat-list-active-indicator-color",
      "--x1nh6le8"
    ],
    "onPrimaryContainer": [
      "--gem-sys-color--on-primary-container",
      "--bard-color-on-tonal-container",
      "--xxmoypt"
    ],
    "secondary": [
      "--gem-sys-color--secondary",
      "--gm3-sys-color-secondary",
      "--gm3-sys-color-secondary-variant"
    ],
    "onSecondary": [
      "--gem-sys-color--on-secondary",
      "--gm3-sys-color-on-secondary"
    ],
    "secondaryContainer": [
      "--gem-sys-color--secondary-container"
    ],
    "onSecondaryContainer": [
      "--gem-sys-color--on-secondary-container"
    ],
    "tertiary": [
      "--gem-sys-color--tertiary"
    ],
    "onTertiary": [
      "--gem-sys-color--on-tertiary"
    ],
    "tertiaryContainer": [
      "--gem-sys-color--tertiary-container"
    ],
    "onTertiaryContainer": [
      "--gem-sys-color--on-tertiary-container"
    ],
    "outline": [
      "--gem-sys-color--outline",
      "--gm3-sys-color-outline",
      "--x10pk9ts"
    ],
    "outlineVariant": [
      "--gem-sys-color--outline-variant",
      "--mat-menu-divider-color",
      "--mat-sidenav-container-divider-color",
      "--gm3-sys-color-hairline"
    ],
    "error": [
      "--gem-sys-color--error",
      "--lumi-sys-color--error",
      "--gm3-sys-color-error"
    ],
    "onError": [
      "--gem-sys-color--on-error",
      "--gm3-sys-color-on-error"
    ],
    "errorContainer": [
      "--gem-sys-color--error-container",
      "--lumi-sys-color--error-container"
    ],
    "onErrorContainer": [
      "--gem-sys-color--on-error-container",
      "--lumi-sys-color--on-error-container"
    ],
    "inverseSurface": [
      "--gem-sys-color--inverse-surface",
      "--mat-tooltip-container-color",
      "--mdc-plain-tooltip-container-color",
      "--gm3-sys-color-inverse-surface",
      "--gm3-tooltip-plain-container-color"
    ],
    "inverseOnSurface": [
      "--gem-sys-color--inverse-on-surface",
      "--mat-tooltip-supporting-text-color",
      "--mdc-plain-tooltip-supporting-text-color",
      "--gm3-sys-color-inverse-on-surface",
      "--gm3-tooltip-plain-supporting-text-color"
    ],
    "inversePrimary": [
      "--gem-sys-color--inverse-primary"
    ]
  };

  const GM3_RGB_MAP = {
    surfaceContainerLowest: "--gm3-sys-color-surface-container-lowest-rgb",
    surfaceContainerLow: "--gm3-sys-color-surface-container-low-rgb",
    surfaceContainer: "--gm3-sys-color-surface-container-rgb",
    surfaceContainerHigh: "--gm3-sys-color-surface-container-high-rgb",
    surfaceContainerHighest: "--gm3-sys-color-surface-container-highest-rgb",
    surfaceVariant: "--gm3-sys-color-surface-variant-rgb",
    onSurface: ["--gm3-sys-color-on-surface-rgb", "--gm3-sys-color-on-background-rgb"],
    onSurfaceVariant: "--gm3-sys-color-on-surface-variant-rgb",
    primary: "--gm3-sys-color-primary-rgb",
    outline: "--gm3-sys-color-outline-rgb"
  };

  let lastApplied = null;
  let lastThemeMode = "dark";

  function buildCss(palette, themeMode) {
    const map = THEME_MAP;
    const lines = [];

    const light = (palette && palette.light) || palette || {};
    const dark = (palette && palette.dark) || palette || {};

    function emitRules(selector, rawP, isDark) {
      const p = Object.assign({}, rawP);
      if (!p.surfaceVariant) p.surfaceVariant = p.surfaceContainerHighest || (isDark ? "#4D4449" : "#EDE0E8");
      // Align inverse tooltip surfaces with Monet theme surfaceContainerHighest + onSurface so
      // native Angular (.gem-tooltip .mat-mdc-tooltip-surface) and Monet overrides never clash
      const tooltipBg = p.surfaceContainerHighest || (isDark ? "#383236" : "#F0DEE6");
      const tooltipFg = p.onSurface || (isDark ? "#EAE0E4" : "#22191E");
      p.inverseSurface = tooltipBg;
      p.inverseOnSurface = tooltipFg;
      if (!p.inversePrimary) p.inversePrimary = p.primary;

      lines.push(`${selector} {`);
      for (const role in map) {
        const varNames = Array.isArray(map[role]) ? map[role] : [map[role]];
        for (const varName of varNames) {
          if (p && p[role] && varName) {
            lines.push(`  ${varName}: ${p[role]} !important;`);
          }
        }
      }
      for (const role in GM3_RGB_MAP) {
        const tuple = p && p[role] ? hexToRgbTuple(p[role]) : null;
        if (!tuple) continue;
        const rgbNames = Array.isArray(GM3_RGB_MAP[role]) ? GM3_RGB_MAP[role] : [GM3_RGB_MAP[role]];
        for (const rgbVar of rgbNames) {
          lines.push(`  ${rgbVar}: ${tuple} !important;`);
        }
      }
      const onSurfRgb = hexToRgbTuple(p.onSurface) || (isDark ? '234, 224, 228' : '34, 25, 30');
      const primCol = p.primary || (isDark ? '#FCBCE2' : '#653655');
      const surfHighCol = p.surfaceContainerHigh || (isDark ? '#2D282C' : '#EDE0E8');
      lines.push(`  --lumi-sys-color--on-surface-low: rgba(${onSurfRgb}, ${isDark ? '0.12' : '0.08'}) !important;`);
      lines.push(`  --x1ht9wpk: rgba(${onSurfRgb}, ${isDark ? '0.12' : '0.10'}) !important;`);
      lines.push(`  --xun3vkn: rgba(${onSurfRgb}, 0.12) !important;`);
      lines.push(`  --xuw4o75: rgba(${onSurfRgb}, 0.42) !important;`);
      lines.push(`  --xw7l8uk: color-mix(in srgb, ${surfHighCol} 90%, transparent) !important;`);
      lines.push(`  --x2md6tt: color-mix(in srgb, ${primCol} 12%, transparent) !important;`);
      lines.push(`  --xbebe17: color-mix(in srgb, ${primCol} 18%, transparent) !important;`);
      lines.push(`  --xh7zu4x: color-mix(in srgb, ${primCol} 12%, transparent) !important;`);
      if (isDark) {
        lines.push(`  --monet-surface: ${p.surface || '#1A1618'} !important;`);
        lines.push(`  --monet-surface-container: ${p.surfaceContainer || '#241F22'} !important;`);
        lines.push(`  --monet-surface-container-high: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-surface-container-highest: ${p.surfaceContainerHighest || '#383236'} !important;`);
        lines.push(`  --monet-border: ${p.outlineVariant || '#50434A'} !important;`);
        lines.push(`  --monet-input-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-input-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-input-placeholder: ${p.onSurfaceVariant || '#A18F97'} !important;`);
        lines.push(`  --monet-user-bubble-bg: ${p.secondaryContainer || '#57404E'} !important;`);
        lines.push(`  --monet-user-bubble-text: ${p.onSecondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-code-bg: ${p.surfaceContainer || '#231E21'} !important;`);
        lines.push(`  --monet-code-header-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-code-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-code-border: ${p.outlineVariant || '#50434A'} !important;`);
        lines.push(`  --monet-sidebar-bg: ${p.surface || '#161214'} !important;`);
        lines.push(`  --monet-sidebar-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-sidebar-icon: ${p.secondary || '#DBBDE5'} !important;`);
        lines.push(`  --monet-sidebar-selected-bg: ${p.secondaryContainer || '#57404E'} !important;`);
        lines.push(`  --monet-sidebar-selected-text: ${p.onSecondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-sidebar-hover-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --sidenav-button-selected-background-color: ${p.secondaryContainer || '#57404E'} !important;`);
        lines.push(`  --sidenav-button-selected-text-color: ${p.onSecondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --sidenav-button-hover-background-color: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-menu-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-menu-border: ${p.outlineVariant || '#50434A'} !important;`);
        lines.push(`  --monet-menu-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-menu-subtext: ${p.onSurfaceVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-menu-selected-bg: ${p.secondaryContainer || '#57404E'} !important;`);
        lines.push(`  --monet-menu-selected-text: ${p.onSecondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-menu-hover-bg: ${p.surfaceContainerHighest || '#383236'} !important;`);
        lines.push(`  --monet-chip-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-sheet-bg: ${p.surfaceContainerLow || '#1E191C'} !important;`);
        lines.push(`  --monet-sheet-item-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
      } else {
        lines.push(`  --monet-surface: ${p.surface || '#FFF8F9'} !important;`);
        lines.push(`  --monet-surface-container: ${p.surfaceContainer || '#F5E4EB'} !important;`);
        lines.push(`  --monet-surface-container-high: ${p.surfaceContainerHigh || '#EDE0E8'} !important;`);
        lines.push(`  --monet-surface-container-highest: ${p.surfaceContainerHighest || '#F0DEE6'} !important;`);
        lines.push(`  --monet-border: ${p.outlineVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-input-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --monet-input-text: ${p.onSurface || '#22191E'} !important;`);
        lines.push(`  --monet-input-placeholder: ${p.onSurfaceVariant || '#695B62'} !important;`);
        lines.push(`  --monet-user-bubble-bg: ${p.primaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-user-bubble-text: ${p.onPrimaryContainer || '#340B29'} !important;`);
        lines.push(`  --monet-code-bg: ${p.surfaceContainer || '#FAEAF0'} !important;`);
        lines.push(`  --monet-code-header-bg: ${p.surfaceContainerHighest || '#F0DEE6'} !important;`);
        lines.push(`  --monet-code-text: ${p.onSurface || '#22191E'} !important;`);
        lines.push(`  --monet-code-border: ${p.outlineVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-sidebar-bg: ${p.surface || '#FFF8F9'} !important;`);
        lines.push(`  --monet-sidebar-text: ${p.onSurface || '#3A2F35'} !important;`);
        lines.push(`  --monet-sidebar-icon: ${p.primary || '#653655'} !important;`);
        lines.push(`  --monet-sidebar-selected-bg: ${p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --monet-sidebar-selected-text: ${p.onPrimaryContainer || '#3A2F35'} !important;`);
        lines.push(`  --monet-sidebar-hover-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --sidenav-button-selected-background-color: ${p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --sidenav-button-selected-text-color: ${p.onPrimaryContainer || '#3A2F35'} !important;`);
        lines.push(`  --sidenav-button-hover-background-color: ${p.surfaceDim || '#E7D5DD'} !important;`);
        lines.push(`  --monet-menu-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --monet-menu-border: ${p.outlineVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-menu-text: ${p.onSurface || '#22191E'} !important;`);
        lines.push(`  --monet-menu-subtext: ${p.onSurfaceVariant || '#695B62'} !important;`);
        lines.push(`  --monet-menu-selected-bg: ${p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --monet-menu-selected-text: ${p.onPrimaryContainer || '#340B29'} !important;`);
        lines.push(`  --monet-menu-hover-bg: ${p.surfaceDim || '#E7D5DD'} !important;`);
        lines.push(`  --monet-chip-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --monet-sheet-bg: ${p.surfaceContainerLow || '#FFF0F5'} !important;`);
        lines.push(`  --monet-sheet-item-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
      }
      lines.push("}");
    }

    if (isOgs) {
      const isDarkOgs = themeMode !== "light";
      const p = isDarkOgs ? dark : light;
      const outerCardBg = p.surfaceContainerHigh || (isDarkOgs ? "#2D282C" : "#F5E4EB");
      const cardContainerBg = p.surfaceContainer || (isDarkOgs ? "#241F22" : "#F7EAF2");
      const innerBg = p.surfaceContainerLow || (isDarkOgs ? "#1E191C" : "#FFF0F5");
      const hoverBg = isDarkOgs ? (p.surfaceContainerHighest || "#383236") : (p.surfaceDim || "#E7D5DD");
      const onSurf = p.onSurface || (isDarkOgs ? "#EAE0E4" : "#22191E");
      const onSurfVar = p.onSurfaceVariant || (isDarkOgs ? "#D5C2CC" : "#695B62");
      const pillBg = isDarkOgs ? (p.secondaryContainer || "#57404E") : (p.primaryContainer || "#FFD8ED");
      const pillText = isDarkOgs ? (p.onSecondaryContainer || "#FFD8ED") : (p.onPrimaryContainer || "#340B29");
      const accentRing = p.primary || (isDarkOgs ? "#FCBCE2" : "#653655");
      const borderCol = p.outlineVariant || (isDarkOgs ? "#50434A" : "#D5C2CC");

      // Override OneGoogleWidgetUi local .nz9sqb / .aRDKUe / .J5OKee variables on every widget node
      emitRules(":root, html, body, c-wiz, c-wiz *, .nz9sqb, .nz9sqb *, .aRDKUe, .aRDKUe *, .J5OKee, .J5OKee *, .EHzcec, .EHzcec *, .Lvwayc, .Agku8b, .bMnvr, .LVal7b, .Rq5Gcb, .NQV3m, .tX9u1b, .bOwcqf", p, isDarkOgs);
      lines.push(
        `:root, body, .aRDKUe, .J5OKee, .YLkvaf {`,
        `  --monet-surface-container: ${cardContainerBg} !important;`,
        `  --monet-surface-container-highest: ${outerCardBg} !important;`,
        `  --monet-chip-bg: ${outerCardBg} !important;`,
        `  --monet-sheet-bg: ${innerBg} !important;`,
        `  --monet-menu-hover-bg: ${hoverBg} !important;`,
        `  --monet-border: ${borderCol} !important;`,
        `  --monet-input-text: ${onSurf} !important;`,
        `  --monet-input-placeholder: ${onSurfVar} !important;`,
        `  --monet-sidebar-icon: ${accentRing} !important;`,
        `  --monet-sidebar-selected-bg: ${pillBg} !important;`,
        `  --monet-sidebar-selected-text: ${pillText} !important;`,
        `  --action-items-action-item-background-color: ${innerBg} !important;`,
        `  --action-items-action-item-dark-background-color: ${innerBg} !important;`,
        `  --action-items-action-item-dark-color: ${onSurf} !important;`,
        `  --action-items-action-card-title-color: ${onSurf} !important;`,
        `  --action-items-action-card-title-color-dark: ${onSurf} !important;`,
        `  --action-items-action-card-body-color: ${onSurfVar} !important;`,
        `  --action-items-action-card-body-color-dark: ${onSurfVar} !important;`,
        `  --action-items-action-pill-label-color: ${onSurf} !important;`,
        `  --action-items-action-pill-label-color-dark: ${onSurf} !important;`,
        `  --action-items-action-pill-sub-label-color: ${onSurfVar} !important;`,
        `  --action-items-action-pill-sub-label-color-dark: ${onSurfVar} !important;`,
        `  --action-items-add-account-icon-background-color: ${pillBg} !important;`,
        `  --action-items-add-account-icon-dark-background-color: ${pillBg} !important;`,
        `  --action-items-add-account-icon-color: ${pillText} !important;`,
        `  --action-items-add-account-icon-dark-color: ${pillText} !important;`,
        `  --action-items-expandable-action-toggle-icon-background-color: ${outerCardBg} !important;`,
        `  --action-items-expandable-action-toggle-icon-dark-background-color: ${outerCardBg} !important;`,
        `  --action-items-expandable-action-toggle-icon-color: ${onSurfVar} !important;`,
        `  --action-items-expandable-action-toggle-icon-dark-color: ${onSurfVar} !important;`,
        `}`,
        `html, body, .SSPGKf, .MCcOAc, .T4LgNb, .UFjXSc { background: transparent !important; background-color: transparent !important; border: none !important; box-shadow: none !important; }`,
        `.Lvwayc, .aRDKUe .Lvwayc, .J5OKee .Lvwayc, .EHzcec, .nz9sqb.EHzcec { background: ${cardContainerBg} !important; background-color: ${cardContainerBg} !important; color: ${onSurf} !important; border-radius: 28px !important; border: 1px solid ${borderCol} !important; box-sizing: border-box !important; }`,
        `.bMnvr, .aRDKUe .bMnvr, .J5OKee .bMnvr { background-color: ${outerCardBg} !important; color: ${onSurf} !important; }`,
        `.LVal7b, .nz9sqb.EHzcec .LVal7b, .kibP6b, .lHtSbd, .nz9sqb .kibP6b, .nz9sqb .lHtSbd, .Agku8b, .aRDKUe .Agku8b, .J5OKee .Agku8b, .HEN9Lb { background: ${innerBg} !important; background-color: ${innerBg} !important; color: ${onSurf} !important; }`,
        `.Agku8b.w5k6Yd:hover, .aRDKUe .Agku8b.w5k6Yd:hover, .J5OKee .Agku8b.w5k6Yd:hover, .vEJJte.iz5qmd.Agku8b:focus-visible, .aRDKUe .vEJJte.iz5qmd.Agku8b:focus-visible, .J5OKee .vEJJte.iz5qmd.Agku8b:focus-visible { background-color: ${hoverBg} !important; }`,
        `a.JP6mTe, .JP6mTe, .zH8ZJ { background: transparent !important; background-color: transparent !important; border: none !important; box-shadow: none !important; }`,
        `.zH8ZJ:has(> img.R1BIob), .zH8ZJ:has(> img[src*="/gb/images/ring/"]) { overflow: visible !important; }`,
        `img.R1BIob, img[src*="/gb/images/ring/"] { opacity: 0 !important; visibility: hidden !important; }`,
        `.zH8ZJ:has(> img.R1BIob)::before, .zH8ZJ:has(> img[src*="/gb/images/ring/"])::before { content: "" !important; position: absolute !important; inset: -4px !important; border-radius: 50% !important; border: 2.5px solid ${accentRing} !important; box-sizing: border-box !important; pointer-events: none !important; z-index: 0 !important; }`,
        `.Rq5Gcb, .nz9sqb .Rq5Gcb, .p37w9e, .nz9sqb .p37w9e, .Cop04b, .Dz0Ydc, .fL9B0b, .N3tlYd { color: ${onSurf} !important; }`,
        `.OdHJXd, .MnI9ke, .aRDKUe .MnI9ke, .J5OKee .MnI9ke, .DM2Ltc, .aRDKUe .DM2Ltc, .CkSNRd, .aRDKUe .CkSNRd, .Z6NXed, .aRDKUe .Z6NXed, .J5OKee .Z6NXed { color: ${onSurfVar} !important; }`,
        `.DM2Ltc:has(> .N6gx9b) { display: flex !important; align-items: center !important; justify-content: center !important; }`,
        `.N6gx9b, .aRDKUe .N6gx9b, .J5OKee .N6gx9b { background: ${pillBg} !important; background-color: ${pillBg} !important; color: ${pillText} !important; fill: ${pillText} !important; display: block !important; box-sizing: border-box !important; width: 24px !important; height: 24px !important; padding: 3px !important; margin: 0 !important; border-radius: 50% !important; }`,
        `.N6gx9b path, .aRDKUe .N6gx9b path, .J5OKee .N6gx9b path { fill: currentColor !important; }`,
        `.Pzuhxc.CkSNRd { display: inline-flex !important; align-items: center !important; justify-content: center !important; }`,
        `c-wiz.SSPGKf .kykVM, c-wiz.aRDKUe .kykVM, c-wiz.J5OKee .kykVM, .aRDKUe .kykVM, .J5OKee .kykVM, .YLkvaf .kykVM, .kykVM { background: ${pillBg} !important; background-color: ${pillBg} !important; background-image: none !important; border: 1px solid ${borderCol} !important; box-shadow: none !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; }`,
        `c-wiz.SSPGKf .kykVM::before, c-wiz.SSPGKf .kykVM::after, .kykVM::before, .kykVM::after { display: none !important; content: none !important; background: none !important; }`,
        `c-wiz.SSPGKf .kykVM > img, c-wiz.aRDKUe .kykVM .oU5yj, c-wiz.J5OKee .kykVM .oU5yj, .aRDKUe .kykVM .oU5yj, .J5OKee .kykVM .oU5yj, .kykVM .oU5yj, .kykVM > img, img.oU5yj, img[src*="tier_wave"] { display: none !important; opacity: 0 !important; visibility: hidden !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; pointer-events: none !important; }`,
        `c-wiz.SSPGKf .kykVM .YzbLde, .aRDKUe .kykVM .YzbLde, .J5OKee .kykVM .YzbLde, .kykVM .YzbLde { color: ${pillText} !important; position: relative !important; z-index: 1 !important; }`,
        `.NQV3m, .nz9sqb .NQV3m, a.Agku8b[href*="myaccount.google.com"], .aRDKUe a.Agku8b[href*="myaccount.google.com"], .J5OKee a.Agku8b[href*="myaccount.google.com"] { background-color: ${outerCardBg} !important; border: 1px solid ${p.outline || '#82737C'} !important; color: ${onSurf} !important; border-radius: 100px !important; }`,
        `.NQV3m:hover, .nz9sqb .NQV3m:hover, a.Agku8b[href*="myaccount.google.com"]:hover, .tX9u1b:hover, .nz9sqb .tX9u1b:hover, .kibP6b:hover, .lHtSbd:hover { background-color: ${hoverBg} !important; }`,
        `.NPEKs, .nz9sqb .NPEKs, .bOwcqf, .nz9sqb .bOwcqf, .aRDKUe .Gbp3ze .O52YZb, .J5OKee .Gbp3ze .O52YZb { background: ${pillBg} !important; background-color: ${pillBg} !important; color: ${pillText} !important; }`,
        `.dGrefb, .nz9sqb .dGrefb { border-color: ${borderCol} !important; }`
      );
    } else {
      const baseList = [
        "mat-sidenav", ".mat-drawer", "bard-sidenav", "bard-sidenav-container", "side-navigation-v2", "side-navigation-content",
        "input-area-v2", ".user-query-bubble-with-background", "code-block",
        ".cdk-overlay-container", "mat-bottom-sheet-container", "gem-bottom-sheet",
        ".popover-menu", "gem-menu", "mat-menu-panel", ".mat-mdc-menu-panel",
        "mat-tooltip-component", ".mat-mdc-tooltip", ".mat-mdc-tooltip-panel",
        ".mat-mdc-tooltip-surface", ".gem-tooltip", ".mdc-tooltip",
        "mat-dialog-container", ".mat-mdc-dialog-container", ".mat-mdc-dialog-surface",
        "declared-route-island-page", ".route-island-host", "[data-root-style]",
        "[data-root-style].xmtc9b4.xmtc9b4", "[data-root-style].x11bkym0.x11bkym0",
        "[data-root-style].x1wv52q2", ".xmtc9b4.xmtc9b4", ".x11bkym0.x11bkym0",
        ".x1wv52q2", "[role=\"dialog\"]"
      ];
      const baseElements = baseList.join(", ");
      const scopedElements = (prefix) => baseList.map((s) => `${prefix} ${s}`).join(", ");
      const darkScopes = ":root, html, body, [data-theme], .theme-dark, [data-theme=\"dark\"], .dark-theme, :where(.dark-theme)";
      const lightScopes = ":root, html, body, [data-theme], .theme-light, .light-theme, :where(.light-theme), .theme-host";

      if (themeMode === "light") {
        emitRules(`${lightScopes}, ${darkScopes}, ${baseElements}`, light, false);
      } else if (themeMode === "dark") {
        emitRules(`${darkScopes}, ${lightScopes}, ${baseElements}, ${scopedElements(".dark-theme")}`, dark, true);
      } else {
        // Light rules
        emitRules(`:root, html, body, [data-theme], .theme-light, .light-theme, .theme-host, ${baseElements}`, light, false);

        // Dark rules
        emitRules(`:root.dark-theme, html.dark-theme, body.dark-theme, .theme-dark, [data-theme=\"dark\"], .dark-theme, :where(.dark-theme), ${scopedElements(".dark-theme")}`, dark, true);

        // Media prefers-color-scheme fallback
        lines.push("@media (prefers-color-scheme: dark) {");
        emitRules(`:root:not(.light-theme), html:not(.light-theme), body:not(.light-theme), ${scopedElements(":where(:root:not(.light-theme))")}`, dark, true);
        lines.push("}");
      }
    }

    // Direct tone variables
    if (palette) {
      lines.push(":root {");
      for (const k in palette) {
        if (k.startsWith("a1_") || k.startsWith("a2_") || k.startsWith("a3_") || k.startsWith("n1_") || k.startsWith("n2_")) {
          const varName = "--monet-" + k.replace("_", "-");
          lines.push(`  ${varName}: ${palette[k]} !important;`);
        }
      }
      lines.push("}");
    }

    return lines.join("\n");
  }

  function clearPalette() {
    try {
      document.adoptedStyleSheets = (document.adoptedStyleSheets || []).filter(s => s._geminiMonet !== true);
    } catch (e) {}
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  function applyRuntimeFlags(enabled, editModeStyle) {
    if (typeof enabled === "boolean") {
      isPluginEnabled = enabled;
      if (isPluginEnabled) {
        delete document.documentElement.dataset.monetDisabled;
      } else {
        document.documentElement.dataset.monetDisabled = "1";
        clearPalette();
      }
      try {
        if (typeof localStorage !== "undefined") {
          if (isPluginEnabled) localStorage.removeItem(LS_DISABLED_KEY);
          else localStorage.setItem(LS_DISABLED_KEY, "1");
        }
      } catch (e) {}
    }

    if (editModeStyle === "legacy" || editModeStyle === "canon") {
      currentEditModeStyle = editModeStyle;
      if (editModeStyle === "legacy") {
        document.documentElement.dataset.monetEditMode = "legacy";
      } else {
        delete document.documentElement.dataset.monetEditMode;
      }
      try {
        if (typeof localStorage !== "undefined") {
          if (editModeStyle === "legacy") localStorage.setItem(LS_EDIT_MODE_KEY, "legacy");
          else localStorage.removeItem(LS_EDIT_MODE_KEY);
        }
      } catch (e) {}
    }
  }

  function applyPalette(palette, themeMode) {
    if (!palette || !isPluginEnabled) return;
    lastApplied = palette;
    if (themeMode) lastThemeMode = themeMode;
    const mode = themeMode || lastThemeMode || "dark";
    const css = buildCss(palette, mode);

    if (mode === "light") {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.add("light-theme");
      document.documentElement.setAttribute("data-theme", "light");
    } else if (mode === "dark") {
      document.documentElement.classList.remove("light-theme");
      document.documentElement.classList.add("dark-theme");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    // adoptedStyleSheets primary mechanism
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      const sheets = (document.adoptedStyleSheets || []).filter(s => s._geminiMonet !== true);
      sheet._geminiMonet = true;
      document.adoptedStyleSheets = [sheet, ...sheets];
    } catch (e) {}

    // Fallback <style> element
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = css;

    // Cache locally
    try {
      browser.storage.local.set({ activePalette: palette, themeMode: mode });
    } catch (e) {}

    enhanceRuntimeOverlays();
  }

  // Instant apply from cache
  (async () => {
    try {
      const res = await browser.storage.local.get(["activePalette", "lastPalette", "themeMode", "pluginEnabled", "editModeStyle"]);
      applyRuntimeFlags(res.pluginEnabled !== false, res.editModeStyle || "canon");
      const pal = res.activePalette || res.lastPalette;
      if (pal && isPluginEnabled) applyPalette(pal, res.themeMode || "dark");
    } catch (e) {}
  })();

  // Listen for broadcasts from popup or background
  browser.runtime.onMessage.addListener((msg) => {
    if (!msg) return;
    if (msg.type === "PALETTE") {
      if (isPluginEnabled) applyPalette(msg.palette, msg.themeMode);
    } else if (msg.type === "SET_ENABLED") {
      applyRuntimeFlags(Boolean(msg.enabled), null);
      if (isPluginEnabled && lastApplied) applyPalette(lastApplied, lastThemeMode);
    } else if (msg.type === "SET_EDIT_MODE") {
      applyRuntimeFlags(null, msg.editModeStyle || "canon");
    }
  });

  // Pull latest palette
  try {
    browser.runtime.sendMessage({ type: "GET_PALETTE" }, (resp) => {
      if (!resp) return;
      applyRuntimeFlags(resp.pluginEnabled !== false, resp.editModeStyle || "canon");
      if (resp.palette && isPluginEnabled) applyPalette(resp.palette, resp.themeMode);
    });
  } catch (e) {}

  // Keep stylesheet in <head>
  const observer = new MutationObserver(() => {
    if (isPluginEnabled && !document.getElementById(STYLE_ID) && lastApplied) {
      applyPalette(lastApplied, lastThemeMode);
    }
  });
  const targetHead = document.head || document.documentElement;
  if (targetHead) {
    observer.observe(targetHead, { childList: true });
  }

  // Track last hovered/focused bottom model switcher so its tooltip can be flipped above the button
  let lastModeBtn = null;
  let lastModeHoverTs = 0;
  if (!isOgs) {
    const recordModeBtn = (ev) => {
      const btn = ev.target && ev.target.closest && ev.target.closest('input-area-v2 [data-test-id="bard-mode-menu-button"], input-area-v2 bard-mode-switcher button');
      if (btn) {
        lastModeBtn = btn;
        lastModeHoverTs = Date.now();
      }
    };
    document.addEventListener("pointerenter", recordModeBtn, true);
    document.addEventListener("focusin", recordModeBtn, true);
  }

  function positionModeTooltipAbove() {
    if (isOgs || !isPluginEnabled) return;
    const panes = document.querySelectorAll(".cdk-overlay-pane.mat-mdc-tooltip-panel-below");
    if (!panes.length) return;
    const modeBtns = document.querySelectorAll('input-area-v2 [data-test-id="bard-mode-menu-button"], input-area-v2 bard-mode-switcher button');
    let activeBtn = null;
    for (const b of modeBtns) {
      if (b.matches(":hover, :focus-visible") || b === document.activeElement) {
        activeBtn = b;
        break;
      }
    }
    if (!activeBtn && lastModeBtn && document.contains(lastModeBtn) && Date.now() - lastModeHoverTs < 2000) {
      activeBtn = lastModeBtn;
    }
    if (!activeBtn) return;

    const btnRect = activeBtn.getBoundingClientRect();
    if (btnRect.width <= 0 || btnRect.height <= 0) return;
    const descId = activeBtn.getAttribute("aria-describedby");
    const descNode = descId ? document.getElementById(descId) : null;
    const expectedText = descNode ? descNode.textContent.trim() : "";

    for (const pane of panes) {
      if (pane.dataset.monetTooltipAbove === "1") continue;
      const paneRect = pane.getBoundingClientRect();
      if (paneRect.width <= 0) continue;
      const ttText = (pane.textContent || "").trim();
      const textMatches = Boolean(expectedText && ttText && ttText === expectedText);
      const paneCenterX = paneRect.left + paneRect.width / 2;
      const nearHoriz = paneCenterX >= btnRect.left - 60 && paneCenterX <= btnRect.right + 60;
      const nearBelow = paneRect.top >= btnRect.top && paneRect.top <= btnRect.bottom + 28;
      if (textMatches || (nearHoriz && nearBelow)) {
        pane.dataset.monetTooltipAbove = "1";
        pane.style.setProperty("--monet-tt-btn-h", `${Math.round(btnRect.height)}px`);
      }
    }
  }

  // Dynamic runtime enhancer for real Angular Material tooltips (.mat-mdc-tooltip-surface)
  function enhanceRuntimeOverlays() {
    if (!isPluginEnabled) return;
    const isLight = (lastThemeMode || "dark") === "light";
    const palBranch = isLight ? (lastApplied && lastApplied.light) : (lastApplied && lastApplied.dark);
    const bg = (palBranch && (palBranch.surfaceContainerHighest || palBranch.surfaceContainerHigh)) || (isLight ? "#F0DEE6" : "#383136");
    const text = (palBranch && palBranch.onSurface) || (isLight ? "#22191E" : "#EDE0E4");
    const border = (palBranch && palBranch.outlineVariant) || (isLight ? "#D5C2CC" : "#50434A");
    const sig = `${lastThemeMode}:${bg}:${text}`;

    const tooltips = document.querySelectorAll(".mat-mdc-tooltip-surface, .gem-tooltip .mat-mdc-tooltip-surface, .mdc-tooltip__surface");
    for (const t of tooltips) {
      if (t.dataset && t.dataset.monetTooltip === sig) continue;
      if (t.dataset) t.dataset.monetTooltip = sig;
      t.style.setProperty("background-color", bg, "important");
      t.style.setProperty("color", text, "important");
      t.style.setProperty("border-color", border, "important");
      const children = t.querySelectorAll("*");
      for (const ch of children) {
        ch.style.setProperty("color", text, "important");
      }
    }
    positionModeTooltipAbove();
  }

  const overlayObserver = new MutationObserver((mutations) => {
    if (!isPluginEnabled) return;
    enhanceRuntimeOverlays();
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1 && (n.classList.contains("cdk-overlay-pane") || (n.closest && n.closest(".cdk-overlay-pane.mat-mdc-tooltip-panel")))) {
          requestAnimationFrame(positionModeTooltipAbove);
          return;
        }
      }
    }
  });
  if (document.body) {
    overlayObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.body) overlayObserver.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
