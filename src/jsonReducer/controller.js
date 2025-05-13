export class Controller {
  constructor() {}

  init(set, get) {
    this.set = set;
    this.get = get;
    this._step1Text;
  }

  setStep1Text = (text) => {
    this._step1Text = text;
  };

  _trigger() {
    this.setTrigger((t) => !t);
  }

  setTrigger(setTrigger) {
    this.setTrigger = setTrigger;
  }

  setSteps(...callBacks) {
    this._callBacks = [...callBacks];
    this._callBacksLessOne = this._callBacks.length - 1;
  }

  continue(_currStep) {
    if (_currStep >= this._callBacksLessOne) {
      _currStep = -1;
    }
    this._callBacks[++_currStep]();
    //console.log("next", this._nextStep);
  }
}
