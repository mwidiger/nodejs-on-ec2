const BaseAdvanceEvent = require('../models/BaseAdvanceEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('BaseAdvanceEvent', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState(new GameConfig());
    gameState.state.isTopInning = false; // use home team for all tests
  });

  test('moves batter to first base', () => {
    const event = new BaseAdvanceEvent(null, 0, 0); // batter is lineup[0]
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBe(0); // store roster position
    expect(newState.baseRunners[1]).toBeNull();
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('moves runner from first to second', () => {
    gameState.state.baseRunners[0] = 1; // runner is lineup[1]
    const event = new BaseAdvanceEvent(0, 1, 1);
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBe(1); // store roster position
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('moves runner from second to third', () => {
    gameState.state.baseRunners[1] = 2; // runner is lineup[2]
    const event = new BaseAdvanceEvent(1, 2, 2);
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBeNull();
    expect(newState.baseRunners[2]).toBe(2); // store roster position
  });

  test('moves runner from third to home', () => {
    gameState.state.baseRunners[2] = 3; // runner is lineup[3]
    const event = new BaseAdvanceEvent(2, 3, 3);
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBeNull();
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('moves batter to second (double)', () => {
    const event = new BaseAdvanceEvent(null, 1, 4); // batter is lineup[4]
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBe(4); // store roster position
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('moves batter to third (triple)', () => {
    const event = new BaseAdvanceEvent(null, 2, 5); // batter is lineup[5]
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBeNull();
    expect(newState.baseRunners[2]).toBe(5); // store roster position
  });

  test('tracks runner correctly after substitution', () => {
    // Put runner on first base (roster position 1)
    gameState.state.baseRunners[0] = 1;
    
    // Substitute player at roster position 1
    const originalPlayer = gameState.state.homeTeam.lineup[1];
    const substitute = gameState.state.homeTeam.substitutes[0];
    gameState.state.homeTeam.lineup[1] = substitute;
    
    // Runner should still be tracked at position 1
    expect(gameState.state.baseRunners[0]).toBe(1);
    
    // Move runner to second
    const event = new BaseAdvanceEvent(0, 1, 1);
    const newState = event.apply(gameState);
    expect(newState.baseRunners[0]).toBeNull();
    expect(newState.baseRunners[1]).toBe(1);
    
    // Verify the substitute is now on second base
    const team = gameState.currentBattingTeam;
    expect(team.lineup[1]).toBe(substitute);
  });
}); 