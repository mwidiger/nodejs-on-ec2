const BaseAdvanceEvent = require('../models/BaseAdvanceEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');
const Game = require('../models/Game');

describe('BaseAdvanceEvent', () => {
  let game;
  let config;
  let event;

  beforeEach(() => {
    config = new GameConfig();
    game = new Game(config);
    // Set initial lineup position
    game.state.isTopInning = false; // home team is batting
    game.state.homeTeam.lineupPosition = 0;
    event = new BaseAdvanceEvent();
  });

  describe('validation', () => {
    test('validates base numbers in constructor', () => {
      expect(() => new BaseAdvanceEvent(null, 4)).toThrow('Invalid base number: 4');
      expect(() => new BaseAdvanceEvent(null, -1)).toThrow('Invalid base number: -1');
      expect(() => new BaseAdvanceEvent(-1, 1)).toThrow('Invalid base number: -1');
      expect(() => new BaseAdvanceEvent(3, 1)).toThrow('Invalid base number: 3');
    });

    test('validates backwards movement before any state changes', () => {
      game.state.baseRunners = [null, 0, null]; // runner on second
      const invalidEvent = new BaseAdvanceEvent(1, 0);
      const originalState = { ...game.state };
      
      expect(() => game.addEvent(invalidEvent)).toThrow('Cannot move backwards from second base to first base');
      expect(game.state).toEqual(originalState);
    });

    test('validates runner presence at fromBase', () => {
      game.state.baseRunners = [null, null, null]; // empty bases
      const invalidEvent = new BaseAdvanceEvent(1, 2);
      const originalState = { ...game.state };
      
      expect(() => game.addEvent(invalidEvent)).toThrow('Cannot move from second base - no runner on base');
      expect(game.state).toEqual(originalState);
    });

    test('performs all validations before any state changes', () => {
      // Set up a state that would fail multiple validations
      game.state.baseRunners = [0, 1, null]; // runners on first and second
      const invalidEvent = new BaseAdvanceEvent(1, 0); // trying to move backwards to occupied base
      const originalState = { ...game.state };
      
      expect(() => game.addEvent(invalidEvent)).toThrow('Cannot move backwards from second base to first base');
      expect(game.state).toEqual(originalState);
    });
  });

  test('validates base numbers', () => {
    expect(() => new BaseAdvanceEvent(null, -1)).toThrow('Invalid base number: -1');
    expect(() => new BaseAdvanceEvent(null, 4)).toThrow('Invalid base number: 4');
    expect(() => new BaseAdvanceEvent(-1, 1)).toThrow('Invalid base number: -1');
    expect(() => new BaseAdvanceEvent(3, 1)).toThrow('Invalid base number: 3');
  });

  test('checks if base is occupied', () => {
    game.state.baseRunners = [0, null, null];
    expect(event.isBaseOccupied(0, game.state)).toBe(true);
    expect(event.isBaseOccupied(1, game.state)).toBe(false);
    expect(event.isBaseOccupied(3, game.state)).toBe(false);
  });

  test('gets runners between bases', () => {
    game.state.baseRunners = [0, 1, 2];
    const runners = event.getRunnersBetween(0, 2, game.state);
    expect(runners).toHaveLength(1);
    expect(runners[0]).toEqual({ base: 1, rosterPosition: 1 });
  });

  test('handles scoring', () => {
    const scoringEvent = new BaseAdvanceEvent(2, 3);
    expect(scoringEvent.handleScoring(game.state)).toBe(true);
    
    const nonScoringEvent = new BaseAdvanceEvent(1, 2);
    expect(nonScoringEvent.handleScoring(game.state)).toBe(false);
  });

  test('gets roster position', () => {
    game.state.isTopInning = false; // home team is batting
    game.state.homeTeam.lineupPosition = 3;
    game.state.baseRunners = [1, null, null];
    
    const batterEvent = new BaseAdvanceEvent(null, 1);
    expect(batterEvent.getRosterPosition(game.state)).toBe(3);
    
    const runnerEvent = new BaseAdvanceEvent(0, 1);
    expect(runnerEvent.getRosterPosition(game.state)).toBe(1);
  });

  test('moves runner', () => {
    game.state.baseRunners = [0, null, null];
    const event = new BaseAdvanceEvent(0, 1);
    event.moveRunner(game.state);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(0);
  });

  test('gets current teams and inning', () => {
    game.state.inning = 3;
    game.state.isTopInning = false; // home team is batting
    game.state.homeTeam.lineupPosition = 2;
    game.state.awayTeam.lineupPosition = 1;
    
    expect(event.getCurrentInning(game.state)).toBe(3);
    expect(event.getCurrentBattingTeam(game.state).lineupPosition).toBe(2);
    expect(event.getCurrentFieldingTeam(game.state).lineupPosition).toBe(1);
  });

  test('moves batter to first base', () => {
    const event = new BaseAdvanceEvent(null, 0);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBe(0); // batter at first base
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBeNull();
  });

  test('moves runner from first to second', () => {
    game.state.baseRunners = [0, null, null]; // runner on first base
    const event = new BaseAdvanceEvent(0, 1);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(0); // runner at second base
    expect(game.state.baseRunners[2]).toBeNull();
  });

  test('moves runner from second to third', () => {
    game.state.baseRunners = [null, 0, null]; // runner on second base
    const event = new BaseAdvanceEvent(1, 2);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBe(0); // runner at third base
  });

  test('moves runner from third to home', () => {
    game.state.baseRunners = [null, null, 0]; // runner on third base
    const event = new BaseAdvanceEvent(2, 3);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBeNull(); // runner scored
  });

  test('moves batter to second (double)', () => {
    game.state.isTopInning = false; // home team is batting
    game.state.homeTeam.lineupPosition = 4;
    const event = new BaseAdvanceEvent(null, 1);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(4); // batter at second base
    expect(game.state.baseRunners[2]).toBeNull();
  });

  test('moves batter to third (triple)', () => {
    game.state.isTopInning = false; // home team is batting
    game.state.homeTeam.lineupPosition = 5;
    const event = new BaseAdvanceEvent(null, 2);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBe(5); // batter at third base
  });

  test('tracks runner correctly after substitution', () => {
    // Put runner on first base
    game.state.baseRunners[0] = 1;
    
    // Substitute player at roster position 1
    const originalPlayer = game.state.homeTeam.lineup[1];
    const substitute = game.state.homeTeam.substitutes[0];
    game.state.homeTeam.lineup[1] = substitute;
    
    // Runner should still be tracked at position 1
    expect(game.state.baseRunners[0]).toBe(1);
    
    // Move runner to second base
    const event = new BaseAdvanceEvent(0, 1);
    game.addEvent(event);
    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(1); // substitute at second base
    expect(game.state.baseRunners[2]).toBeNull();
    
    // Verify the substitute is now on second base
    expect(game.state.homeTeam.lineup[1]).toBe(substitute);
  });

  test('throws error when trying to move backwards', () => {
    game.state.baseRunners = [null, 0, null]; // runner on second base
    const event = new BaseAdvanceEvent(1, 0);
    expect(() => game.addEvent(event)).toThrow('Cannot move backwards from second base to first base');
  });

  describe('runner pushing behavior', () => {
    beforeEach(() => {
      game.state.homeTeam.runs = 0;
      game.state.awayTeam.runs = 0;
    });

    test('pushes runner when not enough unoccupied bases ahead', () => {
      // Set up runners on first and third
      game.state.baseRunners = [0, null, 2]; // runners on first and third
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 1;
      
      // Batter advances to second (baseAdvanceCount = 2)
      const event = new BaseAdvanceEvent(null, 1);
      game.addEvent(event);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(1); // Runner from third scored
      expect(game.state.baseRunners[2]).toBe(0); // Runner from first on third
      expect(game.state.baseRunners[1]).toBe(1); // Batter on second
      expect(game.state.baseRunners[0]).toBeNull();

      // Verify the events that were generated
      expect(game.events).toHaveLength(3);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(1);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(2);
      expect(game.events[1].toBase).toBe(3);
      expect(game.events[2]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[2].fromBase).toBe(0);
      expect(game.events[2].toBase).toBe(2);
    });

    test('pushes multiple runners in correct order', () => {
      // Set up runners on first and second
      game.state.baseRunners = [0, 1, null]; // runners on first and second
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 2;
      
      // Batter advances to first (baseAdvanceCount = 1)
      const event = new BaseAdvanceEvent(null, 0);
      game.addEvent(event);
      
      // Verify BaseAdvanceEvent was called three times:
      // 1. Original event (batter to first)
      // 2. Push event (runner on second to third)
      // 3. Push event (runner on first to second)
      expect(game.events).toHaveLength(3);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(0);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(1);
      expect(game.events[1].toBase).toBe(2);
      expect(game.events[2]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[2].fromBase).toBe(0);
      expect(game.events[2].toBase).toBe(1);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(0); // No runs scored
      expect(game.state.baseRunners[2]).toBe(1); // Runner from second on third
      expect(game.state.baseRunners[1]).toBe(0); // Runner from first on second
      expect(game.state.baseRunners[0]).toBe(2); // Batter on first
    });

    test('pushes runner to home when necessary', () => {
      // Set up runners on first and third
      game.state.baseRunners = [0, null, 2]; // runners on first and third
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 1;
      
      // Batter advances to third (baseAdvanceCount = 3)
      const event = new BaseAdvanceEvent(null, 2);
      game.addEvent(event);
      
      // Verify BaseAdvanceEvent was called three times:
      // 1. Original event (batter to third)
      // 2. Push event (runner on third to home)
      // 3. Push event (runner on first to home)
      expect(game.events).toHaveLength(3);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(2);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(2);
      expect(game.events[1].toBase).toBe(3);
      expect(game.events[2]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[2].fromBase).toBe(0);
      expect(game.events[2].toBase).toBe(3);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(2); // Both runners scored
      expect(game.state.baseRunners[2]).toBe(1); // Batter on third
      expect(game.state.baseRunners[1]).toBeNull();
      expect(game.state.baseRunners[0]).toBeNull();
    });

    test('handles bases loaded scenario', () => {
      // Set up bases loaded
      game.state.baseRunners = [0, 1, 2]; // runners on first, second, and third
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 3;
      
      // Batter advances to second (baseAdvanceCount = 2)
      const event = new BaseAdvanceEvent(null, 1);
      game.addEvent(event);
      
      // Verify BaseAdvanceEvent was called four times:
      // 1. Original event (batter to second)
      // 2. Push event (runner on third to home)
      // 3. Push event (runner on second to home)
      // 4. Push event (runner on first to third)
      expect(game.events).toHaveLength(4);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(1);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(2);
      expect(game.events[1].toBase).toBe(3);
      expect(game.events[2]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[2].fromBase).toBe(1);
      expect(game.events[2].toBase).toBe(3);
      expect(game.events[3]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[3].fromBase).toBe(0);
      expect(game.events[3].toBase).toBe(2);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(2); // Two runners scored
      expect(game.state.baseRunners[2]).toBe(0); // Runner from first on third
      expect(game.state.baseRunners[1]).toBe(3); // Batter on second
      expect(game.state.baseRunners[0]).toBeNull();
    });

    test('pushes runner multiple bases when needed', () => {
      // Set up runner on first
      game.state.baseRunners = [0, null, null]; // runner on first
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 1;
      
      // Batter advances to third (baseAdvanceCount = 3)
      const event = new BaseAdvanceEvent(null, 2);
      game.addEvent(event);
      
      // Verify BaseAdvanceEvent was called twice:
      // 1. Original event (batter to third)
      // 2. Push event (runner on first to home)
      expect(game.events).toHaveLength(2);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(2);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(0);
      expect(game.events[1].toBase).toBe(3);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(1); // Runner from first scored
      expect(game.state.baseRunners[2]).toBe(1); // Batter on third
      expect(game.state.baseRunners[1]).toBeNull();
      expect(game.state.baseRunners[0]).toBeNull();
    });

    test('does not push runner when enough unoccupied bases ahead', () => {
      // Set up runners on first and third
      game.state.baseRunners = [0, null, 2]; // runners on first and third
      game.state.isTopInning = false;
      game.state.homeTeam.lineupPosition = 1;
      
      // Batter advances to first (baseAdvanceCount = 1)
      const event = new BaseAdvanceEvent(null, 0);
      game.addEvent(event);
      
      // Verify BaseAdvanceEvent was called twice:
      // 1. Original event (batter to first)
      // 2. Push event (runner on first to second)
      expect(game.events).toHaveLength(2);
      expect(game.events[0]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[0].fromBase).toBe(null);
      expect(game.events[0].toBase).toBe(0);
      expect(game.events[1]).toBeInstanceOf(BaseAdvanceEvent);
      expect(game.events[1].fromBase).toBe(0);
      expect(game.events[1].toBase).toBe(1);
      
      // Verify final state
      expect(game.state.homeTeam.runs).toBe(0); // No runs scored
      expect(game.state.baseRunners[2]).toBe(2); // Runner on third stays
      expect(game.state.baseRunners[1]).toBe(0); // Runner from first on second
      expect(game.state.baseRunners[0]).toBe(1); // Batter on first
    });
  });

  describe('scoring behavior', () => {
    test('scores run when runner reaches home', () => {
      // Set up runner on third
      game.state.baseRunners = [null, null, 0]; // runner on third
      game.state.isTopInning = false; // home team is batting
      game.state.homeTeam.runs = 0;
      
      // Runner advances to home
      const event = new BaseAdvanceEvent(2, 3);
      game.addEvent(event);
      
      expect(game.state.homeTeam.runs).toBe(1);
      expect(game.state.baseRunners[2]).toBeNull();
    });

    test('scores run for correct team', () => {
      // Set up runner on third for away team
      game.state.baseRunners = [null, null, 0]; // runner on third
      game.state.isTopInning = true; // away team is batting
      
      // Runner advances to home
      const event = new BaseAdvanceEvent(2, 3);
      game.addEvent(event);
      
      expect(game.state.awayTeam.runs).toBe(1);
      expect(game.state.homeTeam.runs).toBe(0);
    });
  });
}); 