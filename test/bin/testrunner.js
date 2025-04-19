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

// Execute the registered tests
async function executeTests() {
  const toRun = onlyTests.length > 0 ? onlyTests : tests;
  console.log(`Running ${toRun.length} tests...`);

  let passed = 0;
  let failed = 0;

  for (const test of toRun) {
    try {
      await test.fn();
      console.log(`✓ ${test.name}`);
      passed++;
    } catch (error) {
      console.error(`✗ ${test.name}`);
      console.error(`  ${error.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  // Reset test arrays for next run
  tests.length = 0;
  onlyTests.length = 0;
}

export async function run(testPath = "./test") {
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
      const fileURL = pathToFileURL(path.resolve(filePath));
      console.log(`Loading test file: ${fileURL}`);

      // Import the test file - this will register tests via describe/it
      await import(fileURL);

      // After importing, run the registered tests
      await executeTests();
    } catch (e) {
      console.error(`Failed to run test from ${filePath}`);
      console.error(e.message);
    }
  }
}

const args = process.argv.slice(2);
const testPath = args[0] || "./test"; // Default to './test' directory

run(testPath);
