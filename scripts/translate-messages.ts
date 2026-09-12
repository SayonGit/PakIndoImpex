/**
 * Auto-translates src/messages/en.json into every other locale using the
 * Gemini API (free tier — no billing account needed). This is the ONLY tool
 * that should ever touch src/messages/<locale>.json for locale != "en" —
 * those files are generated output, not hand-edited source. If you change
 * copy, change it in en.json, then run this script to bring every other
 * language back in sync.
 *
 * Usage:
 *   npm run translate                                   Resync every existing
 *                                                        locale file from the
 *                                                        current en.json.
 *   npm run translate -- ja "Japanese" "日本語"           Add/regenerate one
 *                                                        specific locale.
 *   npm run translate -- ar "Arabic" "العربية" --rtl      Same, marked RTL
 *                                                        (prints a routing.ts
 *                                                        reminder for it).
 *
 * Requires GEMINI_API_KEY in .env (see .env.example). This is a free API
 * key from Google AI Studio (https://aistudio.google.com/apikey) — just a
 * Google account, no credit card, no billing setup.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

const MESSAGES_DIR = path.join(process.cwd(), "src/messages");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");

/** Display names for locales this project already knows about, so a plain `npm run translate` resync doesn't require re-typing them. */
const KNOWN_LANGUAGES: Record<string, { name: string; native: string }> = {
  id: { name: "Indonesian", native: "Bahasa Indonesia" },
  hi: { name: "Hindi", native: "हिन्दी" },
  ur: { name: "Urdu", native: "اردو" },
  fa: { name: "Persian", native: "فارسی" },
  ne: { name: "Nepali", native: "नेपाली" },
  bn: { name: "Bengali", native: "বাংলা" },
  zh: { name: "Chinese", native: "中文" },
  ms: { name: "Malay", native: "Bahasa Melayu" },
};

type Target = { code: string; name: string; native: string; rtl: boolean };

function usageAndExit(): never {
  console.error(
    [
      "Usage:",
      "  npm run translate                              # resync every existing locale from en.json",
      '  npm run translate -- <code> "<Name>" "<Native>" [--rtl]   # add/regenerate one locale',
      "",
      'Example: npm run translate -- ja "Japanese" "日本語"',
    ].join("\n")
  );
  process.exit(1);
}

function collectKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  if (Array.isArray(value)) {
    const keys = [prefix + "[]"];
    if (value.length) keys.push(...collectKeys(value[0], prefix + "[]"));
    return keys;
  }
  const keys: string[] = [];
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    keys.push(...collectKeys(v, prefix ? `${prefix}.${k}` : k));
  }
  return keys;
}

function validateStructure(en: unknown, translated: unknown, code: string) {
  const enKeys = new Set(collectKeys(en));
  const gotKeys = new Set(collectKeys(translated));
  const missing = [...enKeys].filter((k) => !gotKeys.has(k));
  const extra = [...gotKeys].filter((k) => !enKeys.has(k));
  if (missing.length || extra.length) {
    throw new Error(
      `Structure mismatch for "${code}" — missing: ${JSON.stringify(missing)}, extra: ${JSON.stringify(extra)}`
    );
  }
}

function buildSystemPrompt(target: Target): string {
  const lines = [
    `You are translating UI copy for the website of PT. Pakindo Impex Perkasa, an Indonesian export/import trading company, from English into ${target.name} (${target.native}).`,
    "",
    "You will be given a JSON object. Translate ONLY the string values into the target language. Preserve the exact structure: the same keys, the same nesting, the same array lengths and order. Do not add, remove, or rename any keys. Numbers (e.g. a \"value\" field holding 8) must stay numbers, completely unchanged. Short numeric-looking strings used as step labels (e.g. \"01\" through \"06\") must stay unchanged.",
    "",
    "Tone: professional, confident, concise international B2B trade register — write the way an actual export/trading company would write its own website in this language, not a literal word-for-word machine translation.",
    "",
    "Rules:",
    '- Keep "PT. Pakindo Impex Perkasa" completely untranslated, everywhere it appears.',
    `- Keep standard trade/business terms as commonly used in ${target.name} business writing where a literal translation would be unnatural or unfamiliar to a buyer: Incoterm, MOQ, FOB, CFR, CIF, and similar.`,
    `- "Areca Nut" — translate naturally if there is a standard local term for areca/betel nut in ${target.name}-speaking trade contexts; otherwise keep "Areca Nut".`,
    "- Do not invent or add any content beyond translating what's given.",
  ];

  if (target.rtl) {
    lines.push(
      "",
      "This is a right-to-left (RTL) language — write natural RTL grammar and word order. No markup is needed; the site's layout already handles text direction."
    );
  }

  lines.push(
    "",
    "Respond with ONLY the translated JSON object. No markdown code fences, no commentary, nothing before or after the JSON."
  );

  return lines.join("\n");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Free-tier Gemini quota is a few requests/minute — retry transient 429/503s with backoff instead of failing the whole run. */
async function generateWithRetry(client: GoogleGenAI, target: Target, contents: string, maxAttempts = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await client.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents,
        config: {
          systemInstruction: buildSystemPrompt(target),
          temperature: 0.2,
          maxOutputTokens: 16000,
          responseMimeType: "application/json",
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // A per-day quota won't reset within this run's timeframe — retrying with a
      // short backoff just wastes the little quota that might remain. Fail fast.
      if (/PerDay/.test(message)) {
        throw new Error(
          `Daily free-tier Gemini quota exhausted. Wait until it resets (usually ~24h) or use a different GEMINI_API_KEY. Original error: ${message}`
        );
      }

      const isRetryable = /"code":\s*(429|503)/.test(message) || /RESOURCE_EXHAUSTED|UNAVAILABLE/.test(message);
      if (!isRetryable || attempt === maxAttempts) throw error;

      const retryDelayMatch = message.match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
      const waitMs = retryDelayMatch ? Math.ceil(parseFloat(retryDelayMatch[1]) * 1000) + 1000 : attempt * 15000;
      process.stdout.write(`rate limited, retrying in ${Math.round(waitMs / 1000)}s (attempt ${attempt}/${maxAttempts})... `);
      await sleep(waitMs);
    }
  }
  throw new Error("unreachable");
}

