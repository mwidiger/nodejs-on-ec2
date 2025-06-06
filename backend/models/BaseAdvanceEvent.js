const GameEvent = require('./GameEvent');
const { BASES, HOME_PLATE, BATTER } = require('./BaseConstants');
const { InvalidBaseError, OccupiedBaseError, NoRunnerError, InvalidAdvanceError } = require('./BaseAdvanceErrors');

class BaseAdvanceEvent extends GameEvent {
  constructor(beforeState, config, fromBase, toBase) {
    super(beforeState, config);
    this.fromBase = fromBase;
    this.toBase = toBase;
  }

  validate() {
    if (this.fromBase < BATTER || this.fromBase >= BASES) {
      throw new InvalidBaseError(this.fromBase, 'fromBase');
    }
    if (this.toBase < 0 || this.toBase > HOME_PLATE) {
      throw new InvalidBaseError(this.toBase, 'toBase');
    }
    if (this.fromBase >= this.toBase) {
      throw new InvalidAdvanceError();
    }
    if (this.fromBase !== BATTER && this.beforeState.baseRunners[this.fromBase] === null) {
      throw new NoRunnerError(this.fromBase);
    }

    // Only check bases 0-2 for occupancy
    const endBase = Math.min(this.toBase, BASES - 1);
    for (let base = this.fromBase + 1; base <= endBase; base++) {
      if (this.beforeState.baseRunners[base] !== null) {
        throw new OccupiedBaseError(base);
      }
    }

    return true;
  }

  apply() {
    // Get the runner (either from base or current batter)
    const runner = this.fromBase === BATTER 
      ? this.beforeState.battingTeam.lineupPosition
      : this.beforeState.baseRunners[this.fromBase];

    // Remove runner from current position
    if (this.fromBase !== BATTER) {
      this.afterState.baseRunners[this.fromBase] = null;
    }

    // Place runner at destination or score run
    if (this.toBase === HOME_PLATE) {
      this.afterState.battingTeam.runs += 1;
    } else {
      this.afterState.baseRunners[this.toBase] = runner;
    }

    // Advance lineup if this was a batter
    if (this.fromBase === BATTER) {
      this.advanceLineup();
    }
  }
}

module.exports = BaseAdvanceEvent;