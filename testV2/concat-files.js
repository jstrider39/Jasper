import { readFileSync } from "fs";

export function readAndLogFiles(pathsString) {
  // Split the input string by newlines to get individual file paths
  const filePaths = pathsString
    .split(/\r?\n/)
    .filter((path) => path.trim() !== "")
    .map((item) => item.trim());
  //console.log(Array.isArray(filePaths), filePaths.length, filePaths[0]); // Log the full path file name

  // Process each file path
  filePaths.forEach((filePath) => {
    try {
      //console.log("////", typeof filePath, filePath.length); // Log the full path file name

      // Read the file content
      const fileContent = readFileSync(filePath, "utf8");

      // Log the file path followed by its contents
      console.log("////" + filePath); // Log the full path file name
      console.log(fileContent); // Log the contents of the file
    } catch (error) {
      // Handle any errors that occur while reading files
      console.error(`Error reading file ${filePath}: ${error.message}`);
    }
  });
}

// Example usage:
// readAndLogFiles('/path/to/file1.txt\\n/path/to/file2.txt\\n/path/to/file3.txt');

// const files = `
// J:\\dev\\Jasper\\testV2\\a-loader.js
// J:\\dev\\Jasper\\testV2\\a-mock-registry.js
// J:\\dev\\Jasper\\testV2\\a-mock-setup.js
// J:\\dev\\Jasper\\testV2\\a-setup.js
// J:\\dev\\Jasper\\testV2\\app.js
// J:\\dev\\Jasper\\testV2\\my-module.js
// `;

let files = `
J:\\dev\\Jasper\\server\\src\\index.js
J:\\dev\\Jasper\\server\\src\\routes\\files.js
`;

readAndLogFiles(files);
