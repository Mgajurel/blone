#!/usr/bin/env node
// Issue 003 smoke test: push the corpus in config/smoke-urls.json through the live
// pipeline, wait for crawling + tagging + summarization, and write a quality report
// to .docs/reports/003-smoke-report.md for human judgment.
//
// Zero dependencies; needs node >= 18. Reads KARAKEEP_API_KEY (and optionally
// KARAKEEP_URL) from the environment or from ./.env.
//
// Usage: node scripts/smoke-test.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// --- env ---------------------------------------------------------------------
function loadDotEnv() {
  const path = resolve(ROOT, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadDotEnv();

const BASE = (process.env.KARAKEEP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const KEY = process.env.KARAKEEP_API_KEY;
if (!KEY) {
  console.error("KARAKEEP_API_KEY is not set (create one in Karakeep: Settings → API Keys, then add it to .env)");
  process.exit(1);
}

const POLL_INTERVAL_MS = 15_000;
const GLOBAL_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MIN ?? 45) * 60_000;

// --- karakeep REST -----------------------------------------------------------
async function api(method, path, body) {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} -> HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

// --- type rules --------------------------------------------------------------
const RULES = JSON.parse(readFileSync(resolve(ROOT, "config/type-rules.json"), "utf8")).rules;

function ruleTypeFor(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  for (const rule of RULES) {
    if (rule.hosts.some((h) => host === h || host.endsWith(`.${h}`))) return rule.type;
  }
  return null;
}

// Precedence for the winning type: manual > rule > ai (PRD). The smoke corpus has
// no manual tags, so: rule type if the URL matches a rule, else the AI's type/ tag.
function winningType(url, tags) {
  const rule = url ? ruleTypeFor(url) : null;
  if (rule) return { type: rule, source: "rule" };
  const aiTypes = tags.filter((t) => t.name.startsWith("type/") && t.attachedBy === "ai");
  if (aiTypes.length > 0) return { type: aiTypes[0].name, source: "ai" };
  return { type: null, source: "none" };
}

// --- run ---------------------------------------------------------------------
const corpus = JSON.parse(readFileSync(resolve(ROOT, "config/smoke-urls.json"), "utf8"));
const started = Date.now();
const items = [];

console.log(`saving ${corpus.links.length} links + ${corpus.notes.length} notes to ${BASE} ...`);
for (const entry of corpus.links) {
  const created = await api("POST", "/bookmarks", { type: "link", url: entry.url });
  items.push({ ...entry, id: created.id, kind: "link", existed: created.alreadyExists === true, savedAt: Date.now() });
  console.log(`  ${created.alreadyExists ? "exists" : "saved "}  ${entry.url}`);
}
for (const entry of corpus.notes) {
  const created = await api("POST", "/bookmarks", { type: "text", text: entry.text });
  items.push({ ...entry, id: created.id, kind: "note", existed: created.alreadyExists === true, savedAt: Date.now() });
  console.log(`  ${created.alreadyExists ? "exists" : "saved "}  note: ${entry.text.slice(0, 50)}...`);
}

console.log("waiting for crawl + tagging + summary (poll every 15s) ...");
const pending = new Set(items.map((i) => i.id));
while (pending.size > 0 && Date.now() - started < GLOBAL_TIMEOUT_MS) {
  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  for (const item of items) {
    if (!pending.has(item.id)) continue;
    const b = await api("GET", `/bookmarks/${item.id}`);
    item.bookmark = b;
    const tagged = b.taggingStatus && b.taggingStatus !== "pending";
    const summarized = item.kind === "note" || b.summarizationStatus == null || b.summarizationStatus !== "pending";
    if (tagged && summarized) {
      pending.delete(item.id);
      item.doneAt = Date.now();
      console.log(`  done (${Math.round((item.doneAt - item.savedAt) / 1000)}s)  ${item.url ?? "note"} [${b.taggingStatus}]`);
    }
  }
}
for (const id of pending) console.log(`  TIMED OUT waiting for ${id}`);

// --- evaluate ----------------------------------------------------------------
function evaluate(item) {
  const b = item.bookmark ?? {};
  const tags = (b.tags ?? []).map((t) => ({ name: t.name, attachedBy: t.attachedBy }));
  const win = winningType(item.url, tags);
  const aiTypeTags = tags.filter((t) => t.name.startsWith("type/") && t.attachedBy === "ai");
  const topicTags = tags.filter((t) => !t.name.startsWith("type/") && t.attachedBy === "ai").map((t) => t.name);
  const violations = [];
  if (aiTypeTags.length === 0 && !ruleTypeFor(item.url ?? "")) violations.push("no type tag at all");
  if (aiTypeTags.length > 1) violations.push(`${aiTypeTags.length} ai type tags`);
  if (aiTypeTags.some((t) => !/^type\/(tweet|article|product|design|video|link)$/.test(t.name)))
    violations.push("type outside closed set");
  if (topicTags.length < 2 || topicTags.length > 5) violations.push(`${topicTags.length} topic tags (want 2-5)`);
  if (topicTags.some((t) => /[A-Z\s]/.test(t))) violations.push("non-lowercase/spaced topic tag");
  return {
    win,
    match: win.type === item.expect,
    topicTags,
    violations,
    summary: (b.summary ?? "").replace(/\s+/g, " ").trim(),
    crawlOk: item.kind === "note" || Boolean(b.content?.htmlContent || b.content?.description || b.title || b.content?.title),
    taggingStatus: b.taggingStatus ?? "unknown",
    seconds: item.doneAt ? Math.round((item.doneAt - item.savedAt) / 1000) : null,
  };
}

const rows = items.map((item) => ({ item, r: evaluate(item) }));
const done = rows.filter(({ r }) => r.seconds != null);
const matches = rows.filter(({ r }) => r.match).length;
const clean = rows.filter(({ r }) => r.violations.length === 0).length;

// --- report ------------------------------------------------------------------
const esc = (s) => String(s ?? "").replaceAll("|", "\\|");
const lines = [];
lines.push("# 003 smoke report — tagging pipeline quality");
lines.push("");
lines.push(`Corpus: ${corpus.links.length} links + ${corpus.notes.length} notes · model: local Ollama (\`INFERENCE_TEXT_MODEL\`) · ${new Date().toISOString()}`);
lines.push("");
lines.push(`**Type accuracy: ${matches}/${rows.length}** (winner === expected) · **format-clean: ${clean}/${rows.length}** (no violations) · settled: ${done.length}/${rows.length} within timeout`);
lines.push("");
lines.push("| # | save | expected | got (source) | ✓ | topic tags | violations | summary | s |");
lines.push("|---|---|---|---|---|---|---|---|---|");
rows.forEach(({ item, r }, i) => {
  const label = item.url ? item.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 45) : `note: ${item.text.slice(0, 35)}…`;
  lines.push(
    `| ${i + 1} | ${esc(label)} | ${item.expect} | ${r.win.type ?? "—"} (${r.win.source}) | ${r.match ? "✓" : "✗"} | ${esc(r.topicTags.join(", "))} | ${esc(r.violations.join("; ") || "—")} | ${esc(r.summary.slice(0, 70) || "—")} | ${r.seconds ?? "⏱"} |`
  );
});
lines.push("");
lines.push("## Notes for the human judgment call");
lines.push("");
lines.push(`- Crawl failures (expected for x.com): ${rows.filter(({ r }) => !r.crawlOk).map(({ item }) => item.url).join(", ") || "none"} — tweets still type correctly via rules; their text survives only via selection-capture (issue 008).`);
lines.push("- `expected` on via:ai rows is best-judgment, not ground truth — a defensible different type is a shrug, a nonsense type is a strike.");
lines.push("- If format violations dominate: tighten `config/tagging-prompt.md` first, try `llama3.1:8b` second, and the cloud escape hatch (README → Configuration) is the documented last resort.");
lines.push("");

mkdirSync(resolve(ROOT, ".docs/reports"), { recursive: true });
const out = resolve(ROOT, ".docs/reports/003-smoke-report.md");
writeFileSync(out, lines.join("\n"));
console.log(`\nreport written: ${out}`);
console.log(`type accuracy ${matches}/${rows.length}, format-clean ${clean}/${rows.length}`);
