const Game = require('../models/Game');
const GameConfig = require('../models/GameConfig');
const BallEvent = require('../models/BallEvent');
const StrikeEvent = require('../models/StrikeEvent');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it('should initialize with default config', () => {
    expect(game.config).toBeInstanceOf(GameConfig);
  });

  it('should initialize with default counts', () => {
    expect(game.state.balls).toBe(0);
    expect(game.state.strikes).toBe(0);
    expect(game.state.outs).toBe(0);
  });

  it('should initialize with default inning state', () => {
    expect(game.state.inning).toBe(1);
    expect(game.state.isTopInning).toBe(true);
  });

  it('should store initial state', () => {
    expect(game.initialState).toEqual({
      balls: 0,
      strikes: 0,
      outs: 0,
      inning: 1,
      isTopInning: true
    });
  });

  it('should track events', () => {
    const event = new BallEvent();
    game.addEvent(event);
    expect(game.events).toContain(event);
  });

  it('should not change inning for non-ending events', () => {
    const event = new BallEvent();
    game.addEvent(event);
    expect(game.state.inning).toBe(1);
    expect(game.state.isTopInning).toBe(true);
  });

  it('should toggle top/bottom inning when event ends inning', () => {
    const event = new StrikeEvent();
    event.inningEnds = true;
    
    expect(game.state.isTopInning).toBe(true);
    expect(game.state.inning).toBe(1);
    
    game.addEvent(event);
    expect(game.state.isTopInning).toBe(false);
    expect(game.state.inning).toBe(1);

    game.addEvent(event);
    expect(game.state.isTopInning).toBe(true);
    expect(game.state.inning).toBe(2);
  });
}); 