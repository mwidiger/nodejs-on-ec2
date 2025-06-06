const OutEvent = require('./OutEvent');
const EndOfInningEvent = require('./EndOfInningEvent');

class FlyOutEvent extends OutEvent {
  constructor(beforeState, config) {
    // Fly out resets count
    super(beforeState, config, true);
  }

  validate() {
    return true;
  }

  apply() {
    // Increment outs and reset count
    this.afterState.outs = this.beforeState.outs + 1;
    this.afterState.balls = this.config.initialCount.balls;
    this.afterState.strikes = this.config.initialCount.strikes;
    
    // Advance lineup
    this.advanceLineup();
    
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

module.exports = FlyOutEvent; 