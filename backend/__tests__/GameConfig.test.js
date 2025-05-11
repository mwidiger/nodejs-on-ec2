const { GameRule, WalkRule, GameConfig } = require('../models/GameConfig');

describe('GameConfig', () => {
  let config;
  let gameState;

  beforeEach(() => {
    config = new GameConfig();
    gameState = {
      inning: 1,
      isTopInning: true,
      outs: 0,
      balls: 0,
      strikes: 0,
      bases: {
        first: null,
        second: null,
        third: null
      },
      currentBatter: {
        number: 1,
        name: 'Player 1',
        position: 'P'
      }
    };
  });

  test('should initialize with default MLB rules', () => {
    expect(config.ballsForWalk).toBe(4);
    expect(config.strikesForOut).toBe(3);
    expect(config.outsPerInning).toBe(3);
    expect(config.inningsPerGame).toBe(9);
    expect(config.extraInnings).toBe(true);
    expect(config.designatedHitter).toBe(true);
    expect(config.maxPlayersOnField).toBe(9);
  });

  test('should allow overriding default rules', () => {
    const customConfig = new GameConfig({
      ballsForWalk: 5,
      strikesForOut: 4,
      outsPerInning: 4,
      inningsPerGame: 7,
      extraInnings: false,
      designatedHitter: false,
      maxPlayersOnField: 10
    });

    expect(customConfig.ballsForWalk).toBe(5);
    expect(customConfig.strikesForOut).toBe(4);
    expect(customConfig.outsPerInning).toBe(4);
    expect(customConfig.inningsPerGame).toBe(7);
    expect(customConfig.extraInnings).toBe(false);
    expect(customConfig.designatedHitter).toBe(false);
    expect(customConfig.maxPlayersOnRoster).toBe(20);
    expect(customConfig.maxPlayersOnField).toBe(10);
  });

  test('should maintain default values for unspecified overrides', () => {
    const customConfig = new GameConfig({
      ballsForWalk: 5,
      inningsPerGame: 7
    });

    expect(customConfig.ballsForWalk).toBe(5);
    expect(customConfig.inningsPerGame).toBe(7);
    expect(customConfig.strikesForOut).toBe(3); // Default value
    expect(customConfig.outsPerInning).toBe(3); // Default value
  });

  describe('WalkRule', () => {
    let walkRule;

    beforeEach(() => {
      walkRule = new WalkRule();
    });

    test('should not trigger walk when balls < 4', () => {
      gameState.balls = 3;
      const newState = walkRule.check(gameState);
      
      expect(newState.balls).toBe(3);
      expect(newState.bases.first).toBeNull();
    });

    test('should trigger walk when balls = 4', () => {
      gameState.balls = 4;
      const newState = walkRule.check(gameState);
      
      expect(newState.balls).toBe(0);
      expect(newState.strikes).toBe(0);
      expect(newState.bases.first).toEqual(gameState.currentBatter);
    });

    test('should advance runners on walk', () => {
      gameState.balls = 4;
      gameState.bases.first = { number: 2, name: 'Player 2', position: 'C' };
      gameState.bases.second = { number: 3, name: 'Player 3', position: '1B' };
      
      const newState = walkRule.check(gameState);
      
      expect(newState.bases.first).toEqual(gameState.currentBatter);
      expect(newState.bases.second).toEqual(gameState.bases.first);
      expect(newState.bases.third).toEqual(gameState.bases.second);
    });

    test('should score run when bases loaded', () => {
      gameState.balls = 4;
      gameState.bases.first = { number: 2, name: 'Player 2', position: 'C' };
      gameState.bases.second = { number: 3, name: 'Player 3', position: '1B' };
      gameState.bases.third = { number: 4, name: 'Player 4', position: '2B' };
      gameState.score = 0;
      
      const newState = walkRule.check(gameState);
      
      expect(newState.score).toBe(1);
      expect(newState.bases.first).toEqual(gameState.currentBatter);
      expect(newState.bases.second).toEqual(gameState.bases.first);
      expect(newState.bases.third).toEqual(gameState.bases.second);
    });
  });
}); 