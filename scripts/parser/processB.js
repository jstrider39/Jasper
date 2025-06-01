// processB.js
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = resolve(__dirname, "example.txt");
const PATTERN_FILE = resolve(__dirname, "patterns.json");

function indexToPosition(text, index) {
  const lines = text.slice(0, index).split("\n");
  const row = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { row, column };
}

async function ProcessB() {
  const text = await fs.readFile(INPUT_FILE, "utf-8");
  const patternData = JSON.parse(await fs.readFile(PATTERN_FILE, "utf-8"));

  const patterns = patternData.sort((a, b) => b.pattern.length - a.pattern.length);

  const matchedIndices = new Set();

  for (const { pattern, type } of patterns) {
    let idx = 0;
    while ((idx = text.indexOf(pattern, idx)) !== -1) {
      const end = idx + pattern.length;

      let overlap = false;
      for (let i = idx; i < end; i++) {
        if (matchedIndices.has(i)) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        const { row, column } = indexToPosition(text, idx);
        console.log(`🔍 Matched "${pattern}" (${type}) at row ${row}, column ${column}`);

        for (let i = idx; i < end; i++) {
          matchedIndices.add(i);
        }
      }

      idx += pattern.length;
    }
  }
}

ProcessB().catch(console.error);
