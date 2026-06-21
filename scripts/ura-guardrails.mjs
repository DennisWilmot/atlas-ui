import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const publicRoots = ["src/primitives", "src/patterns"];
const migrationMapColumns = [
  { key: "legacySlug", label: "Legacy slug" },
  { key: "label", label: "Label" },
  { key: "disposition", label: "Disposition" },
  { key: "destination", label: "Destination" },
  { key: "publicExport", label: "Public export" },
  { key: "currentStatus", label: "Current status" },
  { key: "owner", label: "Owner" },
  { key: "pullRequest", label: "PR" },
  { key: "notes", label: "Notes" },
];
const migrationDispositionValues = new Set(["REBUILD", "REFACTOR", "REFERENCE_ONLY", "EXAMPLE_ONLY", "MERGED"]);
const migrationStatusValues = new Set([
  "NOT_STARTED",
  "IN_PROGRESS",
  "BUILT",
  "EXAMPLE_ONLY_DONE",
  "REFERENCE_ONLY_DONE",
  "MERGED",
  "BLOCKED",
]);

function read(file) {
  return readFileSync(file, "utf8");
}

function walk(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) return walk(path);
    return [path];
  });
}

function stripCodeTicks(value) {
  return value.replace(/^`+|`+$/g, "").trim();
}

function normalizePathValue(value) {
  return stripCodeTicks(value).replace(/\/+$/, "");
}

function toDisplayPath(repoRoot, path) {
  return relative(repoRoot, path).split(sep).join("/");
}

function formatViolation(repoRoot, file, message, lineNumber) {
  const displayPath = toDisplayPath(repoRoot, file);
  if (lineNumber != null) {
    return `${displayPath}:${lineNumber}: ${message}`;
  }

  return `${displayPath}: ${message}`;
}

function addViolation(violations, repoRoot, file, message, lineNumber) {
  violations.push(formatViolation(repoRoot, file, message, lineNumber));
}

export function parseBarrelExportPaths(source, rootPath) {
  const exportPaths = new Set();
  const exportPattern = /export\s+(?:\*|{[^}]+})\s+from\s+["']\.\/([^"']+)["']/g;

  for (const match of source.matchAll(exportPattern)) {
    exportPaths.add(`${rootPath}/${match[1]}`.replace(/\/+$/, ""));
  }

  return exportPaths;
}

export function collectPublicExportPaths(repoRoot) {
  const barrelFiles = [
    { file: join(repoRoot, "src/primitives/index.ts"), rootPath: "src/primitives" },
    { file: join(repoRoot, "src/patterns/index.ts"), rootPath: "src/patterns" },
  ];
  const exportPaths = new Set();

  for (const { file, rootPath } of barrelFiles) {
    if (!existsSync(file)) continue;

    for (const exportPath of parseBarrelExportPaths(read(file), rootPath)) {
      exportPaths.add(exportPath);
    }
  }

  return exportPaths;
}

export function parseMigrationMap(source) {
  const lines = source.split(/\r?\n/);
  const headerLine = `| ${migrationMapColumns.map((column) => column.label).join(" | ")} |`;
  const headerIndex = lines.findIndex((line) => line.trim() === headerLine);

  if (headerIndex === -1) return [];

  const rows = [];

  for (let lineIndex = headerIndex + 2; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex].trim();
    if (!line.startsWith("|")) break;

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    const row = { lineNumber: lineIndex + 1 };

    migrationMapColumns.forEach((column, columnIndex) => {
      row[column.key] = cells[columnIndex] ?? "";
    });

    rows.push(row);
  }

  return rows;
}

export function getMigrationMapViolations(rows, publicExportPaths = new Set()) {
  const violations = [];

  for (const row of rows) {
    const slug = row.legacySlug || row.label || `line ${row.lineNumber}`;
    const disposition = stripCodeTicks(row.disposition);
    const destination = normalizePathValue(row.destination);
    const publicExport = stripCodeTicks(row.publicExport).toLowerCase();
    const currentStatus = stripCodeTicks(row.currentStatus);
    const requiredMissingFields = migrationMapColumns
      .filter(({ key }) => key !== "destination" || disposition !== "MERGED")
      .filter(({ key }) => stripCodeTicks(row[key] ?? "") === "")
      .map(({ label }) => label);

    if (requiredMissingFields.length > 0) {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" is incomplete; missing ${requiredMissingFields.join(", ")}`,
      });
    }

    if (disposition && !migrationDispositionValues.has(disposition)) {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" has unsupported disposition "${disposition}"`,
      });
    }

    if (currentStatus && !migrationStatusValues.has(currentStatus)) {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" has unsupported status "${currentStatus}"`,
      });
    }

    if (disposition === "MERGED" && !destination) {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" must declare a merge destination`,
      });
    }

    if ((disposition === "EXAMPLE_ONLY" || disposition === "REFERENCE_ONLY") && publicExport === "yes") {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" cannot mark ${disposition} work as a public export`,
      });
    }

    if (
      (disposition === "EXAMPLE_ONLY" || disposition === "REFERENCE_ONLY") &&
      destination &&
      publicExportPaths.has(destination)
    ) {
      violations.push({
        lineNumber: row.lineNumber,
        message: `migration row "${slug}" points ${disposition} work at exported path "${destination}"`,
      });
    }
  }

  return violations;
}

