const OutEvent = require('./OutEvent');

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
    
    return super.apply();
  }
}

module.exports = CaughtStealingEvent; 