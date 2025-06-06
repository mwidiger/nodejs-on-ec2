class GameConfig {
  constructor() {
    this.maxBalls = 4;
    this.maxStrikes = 3;
    this.maxOuts = 3;
    this.maxInnings = 9;
    this.initialCount = {
      balls: 0,
      strikes: 0
    };
    this.ballsPerWalk = 4;
    this.strikesPerOut = 3;
  }
}

module.exports = GameConfig;