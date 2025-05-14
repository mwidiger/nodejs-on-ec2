const GameConfig = require('./GameConfig');
const GameState = require('./GameState');

class Game {
  constructor(config = new GameConfig()) {
    this.config = config;
    this.gameState = new GameState(config);
    this.events = [];
    
    // Store initial state for reconstruction
    this.initialState = { ...this.gameState.state };
  }

  addEvent(event) {
    this.events.push(event);
    Object.assign(this.gameState.state, event.apply(this.gameState));

    if (event.inningEnds) {
      this.gameState.handleInningEnd();
    }
  }

  get state() {
    return this.gameState.state;
  }

  get currentBatter() {
    return this.gameState.currentBatter;
  }

  advanceLineup() {
    this.gameState.advanceLineup();
  }
}

module.exports = Game; 