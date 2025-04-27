import { MathOp } from "./master/math";
import { Utils } from "./master/utils";
import UtilsJsx from "./utilsJsx";
import { TakeANumber } from "./TakeANumber";

export class Master {
  constructor() {}
  /** @type {MathOp} */
  mathOp;

  /** @type {Utils} */
  utils;

  /** @type {UtilsJsx} */
  utilsJsx;

  init(set, get) {
    this.mathOp = new MathOp(set, get);
    this.utils = new Utils(set, get);
    this.utilsJsx = new UtilsJsx(set, get);
  }

  get nextPositive() {
    return TakeANumber.NextPositive;
  }
  get nextNegative() {
    return TakeANumber.NextNegative;
  }
}

// const master = new Master();
// master.init();
// export default master;
