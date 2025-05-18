import { getMock } from "./a-mock-registry.js";
import { Module, createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { registerMock } from "./a-mock-registry.js";

// Register mock here directly — now it's in the same context as getMock()
const mockUrl = new URL("./my-module.js", import.meta.url).href;
console.log("[Loader] Registering mock for:", mockUrl);
registerMock(mockUrl, {
  hello: () => "Mocked Hello!",
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

    // Generate actual JS source code, not a JSON string
    const exportedProps = Object.entries(mock).map(([key, value]) => {
      if (typeof value === "function") {
        return `${key}: ${value.toString()}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    });

    const source = `export default { ${exportedProps.join(", ")} };`;

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
