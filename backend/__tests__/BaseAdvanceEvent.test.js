const Game = require('../models/Game');
const BaseAdvanceEvent = require('../models/BaseAdvanceEvent');
const { BATTER, HOME_PLATE } = require('../models/BaseConstants');
const { InvalidBaseError, OccupiedBaseError, NoRunnerError, InvalidAdvanceError } = require('../models/BaseAdvanceErrors');

describe('BaseAdvanceEvent', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('batter to first with no runners', () => {
    const event = new BaseAdvanceEvent(game.state, game.config, BATTER, 0);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBe(0); // First batter (position 0) on first
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBeNull();
    expect(game.state.awayTeam.runs).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(1); // Lineup should advance
  });

  test('batter to first with runner on third', () => {
    // First place a runner on third
    const runnerToThird = new BaseAdvanceEvent(game.state, game.config, BATTER, 2);
    game.addEvent(runnerToThird);

    // Now try to advance batter to first
    const event = new BaseAdvanceEvent(game.state, game.config, BATTER, 0);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBe(1); // Batter (position 1) on first
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBe(0); // Original runner stays on third
    expect(game.state.awayTeam.runs).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(2); // Lineup should advance twice
  });

  test('batter to second with runner on third', () => {
    // First place a runner on third
    const runnerToThird = new BaseAdvanceEvent(game.state, game.config, BATTER, 2);
    game.addEvent(runnerToThird);

    // Now try to advance batter to second
    const event = new BaseAdvanceEvent(game.state, game.config, BATTER, 1);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(1); // Batter (position 1) on second
    expect(game.state.baseRunners[2]).toBe(0); // Original runner stays on third
    expect(game.state.awayTeam.runs).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(2); // Lineup should advance twice
  });

  test('batter to home with runner on third should throw error', () => {
    // First place a runner on third
    const runnerToThird = new BaseAdvanceEvent(game.state, game.config, BATTER, 2);
    game.addEvent(runnerToThird);

    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, BATTER, HOME_PLATE);
      game.addEvent(event);
    }).toThrow(OccupiedBaseError);
  });

  test('runner advances from first to second', () => {
    // First place a runner on first
    const runnerToFirst = new BaseAdvanceEvent(game.state, game.config, BATTER, 0);
    game.addEvent(runnerToFirst);

    // Now advance from first to second
    const event = new BaseAdvanceEvent(game.state, game.config, 0, 1);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBe(0);
    expect(game.state.baseRunners[2]).toBeNull();
    expect(game.state.awayTeam.runs).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(1); // Lineup should only advance once
  });

  test('runner advances from second to third', () => {
    // First place a runner on second
    const runnerToSecond = new BaseAdvanceEvent(game.state, game.config, BATTER, 1);
    game.addEvent(runnerToSecond);

    // Now advance from second to third
    const event = new BaseAdvanceEvent(game.state, game.config, 1, 2);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBe(0);
    expect(game.state.awayTeam.runs).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(1); // Lineup should only advance once
  });

  test('runner advances from third to home', () => {
    // First place a runner on third
    const runnerToThird = new BaseAdvanceEvent(game.state, game.config, BATTER, 2);
    game.addEvent(runnerToThird);

    // Now advance from third to home
    const event = new BaseAdvanceEvent(game.state, game.config, 2, HOME_PLATE);
    game.addEvent(event);

    expect(game.state.baseRunners[0]).toBeNull();
    expect(game.state.baseRunners[1]).toBeNull();
    expect(game.state.baseRunners[2]).toBeNull();
    expect(game.state.awayTeam.runs).toBe(1);
    expect(game.state.awayTeam.lineupPosition).toBe(1); // Lineup should only advance once
  });

  // Validation tests
  test('should throw error for invalid fromBase', () => {
    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, -2, 1);
      game.addEvent(event);
    }).toThrow(InvalidBaseError);
  });

  test('should throw error for invalid toBase', () => {
    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, 0, 4);
      game.addEvent(event);
    }).toThrow(InvalidBaseError);
  });

  test('should throw error when advancing to same base', () => {
    // First place a runner on second
    const runnerToSecond = new BaseAdvanceEvent(game.state, game.config, BATTER, 1);
    game.addEvent(runnerToSecond);

    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, 1, 1);
      game.addEvent(event);
    }).toThrow(InvalidAdvanceError);
  });

  test('should throw error when no runner on base', () => {
    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, 0, 1);
      game.addEvent(event);
    }).toThrow(NoRunnerError);
  });

  test('should throw error when advancing through occupied base', () => {
    // First place a runner on second
    const runnerToSecond = new BaseAdvanceEvent(game.state, game.config, BATTER, 1);
    game.addEvent(runnerToSecond);

    // Place a runner on first
    const runnerToFirst = new BaseAdvanceEvent(game.state, game.config, BATTER, 0);
    game.addEvent(runnerToFirst);

    // Now try to advance from first to third
    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, 0, 2);
      game.addEvent(event);
    }).toThrow(OccupiedBaseError);
  });

  test('should throw error when advancing to occupied base', () => {
    // First place a runner on second
    const runnerToSecond = new BaseAdvanceEvent(game.state, game.config, BATTER, 1);
    game.addEvent(runnerToSecond);

    // Place a runner on first
    const runnerToFirst = new BaseAdvanceEvent(game.state, game.config, BATTER, 0);
    game.addEvent(runnerToFirst);

    // Now try to advance from first to second
    expect(() => {
      const event = new BaseAdvanceEvent(game.state, game.config, 0, 1);
      game.addEvent(event);
    }).toThrow(OccupiedBaseError);
  });
}); 