class GameConfig {
  constructor(overrides = {}) {
    this.initialBalls = overrides.initialBalls || 0;
    this.initialStrikes = overrides.initialStrikes || 0;
    this.ballsForWalk = overrides.ballsForWalk || 4;
    this.strikesForOut = overrides.strikesForOut || 3;
    this.outsPerInning = overrides.outsPerInning || 3;
  }
}

module.exports = GameConfig; 