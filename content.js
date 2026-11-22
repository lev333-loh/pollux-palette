/* Gemini Monet Standalone Content Script (document_start, gemini.google.com). */
(function () {
  "use strict";

  const STYLE_ID = "gemini-monet-style";

  const THEME_MAP = {
    "surface": [
      "--gem-sys-color--surface",
      "--bard-color-synthetic--chat-window-surface",
      "--bard-color-remy-surface",
      "--lumi-sys-color--surface",
      "--lumi-sys-color--surface-background",
      "--mat-sys-surface",
      "--mat-sys-background"
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
      "--gem-sys-color--surface-container-lowest"
    ],
    "surfaceContainerLow": [
      "--gem-sys-color--surface-container-low"
    ],
    "surfaceContainer": [
      "--gem-sys-color--surface-container",
      "--bard-color-synthetic--chat-window-surface-container",
      "--bard-color-sidenav-background-mobile",
      "--bard-color-mode-switcher-container",
      "--mat-sidenav-container-background-color",
      "--mat-sidenav-content-background-color",
      "--lumi-sys-color--surface-accent"
    ],
    "surfaceContainerHigh": [
      "--gem-sys-color--surface-container-high",
      "--bard-color-synthetic--chat-window-surface-container-high",
      "--bard-color-sidenav-background-desktop",
      "--lumi-sys-color--code-background"
    ],
    "surfaceContainerHighest": [
      "--gem-sys-color--surface-container-highest",
      "--bard-color-synthetic--chat-window-surface-container-highest"
    ],
    "onSurface": [
      "--gem-sys-color--on-surface",
      "--lumi-sys-color--on-surface",
      "--mat-sidenav-container-text-color",
      "--mat-sidenav-content-text-color",
      "--lumi-sys-color--code-primary-text"
    ],
    "onSurfaceVariant": [
      "--gem-sys-color--on-surface-variant",
      "--lumi-sys-color--on-surface-variant",
      "--lumi-sys-color--on-surface-low",
      "--bard-color-sidenav-tile-text-aurora",
      "--bard-color-sidenav-mobile-controls"
    ],
    "primary": [
      "--gem-sys-color--primary",
      "--lumi-sys-color-acc-color--accent-fixed"
    ],
    "onPrimary": [
      "--gem-sys-color--on-primary"
    ],
    "primaryContainer": [
      "--gem-sys-color--primary-container",
      "--bard-color-custom-primary-container",
      "--lumi-sys-color-acc-color--accent-container",
      "--lumi-sys-color-acc-color--accent",
      "--bard-color-sidenav-tile-background-aurora",
      "--mat-list-active-indicator-color"
    ],
    "onPrimaryContainer": [
      "--gem-sys-color--on-primary-container",
      "--bard-color-on-tonal-container"
    ],
    "secondary": [
      "--gem-sys-color--secondary"
    ],
    "onSecondary": [
      "--gem-sys-color--on-secondary"
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
      "--gem-sys-color--outline"
    ],
    "outlineVariant": [
      "--gem-sys-color--outline-variant"
    ],
    "error": [
      "--gem-sys-color--error",
      "--lumi-sys-color--error"
    ],
    "onError": [
      "--gem-sys-color--on-error"
    ],
    "errorContainer": [
      "--gem-sys-color--error-container",
      "--lumi-sys-color--error-container"
    ],
    "onErrorContainer": [
      "--gem-sys-color--on-error-container",
      "--lumi-sys-color--on-error-container"
    ]
  };

  let lastApplied = null;

  function buildCss(palette) {
    const map = THEME_MAP;
    const lines = [];

    const light = (palette && palette.light) || palette || {};
    const dark = (palette && palette.dark) || palette || {};

    function emitRules(selector, p, isDark) {
      lines.push(`${selector} {`);
      for (const role in map) {
        const varNames = Array.isArray(map[role]) ? map[role] : [map[role]];
        for (const varName of varNames) {
          if (p && p[role] && varName) {
            lines.push(`  ${varName}: ${p[role]} !important;`);
          }
        }
      }
      if (isDark) {
        lines.push(`  --monet-surface: ${p.surface || '#1A1618'} !important;`);
        lines.push(`  --monet-surface-container: ${p.surfaceContainer || '#241F22'} !important;`);
        lines.push(`  --monet-input-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-input-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-user-bubble-bg: ${p.secondaryContainer || '#57404E'} !important;`);
        lines.push(`  --monet-user-bubble-text: ${p.onSecondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-code-bg: ${p.surfaceContainer || '#231E21'} !important;`);
        lines.push(`  --monet-code-header-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-code-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-code-border: ${p.outlineVariant || '#50434A'} !important;`);
        lines.push(`  --monet-sidebar-bg: ${p.surface || '#161214'} !important;`);
        lines.push(`  --monet-sidebar-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-sidebar-icon: ${p.primary || '#FCBCE2'} !important;`);
        lines.push(`  --monet-sidebar-selected-bg: ${p.primaryContainer || '#663757'} !important;`);
        lines.push(`  --monet-sidebar-selected-text: ${p.onPrimaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --sidenav-button-selected-background-color: ${p.primaryContainer || '#663757'} !important;`);
        lines.push(`  --sidenav-button-selected-text-color: ${p.onPrimaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --sidenav-button-hover-background-color: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-menu-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-menu-border: ${p.outlineVariant || '#50434A'} !important;`);
        lines.push(`  --monet-menu-text: ${p.onSurface || '#EAE0E4'} !important;`);
        lines.push(`  --monet-menu-subtext: ${p.onSurfaceVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-menu-selected-bg: ${p.primaryContainer || '#663757'} !important;`);
        lines.push(`  --monet-menu-selected-text: ${p.onPrimaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-menu-hover-bg: ${p.surfaceContainerHighest || '#383236'} !important;`);
        lines.push(`  --monet-chip-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
        lines.push(`  --monet-sheet-bg: ${p.surfaceContainerLow || '#1E191C'} !important;`);
        lines.push(`  --monet-sheet-item-bg: ${p.surfaceContainerHigh || '#2D282C'} !important;`);
      } else {
        lines.push(`  --monet-surface: ${p.surface || '#FFF8F9'} !important;`);
        lines.push(`  --monet-surface-container: ${p.surfaceContainer || '#F5E4EB'} !important;`);
        lines.push(`  --monet-input-bg: ${palette.a1_100 || p.surfaceContainerHigh || '#FFD8ED'} !important;`);
        lines.push(`  --monet-input-text: ${palette.a1_900 || p.onSurface || '#340B29'} !important;`);
        lines.push(`  --monet-user-bubble-bg: ${palette.a1_100 || p.secondaryContainer || '#FFD8ED'} !important;`);
        lines.push(`  --monet-user-bubble-text: ${palette.a1_900 || p.onSecondaryContainer || '#340B29'} !important;`);
        lines.push(`  --monet-code-bg: ${p.surfaceContainer || '#FAEAF0'} !important;`);
        lines.push(`  --monet-code-header-bg: ${p.surfaceContainerHighest || '#F0DEE6'} !important;`);
        lines.push(`  --monet-code-text: ${p.onSurface || '#22191E'} !important;`);
        lines.push(`  --monet-code-border: ${p.outlineVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-sidebar-bg: ${p.surface || '#FFF8F9'} !important;`);
        lines.push(`  --monet-sidebar-text: ${p.onSurface || '#3A2F35'} !important;`);
        lines.push(`  --monet-sidebar-icon: ${p.primary || '#653655'} !important;`);
        lines.push(`  --monet-sidebar-selected-bg: ${p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --monet-sidebar-selected-text: ${p.onPrimaryContainer || '#3A2F35'} !important;`);
        lines.push(`  --sidenav-button-selected-background-color: ${p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --sidenav-button-selected-text-color: ${p.onPrimaryContainer || '#3A2F35'} !important;`);
        lines.push(`  --sidenav-button-hover-background-color: ${p.surfaceDim || '#E7D5DD'} !important;`);
        lines.push(`  --monet-menu-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --monet-menu-border: ${p.outlineVariant || '#D5C2CC'} !important;`);
        lines.push(`  --monet-menu-text: ${p.onSurface || '#22191E'} !important;`);
        lines.push(`  --monet-menu-subtext: ${p.onSurfaceVariant || '#695B62'} !important;`);
        lines.push(`  --monet-menu-selected-bg: ${palette.a1_100 || p.primaryContainer || '#FCBCE2'} !important;`);
        lines.push(`  --monet-menu-selected-text: ${palette.a1_900 || p.onPrimaryContainer || '#340B29'} !important;`);
        lines.push(`  --monet-menu-hover-bg: ${p.surfaceDim || '#E7D5DD'} !important;`);
        lines.push(`  --monet-chip-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
        lines.push(`  --monet-sheet-bg: ${p.surfaceContainerLow || '#FFF0F5'} !important;`);
        lines.push(`  --monet-sheet-item-bg: ${p.surfaceContainerHigh || '#F5E4EB'} !important;`);
      }
      lines.push("}");
    }

    // Light rules
    emitRules(":root, html, body, [data-theme], .theme-light, .light-theme, .theme-host, mat-sidenav, .mat-drawer, side-navigation-v2, side-navigation-content, .cdk-overlay-container, mat-bottom-sheet-container, gem-bottom-sheet, .popover-menu, gem-menu", light, false);

    // Dark rules
    emitRules(":root.dark-theme, html.dark-theme, body.dark-theme, .theme-dark, [data-theme=\"dark\"], .dark-theme, :where(.dark-theme), .dark-theme mat-sidenav, .dark-theme .mat-drawer, .dark-theme side-navigation-v2, .dark-theme side-navigation-content, .dark-theme input-area-v2, .dark-theme .user-query-bubble-with-background, .dark-theme code-block, .dark-theme .cdk-overlay-container, .dark-theme mat-bottom-sheet-container, .dark-theme gem-bottom-sheet, .dark-theme .popover-menu, .dark-theme gem-menu", dark, true);

    // Media prefers-color-scheme fallback
    lines.push("@media (prefers-color-scheme: dark) {");
    emitRules(":root:not(.light-theme), html:not(.light-theme), body:not(.light-theme), :where(:root:not(.light-theme)) mat-sidenav, :where(:root:not(.light-theme)) .mat-drawer, :where(:root:not(.light-theme)) input-area-v2, :where(:root:not(.light-theme)) .user-query-bubble-with-background, :where(:root:not(.light-theme)) code-block, :where(:root:not(.light-theme)) .cdk-overlay-container, :where(:root:not(.light-theme)) mat-bottom-sheet-container, :where(:root:not(.light-theme)) gem-bottom-sheet, :where(:root:not(.light-theme)) .popover-menu, :where(:root:not(.light-theme)) gem-menu", dark, true);
    lines.push("}");

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

  function applyPalette(palette) {
    if (!palette) return;
    lastApplied = palette;
    const css = buildCss(palette);

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
    try { browser.storage.local.set({ activePalette: palette }); } catch (e) {}
  }

  // Instant apply from cache
  (async () => {
    try {
      const res = await browser.storage.local.get(["activePalette", "lastPalette"]);
      const pal = res.activePalette || res.lastPalette;
      if (pal) applyPalette(pal);
    } catch (e) {}
  })();

  // Listen for palette broadcasts from popup or background
  browser.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "PALETTE") {
      applyPalette(msg.palette);
    }
  });

  // Pull latest palette
  try {
    browser.runtime.sendMessage({ type: "GET_PALETTE" }, (resp) => {
      if (resp && resp.palette) applyPalette(resp.palette);
    });
  } catch (e) {}

  // Keep stylesheet in <head>
  const observer = new MutationObserver(() => {
    if (!document.getElementById(STYLE_ID) && lastApplied) {
      applyPalette(lastApplied);
    }
  });
  const targetHead = document.head || document.documentElement;
  if (targetHead) {
    observer.observe(targetHead, { childList: true });
  }
})();