async function translateLocale(client: GoogleGenAI, en: unknown, target: Target) {
  const response = await generateWithRetry(client, target, JSON.stringify(en));

  const text = response.text;
  if (!text) throw new Error(`No text response from Gemini for "${target.code}"`);

  let raw = text.trim();
  raw = raw.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const dumpPath = path.join(process.cwd(), `.translate-debug-${target.code}.txt`);
    fs.writeFileSync(dumpPath, raw, "utf8");
    throw new Error(
      `Could not parse the translated JSON for "${target.code}". Raw response saved to ${dumpPath} for inspection.`
    );
  }

  validateStructure(en, parsed, target.code);
  return parsed;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "Missing GEMINI_API_KEY. Get a free key at https://aistudio.google.com/apikey (just a Google account, no credit card) and add it to your .env file (see .env.example) before running this script."
    );
    process.exit(1);
  }

  const rawArgs = process.argv.slice(2);
  const rtl = rawArgs.includes("--rtl");
  const args = rawArgs.filter((a) => a !== "--rtl");

  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let targets: Target[];
  let isNewLocaleMode = false;

  if (args.length === 0) {
    targets = fs
      .readdirSync(MESSAGES_DIR)
      .filter((f) => f.endsWith(".json") && f !== "en.json")
      .map((f) => {
        const code = f.replace(/\.json$/, "");
        const known = KNOWN_LANGUAGES[code];
        return { code, name: known?.name ?? code, native: known?.native ?? code, rtl: code === "ur" || code === "fa" };
      });

    if (targets.length === 0) {
      console.log('No existing locale files to resync yet. Add one with:\n  npm run translate -- <code> "<Name>" "<Native name>"');
      return;
    }
    console.log(`Resyncing ${targets.length} locale(s) from en.json: ${targets.map((t) => t.code).join(", ")}\n`);
  } else {
    const [code, name, native] = args;
    if (!code || !name || !native) usageAndExit();
    if (!/^[a-z]{2,3}$/.test(code)) {
      console.error('Locale code should be 2-3 lowercase letters, e.g. "ja" or "zh".');
      process.exit(1);
    }
    targets = [{ code, name, native, rtl }];
    isNewLocaleMode = true;
  }

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    // Free-tier Gemini quota is a handful of requests/minute — space requests out
    // proactively so most runs don't need to fall back on generateWithRetry's backoff.
    if (i > 0) await sleep(13000);

    process.stdout.write(`Translating -> ${target.code} (${target.name})... `);
    try {
      const translated = await translateLocale(client, en, target);
      const outPath = path.join(MESSAGES_DIR, `${target.code}.json`);
      fs.writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n", "utf8");
      console.log(`done -> ${path.relative(process.cwd(), outPath)}`);
    } catch (error) {
      console.log("FAILED");
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }

  if (isNewLocaleMode && process.exitCode !== 1) {
    const t = targets[0];
    console.log("\nNew locale generated. To wire it into the site, edit src/i18n/routing.ts:");
    console.log(`  1. Add "${t.code}" to the "locales" array.`);
    console.log(`  2. Add to "localeLabels":  ${t.code}: { name: "${t.name}", nativeName: "${t.native}" },`);
    if (t.rtl) console.log(`  3. Add "${t.code}" to the "rtlLocales" Set.`);
    console.log('  4. (Optional) Add an entry to "marketCountries" if it should appear in the Country/Language switcher.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
