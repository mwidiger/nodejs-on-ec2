class BallEvent {
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
  }

  apply(gameState) {
    return {
      ...gameState,
      balls: gameState.balls + 1
    };
  }
}

module.exports = BallEvent; 