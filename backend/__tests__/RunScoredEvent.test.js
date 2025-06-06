const RunScoredEvent = require('../models/RunScoredEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('RunScoredEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.maxInnings = 9;
    // Initialize arrays with correct size
    beforeState.homeTeam.runsPerInning = new Array(config.maxInnings).fill(0);
    beforeState.awayTeam.runsPerInning = new Array(config.maxInnings).fill(0);
  });

  test('should calculate total runs from runsPerInning array', () => {
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    
    // Should have 1 run in first inning
    expect(event.afterState.battingTeam.runsPerInning[0]).toBe(1);
    // Total runs should match sum of runsPerInning
    expect(event.afterState.battingTeam.runs).toBe(1);
  });

  test('should not affect defending team runs', () => {
    const initialRuns = beforeState.defendingTeam.runs;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    expect(event.afterState.defendingTeam.runs).toBe(initialRuns);
    expect(event.afterState.defendingTeam.runsPerInning).toEqual(new Array(config.maxInnings).fill(0));
  });

  test('should store runner information', () => {
    const runner = 5;
    const event = new RunScoredEvent(beforeState, config, runner);
    expect(event.runner).toBe(runner);
  });

  test('should track runs per inning', () => {
    beforeState.inning = 3;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    
    // Should have initialized arrays up to current inning
    expect(event.afterState.battingTeam.runsPerInning.length).toBe(config.maxInnings);
    expect(event.afterState.defendingTeam.runsPerInning.length).toBe(config.maxInnings);
    
    // Should have 1 run in the current inning
    expect(event.afterState.battingTeam.runsPerInning[2]).toBe(1);
    
    // Previous innings should be 0
    expect(event.afterState.battingTeam.runsPerInning[0]).toBe(0);
    expect(event.afterState.battingTeam.runsPerInning[1]).toBe(0);
    
    // Total runs should match sum of runsPerInning
    expect(event.afterState.battingTeam.runs).toBe(1);
    
    // Defending team should have all 0s
    expect(event.afterState.defendingTeam.runsPerInning).toEqual(new Array(config.maxInnings).fill(0));
    expect(event.afterState.defendingTeam.runs).toBe(0);
  });

  test('should end game on walk-off in last inning', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = false;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runsPerInning[1] = 1;
    beforeState.homeTeam.runs = 2;
    beforeState.awayTeam.runsPerInning[0] = 1;
    beforeState.awayTeam.runsPerInning[1] = 1;
    beforeState.awayTeam.runs = 2;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    expect(event.afterState.isGameOver).toBe(true);
    expect(event.afterState.gameEndReason).toBe('Walk off');
    expect(event.childEvents).toHaveLength(1);
  });

  test('should not end game if not last inning', () => {
    beforeState.inning = config.maxInnings - 1;
    beforeState.isTopInning = false;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runsPerInning[1] = 1;
    beforeState.homeTeam.runs = 2;
    beforeState.awayTeam.runsPerInning[0] = 1;
    beforeState.awayTeam.runsPerInning[1] = 1;
    beforeState.awayTeam.runs = 2;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    expect(event.afterState.isGameOver).toBe(false);
    expect(event.childEvents).toHaveLength(0);
  });

  test('should not end game if not bottom of inning', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = true;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runsPerInning[1] = 1;
    beforeState.homeTeam.runs = 2;
    beforeState.awayTeam.runsPerInning[0] = 1;
    beforeState.awayTeam.runsPerInning[1] = 1;
    beforeState.awayTeam.runs = 2;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    expect(event.afterState.isGameOver).toBe(false);
    expect(event.childEvents).toHaveLength(0);
  });

  test('should not end game if home team not winning', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = false;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runsPerInning[1] = 1;
    beforeState.homeTeam.runs = 2;
    beforeState.awayTeam.runsPerInning[0] = 1;
    beforeState.awayTeam.runsPerInning[1] = 1;
    beforeState.awayTeam.runsPerInning[2] = 1;
    beforeState.awayTeam.runs = 3;
    const event = new RunScoredEvent(beforeState, config, 5);
    event.apply();
    expect(event.afterState.isGameOver).toBe(false);
    expect(event.childEvents).toHaveLength(0);
  });
}); 