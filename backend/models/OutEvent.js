const GameEvent = require('./GameEvent');
const EndOfInningEvent = require('./EndOfInningEvent');

class OutEvent extends GameEvent {
  constructor(beforeState, config, shouldResetCount = true) {
    super(beforeState, config);
    this.shouldResetCount = shouldResetCount;
  }

  validate() {
    return true;
  }

  apply() {
    // Increment outs
    this.afterState.outs += 1;

    // Reset count if needed
    if (this.shouldResetCount) {
      this.afterState.balls = this.config.initialCount.balls;
      this.afterState.strikes = this.config.initialCount.strikes;
    }

    // Advance lineup if needed
    if (this.shouldResetCount) {
      this.advanceLineup();
    }

    // Check for end of inning
    if (this.afterState.outs >= this.config.outsPerInning) {
      const endOfInningEvent = new EndOfInningEvent(this.afterState, this.config);
      endOfInningEvent.apply();
      this.childEvents.push(endOfInningEvent);
      this.afterState = endOfInningEvent.afterState;
      return endOfInningEvent.afterState;
    }

    return this.afterState;
  }
}

module.exports = OutEvent; 