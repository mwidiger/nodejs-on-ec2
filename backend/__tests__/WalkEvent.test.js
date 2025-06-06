const WalkEvent = require('../models/WalkEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('WalkEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.initialCount = { balls: 0, strikes: 0 };
  });

  test('should move batter to first on empty bases', () => {
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
  });

  test('should handle bases loaded correctly', () => {
    beforeState.baseRunners[0] = 5; // Runner on first
    beforeState.baseRunners[1] = 6; // Runner on second
    beforeState.baseRunners[2] = 7; // Runner on third
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(5);
    expect(event.afterState.baseRunners[2]).toBe(6);
    expect(event.afterState.battingTeam.runs).toBe(1);
  });

  test('should handle runners on first and second correctly', () => {
    beforeState.baseRunners[0] = 5; // Runner on first
    beforeState.baseRunners[1] = 6; // Runner on second
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(5);
    expect(event.afterState.baseRunners[2]).toBe(6);
  });

  test('should handle runner on first only', () => {
    beforeState.baseRunners[0] = 5; // Runner on first
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(5);
    expect(event.afterState.baseRunners[2]).toBeNull();
  });

  test('should handle runner on second only', () => {
    beforeState.baseRunners[1] = 6; // Runner on second
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(6);
    expect(event.afterState.baseRunners[2]).toBeNull();
  });

  test('should handle runner on third only', () => {
    beforeState.baseRunners[2] = 7; // Runner on third
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBeNull();
    expect(event.afterState.baseRunners[2]).toBe(7);
    expect(event.afterState.battingTeam.runs).toBe(0);
  });

  test('should handle runners on first and third correctly', () => {
    beforeState.baseRunners[0] = 5; // Runner on first
    beforeState.baseRunners[2] = 7; // Runner on third
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(5);
    expect(event.afterState.baseRunners[2]).toBe(7);
  });

  test('should reset count using config initialCount and advance lineup', () => {
    beforeState.balls = 3;
    beforeState.strikes = 2;
    config.initialCount = { balls: 0, strikes: 0 };
    const event = new WalkEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.battingTeam.lineupPosition).toBe(
      (beforeState.battingTeam.lineupPosition + 1) % beforeState.battingTeam.lineup.length
    );
  });
}); 