const Game = require('../models/Game');
const GameConfig = require('../models/GameConfig');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it('should initialize with config defaults', () => {
    expect(game.balls).toBe(0);
    expect(game.strikes).toBe(0);
    expect(game.outs).toBe(0);
    expect(game.config).toBeInstanceOf(GameConfig);
  });

  it('should initialize with custom config', () => {
    const config = new GameConfig({ initialBalls: 2, initialStrikes: 1 });
    const customGame = new Game(config);
    expect(customGame.balls).toBe(2);
    expect(customGame.strikes).toBe(1);
    expect(customGame.config).toBe(config);
  });

  it('should initialize with empty events array', () => {
    expect(game.events).toEqual([]);
  });

  it('should apply event changes to state', () => {
    const mockEvent = {
      apply: jest.fn(state => ({ ...state, balls: state.balls + 1 }))
    };
    
    game.addEvent(mockEvent);
    
    expect(mockEvent.apply).toHaveBeenCalledWith(game);
    expect(game.balls).toBe(1);
    expect(game.events).toHaveLength(1);
  });
}); 