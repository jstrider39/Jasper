// list-files.mjs
import { readdir } from "fs/promises";
import { join, resolve } from "path";
import { stat } from "fs/promises";

const listFiles = async (dirPath) => {
  const fullDirPath = resolve(dirPath);
  try {
    const entries = await readdir(fullDirPath);
    for (const entry of entries) {
      const fullPath = join(fullDirPath, entry);
      const entryStat = await stat(fullPath);
      if (entryStat.isFile()) {
        console.log(fullPath);
      }
    }
  } catch (err) {
    console.error(`❌ Error reading directory: ${err.message}`);
  }
};

// Get directory path from command line arguments
const dir = process.argv[2];
if (!dir) {
  console.error("❌ Please provide a directory path.");
  process.exit(1);
}

await listFiles(dir);
