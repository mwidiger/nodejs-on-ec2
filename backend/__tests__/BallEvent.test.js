const BallEvent = require('../models/BallEvent');
const WalkEvent = require('../models/WalkEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('BallEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.ballsPerWalk = 4; // Set default value for tests
  });

  test('should increment balls by 1', () => {
    const event = new BallEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(1);
  });

  test('should create WalkEvent on ball four', () => {
    beforeState.balls = config.ballsPerWalk - 1;
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new BallEvent(beforeState, config);
    event.apply();
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0]).toBeInstanceOf(WalkEvent);
    expect(event.afterState.balls).toBe(0);
    expect(event.afterState.strikes).toBe(0);
    expect(event.afterState.battingTeam.lineupPosition).toBe(
      (originalLineupPosition + 1) % beforeState.battingTeam.lineup.length
    );
  });

  test('should update afterState with WalkEvent state', () => {
    beforeState.balls = config.ballsPerWalk - 1;
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new BallEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.battingTeam.lineupPosition).toBe(
      (originalLineupPosition + 1) % beforeState.battingTeam.lineup.length
    );
  });

  test('should handle bases loaded walk correctly', () => {
    // Setup bases loaded
    beforeState.baseRunners[0] = 5; // Runner on first
    beforeState.baseRunners[1] = 6; // Runner on second
    beforeState.baseRunners[2] = 7; // Runner on third
    
    // Setup count
    beforeState.balls = config.ballsPerWalk - 1;
    beforeState.strikes = 2;
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;

    const event = new BallEvent(beforeState, config);
    event.apply();

    // Verify WalkEvent was created
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0]).toBeInstanceOf(WalkEvent);

    // Verify final state
    expect(event.afterState.balls).toBe(0);
    expect(event.afterState.strikes).toBe(0);
    expect(event.afterState.baseRunners[0]).toBe(beforeState.battingTeam.lineupPosition);
    expect(event.afterState.baseRunners[1]).toBe(5);
    expect(event.afterState.baseRunners[2]).toBe(6);
    expect(event.afterState.battingTeam.runs).toBe(1);
    expect(event.afterState.battingTeam.lineupPosition).toBe(
      (originalLineupPosition + 1) % beforeState.battingTeam.lineup.length
    );
  });
}); 