// First import the setup to register mocks
import "../setup-mocks";

import master from "../src/master";
import { describe, it, expect } from "./bin/testrunner";

describe("Math", () => {
  it("adds numbers", () => {
    expect(master.mathOp.add(2, 4)).toBe(6);
  });

  // it.only("subtracts numbers", () => {
  //   expect(5 - 3).toBe(2);
  // });
});

// // Check if a file path is provided as an argument
// const args = process.argv.slice(2);
// const testPath = args[0] || "./test"; // Default to './test' directory
// run(testPath);
//run();
