#!/usr/bin/env node
/**
 * Fail when any covered source file drops below the per-file coverage floor.
 * Vitest global thresholds enforce project-wide averages; this script catches
 * individual files that slip through with low coverage.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FLOOR = {
  statements: 50,
  branches: 50,
  functions: 50,
  lines: 50,
};

const coveragePath = resolve("coverage/coverage-final.json");

const pct = (covered, total) => (total === 0 ? 100 : (covered / total) * 100);

const readCoverage = () => {
  let raw;
  try {
    raw = readFileSync(coveragePath, "utf8");
  } catch {
    console.error(
      `Per-file coverage check failed: ${coveragePath} not found. Run npm run test:coverage first.`,
    );
    process.exit(1);
  }
  return JSON.parse(raw);
};

const fileMetrics = (data) => {
  const statements = data.s ?? {};
  const functions = data.f ?? {};
  const branches = data.b ?? {};
  const lines = data.l ?? statements;

  const stmtTotal = Object.keys(statements).length;
  const stmtCovered = Object.values(statements).filter((v) => v > 0).length;

  const fnTotal = Object.keys(functions).length;
  const fnCovered = Object.values(functions).filter((v) => v > 0).length;

  const branchValues = Object.values(branches).flat();
  const branchTotal = branchValues.length;
  const branchCovered = branchValues.filter((v) => v > 0).length;

  const lineTotal = Object.keys(lines).length;
  const lineCovered = Object.values(lines).filter((v) => v > 0).length;

  return {
    statements: pct(stmtCovered, stmtTotal),
    branches: pct(branchCovered, branchTotal),
    functions: pct(fnCovered, fnTotal),
    lines: pct(lineCovered, lineTotal),
  };
};

const coverage = readCoverage();
const failures = [];

for (const [file, data] of Object.entries(coverage)) {
  const rel = file.replace(`${process.cwd()}/`, "");
  const metrics = fileMetrics(data);

  for (const [metric, value] of Object.entries(metrics)) {
    const floor = FLOOR[metric];
    if (value < floor) {
      failures.push({
        file: rel,
        metric,
        value: value.toFixed(1),
        floor,
      });
    }
  }
}

if (failures.length > 0) {
  console.error(
    `\nPer-file coverage floor check failed (${failures.length} violation(s), minimum ${FLOOR.statements}% per metric):\n`,
  );
  for (const { file, metric, value, floor } of failures) {
    console.error(`  ${file}: ${metric} ${value}% < ${floor}%`);
  }
  process.exit(1);
}

console.log(
  `Per-file coverage floor check passed (all files >= ${FLOOR.statements}% for statements, branches, functions, and lines).`,
);
