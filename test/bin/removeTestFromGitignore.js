import fs from "fs";
import path from "path";

/**
 * Removes the /test line from the .gitignore file if it exists.
 */
export function removeTestFromGitignore() {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore"); // Get the .gitignore file path in the current directory

  // Check if the .gitignore file exists
  if (fs.existsSync(gitignorePath)) {
    // Read the contents of .gitignore
    const fileContent = fs.readFileSync(gitignorePath, "utf-8");

    // Remove the '/test' line from the content
    const updatedContent = fileContent
      .split("\n")
      .filter((line) => line.trim() !== "/test") // Remove lines with '/test'
      .join("\n");

    // Save the updated content back to .gitignore
    fs.writeFileSync(gitignorePath, updatedContent, "utf-8");
    console.log('Successfully removed "/test" entry from .gitignore');
  } else {
    console.log(".gitignore file not found in the current directory");
  }
}
