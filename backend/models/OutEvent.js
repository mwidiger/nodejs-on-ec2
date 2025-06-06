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

    // Reset count if specified
    if (this.shouldResetCount) {
      this.afterState.balls = this.config.initialCount.balls;
      this.afterState.strikes = this.config.initialCount.strikes;
    }

    // Advance lineup
    this.advanceLineup();

    // If three outs, end the inning
    if (this.afterState.outs === this.config.outsPerInning) {
      const endOfInningEvent = new EndOfInningEvent(this.afterState, this.config);
      endOfInningEvent.apply();
      this.childEvents.push(endOfInningEvent);
      this.afterState = endOfInningEvent.afterState;
    }
  }
}

module.exports = OutEvent; 