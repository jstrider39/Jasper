import { Master } from "./master";

let masterInstance = new Master();
export function masterSlice(set, get) {
  masterInstance.init(set, get);
  return {
    master: null,
  };
}

/** @type {Master} */
export const master = masterInstance;
