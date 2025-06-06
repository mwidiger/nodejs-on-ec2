const GameEvent = require('../models/GameEvent');
const Game = require('../models/Game');
const GameState = require('../models/GameState');

describe('GameEvent', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('should initialize with correct properties', () => {
    const event = new GameEvent(game.state, game.config);
    expect(event.timestamp).toBeDefined();
    expect(event.beforeState).toBe(game.state);
    expect(event.afterState).toEqual(game.state.clone());
    expect(event.config).toBe(game.config);
    expect(event.childEvents).toEqual([]);
  });
}); 