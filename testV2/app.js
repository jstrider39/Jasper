// J:\dev\Jasper\testV2\app.js
const myModule = await import("./my-module.js");

console.log("[App] Imported module:", myModule);
console.log(myModule.default.hello());
console.log(myModule.myGotoStore(22)); // Should now return "Mocked GotoStore! 22"
