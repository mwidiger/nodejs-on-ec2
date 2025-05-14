class BallEvent {
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
    this.plateAppearanceEnds = false;
    this.inningEnds = false;
  }

  apply(gameState) {
    return {
      ...gameState.state,
      balls: gameState.state.balls + 1
    };
  }
}

module.exports = BallEvent; 