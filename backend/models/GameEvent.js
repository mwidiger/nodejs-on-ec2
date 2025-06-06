const BASES = 3;

class GameEvent {
  constructor(beforeState, config) {
    this.timestamp = Date.now();
    this.beforeState = beforeState;
    this.afterState = beforeState.clone();
    this.config = config;
    this.childEvents = [];
    this.parentEvent = null;
  }

  validate() {
    // Base validation - can be overridden by child classes
    return true;
  }

  apply() {
    throw new Error('Abstract method apply() called for GameEvent');
  }

  advanceLineup() {
    const team = this.afterState.battingTeam;
    team.lineupPosition = (team.lineupPosition + 1) % team.lineup.length;
  }

  setParentEvent(parentEvent) {
    this.parentEvent = parentEvent;
  }

  syncParentState() {
    if (this.parentEvent) {
      this.parentEvent.afterState = this.afterState;
    }
  }

  addChildEvent(childEvent) {
    childEvent.apply();
    this.childEvents.push(childEvent);
    this.afterState = childEvent.afterState;
  }
}

module.exports = GameEvent;
module.exports.BASES = BASES; 