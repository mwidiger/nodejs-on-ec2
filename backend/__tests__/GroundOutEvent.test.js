const GroundOutEvent = require('../models/GroundOutEvent');
const GameState = require('../models/GameState');
const EndOfInningEvent = require('../models/EndOfInningEvent');

describe('GroundOutEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = { 
      outsPerInning: 3,
      initialCount: { balls: 0, strikes: 0 }
    };
  });

  it('should increment outs by 1', () => {
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.outs).toBe(1);
  });

  it('should reset count after out', () => {
    beforeState.balls = 2;
    beforeState.strikes = 1;
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.balls).toBe(0);
    expect(event.afterState.strikes).toBe(0);
  });

  it('should advance lineup position', () => {
    beforeState.battingTeam.lineupPosition = 3;
    beforeState.battingTeam.lineup = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9'];
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.battingTeam.lineupPosition).toBe(4);
  });

  it('should advance all runners one base', () => {
    beforeState.battingTeam.lineup = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8', 'player9'];
    beforeState.baseRunners = [0, 1, 2]; // Runners are identified by their lineup position
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.baseRunners).toEqual([null, 0, 1]);
  });

  it('should create EndOfInningEvent on third out', () => {
    beforeState.outs = 2;
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.childEvents[0]).toBeInstanceOf(EndOfInningEvent);
  });

  it('should not create EndOfInningEvent before third out', () => {
    beforeState.outs = 1;
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.childEvents[0]).not.toBeInstanceOf(EndOfInningEvent);
  });

  it('should update state correctly when EndOfInningEvent occurs', () => {
    beforeState.outs = 2;
    beforeState.inning = 3;
    beforeState.isTopInning = true;
    const event = new GroundOutEvent(beforeState, config);
    event.apply();
    expect(event.afterState.outs).toBe(0);
    expect(event.afterState.inning).toBe(3);
    expect(event.afterState.isTopInning).toBe(false);
  });
}); 