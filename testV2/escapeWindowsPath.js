// path-utils.js
export function escapeWindowsPath(path) {
  // Replace single backslashes with double backslashes
  return path.replace(/\\/g, "\\\\");
}

export async function copyToWindowsClipboard(text) {
  const { execSync } = await import("child_process");
  const { writeFileSync, unlinkSync } = await import("fs");
  const { tmpdir } = await import("os");
  const tempFile = tmpdir() + "\\text-to-clipboard.txt";

  try {
    // Write the text to temporary file
    writeFileSync(tempFile, text);

    // Use type to send to clip (Windows clipboard utility)
    execSync(`type "${tempFile}" | clip`);

    // Clean up
    unlinkSync(tempFile);

    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error.message);
    return false;
  }
}

// main.js
//import { escapeWindowsPath, copyToWindowsClipboard } from "./path-utils.js";

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  const inputPath = args[0];
  const escapedPath = escapeWindowsPath(inputPath);

  // Use the clipboard function
  const success = await copyToWindowsClipboard(escapedPath);

  console.log(`Original path: ${inputPath}`);
  console.log(`Escaped path: ${escapedPath}`);

  if (success) {
    console.log("The escaped path has been copied to clipboard!");
  } else {
    console.log("Failed to copy to clipboard. You can manually copy the escaped path above.");
  }
} else {
  console.log("Please provide a file path as an argument");
}
