import { registerMock } from "./extension-loader.mjs";

// Create a mock Utils class
const mockUtils = {
  Utils: class MockUtils {
    constructor(set, get) {
      this.set = set;
      this.get = get;
    }

    // Add mock methods here
    someUtilMethod() {
      return "mocked result";
    }
  },
};

// Register the mock for the Utils module
registerMock("./src/master/utils", mockUtils);
console.log("registerMock(./src/master/utils");

// Export for use in tests
export { mockUtils };
