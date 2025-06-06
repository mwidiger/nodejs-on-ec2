const GameEvent = require('./GameEvent');

class EndOfGameEvent extends GameEvent {
  constructor(beforeState, config, reason) {
    super(beforeState, config);
    this.reason = reason;
  }

  validate() {
    // Prevent adding events if game is already over
    if (this.beforeState.isGameOver) {
      throw new Error('Cannot add events after game has ended');
    }
    return true;
  }

  apply() {
    // Set game as ended
    this.afterState.isGameOver = true;
    this.afterState.gameEndReason = this.reason;
  }
}

module.exports = EndOfGameEvent; 