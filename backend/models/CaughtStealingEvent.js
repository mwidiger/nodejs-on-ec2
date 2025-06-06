const OutEvent = require('./OutEvent');
const EndOfInningEvent = require('./EndOfInningEvent');

class CaughtStealingEvent extends OutEvent {
  constructor(beforeState, config, runnerBase) {
    // Caught stealing doesn't reset count
    super(beforeState, config, false);
    this.runnerBase = runnerBase;
  }

  validate() {
    return this.runnerBase >= 1 && this.runnerBase <= 3;
  }

  apply() {
    // If no runner on base, do nothing
    if (this.beforeState.baseRunners[this.runnerBase - 1] === null) {
      return this.beforeState;
    }

    // Remove the runner from the basepaths
    this.afterState.baseRunners[this.runnerBase - 1] = null;
    
    // Increment outs without advancing lineup
    this.afterState.outs = this.beforeState.outs + 1;
    
    // Check for end of inning
    if (this.afterState.outs >= this.config.outsPerInning) {
      const endOfInningEvent = new EndOfInningEvent(this.afterState, this.config);
      endOfInningEvent.apply();
      this.childEvents.push(endOfInningEvent);
      return endOfInningEvent.afterState;
    }
    
    return this.afterState;
  }
}

module.exports = CaughtStealingEvent; 