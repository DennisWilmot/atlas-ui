import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const lockDir = join(tmpdir(), "atlas-ui-verification-runner.lock");
const ownerPath = join(lockDir, "owner.json");
const pollMs = Number(process.env.ATLAS_VERIFY_LOCK_POLL_MS ?? 2000);
const timeoutMs = Number(process.env.ATLAS_VERIFY_LOCK_TIMEOUT_MS ?? 30 * 60 * 1000);
const cliArgs = process.argv.slice(2);
const args = new Set(cliArgs);
const requestedStageIndex = cliArgs.findIndex((arg) => !arg.startsWith("--"));
const requestedStage = requestedStageIndex >= 0 ? cliArgs[requestedStageIndex] : "check";
const passthroughArgs = requestedStage !== "check" && requestedStageIndex >= 0 ? cliArgs.slice(requestedStageIndex + 1) : [];

function npmScript(script) {
  const args = ["run", script];

  if (passthroughArgs.length > 0) {
    args.push("--", ...passthroughArgs);
  }

  return ["npm", args];
}

const stageCommands = {
  guardrails: [npmScript("guardrails:raw")],
  test: [npmScript("test:raw")],
  build: [npmScript("build:raw")],
  "smoke:consumer": [npmScript("smoke:consumer")],
  "build-storybook": [npmScript("build-storybook:raw")],
};

stageCommands.check = [
  ...stageCommands.guardrails,
  ...stageCommands.test,
  ...stageCommands.build,
  ...stageCommands["smoke:consumer"],
  ...stageCommands["build-storybook"],
];

const stages = stageCommands[requestedStage];

if (!stages) {
  console.error(
    `Unknown Atlas UI verification stage "${requestedStage}". Expected one of: ${Object.keys(stageCommands).join(", ")}.`,
  );
  process.exit(1);
}

function readOwner() {
  if (!existsSync(ownerPath)) return null;

  try {
    return JSON.parse(readFileSync(ownerPath, "utf8"));
  } catch {
    return null;
  }
}

function isAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function describeOwner(owner) {
  if (!owner) return "unknown owner";

  const since = owner.startedAt ? ` since ${owner.startedAt}` : "";
  const cwd = owner.cwd ? ` in ${owner.cwd}` : "";
  const pid = owner.pid ? `pid ${owner.pid}` : "unknown pid";
  return `${pid}${since}${cwd}`;
}

async function acquireLock() {
  const started = Date.now();
  let announced = false;

  while (true) {
    try {
      mkdirSync(lockDir);
      writeFileSync(
        ownerPath,
        JSON.stringify(
          {
            pid: process.pid,
            cwd: process.cwd(),
            command: `npm run ${requestedStage}`,
            startedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
      console.info("Atlas UI verification lock acquired.");
      return;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;

      const owner = readOwner();
      if (!owner || !isAlive(owner.pid)) {
        rmSync(lockDir, { force: true, recursive: true });
        continue;
      }

      if (!announced) {
        console.info(`Atlas UI verification is already running (${describeOwner(owner)}). Waiting for the shared lane.`);
        announced = true;
      }

      if (Date.now() - started > timeoutMs) {
        throw new Error(`Timed out waiting for Atlas UI verification lock held by ${describeOwner(owner)}.`);
      }

      await sleep(pollMs);
    }
  }
}

function releaseLock() {
  const owner = readOwner();
  if (owner?.pid === process.pid) {
    rmSync(lockDir, { force: true, recursive: true });
  }
}

function runStage(command, args) {
  return new Promise((resolve, reject) => {
    console.info(`\n> ${command} ${args.join(" ")}`);
    const child = spawn(command, args, { stdio: "inherit" });

    const forwardSignal = (signal) => {
      child.kill(signal);
    };

    process.once("SIGINT", forwardSignal);
    process.once("SIGTERM", forwardSignal);

    child.on("exit", (code, signal) => {
      process.removeListener("SIGINT", forwardSignal);
      process.removeListener("SIGTERM", forwardSignal);

      if (signal) {
        reject(new Error(`${command} ${args.join(" ")} terminated with ${signal}.`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${command} ${args.join(" ")} exited with code ${code}.`));
        return;
      }

      resolve();
    });

    child.on("error", (error) => {
      process.removeListener("SIGINT", forwardSignal);
      process.removeListener("SIGTERM", forwardSignal);
      reject(error);
    });
  });
}

try {
  await acquireLock();

  if (args.has("--lock-only")) {
    console.info("Atlas UI verification lane is available.");
  } else {
    for (const [command, stageArgs] of stages) {
      await runStage(command, stageArgs);
    }
  }
} finally {
  releaseLock();
}
