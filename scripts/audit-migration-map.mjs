import { existsSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const migrationMapPath = join(repoRoot, "docs/migration-map.md");
const expectedItemCount = 78;
const expectedCategoryCounts = new Map([
  ["base primitive", 28],
  ["application component", 34],
  ["page template", 16],
]);
const expectedColumns = [
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
const allowedDispositions = new Set(["REBUILD", "REFACTOR", "EXAMPLE_ONLY", "REFERENCE_ONLY", "MERGED"]);
const allowedStatuses = new Set([
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

function display(path) {
  return relative(repoRoot, path).split(sep).join("/");
}

function addViolation(path, message) {
  violations.push(`${display(path)}: ${message}`);
}

function parseMarkdownTable(file) {
  const lines = readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*-/.test(line));
  const [headerLine, ...rowLines] = lines;

  if (!headerLine) return { headers: [], rows: [] };

  const headers = headerLine.split("|").slice(1, -1).map((cell) => cell.trim());
  const rows = rowLines.map((line) => {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });

  return { headers, rows };
}

function normalizeMarkdownPath(path) {
  return path.replace(/^`|`$/g, "").replaceAll("\\", "/");
}

if (!existsSync(migrationMapPath)) {
  addViolation(migrationMapPath, "migration map is missing");
} else {
  const { headers, rows } = parseMarkdownTable(migrationMapPath);
  const slugs = new Set();
  const categoryCounts = new Map();

  if (headers.join("|") !== expectedColumns.join("|")) {
    addViolation(migrationMapPath, `columns must be exactly: ${expectedColumns.join(", ")}`);
  }

  if (rows.length !== expectedItemCount) {
    addViolation(migrationMapPath, `must account for exactly ${expectedItemCount} legacy items; found ${rows.length}`);
  }

  for (const row of rows) {
    const slug = row["legacy slug"];
    const label = row["legacy label"];
    const category = row["audit category"];
    const disposition = row.disposition;
    const destination = normalizeMarkdownPath(row.destination);
    const publicExport = row["public export"];
    const status = row.status;
    const rowLabel = slug || label || "unknown legacy item";

    if (!slug) {
      addViolation(migrationMapPath, "row is missing a legacy slug");
    } else if (slugs.has(slug)) {
      addViolation(migrationMapPath, `duplicate legacy slug "${slug}"`);
    } else {
      slugs.add(slug);
    }

    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);

    if (!expectedCategoryCounts.has(category)) addViolation(migrationMapPath, `${rowLabel} has invalid audit category "${category}"`);
    if (!allowedDispositions.has(disposition)) addViolation(migrationMapPath, `${rowLabel} has invalid disposition "${disposition}"`);
    if (!allowedStatuses.has(status)) addViolation(migrationMapPath, `${rowLabel} has invalid status "${status}"`);
    if (publicExport !== "yes" && publicExport !== "no") addViolation(migrationMapPath, `${rowLabel} must use yes/no for public export`);
    if (!destination) addViolation(migrationMapPath, `${rowLabel} must include a destination`);
    if (!row["current implementation"]) addViolation(migrationMapPath, `${rowLabel} must describe current implementation`);
    if (!row.owner) addViolation(migrationMapPath, `${rowLabel} must include an owner`);
    if (!row["PR link"]) addViolation(migrationMapPath, `${rowLabel} must include a PR link value`);

    if (category === "page template" && disposition !== "EXAMPLE_ONLY") {
      addViolation(migrationMapPath, `${rowLabel} is a page template and must be EXAMPLE_ONLY`);
    }

    if ((disposition === "REFERENCE_ONLY" || disposition === "EXAMPLE_ONLY" || disposition === "MERGED") && publicExport !== "no") {
      addViolation(migrationMapPath, `${rowLabel} is ${disposition} but is marked as a public export`);
    }

    if (disposition === "REBUILD" && (!destination.startsWith("src/primitives/") || category !== "base primitive" || publicExport !== "yes")) {
      addViolation(migrationMapPath, `${rowLabel} REBUILD rows must be exported base primitives in src/primitives`);
    }

    if (disposition === "REFACTOR" && (!destination.startsWith("src/patterns/") || category !== "application component" || publicExport !== "yes")) {
      addViolation(migrationMapPath, `${rowLabel} REFACTOR rows must be exported application components in src/patterns`);
    }

    if (disposition === "EXAMPLE_ONLY" && !destination.startsWith("examples/")) {
      addViolation(migrationMapPath, `${rowLabel} is EXAMPLE_ONLY but does not target examples`);
    }

    if (disposition === "REFERENCE_ONLY" && destination.startsWith("src/")) {
      addViolation(migrationMapPath, `${rowLabel} is REFERENCE_ONLY but targets public source`);
    }
  }

  for (const [category, expectedCount] of expectedCategoryCounts) {
    const actualCount = categoryCounts.get(category) ?? 0;
    if (actualCount !== expectedCount) addViolation(migrationMapPath, `${category} must have ${expectedCount} rows; found ${actualCount}`);
  }
}

if (violations.length > 0) {
  console.error("Atlas UI migration map audit failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.info("Atlas UI migration map audit passed.");
