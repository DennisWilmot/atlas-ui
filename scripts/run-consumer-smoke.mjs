import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const smokeDir = join(rootDir, "smoke", "consumer-app");
const artifactDir = join(smokeDir, ".artifacts");
const builtEntry = join(rootDir, "dist", "index.js");

function run(command, args, cwd, options = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
}

if (!existsSync(builtEntry)) {
  console.error('Atlas UI must be built before running consumer smoke. Run "npm run build" or "npm run check" first.');
  process.exit(1);
}

rmSync(artifactDir, { force: true, recursive: true });
rmSync(join(smokeDir, "dist"), { force: true, recursive: true });
rmSync(join(smokeDir, "node_modules"), { force: true, recursive: true });
rmSync(join(smokeDir, "package-lock.json"), { force: true });
mkdirSync(artifactDir, { recursive: true });

const packedFile = run("npm", ["pack", "--quiet", "--ignore-scripts", "--pack-destination", artifactDir], rootDir, {
  capture: true,
})
  .trim()
  .split(/\r?\n/)
  .pop();

if (!packedFile) {
  console.error("npm pack did not return a tarball name.");
  process.exit(1);
}

const packedTarballPath = join(artifactDir, packedFile);
const stableTarballPath = join(artifactDir, "atlas-ui.tgz");

renameSync(packedTarballPath, stableTarballPath);

run("npm", ["install", "--no-package-lock"], smokeDir);
run("npm", ["run", "typecheck"], smokeDir);
run("npm", ["run", "build"], smokeDir);
