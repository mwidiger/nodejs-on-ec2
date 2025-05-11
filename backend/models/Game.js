const GameConfig = require('./GameConfig');

class Game {
  constructor(config = new GameConfig()) {
    this.config = config;
    this.balls = config.initialBalls;
    this.strikes = config.initialStrikes;
    this.outs = 0;
    this.events = [];
  }

  addEvent(event) {
    this.events.push(event);
    Object.assign(this, event.apply(this));
  }
}

module.exports = Game; 