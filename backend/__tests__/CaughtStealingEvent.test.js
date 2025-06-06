const CaughtStealingEvent = require('../models/CaughtStealingEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('CaughtStealingEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.outsPerInning = 3;
  });

  test('should increment outs by 1', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.outs).toBe(1);
  });

  test('should not reset count after caught stealing', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.balls).toBe(2);
    expect(event.afterState.strikes).toBe(1);
  });

  test('should not advance lineup after caught stealing', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(originalLineupPosition);
  });

  test('should remove runner from basepaths', () => {
    beforeState.baseRunners = ['runner1', 'runner2', 'runner3'];
    const event = new CaughtStealingEvent(beforeState, config, 2);
    event.apply();
    expect(event.afterState.baseRunners).toEqual(['runner1', null, 'runner3']);
  });

  test('should do nothing if no runner on base', () => {
    beforeState.baseRunners = ['runner1', null, 'runner3'];
    const event = new CaughtStealingEvent(beforeState, config, 2);
    const result = event.apply();
    expect(result).toBe(beforeState);
    expect(result.outs).toBe(beforeState.outs);
    expect(result.baseRunners).toEqual(beforeState.baseRunners);
  });

  test('should validate runner base is between 1 and 3', () => {
    const event1 = new CaughtStealingEvent(beforeState, config, 0);
    const event2 = new CaughtStealingEvent(beforeState, config, 4);
    expect(event1.validate()).toBe(false);
    expect(event2.validate()).toBe(false);
  });

  test('should create EndOfInningEvent on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0].constructor.name).toBe('EndOfInningEvent');
  });

  test('should not create EndOfInningEvent before third out', () => {
    beforeState.outs = 0;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.childEvents.length).toBe(0);
  });

  test('should update afterState with EndOfInningEvent state on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new CaughtStealingEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });
}); 