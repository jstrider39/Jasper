import { MathOp } from "./master/math";
import { Utils } from "./master/utils";

export class Master {
  constructor(set, get) {
    this.set = set;
    this.get = get;
  }
  /** @type {MathOp} */
  mathOp;

  /** @type {Utils} */
  utils;

  init() {
    this.mathOp = new MathOp(this.set, this.get);
    this.utils = new Utils(this.set, this.get);
  }
}

const master = new Master();
master.init();
export default master;
