#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");

if (separatorIndex === -1) {
  console.error("Usage: run-with-env.mjs <env-file...> -- <command> [args...]");
  process.exit(2);
}

const envFiles = args.slice(0, separatorIndex);
const command = args[separatorIndex + 1];
const commandArgs = args.slice(separatorIndex + 2);

if (!command) {
  console.error("Missing command after --");
  process.exit(2);
}

for (const envFile of envFiles) {
  if (!existsSync(envFile)) {
    continue;
  }

  const contents = readFileSync(envFile, "utf8");

  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/gu, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const result = spawnSync(command, commandArgs, {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
