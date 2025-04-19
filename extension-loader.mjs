import { resolve as pathResolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

// This function must be named "resolve" to be recognized by Node.js
export async function resolve(specifier, context, nextResolve) {
  // Add debugging here
  console.log(`Trying to resolve: ${specifier}`);
  console.log(`From parent: ${context.parentURL || "no parent"}`);

  // Handle relative or absolute paths
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.includes(":")) {
    // Get parent directory if available
    const parentURL = context.parentURL ? new URL(".", context.parentURL) : null;
    const parentPath = parentURL ? fileURLToPath(parentURL) : process.cwd();

    // Resolve path relative to parent
    let resolvedPath = path.resolve(parentPath, specifier);

    try {
      // Try direct path first
      const stats = await fs.stat(resolvedPath);
      if (stats.isFile()) {
        return nextResolve(pathToFileURL(resolvedPath).href, context);
      }

      if (stats.isDirectory()) {
        // Try index.js in directory
        const indexPath = path.join(resolvedPath, "index.js");
        try {
          const indexStats = await fs.stat(indexPath);
          if (indexStats.isFile()) {
            return nextResolve(pathToFileURL(indexPath).href, context);
          }
        } catch (e) {
          // Index file doesn't exist, continue to other strategies
        }
      }
    } catch (e) {
      // Path doesn't exist, try with extensions
    }

    // Try with .js extension
    if (!resolvedPath.endsWith(".js")) {
      const jsPath = `${resolvedPath}.js`;
      try {
        const stats = await fs.stat(jsPath);
        if (stats.isFile()) {
          return nextResolve(pathToFileURL(jsPath).href, context);
        }
      } catch (e) {
        // .js file doesn't exist
      }
    }
  }

  // Default handling
  return nextResolve(specifier, context);
}

// Required for Node.js v16+ custom loaders
export function load(url, context, nextLoad) {
  return nextLoad(url, context);
}
