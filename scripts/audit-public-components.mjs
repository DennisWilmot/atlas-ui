import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repoRoot = process.cwd();
const publicRoots = [
  { root: "src/primitives", titlePrefix: "Primitives/", expectedCount: 15, label: "public primitives" },
  { root: "src/patterns", titlePrefix: "Patterns/", expectedCount: 30, label: "public patterns" },
];
const violations = [];
const counts = [];

function display(path) {
  return relative(repoRoot, path).split(sep).join("/");
}

function addViolation(path, message) {
  violations.push(`${display(path)}: ${message}`);
}

function getMetaTitle(source) {
  return source.match(/const\s+meta\s*=\s*{[\s\S]*?\n\s*title:\s*["'`]([^"'`]+)["'`]/)?.[1];
}

for (const { root, titlePrefix, expectedCount, label } of publicRoots) {
  const absoluteRoot = join(repoRoot, root);
  if (!existsSync(absoluteRoot)) {
    addViolation(absoluteRoot, "public component root is missing");
    continue;
  }

  const componentNames = readdirSync(absoluteRoot).filter((entry) => statSync(join(absoluteRoot, entry)).isDirectory());
  counts.push(`${label}: ${componentNames.length}`);

  if (componentNames.length !== expectedCount) {
    addViolation(absoluteRoot, `expected ${expectedCount} ${label}; found ${componentNames.length}`);
  }

  for (const entry of componentNames) {
    const componentDir = join(absoluteRoot, entry);
    const files = readdirSync(componentDir);
    const storyFiles = files.filter((file) => file.endsWith(".stories.tsx"));
    const testFiles = files.filter((file) => file.endsWith(".test.tsx"));
    const indexPath = join(componentDir, "index.ts");

    if (storyFiles.length === 0) {
      addViolation(componentDir, "public component folder must include a .stories.tsx file");
    }

    if (testFiles.length === 0) {
      addViolation(componentDir, "public component folder must include a .test.tsx file");
    }

    if (!existsSync(indexPath)) {
      addViolation(componentDir, "public component folder must include an index.ts file");
    }

    for (const storyFile of storyFiles) {
      const storyPath = join(componentDir, storyFile);
      const source = readFileSync(storyPath, "utf8");
      const title = getMetaTitle(source);

      if (!title) {
        addViolation(storyPath, "Storybook file must define meta.title");
      } else if (!title.startsWith(titlePrefix)) {
        addViolation(storyPath, `Storybook title must start with ${titlePrefix}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Atlas UI public component audit failed:\n");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

for (const count of counts) console.info(count);
console.info("Atlas UI public component audit passed.");
