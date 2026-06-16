import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const publicRoots = ["src/primitives", "src/patterns"];
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
