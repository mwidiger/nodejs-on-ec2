const BallEvent = require('../models/BallEvent');
const Game = require('../models/Game');

describe('BallEvent', () => {
  let event;
  let game;

  beforeEach(() => {
    event = new BallEvent();
    game = new Game();
  });

  it('should initialize with timestamp and end flags', () => {
    expect(event.timestamp).toBeDefined();
    expect(event.plateAppearanceEnds).toBe(false);
    expect(event.inningEnds).toBe(false);
  });

  it('should increment balls when added to game', () => {
    game.addEvent(event);
    expect(game.state.balls).toBe(1);
  });

  it('should be tracked in game events', () => {
    game.addEvent(event);
    expect(game.events).toContain(event);
  });
}); 