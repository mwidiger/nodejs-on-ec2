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
    try {
      Object.assign(this.gameState.state, event.apply(this.gameState));
      this.events.push(event);
      
      // Add child events if any
      if (event.childEvents) {
        this.events.push(...event.childEvents);
      }

      if (event.inningEnds) {
        this.gameState.handleInningEnd();
      }
    } catch (error) {
      // If there's an error, remove the event from the array if it was added
      const index = this.events.indexOf(event);
      if (index > -1) {
        this.events.splice(index, 1);
      }
      throw error;
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