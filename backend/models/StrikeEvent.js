class StrikeEvent {
  constructor(timestamp = Date.now()) {
    this.timestamp = timestamp;
  }

  apply(gameState) {
    return {
      ...gameState,
      strikes: gameState.strikes + 1
    };
  }
}

module.exports = StrikeEvent; 