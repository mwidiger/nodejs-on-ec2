const StrikeEvent = require('../models/StrikeEvent');
const Game = require('../models/Game');

describe('StrikeEvent', () => {
  let event;
  let game;

  beforeEach(() => {
    event = new StrikeEvent();
    game = new Game();
  });

  it('should initialize with timestamp', () => {
    expect(event.timestamp).toBeDefined();
  });

  it('should increment strikes when added to game', () => {
    game.addEvent(event);
    expect(game.strikes).toBe(1);
  });

  it('should be tracked in game events', () => {
    game.addEvent(event);
    expect(game.events).toContain(event);
  });
}); 