// Worst Fix Ever: Funniest Commit Message
// make.fun bounty: u-deysumbrella-worst-fix-ever-funniest-commit-message-3f1d9722
//
// Writes ONE commit message to /output/entry.txt — a fix that backfired.
// Pure Node.js, no dependencies, no network, no git history, no secrets.
// Run: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "fix(auth): cached user profiles; now blazing fast and everyone is Dave";

const OUT_PATH = "/output/entry.txt";

// --- Gate guards (the sealed scorer requires UTF-8, 1-100 chars, one line) ---

const chars = [...LINE]; // code points, not UTF-16 units
if (chars.length < 1 || chars.length > 100) {
  throw new Error(`gate FAIL: char count ${chars.length} outside 1-100`);
}
if (LINE.trim().length === 0) {
  throw new Error("gate FAIL: line is blank / whitespace only");
}
if (/[\n\r]/.test(LINE)) {
  throw new Error("gate FAIL: line contains a newline or carriage return");
}
// Invisible control / zero-width characters must never sneak in.
if (/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/.test(LINE)) {
  throw new Error("gate FAIL: line contains a control or zero-width character");
}
// Invisible bidi controls / line & paragraph separators break one-line display.
if (/[\u2028\u2029\u202A-\u202E\u2060\u00AD]/.test(LINE)) {
  throw new Error("gate FAIL: line contains a bidi-control or separator character");
}
// No leading / trailing whitespace: a padded line still "looks" right.
if (LINE !== LINE.trim()) {
  throw new Error("gate FAIL: line has leading or trailing whitespace");
}
// UTF-8 round-trip: the bytes written must decode back to exactly this line.
if (Buffer.from(LINE, "utf8").toString("utf8") !== LINE) {
  throw new Error("gate FAIL: line fails UTF-8 round-trip");
}

// --- Write (no trailing newline: the entry is exactly one line) ---

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, LINE, "utf8");

// --- Read back and verify byte-identical output ---

const back = readFileSync(OUT_PATH, "utf8");
if (back !== LINE) {
  throw new Error("gate FAIL: /output/entry.txt does not match the line byte-for-byte");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("gate FAIL: byte length mismatch on read-back");
}

console.log(`gate PASS: ${chars.length} chars, ${Buffer.byteLength(LINE, "utf8")} bytes, single line`);
console.log(`wrote ${OUT_PATH}: ${LINE}`);
