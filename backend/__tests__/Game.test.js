const Game = require('../models/Game');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it('should initialize with 0 balls', () => {
    expect(game.balls).toBe(0);
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