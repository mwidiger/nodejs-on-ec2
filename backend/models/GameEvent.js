const BASES = 3;

class GameEvent {
  constructor(beforeState, config) {
    this.timestamp = Date.now();
    this.beforeState = beforeState;
    this.afterState = beforeState.clone();
    this.config = config;
    this.childEvents = [];
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
}

module.exports = GameEvent;
module.exports.BASES = BASES; 