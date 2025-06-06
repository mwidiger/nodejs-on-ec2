const GameEvent = require('./GameEvent');
const EndOfGameEvent = require('./EndOfGameEvent');

class RunScoredEvent extends GameEvent {
  constructor(beforeState, config, runner) {
    super(beforeState, config);
    this.runner = runner;
  }

  validate() {
    return true;
  }

  apply() {
    // Track runs per inning
    const currentInningIndex = this.afterState.inning - 1;
    const battingTeam = this.afterState.battingTeam;
    
    // Initialize array up to current inning if needed
    while (battingTeam.runsPerInning.length <= currentInningIndex) {
      battingTeam.runsPerInning.push(0);
    }
    
    // Increment runs for current inning
    battingTeam.runsPerInning[currentInningIndex] += 1;

    // Recalculate total runs from runsPerInning array
    battingTeam.runs = battingTeam.runsPerInning.reduce((sum, runs) => sum + runs, 0);

    // Check if game should end
    const isLastInning = this.afterState.inning >= this.config.maxInnings;
    const isBottomInning = !this.afterState.isTopInning;
    const homeTeamWinning = this.afterState.homeTeam.runs > this.afterState.awayTeam.runs;

    if (isLastInning && isBottomInning && homeTeamWinning) {
      const endOfGameEvent = new EndOfGameEvent(this.afterState, this.config, 'Walk off');
      endOfGameEvent.apply();
      this.childEvents.push(endOfGameEvent);
      this.afterState = endOfGameEvent.afterState;
    }
  }
}

module.exports = RunScoredEvent; 