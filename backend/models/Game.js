const GameConfig = require('./GameConfig');
const GameEvent = require('./GameEvent');
const GameState = require('./GameState');
const { BASES } = GameEvent;

class Game {
  constructor() {
    this.config = new GameConfig();
    this.events = [];
    this.initialState = new GameState();
  }

  addEvent(event) {
    try {
      event.validate();
      
      event.apply();
      
      this.events.push(event);
    } catch (error) {
      throw error;
    }
  }

  get currentBatter() {
    return this.state.battingTeam.lineupPosition;
  }

  get state() {
    return this.events.length > 0 ? this.events[this.events.length - 1].afterState : this.initialState;
  }

  get lastEvent() {
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }
}

module.exports = Game; 