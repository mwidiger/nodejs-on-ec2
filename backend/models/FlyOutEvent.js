const OutEvent = require('./OutEvent');

class FlyOutEvent extends OutEvent {
  constructor(beforeState, config) {
    // Fly out resets count
    super(beforeState, config, true);
  }

  validate() {
    return true;
  }
}

module.exports = FlyOutEvent; 