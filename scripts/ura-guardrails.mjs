import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const publicRoots = ["src/primitives", "src/patterns"];
const expectedMigrationItemCount = 78;
const expectedMigrationCategoryCounts = new Map([
  ["base primitive", 28],
  ["application component", 34],
  ["page template", 16],
]);
const expectedMigrationColumns = [
  "legacy slug",
  "legacy label",
  "audit category",
  "disposition",
  "destination",
  "public export",
  "current implementation",
  "status",
  "owner",
  "PR link",
  "notes",
];
const allowedMigrationDispositions = new Set([
  "REBUILD",
  "REFACTOR",
  "EXAMPLE_ONLY",
  "REFERENCE_ONLY",
  "MERGED",
]);
const allowedMigrationStatuses = new Set([
  "NOT_STARTED",
  "IN_PROGRESS",
  "BUILT",
  "HARDENING_REQUIRED",
  "EXAMPLE_ONLY_DONE",
  "REFERENCE_ONLY_DONE",
  "MERGED",
  "BLOCKED",
]);
const violations = [];

function toDisplayPath(path) {
  return relative(repoRoot, path).split(sep).join("/");
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

function addViolation(file, message) {
  violations.push(`${toDisplayPath(file)}: ${message}`);
}

function read(file) {
  return readFileSync(file, "utf8");
}

function parseMarkdownTable(file) {
  const lines = read(file)
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*-/.test(line));
  const [headerLine, ...rowLines] = lines;

  if (!headerLine) return { headers: [], rows: [] };

  const headers = headerLine
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  const rows = rowLines.map((line) => {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });

  return { headers, rows };
}

function normalizeMarkdownPath(path) {
  return path.replace(/^`|`$/g, "").replaceAll("\\", "/");
}

function componentNameFromDestination(destination) {
  return destination.split("/").filter(Boolean).at(-1) ?? "";
}

function publicComponentDirs(root) {
  const absoluteRoot = join(repoRoot, root);
  if (!existsSync(absoluteRoot)) return [];

  return readdirSync(absoluteRoot)
    .map((entry) => join(absoluteRoot, entry))
    .filter((path) => statSync(path).isDirectory())
    .map((path) => toDisplayPath(path));
}

function requirePublicExport(indexFile, componentName, disposition) {
  if (!existsSync(indexFile)) {
    addViolation(indexFile, `${disposition} index file is missing`);
    return;
  }

  const expectedExport = `export * from "./${componentName}";`;
  if (!read(indexFile).includes(expectedExport)) {
    addViolation(indexFile, `${componentName} is marked BUILT in the migration map but is not exported`);
  }
}

const publicFiles = publicRoots.flatMap((root) => walk(join(repoRoot, root)));
const tsPublicFiles = publicFiles.filter((file) => /\.(ts|tsx)$/.test(file));

