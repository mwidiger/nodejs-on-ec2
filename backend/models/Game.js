const GameConfig = require('./GameConfig');

class Game {
  constructor(config = new GameConfig()) {
    this.config = config;
    this.state = {
      balls: config.initialBalls,
      strikes: config.initialStrikes,
      outs: 0,
      inning: 1,
      isTopInning: true
    };
    this.events = [];
    
    // Store initial state for reconstruction
    this.initialState = { ...this.state };
  }

  addEvent(event) {
    this.events.push(event);
    Object.assign(this.state, event.apply(this));

    if (event.inningEnds) {
      this.state.outs = 0;
      this.state.isTopInning = !this.state.isTopInning;
      if (this.state.isTopInning) {
        this.state.inning++;
      }
    }
  }

  resetCount() {
    this.state.balls = this.config.initialBalls;
    this.state.strikes = this.config.initialStrikes;
    this.state.outs = 0;
  }
}

module.exports = Game; 