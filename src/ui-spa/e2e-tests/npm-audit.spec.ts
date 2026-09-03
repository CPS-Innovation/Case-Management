// Guards the dependency tree as part of the e2e suite: `npm audit` must report
// nothing at or above E2E_AUDIT_FAIL_ON (default "high"). Findings below the
// threshold are logged rather than failed, so a fresh low/moderate advisory
// does not turn the suite red on its own. Set E2E_AUDIT_FAIL_ON=low to be
// strict, or "critical" to be lenient.
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const SEVERITIES = ["info", "low", "moderate", "high", "critical"] as const;
type Severity = (typeof SEVERITIES)[number];

interface AuditAdvisory {
  title?: string;
  url?: string;
}

interface AuditReport {
  metadata?: {
    vulnerabilities?: Partial<Record<Severity, number>>;
  };
  vulnerabilities?: Record<
    string,
    { severity: Severity; via?: Array<string | AuditAdvisory> }
  >;
}

const uiSpaRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const isSeverity = (value: string): value is Severity =>
  (SEVERITIES as readonly string[]).includes(value);

const resolveThreshold = (): Severity => {
  const configured = process.env.E2E_AUDIT_FAIL_ON?.toLowerCase();
  if (!configured) return "high";
  if (!isSeverity(configured)) {
    throw new Error(
      `E2E_AUDIT_FAIL_ON must be one of ${SEVERITIES.join(", ")}, got "${configured}"`,
    );
  }
  return configured;
};

const runAudit = (): AuditReport => {
  let stdout: string;
  try {
    stdout = execSync("npm audit --json", {
      cwd: uiSpaRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000,
    });
  } catch (error) {
    // npm exits non-zero whenever it finds anything, so the report still
    // arrives on stdout. Only a genuine failure to run leaves stdout empty.
    const output = (error as { stdout?: string }).stdout;
    if (!output) throw error;
    stdout = output;
  }
  return JSON.parse(stdout) as AuditReport;
};

const advisoryUrl = (via: Array<string | AuditAdvisory> = []): string => {
  const advisory = via.find(
    (entry): entry is AuditAdvisory => typeof entry === "object",
  );
  return advisory?.url ? ` — ${advisory.url}` : "";
};

test("npm audit finds no vulnerabilities at or above the fail threshold", () => {
  test.setTimeout(150_000);

  const failOn = resolveThreshold();
  const report = runAudit();
  const counts = report.metadata?.vulnerabilities ?? {};

  const summary = SEVERITIES.map((s) => `${counts[s] ?? 0} ${s}`).join(", ");
  console.log(`npm audit (fail at ${failOn} and above): ${summary}`);

  const threshold = SEVERITIES.indexOf(failOn);
  const offenders = Object.entries(report.vulnerabilities ?? {})
    .filter(([, detail]) => SEVERITIES.indexOf(detail.severity) >= threshold)
    .map(
      ([name, detail]) =>
        `${detail.severity.padEnd(8)} ${name}${advisoryUrl(detail.via)}`,
    )
    .sort();

  expect(
    offenders,
    offenders.length
      ? `Vulnerabilities at or above "${failOn}":\n  ${offenders.join("\n  ")}\n\nRun \`npm audit fix\` in src/ui-spa.`
      : "",
  ).toEqual([]);
});
