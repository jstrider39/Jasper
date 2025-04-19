
node test\bin\testrunner.js

node --experimental-loader=./extension-loader.mjs test\bin\testrunner.js



file:///J:/dev/Jasper/extension-loader.mjs:34
export { load, getFormat, transformSource, getGlobalPreloadCode } from "node:module";
         ^^^^
SyntaxError: The requested module 'node:module' does not provide an export named 'load'