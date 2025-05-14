class GameConfig {
  constructor(overrides = {}) {
    this.initialBalls = 0;
    this.initialStrikes = 0;
    this.ballsForWalk = 4;
    this.strikesPerOut = 3;
    this.outsPerInning = 3;

    Object.assign(this, overrides);
  }
}

module.exports = GameConfig; 