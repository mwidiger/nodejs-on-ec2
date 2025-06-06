const GameEvent = require('./GameEvent');
const EndOfGameEvent = require('./EndOfGameEvent');

class EndOfInningEvent extends GameEvent {
  constructor(beforeState, config) {
    super(beforeState, config);
  }

  validate() {
    return true;
  }

  apply() {
    // Reset count
    this.afterState.balls = this.config.initialCount.balls;
    this.afterState.strikes = this.config.initialCount.strikes;
    this.afterState.outs = 0;
    this.afterState.baseRunners = [null, null, null];

    // Switch innings
    this.afterState.isTopInning = !this.beforeState.isTopInning;
    if (!this.beforeState.isTopInning) {
      this.afterState.inning += 1;
    }

    // Check if game should end
    const isLastInning = this.afterState.inning >= this.config.maxInnings;
    const isBottomInning = !this.afterState.isTopInning;
    const homeTeamWinning = this.afterState.homeTeam.runs > this.afterState.awayTeam.runs;
    const bottomOfLastInningComplete = this.beforeState.inning === this.config.maxInnings && !this.beforeState.isTopInning;

    console.log('isLastInning', isLastInning);
    console.log('isBottomInning', isBottomInning);
    console.log('homeTeamWinning', homeTeamWinning);
    console.log('bottomOfLastInningComplete', bottomOfLastInningComplete);
    
    if ((isLastInning && isBottomInning && homeTeamWinning) || bottomOfLastInningComplete) {
      const endOfGameEvent = new EndOfGameEvent(this.afterState, this.config, '');
      endOfGameEvent.apply();
      this.childEvents.push(endOfGameEvent);
      this.afterState = endOfGameEvent.afterState;
    }
  }
}

module.exports = EndOfInningEvent; 