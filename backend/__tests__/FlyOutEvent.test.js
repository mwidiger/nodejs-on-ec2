const FlyOutEvent = require('../models/FlyOutEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('FlyOutEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.outsPerInning = 3;
  });

  test('should increment outs by 1', () => {
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.outs).toBe(1);
  });

  test('should reset count after fly out', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
  });

  test('should advance lineup after fly out', () => {
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(
      (originalLineupPosition + 1) % beforeState.battingTeam.lineup.length
    );
  });

  test('should create EndOfInningEvent on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0].constructor.name).toBe('EndOfInningEvent');
  });

  test('should not create EndOfInningEvent before third out', () => {
    beforeState.outs = 0;
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.childEvents.length).toBe(0);
  });

  test('should update afterState with EndOfInningEvent state on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    const event = new FlyOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });
}); 