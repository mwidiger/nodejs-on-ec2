const OutEvent = require('./OutEvent');

class PopOutEvent extends OutEvent {
  constructor(beforeState, config, isFoul = false) {
    // Pop out resets count
    super(beforeState, config, true);
    this.isFoul = isFoul;
  }

  validate() {
    return true;
  }
}

module.exports = PopOutEvent; 