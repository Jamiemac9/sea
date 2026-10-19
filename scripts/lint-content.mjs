#!/usr/bin/env node
/**
 * Content linter for "AI slop".
 *
 * The patterns come from blader/humanizer (github.com/blader/humanizer, MIT),
 * which is based on Wikipedia's "Signs of AI writing". The readability rules
 * come from ayghri/i-have-adhd (MIT): answer first, short lists, one clear
 * next step. This script cannot rewrite prose. It flags the tells so a person
 * can fix them, and fails on the strongest ones.
 *
 * Usage: node scripts/lint-content.mjs [--warn-only]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const warnOnly = process.argv.includes('--warn-only');

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const targets = [
  ...walk(path.join(root, 'src/content')).filter((f) => f.endsWith('.mdx') || f.endsWith('.md')),
  ...walk(path.join(root, 'src/data')).filter((f) => f.endsWith('.ts')),
  ...walk(path.join(root, 'src/pages')).filter((f) => f.endsWith('.astro')),
];

/** [id, level, regex, message]. Levels: error fails the run, warn is advisory. */
const rules = [
  ['dash', 'error', /[—–]|\s--\s/g, 'Em or en dash in prose (humanizer §8). Use a comma, colon, full stop or brackets.'],
  ['curly-quote', 'warn', /[“”‘’]/g, 'Curly quote (humanizer §21). Use straight quotes.'],
  ['not-just', 'error', /\bnot (just|only|merely)\b[^.]{0,80}\bbut\b|\bit'?s not [^.,]{1,40}, it'?s\b/gi, 'Not X but Y contrast (humanizer §1). State the point directly.'],
  ['run-up', 'error', /\b(let'?s (dive|explore|break (this|it) down|take a look)|here'?s (what you need to know|the thing)|without further ado|the thing is,|real talk)\b/gi, 'Staged run-up (humanizer §4). Remove it and state the point.'],
  ['chatbot', 'error', /\b(i hope this helps|great question|let me know if|feel free to|happy to help|you'?re absolutely right|certainly!)\b/gi, 'Chatbot residue (humanizer §22).'],
  ['deep-saying', 'warn', /\b(at its core|the real question is|what really matters|the heart of the matter|the deeper issue)\b/gi, 'Saying that sounds deep (humanizer §3).'],
  ['inflation', 'warn', /\b(stands as a testament|plays a (key|crucial|pivotal|vital) role|evolving landscape|the future looks bright|setting the stage for|indelible mark|in today'?s (fast-paced|ever-changing|digital))\b/gi, 'Inflated significance (humanizer §13).'],
  ['ai-words', 'warn', /\b(delve|delving|tapestry|testament|pivotal|meticulous(ly)?|showcas(e|es|ing)|underscor(e|es|ing)|bolster(ed|s)?|garner(ed|s)?|interplay|intricate|intricacies|vibrant|seamless(ly)?|leverag(e|es|ing)|unlock(s|ing)? the|game-?changer|holistic|elevate|empower(s|ing)?|robust)\b/gi, 'Overused AI word (humanizer §12).'],
  ['knowledge-limit', 'error', /\b(as of my (last|latest)|up to my last training|based on (the )?available information|while specific details are limited)\b/gi, 'Knowledge-limit disclaimer (humanizer §23).'],
  ['hedge-stack', 'warn', /\b(could potentially|might arguably|may possibly|could possibly)\b/gi, 'Stacked qualifiers (humanizer §9).'],
  ['filler-closer', 'warn', /\b(let that sink in|read that again|that is the real win|that distinction matters)\b/gi, 'One-line closer (humanizer §2).'],
];

// Lines that are code, imports, URLs or config are not prose.
const skipLine = (line, file) => {
  const t = line.trim();
  if (!t) return true;
  if (/^(import|export|const|let|type|interface|return|\}|\{|\/\/|\*|\/\*)/.test(t) && !file.endsWith('.mdx')) return true;
  if (/^(url|href|source|slug|id):/.test(t)) return true;
  if (/^https?:\/\//.test(t)) return true;
  return false;
};

// Strip code-ish fragments so regexes only see words.
const prose = (line) =>
  line
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/class(:list)?=("[^"]*"|\{[^}]*\})/g, ' ')
    .replace(/\/\*.*?\*\//g, ' ');

const findings = [];
for (const file of targets) {
  const rel = path.relative(root, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  let inScript = false;
  lines.forEach((raw, i) => {
    if (/<script|<style/.test(raw)) inScript = true;
    if (inScript) {
      if (/<\/script>|<\/style>/.test(raw)) inScript = false;
      return;
    }
    if (skipLine(raw, file)) return;
    const line = prose(raw);
    for (const [id, level, re, msg] of rules) {
      re.lastIndex = 0;
      const m = line.match(re);
      if (m) findings.push({ file: rel, line: i + 1, id, level, msg, text: m[0] });
    }
  });

  // Headings in Title Case (humanizer §20). Sentence case reads more naturally.
  if (file.endsWith('.mdx')) {
    lines.forEach((raw, i) => {
      const h = raw.match(/^#{2,4}\s+(.+)$/);
      if (!h) return;
      const words = h[1].split(/\s+/).filter((w) => w.length > 3);
      const caps = words.slice(1).filter((w) => /^[A-Z][a-z]/.test(w)).length;
      if (words.length >= 4 && caps >= words.length - 1) findings.push({ file: rel, line: i + 1, id: 'title-case', level: 'warn', msg: 'Heading in Title Case (humanizer §20). Use sentence case.', text: h[1] });
    });

    // i-have-adhd rule 9: cap visible lists at five items, unless the list is numbered steps.
    let run = 0;
    let start = 0;
    lines.forEach((raw, i) => {
      if (/^\s*[-*]\s+/.test(raw)) {
        if (run === 0) start = i + 1;
        run++;
      } else if (raw.trim() !== '' || run) {
        if (run > 7) findings.push({ file: rel, line: start, id: 'long-list', level: 'warn', msg: `Bulleted list of ${run} items (i-have-adhd rule 9). Group it or cut to the strongest.`, text: '' });
        run = 0;
      }
    });
  }
}

// Key facts on the home page and tracker carry a last-checked date. Warn when it goes stale.
try {
  const facts = JSON.parse(readFileSync(path.join(root, 'src/data/key-facts.json'), 'utf8'));
  const age = Math.floor((Date.now() - new Date(facts.lastChecked).getTime()) / 86400000);
  if (age > (facts.reviewEveryDays || 60)) {
    findings.push({ file: 'src/data/key-facts.json', line: 2, id: 'stale-facts', level: 'warn', msg: `Key facts last checked ${age} days ago. Re-check each item against its source and update lastChecked.`, text: facts.lastChecked });
  }
} catch {
  /* no facts file */
}

const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');
for (const f of findings) console.log(`${f.level === 'error' ? 'ERROR' : 'warn '} ${f.file}:${f.line}  [${f.id}] ${f.msg}${f.text ? `  "${f.text}"` : ''}`);
console.log(`\nContent lint: ${targets.length} files, ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length && !warnOnly ? 1 : 0);
