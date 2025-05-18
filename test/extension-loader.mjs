import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { mock } from "node:test";

// Store mock implementations
const mocks = new Map();

// Function to register a mock for a specific module
export function registerMock(modulePath, mockImplementation) {
  mocks.set(path.resolve(modulePath), mockImplementation);
}

export async function resolve(specifier, context, nextResolve) {
  // Add debugging
  console.log(`From parent: ${context.parentURL || "no parent"} trying to resolve: ${specifier} `);

  // Handle relative or absolute paths
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.includes(":")) {
    // Get parent directory if available
    const parentURL = context.parentURL ? new URL(".", context.parentURL) : null;
    const parentPath = parentURL ? fileURLToPath(parentURL) : process.cwd();

    // Resolve path relative to parent
    let resolvedPath = path.resolve(parentPath, specifier);

    // Check for mocks first
    if (mocks.has(resolvedPath) || mocks.has(resolvedPath + ".js")) {
      // Create a virtual URL for the mock
      const mockUrl = `mock:${resolvedPath}`;
      return { url: mockUrl };
    }

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

export async function load(url, context, nextLoad) {
  // Check if this is a mock URL
  if (url.startsWith("mock:")) {
    const modulePath = url.substring(5); // Remove 'mock:' prefix
    const mockedModule = mocks.get(modulePath) || mocks.get(modulePath + ".js");

    // Convert the mock to ESM format
    const source = `
      export default ${JSON.stringify(mockedModule)};
      ${Object.keys(mockedModule)
        .map((key) => `export const ${key} = ${JSON.stringify(mockedModule[key])};`)
        .join("\n")}
    `;

    return {
      format: "module",
      source,
      shortCircuit: true,
    };
  }

  // Normal loading process
  return nextLoad(url, context);
}
