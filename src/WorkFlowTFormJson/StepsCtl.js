export class Steps {
  constructor() {}

  init(set, get) {
    this.set = set;
    this.get = get;
    this.reset();
  }

  reset() {
    this._currStep = 0;
    this.clickCounter = 0;
  }

  _trigger() {
    this.setTrigger((t) => !t);
  }

  setTrigger(setTrigger) {
    this.setTrigger = setTrigger;
  }

  setSteps(...callBacks) {
    this._callBacks = callBacks;
  }

  continue() {
    if (this._currStep === this._callBacks.length) {
      this._currStep = 0;
    }
    //debugger;
    this._callBacks[this._currStep++]();
  }

  click(evt) {
    this.clickCounter++;
    console.log("CLICKED: ", this.clickCounter);
    this.continue();
    this._trigger();
  }
}
