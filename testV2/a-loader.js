// J:\dev\Jasper\testV2\a-loader.js
import { getMock } from "./a-mock-registry.js";
import { Module, createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { registerMock } from "./a-mock-registry.js";

// Register mock here directly
const mockUrl = new URL("./my-module.js", import.meta.url).href;
console.log("[Loader] Registering mock for:", mockUrl);
registerMock(mockUrl, {
  default: {
    hello: () => "Mocked Hello!",
  },
  myGotoStore: (count) => `Mocked GotoStore! ${count}`,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  const resolved = await nextResolve(specifier, context);
  console.log(`[Loader] Resolve: ${specifier} -> ${resolved.url}`);
  const mock = getMock(resolved.url);
  if (mock) {
    console.log(`[Loader] Mock found for: ${resolved.url}`);
    return {
      url: resolved.url,
      format: "module",
      shortCircuit: true,
    };
  } else {
    console.log(`[Loader] No mock found for: ${resolved.url}`);
  }
  return resolved;
}

export async function load(url, context, nextLoad) {
  const mock = getMock(url);
  if (mock) {
    console.log(`[Loader] Mock found for: ${url}`);

    // Generate source code for default and named exports
    const exportStatements = [];
    for (const [key, value] of Object.entries(mock)) {
      if (key === "default") {
        const defaultProps = Object.entries(value).map(([prop, val]) => {
          if (typeof val === "function") {
            return `${prop}: ${val.toString()}`;
          }
          return `${prop}: ${JSON.stringify(val)}`;
        });
        exportStatements.push(`export default { ${defaultProps.join(", ")} };`);
      } else {
        if (typeof value === "function") {
          exportStatements.push(`export const ${key} = ${value.toString()};`);
        } else {
          exportStatements.push(`export const ${key} = ${JSON.stringify(value)};`);
        }
      }
    }

    const source = exportStatements.join("\n");
    return {
      format: "module",
      source,
      shortCircuit: true,
    };
  } else {
    console.log(`[Loader] No mock found for: ${url}`);
  }
  return nextLoad(url, context);
}
