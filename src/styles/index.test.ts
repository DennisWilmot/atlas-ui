/// <reference types="node" />

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const stylesDir = dirname(fileURLToPath(import.meta.url));
const stylesSource = readFileSync(resolve(stylesDir, "index.css"), "utf8");
const tokensSource = readFileSync(resolve(stylesDir, "tokens.css"), "utf8");

describe("Atlas shared style contract", () => {
  it("defines shared interaction tokens for primitive state styling", () => {
    expect(tokensSource).toContain("--atlas-opacity-disabled: 0.58;");
    expect(tokensSource).toContain("--atlas-opacity-data-viz-fill: 0.82;");
    expect(tokensSource).toContain("--atlas-focus-outline: 2px solid var(--atlas-color-primary);");
    expect(tokensSource).toContain("--atlas-focus-ring-shadow: 0 0 0 3px var(--atlas-focus-ring-color);");
    expect(tokensSource).toContain("--atlas-shadow-floating: 0 0.75rem 2rem rgb(16 42 67 / 12%);");
  });

  it("routes shared interactive focus treatments through the focus tokens", () => {
    expect(stylesSource).toContain(".atlas-button:focus-visible");
    expect(stylesSource).toContain(".atlas-field__control:focus-visible");
    expect(stylesSource).toContain(".atlas-checkbox__input:focus-visible");
    expect(stylesSource).toContain(".atlas-radio__input:focus-visible");
    expect(stylesSource).toContain(".atlas-slider__input--single:focus-visible");
    expect(stylesSource).toContain(".atlas-command-surface__item:focus-visible");
    expect(stylesSource).toContain(".atlas-sidebar-navigation__link:focus-visible");
    expect(stylesSource).toContain("outline: var(--atlas-focus-outline);");
    expect(stylesSource).toContain("outline-offset: var(--atlas-focus-outline-offset);");
    expect(stylesSource).toContain("box-shadow: var(--atlas-focus-ring-shadow);");
  });

  it("uses semantic tokens for primitive surface tints, solid text, and elevation", () => {
    expect(stylesSource).toContain("color: var(--atlas-color-on-solid);");
    expect(stylesSource).toContain("background: var(--atlas-color-primary-soft);");
    expect(stylesSource).toContain("background: var(--atlas-color-info-subtle);");
    expect(stylesSource).toContain("border-color: var(--atlas-color-danger-border-subtle);");
    expect(stylesSource).toContain("box-shadow: var(--atlas-shadow-overlay);");
    expect(stylesSource).toContain("opacity: var(--atlas-opacity-data-viz-fill);");
  });

  it("reuses the shared disabled opacity token across primitive affordances", () => {
    const disabledOpacityUses = stylesSource.match(/opacity: var\(--atlas-opacity-disabled\);/g) ?? [];

    expect(disabledOpacityUses.length).toBeGreaterThanOrEqual(18);
  });
});
