import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const publicRoots = ["src/primitives", "src/patterns"];
const violations = [];

function display(path) {
  return relative(repoRoot, path).split(sep).join("/");
}

function addViolation(path, message) {
  violations.push(`${display(path)}: ${message}`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function read(path) {
  return readFileSync(path, "utf8");
}

const publicFiles = publicRoots.flatMap((root) => walk(join(repoRoot, root)));
const implementationFiles = publicFiles.filter((file) => (
  /\.(ts|tsx)$/.test(file) &&
  !file.endsWith(".stories.tsx") &&
  !file.endsWith(".test.tsx") &&
  !file.endsWith("index.ts")
));

for (const file of implementationFiles) {
  const source = read(file);

  if (/from\s+["'][^"']*examples|import\s*\([^)]*["'][^"']*examples/.test(source)) {
    addViolation(file, "public components must not import from examples");
  }

  if (/\bfetch\s*\(/.test(source)) addViolation(file, "public components must not call fetch()");
  if (/\bconsole\.log\s*\(/.test(source)) addViolation(file, "public components must not call console.log()");
  if (/Coming soon/.test(source)) addViolation(file, 'public components must not contain "Coming soon"');
  if (/No data/.test(source)) addViolation(file, 'public components must not contain "No data"');
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(source)) addViolation(file, "public components must not contain fake email strings");
  if (/["'`]https?:\/\/[^"'`]+["'`]/.test(source)) addViolation(file, "public components must not contain hardcoded URL strings");
  if (/\/(admin|login|signup|settings|dashboard|customers|invoices)\b/.test(source)) addViolation(file, "public components must not contain hardcoded app routes");

  if (
    (file.includes(`${sep}ActionMenu${sep}`) || file.includes(`${sep}TableView${sep}`)) &&
    /\b(Edit|Copy|Delete)\b/.test(source)
  ) {
    addViolation(file, "ActionMenu and TableView must not hardcode Edit, Copy, or Delete labels");
  }
}

const behaviorExpectations = [
  {
    file: "src/patterns/SelectView/SelectView.tsx",
    checks: [
      [/shouldUseSearchableSelect\(items\.length\)/, "SelectView must use the >10 searchable select threshold"],
      [/if \(items\.length === 0\) return null;/, "SelectView must return null when empty"],
      [/role="combobox"/, "SelectView searchable mode must expose a combobox"],
    ],
  },
  {
    file: "src/patterns/ListView/ListView.tsx",
    checks: [
      [/shouldUseSearchableList\(items\.length\)/, "ListView must use the >20 searchable list threshold"],
      [/if \(!showEmptyState\) return null;/, "ListView must hide empty data unless explicitly opted in"],
      [/aria-label=\{`\$\{label\} pagination`\}/, "ListView overflow must expose pagination"],
    ],
  },
  {
    file: "src/patterns/TableView/TableView.tsx",
    checks: [
      [/shouldUseTableControls\(rows\.length\)/, "TableView must use the >50 table controls threshold"],
      [/rows\.length === 0 \|\| columns\.length === 0/, "TableView must treat empty rows or columns as meaningless"],
      [/aria-label=\{`\$\{label\} pagination`\}/, "TableView overflow must expose pagination"],
    ],
  },
  {
    file: "src/patterns/MetricView/MetricView.tsx",
    checks: [
      [/isMeaningfulMetric\(metric, \{ showZero \}\)/, "MetricView must use canonical metric visibility"],
      [/return null;/, "MetricView must return null for meaningless metrics"],
    ],
  },
  {
    file: "src/patterns/ActionMenu/ActionMenu.tsx",
    checks: [
      [/getVisibleActions\(actions\)/, "ActionMenu must filter hidden actions"],
      [/if \(visibleActions\.length === 0\) return null;/, "ActionMenu must return null when no visible actions exist"],
      [/if \(!action\.disabled\) onAction\?\.\(action\.id\)/, "ActionMenu must not execute disabled actions"],
    ],
  },
  {
    file: "src/patterns/EmptyState/EmptyState.tsx",
    checks: [
      [/getVisibleActions\(actions\)/, "EmptyState must filter hidden actions"],
      [/return null;/, "EmptyState must return null when meaningless"],
    ],
  },
];

for (const expectation of behaviorExpectations) {
  const file = join(repoRoot, expectation.file);
  const source = existsSync(file) ? read(file) : "";
  if (!source) {
    addViolation(file, "required URA behavior file is missing");
    continue;
  }

  for (const [pattern, message] of expectation.checks) {
    if (!pattern.test(source)) addViolation(file, message);
  }
}

if (violations.length > 0) {
  console.error("Atlas UI URA behavior audit failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.info("Atlas UI URA behavior audit passed.");
