const OutEvent = require('./OutEvent');

class StrikeoutEvent extends OutEvent {
  constructor(beforeState, config) {
    // Strikeouts always reset count
    super(beforeState, config, true);
  }

  validate() {
    return true;
  }
}

module.exports = StrikeoutEvent; 