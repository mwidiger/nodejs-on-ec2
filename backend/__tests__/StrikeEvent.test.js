const StrikeEvent = require('../models/StrikeEvent');
const Game = require('../models/Game');
const GameConfig = require('../models/GameConfig');

describe('StrikeEvent', () => {
  let event;
  let game;

  beforeEach(() => {
    event = new StrikeEvent();
    game = new Game();
  });

  it('should initialize with timestamp and end flags', () => {
    expect(event.timestamp).toBeDefined();
    expect(event.plateAppearanceEnds).toBe(false);
    expect(event.inningEnds).toBe(false);
  });

  it('should increment strikes when added to game', () => {
    game.addEvent(event);
    expect(game.state.strikes).toBe(1);
  });

  it('should reset strikes and increment outs when strikes reach limit', () => {
    game.state.strikes = game.config.strikesPerOut - 1;
    game.addEvent(event);
    expect(game.state.strikes).toBe(0);
    expect(game.state.outs).toBe(1);
  });

  it('should set inningEnds flag when outs reach limit', () => {
    game.state.strikes = game.config.strikesPerOut - 1;
    game.state.outs = game.config.outsPerInning - 1;
    game.addEvent(event);
    expect(event.inningEnds).toBe(true);
  });

  it('should be tracked in game events', () => {
    game.addEvent(event);
    expect(game.events).toContain(event);
  });
}); 