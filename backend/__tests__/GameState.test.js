const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('GameState', () => {
  let gameState;
  let config;

  beforeEach(() => {
    config = new GameConfig();
    gameState = new GameState(config);
  });

  test('initializes with correct default state', () => {
    expect(gameState.state.balls).toBe(0);
    expect(gameState.state.strikes).toBe(0);
    expect(gameState.state.outs).toBe(0);
    expect(gameState.state.inning).toBe(1);
    expect(gameState.state.isTopInning).toBe(true);
  });

  test('initializes teams with correct lineup size', () => {
    expect(gameState.state.homeTeam.lineup).toHaveLength(config.playersPerRoster);
    expect(gameState.state.awayTeam.lineup).toHaveLength(config.playersPerRoster);
  });

  test('initializes teams with correct substitute count', () => {
    expect(gameState.state.homeTeam.substitutes).toHaveLength(2);
    expect(gameState.state.awayTeam.substitutes).toHaveLength(2);
  });

  test('initializes teams with correct lineup positions', () => {
    expect(gameState.state.homeTeam.lineupPosition).toBe(0);
    expect(gameState.state.awayTeam.lineupPosition).toBe(0);
  });

  test('initializes baseRunners as empty', () => {
    expect(gameState.state.baseRunners).toEqual([null, null, null]);
  });

  test('resets count correctly', () => {
    gameState.state.balls = 3;
    gameState.state.strikes = 2;
    gameState.state.outs = 2;
    gameState.resetCount();
    expect(gameState.state.balls).toBe(0);
    expect(gameState.state.strikes).toBe(0);
    expect(gameState.state.outs).toBe(0);
  });

  test('gets current batter based on inning', () => {
    expect(gameState.currentBatter).toBe(gameState.state.awayTeam.lineup[0]);
    gameState.state.isTopInning = false;
    expect(gameState.currentBatter).toBe(gameState.state.homeTeam.lineup[0]);
  });

  test('advances lineup position', () => {
    gameState.advanceLineup();
    expect(gameState.state.awayTeam.lineupPosition).toBe(1);
    gameState.state.isTopInning = false;
    gameState.advanceLineup();
    expect(gameState.state.homeTeam.lineupPosition).toBe(1);
  });

  test('wraps around lineup position', () => {
    gameState.state.awayTeam.lineupPosition = config.playersPerRoster - 1;
    gameState.advanceLineup();
    expect(gameState.state.awayTeam.lineupPosition).toBe(0);
  });

  test('handles inning end correctly', () => {
    gameState.state.outs = 3;
    gameState.handleInningEnd();
    expect(gameState.state.outs).toBe(0);
    expect(gameState.state.isTopInning).toBe(false);
    expect(gameState.state.inning).toBe(1);

    gameState.state.outs = 3;
    gameState.handleInningEnd();
    expect(gameState.state.outs).toBe(0);
    expect(gameState.state.isTopInning).toBe(true);
    expect(gameState.state.inning).toBe(2);
  });
}); 