for (const file of tsPublicFiles) {
  const source = read(file);
  const isComponentSource = !file.endsWith(".stories.tsx") && !file.endsWith(".test.tsx") && !file.endsWith("index.ts");

  if (/from\s+["'][^"']*examples|import\s*\([^)]*["'][^"']*examples/.test(source)) {
    addViolation(file, "public components must not import from examples");
  }

  if (/\bfetch\s*\(/.test(source)) {
    addViolation(file, "public component files must not call fetch()");
  }

  if (/\bconsole\.log\s*\(/.test(source)) {
    addViolation(file, "public component files must not call console.log()");
  }

  if (/Coming soon/.test(source)) {
    addViolation(file, 'public component files must not contain "Coming soon"');
  }

  if (/No data/.test(source)) {
    addViolation(file, 'public component files must not contain "No data"');
  }

  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(source)) {
    addViolation(file, "public component files must not contain fake email strings");
  }

  if (/["'`]https?:\/\/[^"'`]+["'`]/.test(source)) {
    addViolation(file, "public component files must not contain hardcoded URL strings");
  }

  if (
    isComponentSource &&
    (file.includes(`${sep}ActionMenu${sep}`) || file.includes(`${sep}TableView${sep}`)) &&
    /\b(Edit|Copy|Delete)\b/.test(source)
  ) {
    addViolation(file, "ActionMenu and TableView must not hardcode Edit, Copy, or Delete labels");
  }
}

const indexPath = join(repoRoot, "src/index.ts");
if (existsSync(indexPath) && /examples/.test(read(indexPath))) {
  addViolation(indexPath, "src/index.ts must not export from examples");
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
      addViolation(packageJsonPath, `npm run ${script} must use the serialized Atlas UI verification runner`);
    }
  }

  for (const exportPath of Object.keys(packageJson.exports ?? {})) {
    if (/examples/.test(exportPath) || /examples/.test(JSON.stringify(packageJson.exports[exportPath]))) {
      addViolation(packageJsonPath, "package exports must not expose examples");
    }
  }
}

const migrationMapPath = join(repoRoot, "docs/migration-map.md");
if (existsSync(migrationMapPath)) {
  const { headers, rows } = parseMarkdownTable(migrationMapPath);
  const slugs = new Set();
  const categoryCounts = new Map();
  const builtPrimitiveDestinations = new Set();
  const builtPatternDestinations = new Set();

  if (headers.join("|") !== expectedMigrationColumns.join("|")) {
    addViolation(
      migrationMapPath,
      `migration map columns must be exactly: ${expectedMigrationColumns.join(", ")}`,
    );
  }

  if (rows.length !== expectedMigrationItemCount) {
    addViolation(
      migrationMapPath,
      `migration map must account for exactly ${expectedMigrationItemCount} legacy items; found ${rows.length}`,
    );
  }

  for (const row of rows) {
    const slug = row["legacy slug"];
    const label = row["legacy label"];
    const category = row["audit category"];
    const disposition = row.disposition;
    const destination = normalizeMarkdownPath(row.destination);
    const publicExport = row["public export"];
    const currentImplementation = row["current implementation"];
    const status = row.status;
    const owner = row.owner;
    const prLink = row["PR link"];
    const rowLabel = slug || label || "unknown legacy item";

    if (!slug) {
      addViolation(migrationMapPath, "migration map row is missing a legacy slug");
    } else if (slugs.has(slug)) {
      addViolation(migrationMapPath, `migration map has duplicate legacy slug "${slug}"`);
    } else {
      slugs.add(slug);
    }

    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);

    if (!expectedMigrationCategoryCounts.has(category)) {
      addViolation(migrationMapPath, `${rowLabel} has invalid audit category "${category}"`);
    }

    if (!allowedMigrationDispositions.has(disposition)) {
      addViolation(migrationMapPath, `${rowLabel} has invalid disposition "${disposition}"`);
    }

    if (!allowedMigrationStatuses.has(status)) {
      addViolation(migrationMapPath, `${rowLabel} has invalid status "${status}"`);
    }

    if (publicExport !== "yes" && publicExport !== "no") {
      addViolation(migrationMapPath, `${rowLabel} must use "yes" or "no" for Public export`);
    }

    if (!currentImplementation) {
      addViolation(migrationMapPath, `${rowLabel} must describe its current implementation`);
    }

    if (!owner) {
      addViolation(migrationMapPath, `${rowLabel} must include an owner`);
    }

    if (!prLink) {
      addViolation(migrationMapPath, `${rowLabel} must include a PR link value`);
    }

    if (category === "page template" && disposition !== "EXAMPLE_ONLY") {
      addViolation(migrationMapPath, `${rowLabel} is a page template and must be EXAMPLE_ONLY`);
    }

    if ((disposition === "REFERENCE_ONLY" || disposition === "EXAMPLE_ONLY" || disposition === "MERGED") && publicExport !== "no") {
      addViolation(migrationMapPath, `${rowLabel} is ${disposition} but is marked as a public export`);
    }

    if (disposition === "REBUILD") {
      if (category !== "base primitive") {
        addViolation(migrationMapPath, `${rowLabel} is REBUILD but is not categorized as a base primitive`);
      }
      if (!destination.startsWith("src/primitives/")) {
        addViolation(migrationMapPath, `${rowLabel} is REBUILD but does not target src/primitives`);
      }
      if (publicExport !== "yes") {
        addViolation(migrationMapPath, `${rowLabel} is REBUILD but is not marked as a public export`);
      }
      if (status === "BUILT") {
        builtPrimitiveDestinations.add(destination);
        requirePublicExport(join(repoRoot, "src/primitives/index.ts"), componentNameFromDestination(destination), disposition);
      }
    }

    if (disposition === "REFACTOR") {
      if (category !== "application component") {
        addViolation(migrationMapPath, `${rowLabel} is REFACTOR but is not categorized as an application component`);
      }
      if (!destination.startsWith("src/patterns/")) {
        addViolation(migrationMapPath, `${rowLabel} is REFACTOR but does not target src/patterns`);
      }
      if (publicExport !== "yes") {
        addViolation(migrationMapPath, `${rowLabel} is REFACTOR but is not marked as a public export`);
      }
      if (status === "BUILT") {
        builtPatternDestinations.add(destination);
        requirePublicExport(join(repoRoot, "src/patterns/index.ts"), componentNameFromDestination(destination), disposition);
      }
    }

    if (disposition === "EXAMPLE_ONLY") {
      if (category !== "page template") {
        addViolation(migrationMapPath, `${rowLabel} is EXAMPLE_ONLY but is not categorized as a page template`);
      }
      if (!destination.startsWith("examples/")) {
        addViolation(migrationMapPath, `${rowLabel} is EXAMPLE_ONLY but does not target examples`);
      }
      if (status !== "EXAMPLE_ONLY_DONE") {
        addViolation(migrationMapPath, `${rowLabel} is EXAMPLE_ONLY but status is not EXAMPLE_ONLY_DONE`);
      }
    }

    if (disposition === "REFERENCE_ONLY") {
      if (destination.startsWith("src/")) {
        addViolation(migrationMapPath, `${rowLabel} is REFERENCE_ONLY but targets public source`);
      }
      if (status !== "REFERENCE_ONLY_DONE") {
        addViolation(migrationMapPath, `${rowLabel} is REFERENCE_ONLY but status is not REFERENCE_ONLY_DONE`);
      }
    }

    if (disposition === "MERGED") {
      if (!destination.startsWith("src/primitives/") && !destination.startsWith("src/patterns/")) {
        addViolation(migrationMapPath, `${rowLabel} is MERGED but does not point to the covering public component`);
      }
      if (status !== "MERGED") {
        addViolation(migrationMapPath, `${rowLabel} is MERGED but status is not MERGED`);
      }
    }
  }

  for (const [category, expectedCount] of expectedMigrationCategoryCounts) {
    const actualCount = categoryCounts.get(category) ?? 0;
    if (actualCount !== expectedCount) {
      addViolation(migrationMapPath, `${category} audit category must have ${expectedCount} rows; found ${actualCount}`);
    }
  }

  for (const destination of builtPrimitiveDestinations) {
    if (!existsSync(join(repoRoot, destination))) {
      addViolation(migrationMapPath, `${destination} is marked BUILT but the primitive folder is missing`);
    }
  }

  for (const destination of builtPatternDestinations) {
    if (!existsSync(join(repoRoot, destination))) {
      addViolation(migrationMapPath, `${destination} is marked BUILT but the pattern folder is missing`);
    }
  }

  for (const destination of publicComponentDirs("src/primitives")) {
    if (!builtPrimitiveDestinations.has(destination)) {
      addViolation(migrationMapPath, `${destination} exists publicly but is not marked BUILT as REBUILD`);
    }
  }

  for (const destination of publicComponentDirs("src/patterns")) {
    if (!builtPatternDestinations.has(destination)) {
      addViolation(migrationMapPath, `${destination} exists publicly but is not marked BUILT as REFACTOR`);
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
      addViolation(componentDir, "public component folder must include a .stories.tsx file");
    }
    if (!files.some((file) => file.endsWith(".test.tsx"))) {
      addViolation(componentDir, "public component folder must include a .test.tsx file");
    }
  }
}

if (violations.length > 0) {
  console.error("Atlas UI URA guardrails failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.info("Atlas UI URA guardrails passed.");
