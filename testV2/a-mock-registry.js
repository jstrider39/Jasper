console.log("[MockRegistry] **************** Module instance:", import.meta.url);

// a-mock-registry.js
globalThis.__mockRegistry__ ??= new Map();
//console.log("[MockRegistry] **************** Module instance:", globalThis.__mockRegistry__.size);

const ENABLE_LOGGING = true;

function log(message, ...data) {
  if (ENABLE_LOGGING) {
    console.log(`[MockSystem] ${message}`, ...data);
  }
}

export function registerMock(specifier, mockModule) {
  const normalized = new URL(specifier).href;
  globalThis.__mockRegistry__.set(normalized, mockModule);
  log(
    `[MockRegistry]  **************** Registered mock for "${normalized} (${globalThis.__mockRegistry__.size})"`,
    mockModule
  );
}

export function getMock(specifier) {
  const normalized = new URL(specifier).href;
  const mock = globalThis.__mockRegistry__.get(normalized);
  if (mock) {
    log(`Retrieved mock for "${normalized}"`, mock);
  } else {
    log(`Mock---not found for V2 "${normalized}"`, globalThis.__mockRegistry__.size);
    log(`Current mocks: ${[...globalThis.__mockRegistry__.keys()].join(", ")}`);
  }
  return mock;
}

export function clearMocks() {
  const count = globalThis.__mockRegistry__.size;
  globalThis.__mockRegistry__.clear();
  log(`Cleared ${count} mock(s)`);
}
