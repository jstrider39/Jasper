// processA.js
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DISCRIMINATOR_MAP = {
  "#": "heading1",
  "##": "heading2",
  "###": "heading3",
  "*": "italic",
  "**": "bold",
  "***": "bold+italic",
  "-": "list",
  "`": "inlineCode",
  "```": "codeBlock",
  ">": "blockquote",
  _: "italic",
  __: "bold",
  "~": "strikethrough",
  "~~": "strikethrough",
};

async function ProcessA() {
  const mdFilePath = resolve(__dirname, "example.txt");
  const outputPatternFile = resolve(__dirname, "patterns.json");

  const text = await fs.readFile(mdFilePath, "utf-8");
  const foundPatterns = new Set();

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let j = i + 1;
    while (text[j] === char) j++; // repeat run of same char
    const sequence = text.slice(i, j);

    if (DISCRIMINATOR_MAP[sequence]) {
      foundPatterns.add(sequence);
    }

    i = j - 1;
  }

  const patternArray = [...foundPatterns].map((pattern) => ({
    pattern,
    type: DISCRIMINATOR_MAP[pattern],
  }));

  await fs.writeFile(outputPatternFile, JSON.stringify(patternArray, null, 2));
  console.log(`✅ Pattern file saved to ${outputPatternFile}`);
}

ProcessA().catch(console.error);
