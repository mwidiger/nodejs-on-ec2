const GameConfig = require('../models/GameConfig');

describe('GameConfig', () => {
  it('should initialize with MLB standard defaults', () => {
    const config = new GameConfig();
    expect(config.initialBalls).toBe(0);
    expect(config.initialStrikes).toBe(0);
    expect(config.ballsForWalk).toBe(4);
    expect(config.strikesPerOut).toBe(3);
    expect(config.outsPerInning).toBe(3);
  });

  it('should allow overriding defaults', () => {
    const config = new GameConfig({
      ballsForWalk: 5,
      strikesPerOut: 4
    });
    expect(config.ballsForWalk).toBe(5);
    expect(config.strikesPerOut).toBe(4);
    expect(config.outsPerInning).toBe(3); // unchanged
  });
}); 