export function runGuardrails(repoRoot = process.cwd()) {
  const violations = [];
  const publicFiles = publicRoots.flatMap((root) => walk(join(repoRoot, root)));
  const tsPublicFiles = publicFiles.filter((file) => /\.(ts|tsx)$/.test(file));

  for (const file of tsPublicFiles) {
    const source = read(file);
    const isComponentSource = !file.endsWith(".stories.tsx") && !file.endsWith(".test.tsx") && !file.endsWith("index.ts");

    if (/from\s+["'][^"']*examples|import\s*\([^)]*["'][^"']*examples/.test(source)) {
      addViolation(violations, repoRoot, file, "public components must not import from examples");
    }

    if (/\bfetch\s*\(/.test(source)) {
      addViolation(violations, repoRoot, file, "public component files must not call fetch()");
    }

    if (/\bconsole\.log\s*\(/.test(source)) {
      addViolation(violations, repoRoot, file, "public component files must not call console.log()");
    }

    if (/Coming soon/.test(source)) {
      addViolation(violations, repoRoot, file, 'public component files must not contain "Coming soon"');
    }

    if (/No data/.test(source)) {
      addViolation(violations, repoRoot, file, 'public component files must not contain "No data"');
    }

    if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(source)) {
      addViolation(violations, repoRoot, file, "public component files must not contain fake email strings");
    }

    if (/["'`]https?:\/\/[^"'`]+["'`]/.test(source)) {
      addViolation(violations, repoRoot, file, "public component files must not contain hardcoded URL strings");
    }

    if (
      isComponentSource &&
      (file.includes(`${sep}ActionMenu${sep}`) || file.includes(`${sep}TableView${sep}`)) &&
      /\b(Edit|Copy|Delete)\b/.test(source)
    ) {
      addViolation(violations, repoRoot, file, "ActionMenu and TableView must not hardcode Edit, Copy, or Delete labels");
    }
  }

  const indexPath = join(repoRoot, "src/index.ts");
  if (existsSync(indexPath) && /examples/.test(read(indexPath))) {
    addViolation(violations, repoRoot, indexPath, "src/index.ts must not export from examples");
  }

  const packageJsonPath = join(repoRoot, "package.json");
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(read(packageJsonPath));
    const scripts = packageJson.scripts ?? {};
    const serializedScripts = {
      build: "node scripts/verification-runner.mjs build",
      "build-storybook": "node scripts/verification-runner.mjs build-storybook",
      check: "node scripts/verification-runner.mjs check",
      guardrails: "node scripts/verification-runner.mjs guardrails",
      test: "node scripts/verification-runner.mjs test",
    };

    for (const [script, expected] of Object.entries(serializedScripts)) {
      if (scripts[script] !== expected) {
        addViolation(violations, repoRoot, packageJsonPath, `npm run ${script} must use the serialized Atlas UI verification runner`);
      }
    }
  }

  for (const root of publicRoots) {
    const absoluteRoot = join(repoRoot, root);
    if (!existsSync(absoluteRoot)) continue;

    for (const entry of readdirSync(absoluteRoot)) {
      const componentDir = join(absoluteRoot, entry);
      if (!statSync(componentDir).isDirectory()) continue;

      const files = readdirSync(componentDir);
      if (!files.some((file) => file.endsWith(".stories.tsx"))) {
        addViolation(violations, repoRoot, componentDir, "public component folder must include a .stories.tsx file");
      }
      if (!files.some((file) => file.endsWith(".test.tsx"))) {
        addViolation(violations, repoRoot, componentDir, "public component folder must include a .test.tsx file");
      }
    }
  }

  const migrationMapPath = join(repoRoot, "docs/migration-map.md");
  if (!existsSync(migrationMapPath)) {
    addViolation(violations, repoRoot, migrationMapPath, "migration map must exist and account for legacy audit rows");
  } else {
    const migrationRows = parseMigrationMap(read(migrationMapPath));
    if (migrationRows.length === 0) {
      addViolation(violations, repoRoot, migrationMapPath, "migration map table is missing or could not be parsed");
    } else {
      const publicExportPaths = collectPublicExportPaths(repoRoot);

      for (const violation of getMigrationMapViolations(migrationRows, publicExportPaths)) {
        addViolation(violations, repoRoot, migrationMapPath, violation.message, violation.lineNumber);
      }
    }
  }

  return violations;
}

function runCli() {
  const violations = runGuardrails();

  if (violations.length > 0) {
    console.error("Atlas UI URA guardrails failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.info("Atlas UI URA guardrails passed.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli();
}
