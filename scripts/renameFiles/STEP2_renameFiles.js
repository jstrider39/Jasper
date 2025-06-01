import { rename, access } from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { constants } from "fs";

class FileRenamer {
  constructor() {
    this._dirname = dirname(fileURLToPath(import.meta.url));
  }

  /**
   * Audits source paths to ensure all files exist before renaming
   * @param {string[]} sourcePaths - Array of source file paths
   * @returns {Promise<void>} - Resolves if all files exist, throws exception otherwise
   */
  async _initialAudit(sourcePaths) {
    const missingFiles = [];

    // Check each source file for existence
    for (const path of sourcePaths) {
      try {
        await access(path, constants.F_OK);
      } catch (error) {
        missingFiles.push({ path, error: error.message });
      }
    }

    // If any files are missing, throw exception with details
    if (missingFiles.length > 0) {
      const errorMsg =
        `[AUDIT FAILED] ${missingFiles.length} source file(s) not found:\n` +
        missingFiles.map((file, i) => `  ${i + 1}. ${file.path}`).join("\n");

      // Create a custom error with additional data
      const error = new Error(errorMsg);
      error.missingFiles = missingFiles;
      console.error(errorMsg); // Console log the audit failure message
      throw error; // This will halt the _renameFiles method
    }

    console.log(`✓ All ${sourcePaths.length} source files verified`);
  }

  /**
   * Renames files based on source and destination paths
   * @param {string} sourcePaths - Multiline string with source file paths
   * @param {string} destPaths - Multiline string with destination file paths
   * @returns {Promise<Array>} - Results of rename operations
   */
  async _renameFiles(sourcePaths, destPaths) {
    // Parse multiline strings into arrays of trimmed paths
    // Parse multiline strings into arrays of trimmed paths
    const sourceFiles = sourcePaths
      .trim()
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter((file) => file.length > 0); // Filter out empty lines
    const destFiles = destPaths
      .trim()
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter((file) => file.length > 0);

    // Validate input
    if (sourceFiles.length !== destFiles.length) {
      throw new Error("Source and destination file lists must have the same number of entries");
    }

    // Perform initial audit to ensure all source files exist
    try {
      await this._initialAudit(sourceFiles);
    } catch (auditError) {
      // The _initialAudit function now throws an error with the "[AUDIT FAILED]" message
      // and logs it to the console. This catch block ensures that if the audit fails,
      // the rename process is halted.
      console.error("File renaming process halted due to audit failure.");
      throw auditError; // Re-throw the error to stop further execution in the caller
    }

    const results = [];

    // Process each file pair
    for (let i = 0; i < sourceFiles.length; i++) {
      const source = sourceFiles[i];
      const dest = destFiles[i];
      console.log(source, dest);
      try {
        await rename(source, dest);
        results.push({
          success: true,
          source,
          dest,
          message: `Successfully renamed: ${source} → ${dest}`,
        });
        console.log(`✓ Renamed: ${source} → ${dest}`);
      } catch (error) {
        results.push({
          success: false,
          source,
          dest,
          error: error.message,
        });
        console.error(`✗ Failed to rename: ${source} → ${dest}`);
        console.error(`  Error: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Generates and displays a summary of rename operation results
   * @param {Array} results - Results from _renameFiles function
   */
  _displaySummary(results) {
    try {
      console.log("\nSummary:");
      console.log(`Total files: ${results.length}`);
      console.log(`Successful: ${results.filter((r) => r.success).length}`);
      console.log(`Failed: ${results.filter((r) => !r.success).length}`);

      // Add more detailed information if there were failures
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        console.log("\nFailed operations:");
        failures.forEach((failure, index) => {
          console.log(`${index + 1}. ${failure.source} → ${failure.dest}`);
          console.log(`  Error: ${failure.error}`);
        });
      }
    } catch (error) {
      console.error("Error generating summary:", error.message);
    }
  }

  // Public main method
  async main() {
    const files = `
J:\\dev\\Jasper\\server\\src\\rename-files\\file1.txt
J:\\dev\\Jasper\\server\\src\\rename-files\\file2.txt
`;

    const filesRenamed = `
J:\\dev\\Jasper\\server\\src\\rename-files\\a-file1.txt
J:\\dev\\Jasper\\server\\src\\rename-files\\a-file2.txt
`;

    try {
      const results = await this._renameFiles(files, filesRenamed);
      this._displaySummary(results);
    } catch (error) {
      console.error("Error during file renaming process:");
      console.error(error.message);

      // If we have missing files in the error object, we can show them specifically
      if (error.missingFiles) {
        console.error("\nMissing files details:");
        error.missingFiles.forEach((file, i) => {
          console.error(`${i + 1}. ${file.path}`);
          console.error(`  Error: ${file.error}`);
        });
      }

      process.exit(1); // Exit with error code
    }
  }
}

// Instantiate the FileRenamer class
const fileRenamer = new FileRenamer();

// Call the main method
fileRenamer.main();
