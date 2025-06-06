const OutEvent = require('./OutEvent');

class PickedOffEvent extends OutEvent {
  constructor(beforeState, config, runnerBase) {
    // Picked off doesn't reset count
    super(beforeState, config, false);
    this.runnerBase = runnerBase;
  }

  validate() {
    return this.runnerBase >= 1 && 
           this.runnerBase <= 3 && 
           this.beforeState.baseRunners[this.runnerBase - 1] !== null;
  }

  apply() {
    // Remove the runner from the basepaths
    this.afterState.baseRunners[this.runnerBase - 1] = null;
    
    return super.apply();
  }
}

module.exports = PickedOffEvent; 