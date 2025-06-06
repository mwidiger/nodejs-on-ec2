const GameEvent = require('./GameEvent');
const { BASES, HOME_PLATE, BATTER } = require('./BaseConstants');

class WalkEvent extends GameEvent {
  constructor(beforeState, config) {
    super(beforeState, config);
  }

  validate() {
    return true;
  }

  apply() {
    // Handle runner advancement
    if (this.beforeState.baseRunners[0] !== null) {
      this.afterState.baseRunners[1] = this.beforeState.baseRunners[0];
      if (this.beforeState.baseRunners[1] !== null) {
        this.afterState.baseRunners[2] = this.beforeState.baseRunners[1];
        if (this.beforeState.baseRunners[2] !== null) {
          this.afterState.battingTeam.runs += 1;
        }
      }
    }

    // Move batter to first
    this.afterState.baseRunners[0] = this.beforeState.battingTeam.lineupPosition;

    // Reset count using config
    this.afterState.balls = this.config.initialCount.balls;
    this.afterState.strikes = this.config.initialCount.strikes;

    // Advance lineup
    this.advanceLineup();
  }
}

module.exports = WalkEvent; 