const OutEvent = require('./OutEvent');
const BaseAdvanceEvent = require('./BaseAdvanceEvent');

class GroundOutEvent extends OutEvent {
  constructor(beforeState, config) {
    // Ground out resets count
    super(beforeState, config, true);
  }

  apply() {
    // Advance all runners one base
    const runners = this.beforeState.baseRunners;
    for (let i = runners.length - 1; i >= 0; i--) {
      if (runners[i] !== null) {
        const advanceEvent = new BaseAdvanceEvent(this.afterState, this.config, i, i + 1);
        this.addChildEvent(advanceEvent);
      }
    }

    return super.apply();
  }
}

module.exports = GroundOutEvent; 