import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getMigrationMapViolations,
  parseBarrelExportPaths,
  parseMigrationMap,
  runGuardrails,
} from "./ura-guardrails.mjs";

function buildMigrationMap(rows) {
  return [
    "# Migration Map",
    "",
    "| Legacy slug | Label | Disposition | Destination | Public export | Current status | Owner | PR | Notes |",
    "|---|---|---|---|---|---|---|---|---|",
    ...rows,
  ].join("\n");
}

describe("parseBarrelExportPaths", () => {
  it("collects public export destinations from barrel files", () => {
    const exportPaths = parseBarrelExportPaths(
      'export * from "./Button";\nexport { Select } from "./Select";\n',
      "src/primitives",
    );

    expect([...exportPaths]).toEqual(["src/primitives/Button", "src/primitives/Select"]);
  });
});

describe("getMigrationMapViolations", () => {
  it("fails when the migration map table cannot be parsed", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "atlas-ui-guardrails-"));
    mkdirSync(join(repoRoot, "docs"), { recursive: true });
    writeFileSync(join(repoRoot, "docs/migration-map.md"), "# Migration Map\n\nNo table here.\n");

    try {
      expect(runGuardrails(repoRoot)).toEqual([
        expect.stringContaining("docs/migration-map.md: migration map table is missing or could not be parsed"),
      ]);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("flags incomplete migration rows", () => {
    const rows = parseMigrationMap(
      buildMigrationMap([
        "| orphaned-row | Orphaned row | REBUILD | `src/primitives/Orphaned` | yes | BUILT |  | main | Missing owner. |",
      ]),
    );

    const violations = getMigrationMapViolations(rows);

    expect(violations).toEqual([
      expect.objectContaining({
        lineNumber: 5,
        message: 'migration row "orphaned-row" is incomplete; missing Owner',
      }),
    ]);
  });

  it("flags example-only rows marked as public exports", () => {
    const rows = parseMigrationMap(
      buildMigrationMap([
        "| dashboards | Dashboards | EXAMPLE_ONLY | `examples/dashboards/` | yes | EXAMPLE_ONLY_DONE | Squad D | main | Page example only. |",
      ]),
    );

    const violations = getMigrationMapViolations(rows);

    expect(violations).toEqual([
      expect.objectContaining({
        lineNumber: 5,
        message: 'migration row "dashboards" cannot mark EXAMPLE_ONLY work as a public export',
      }),
    ]);
  });

  it("flags reference-only rows that point at exported paths", () => {
    const rows = parseMigrationMap(
      buildMigrationMap([
        "| qr-codes | QR code reference | REFERENCE_ONLY | `src/patterns/QRCodeReference` | no | REFERENCE_ONLY_DONE | Squad D | main | Should stay unexported. |",
      ]),
    );

    const violations = getMigrationMapViolations(rows, new Set(["src/patterns/QRCodeReference"]));

    expect(violations).toEqual([
      expect.objectContaining({
        lineNumber: 5,
        message:
          'migration row "qr-codes" points REFERENCE_ONLY work at exported path "src/patterns/QRCodeReference"',
      }),
    ]);
  });

  it("flags merged rows without destinations", () => {
    const rows = parseMigrationMap(
      buildMigrationMap([
        "| file-lists | FileListView | MERGED |  | no | MERGED | Squad D | main | Covered elsewhere. |",
      ]),
    );

    const violations = getMigrationMapViolations(rows);

    expect(violations).toEqual([
      expect.objectContaining({
        lineNumber: 5,
        message: 'migration row "file-lists" must declare a merge destination',
      }),
    ]);
  });

  it("accepts valid migration rows", () => {
    const rows = parseMigrationMap(
      buildMigrationMap([
        "| buttons | Buttons | REBUILD | `src/primitives/Button` | yes | BUILT | Squad A | main | Canonical button primitive. |",
        "| dashboards | Dashboards | EXAMPLE_ONLY | `examples/dashboards/` | no | EXAMPLE_ONLY_DONE | Squad D | main | Page example only. |",
        "| file-lists | FileListView | MERGED | `src/patterns/ListView` | no | MERGED | Squad D | main | Covered by ListView. |",
      ]),
    );

    expect(getMigrationMapViolations(rows, new Set(["src/primitives/Button", "src/patterns/ListView"]))).toEqual([]);
  });
});
