const myModule = await import("./my-module.js");

console.log("[App] Imported module:", myModule);
console.log(typeof myModule.default);
console.log(typeof myModule.default.hello);
console.log(myModule.default.hello);
console.log(myModule.default.hello());
