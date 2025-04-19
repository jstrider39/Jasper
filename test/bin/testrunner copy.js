import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const tests = [];
let onlyTests = [];

export function describe(name, fn) {
  fn();
}

export function it(name, fn) {
  tests.push({ name, fn });
}

it.only = function (name, fn) {
  onlyTests.push({ name, fn });
};

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected ${actual} to be falsy`);
      }
    },
  };
}

export async function run(testPath = "./test") {
  const toRun = onlyTests.length > 0 ? onlyTests : tests;

  // If testPath is a directory, scan it for files
  const testFiles = [];
  if (testPath === "./test") {
    const files = readdirSync(testPath).filter((file) => file.endsWith(".test.js"));
    testFiles.push(...files.map((file) => path.join(testPath, file)));
  } else {
    testFiles.push(testPath); // Single file mode
  }

  // Dynamically import and run the test files
  for (const filePath of testFiles) {
    try {
      //console.log(filePath);
      const fileURL = pathToFileURL(path.resolve(filePath));
      //const impFile = fileURLToPath(new URL(path.resolve(filePath), import.meta.url));
      console.log(`Running test file: ${fileURL}`);

      const testModule = await import(fileURL);
      //const testModule = await import(path.resolve(filePath));
      await testModule.run();
    } catch (e) {
      console.error(`Failed to run test from ${filePath}`);
      console.error(e.message);
    }
  }
}

const args = process.argv.slice(2);
const testPath = args[0] || "./test"; // Default to './test' directory

run(testPath);
