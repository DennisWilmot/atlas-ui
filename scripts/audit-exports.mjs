import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const allowedPackageExports = new Set([".", "./primitives", "./patterns", "./types", "./headless"]);
const forbiddenExportTerms = [
  "examples",
  "pages",
  "page-templates",
  "dashboards",
  "dashboard",
  "auth",
  "auth-pages",
  "marketing",
  "marketing-sections",
  "email",
  "email-templates",
  "templates",
  "docs",
  "reference-only",
  "reference-only-assets",
];
const violations = [];

function display(path) {
  return relative(repoRoot, path).split(sep).join("/");
}

function addViolation(path, message) {
  violations.push(`${display(path)}: ${message}`);
}

function read(path) {
  return readFileSync(path, "utf8");
}

function getMetaTitle(source) {
  return source.match(/const\s+meta\s*=\s*{[\s\S]*?\n\s*title:\s*["'`]([^"'`]+)["'`]/)?.[1];
}

const packageJsonPath = join(repoRoot, "package.json");
const packageJson = JSON.parse(read(packageJsonPath));
for (const exportPath of Object.keys(packageJson.exports ?? {})) {
  if (!allowedPackageExports.has(exportPath)) {
    addViolation(packageJsonPath, `package export "${exportPath}" is not an allowed public layer`);
  }

  const serialized = JSON.stringify(packageJson.exports[exportPath]);
  if (forbiddenExportTerms.some((term) => exportPath.includes(term) || serialized.includes(term))) {
    addViolation(packageJsonPath, `package export "${exportPath}" exposes forbidden material`);
  }
}

for (const file of packageJson.files ?? []) {
  if (/^(examples|pages|dashboards|auth|marketing|email-templates)$/.test(file)) {
    addViolation(packageJsonPath, `package files must not publish ${file}`);
  }
}

for (const expectedExport of allowedPackageExports) {
  if (!packageJson.exports?.[expectedExport]) addViolation(packageJsonPath, `missing expected package export "${expectedExport}"`);
}

const entryFiles = ["src/index.ts", "src/primitives.ts", "src/patterns.ts", "src/types.ts", "src/headless.ts"];
for (const entryFile of entryFiles) {
  const entryPath = join(repoRoot, entryFile);
  if (!existsSync(entryPath)) {
    addViolation(entryPath, "expected public entry file is missing");
    continue;
  }

  const source = read(entryPath);
  if (/examples|docs|pages|dashboards?|auth|marketing|email|templates|reference-only/i.test(source)) {
    addViolation(entryPath, "public entry file must not reference examples, pages, docs, dashboards, auth pages, marketing sections, email templates, or reference-only assets");
  }
}

for (const [indexFile, expectedPrefix] of [
  ["src/primitives/index.ts", "./"],
  ["src/patterns/index.ts", "./"],
]) {
  const indexPath = join(repoRoot, indexFile);
  const source = read(indexPath);
  if (/examples|docs|pages|dashboards?|auth|marketing|email|templates|reference-only/i.test(source)) {
    addViolation(indexPath, "public barrel must not reference examples, pages, docs, dashboards, auth pages, marketing sections, email templates, or reference-only assets");
  }
  for (const line of source.split("\n").filter(Boolean)) {
    if (!line.startsWith(`export * from "${expectedPrefix}`)) {
      addViolation(indexPath, `unexpected barrel line: ${line}`);
    }
  }
}

const examplesRoot = join(repoRoot, "examples");
if (existsSync(examplesRoot)) {
  const stack = [examplesRoot];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        stack.push(path);
        continue;
      }

      if (entry === "index.ts" || entry === "index.tsx") {
        addViolation(path, "examples must not expose barrel exports");
      }

      if (entry.endsWith(".stories.tsx")) {
        const title = getMetaTitle(read(path));
        if (!title?.startsWith("Examples/")) addViolation(path, "example stories must be under Examples/");
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Atlas UI export audit failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.info("Atlas UI export audit passed.");
