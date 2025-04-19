import { MathOp } from "./master/math";

export class Master {
  constructor(set, get) {
    this.set = set;
    this.get = get;
  }
  /** @type {MathOp} */
  mathOp;

  init() {
    this.mathOp = new MathOp(this.set, this.get);
  }
}

const master = new Master();
master.init();
export default master;
