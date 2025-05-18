import { existsSync, statSync, readdirSync } from "fs";
import { join } from "path";

export function logFilesInDirectory(directoryPath) {
  try {
    // Check if directory exists
    if (!existsSync(directoryPath)) {
      console.error(`Directory does not exist: ${directoryPath}`);
      return;
    }

    // Check if path is actually a directory
    const stats = statSync(directoryPath);
    if (!stats.isDirectory()) {
      console.error(`Path is not a directory: ${directoryPath}`);
      return;
    }

    // Read all files in the directory
    const files = readdirSync(directoryPath);

    // Log the full path of each file
    files.forEach((file) => {
      const fullPath = join(directoryPath, file);
      console.log(fullPath);
    });
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}: ${error.message}`);
  }
}

// Example usage:
logFilesInDirectory("J:\\dev\\Jasper\\testV2");
