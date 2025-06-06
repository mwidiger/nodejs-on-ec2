const DoubledOffEvent = require('../models/DoubledOffEvent');
const PopOutEvent = require('../models/PopOutEvent');
const FlyOutEvent = require('../models/FlyOutEvent');
const StrikeoutEvent = require('../models/StrikeoutEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('DoubledOffEvent', () => {
  let beforeState;
  let config;
  let popOutEvent;
  let flyOutEvent;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.outsPerInning = 3;
    popOutEvent = new PopOutEvent(beforeState, config);
    flyOutEvent = new FlyOutEvent(beforeState, config);
  });

  test('should increment outs by 1', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.afterState.outs).toBe(1);
  });

  test('should not reset count after doubled off', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.afterState.balls).toBe(2);
    expect(event.afterState.strikes).toBe(1);
  });

  test('should not advance lineup after doubled off', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(originalLineupPosition);
  });

  test('should remove runner from basepaths', () => {
    beforeState.baseRunners = ['runner1', 'runner2', 'runner3'];
    const event = new DoubledOffEvent(beforeState, config, 2, popOutEvent);
    event.apply();
    expect(event.afterState.baseRunners).toEqual(['runner1', null, 'runner3']);
  });

  test('should validate runner base is between 1 and 3', () => {
    const event1 = new DoubledOffEvent(beforeState, config, 0, popOutEvent);
    const event2 = new DoubledOffEvent(beforeState, config, 4, popOutEvent);
    expect(event1.validate()).toBe(false);
    expect(event2.validate()).toBe(false);
  });

  test('should validate there is a runner on the specified base', () => {
    beforeState.baseRunners = ['runner1', null, 'runner3'];
    const event = new DoubledOffEvent(beforeState, config, 2, popOutEvent);
    expect(event.validate()).toBe(false);
  });

  test('should validate parent event is PopOutEvent or FlyOutEvent', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const strikeoutEvent = new StrikeoutEvent(beforeState, config);
    
    const validEvent1 = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    const validEvent2 = new DoubledOffEvent(beforeState, config, 1, flyOutEvent);
    const invalidEvent = new DoubledOffEvent(beforeState, config, 1, strikeoutEvent);
    
    expect(validEvent1.validate()).toBe(true);
    expect(validEvent2.validate()).toBe(true);
    expect(invalidEvent.validate()).toBe(false);
  });

  test('should validate parent event exists', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1);
    expect(event.validate()).toBe(false);
  });

  test('should create EndOfInningEvent on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0].constructor.name).toBe('EndOfInningEvent');
  });

  test('should not create EndOfInningEvent before third out', () => {
    beforeState.outs = 0;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.childEvents.length).toBe(0);
  });

  test('should update afterState with EndOfInningEvent state on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new DoubledOffEvent(beforeState, config, 1, popOutEvent);
    event.apply();
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });
}); 