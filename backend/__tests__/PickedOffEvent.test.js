const PickedOffEvent = require('../models/PickedOffEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('PickedOffEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
    config.outsPerInning = 3;
  });

  test('should increment outs by 1', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.outs).toBe(1);
  });

  test('should not reset count after picked off', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.balls).toBe(2);
    expect(event.afterState.strikes).toBe(1);
  });

  test('should not advance lineup after picked off', () => {
    beforeState.baseRunners = ['runner1', null, null];
    const originalLineupPosition = beforeState.battingTeam.lineupPosition;
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(originalLineupPosition);
  });

  test('should remove runner from basepaths', () => {
    beforeState.baseRunners = ['runner1', 'runner2', 'runner3'];
    const event = new PickedOffEvent(beforeState, config, 2);
    event.apply();
    expect(event.afterState.baseRunners).toEqual(['runner1', null, 'runner3']);
  });

  test('should validate runner base is between 1 and 3', () => {
    const event1 = new PickedOffEvent(beforeState, config, 0);
    const event2 = new PickedOffEvent(beforeState, config, 4);
    expect(event1.validate()).toBe(false);
    expect(event2.validate()).toBe(false);
  });

  test('should validate there is a runner on the specified base', () => {
    beforeState.baseRunners = ['runner1', null, 'runner3'];
    const event = new PickedOffEvent(beforeState, config, 2);
    expect(event.validate()).toBe(false);
  });

  test('should create EndOfInningEvent on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    expect(event.childEvents.length).toBe(1);
    expect(event.childEvents[0].constructor.name).toBe('EndOfInningEvent');
  });

  test('should not create EndOfInningEvent before third out', () => {
    beforeState.outs = 0;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    expect(event.childEvents.length).toBe(0);
  });

  test('should update afterState with EndOfInningEvent state on third out', () => {
    beforeState.outs = config.outsPerInning - 1;
    beforeState.baseRunners = ['runner1', null, null];
    const event = new PickedOffEvent(beforeState, config, 1);
    event.apply();
    console.log("OutsPerInning: ", config.outsPerInning);
    console.log("AfterState: ", event.afterState);
    
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.balls).toBe(config.initialCount.balls);
    expect(event.afterState.strikes).toBe(config.initialCount.strikes);
    expect(event.afterState.baseRunners).toEqual([null, null, null]);
  });
}); 