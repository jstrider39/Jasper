export class TakeANumber {
  static _posNum = 1;
  static _negNum = -1;
  static get NextPositive() {
    return this._posNum++;
  }
  static get NextNegative() {
    return this._posNum--;
  }
}
