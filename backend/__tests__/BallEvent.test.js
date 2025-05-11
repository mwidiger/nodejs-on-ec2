const BallEvent = require('../models/BallEvent');
const Game = require('../models/Game');

describe('BallEvent', () => {
  let event;
  let game;

  beforeEach(() => {
    event = new BallEvent();
    game = new Game();
  });

  it('should initialize with timestamp', () => {
    expect(event.timestamp).toBeDefined();
  });

  it('should increment balls when added to game', () => {
    game.addEvent(event);
    expect(game.balls).toBe(1);
  });

  it('should be tracked in game events', () => {
    game.addEvent(event);
    expect(game.events).toContain(event);
  });
}); 