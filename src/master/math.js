import master from "../master";

export class MathOp {
  constructor(set, get) {
    this.set = set;
    this.get = get;
  }

  add(a, b) {
    master.utils.logIt();
    return a + b;
  }
}
