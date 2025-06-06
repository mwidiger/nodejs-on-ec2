const EndOfInningEvent = require('../models/EndOfInningEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('EndOfInningEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.initialCount = { balls: 0, strikes: 0 };
    config.maxInnings = 9;
    // Initialize arrays with correct size
    beforeState.homeTeam.runsPerInning = new Array(config.maxInnings).fill(0);
    beforeState.awayTeam.runsPerInning = new Array(config.maxInnings).fill(0);
  });

  test('should reset outs', () => {
    beforeState.outs = 3;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.outs).toBe(0);
  });

  test('should reset count using config initialCount', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
  });

  test('should clear bases', () => {
    beforeState.baseRunners = [1, 2, 3];
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });

  test('should switch teams', () => {
    beforeState.isTopInning = true;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.isTopInning).toBe(false);
  });

  test('should increment inning on bottom of inning', () => {
    beforeState.isTopInning = false;
    beforeState.inning = 1;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.inning).toBe(2);
  });

  test('should not increment inning on top of inning', () => {
    beforeState.isTopInning = true;
    beforeState.inning = 1;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.inning).toBe(1);
  });

  test('should reset lineup position for new batting team', () => {
    beforeState.battingTeam.lineupPosition = 5;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(0);
  });

  test('should reset count and bases', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    beforeState.outs = 2;
    beforeState.baseRunners = [3, 2, 1];
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });

  test('should end game because home team is winning in last inning', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = true;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runs = 1;
    beforeState.awayTeam.runsPerInning[0] = 0;
    beforeState.awayTeam.runs = 0;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.isGameOver).toBe(true);
    expect(event.afterState.gameEndReason).toBe('');
    expect(event.childEvents).toHaveLength(1);
  });

  test('should end game when bottom of last inning is complete', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = false;
    beforeState.homeTeam.runsPerInning[0] = 0;
    beforeState.homeTeam.runs = 0;
    beforeState.awayTeam.runsPerInning[0] = 1;
    beforeState.awayTeam.runs = 1;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.isGameOver).toBe(true);
    expect(event.afterState.gameEndReason).toBe('');
    expect(event.childEvents).toHaveLength(1);
  });

  test('should not end game if not last inning', () => {
    beforeState.inning = config.maxInnings - 1;
    beforeState.isTopInning = false;
    beforeState.homeTeam.runsPerInning[0] = 1;
    beforeState.homeTeam.runs = 1;
    beforeState.awayTeam.runsPerInning[0] = 0;
    beforeState.awayTeam.runs = 0;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.isGameOver).toBe(false);
    expect(event.childEvents).toHaveLength(0);
  });

  test('should not end game if not bottom of inning', () => {
    beforeState.inning = config.maxInnings;
    beforeState.isTopInning = true;
    const event = new EndOfInningEvent(beforeState, config);
    event.apply();
    expect(event.afterState.isGameOver).toBe(false);
    expect(event.childEvents).toHaveLength(0);
  });
}); 