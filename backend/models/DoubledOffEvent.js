const OutEvent = require('./OutEvent');

class DoubledOffEvent extends OutEvent {
  constructor(beforeState, config, runnerBase, parentEvent) {
    // Doubled off doesn't reset count
    super(beforeState, config, false);
    this.runnerBase = runnerBase;
    this.setParentEvent(parentEvent);
  }

  validate() {
    const validParentTypes = ['PopOutEvent', 'FlyOutEvent'];
    const hasValidParent = Boolean(this.parentEvent) && 
                          validParentTypes.includes(this.parentEvent.constructor.name);
    
    return this.runnerBase >= 1 && 
           this.runnerBase <= 3 && 
           this.beforeState.baseRunners[this.runnerBase - 1] !== null &&
           hasValidParent;
  }

  apply() {
    // Remove the runner from the basepaths
    this.afterState.baseRunners[this.runnerBase - 1] = null;
    
    return super.apply();
  }
}

module.exports = DoubledOffEvent; 