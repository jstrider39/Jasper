import { Master } from "./master";

let masterInstance = new Master();
export function slice(set, get) {
  masterInstance.init(set, get);
  return {
    master: null,
  };
}

/** @type {Master} */
export const master = masterInstance;
