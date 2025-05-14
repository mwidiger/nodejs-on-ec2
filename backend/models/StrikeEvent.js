class StrikeEvent {
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
    this.plateAppearanceEnds = false;
    this.inningEnds = false;
  }

  apply(gameState) {
    const newState = {
      ...gameState.state,
      strikes: gameState.state.strikes + 1
    };

    if (newState.strikes === gameState.config.strikesPerOut) {
      newState.strikes = gameState.config.initialStrikes;
      newState.outs = gameState.state.outs + 1;

      if (newState.outs === gameState.config.outsPerInning) {
        this.inningEnds = true;
      }
    }

    return newState;
  }
}

module.exports = StrikeEvent; 