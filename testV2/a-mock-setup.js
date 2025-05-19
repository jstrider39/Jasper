// J:\dev\Jasper\testV2\a-mock-setup.js
import { registerMock } from "./a-mock-registry.js";

const mockUrl = new URL("./my-module.js", import.meta.url).href;
console.log("[MockSetup] Registering mock for:", mockUrl);
registerMock(mockUrl, {
  default: {
    hello: () => "Mocked Hello!",
  },
  myGotoStore: (count) => `Mocked GotoStore! ${count}`,
});
