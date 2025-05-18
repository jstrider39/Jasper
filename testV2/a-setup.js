import { register } from "module";

register(new URL("./a-loader.js", import.meta.url).href, import.meta.url);
