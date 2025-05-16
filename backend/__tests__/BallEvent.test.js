const BallEvent = require('../models/BallEvent');
const Game = require('../models/Game');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('BallEvent', () => {
  let event;
  let game;
  let gameState;
  let config;

  beforeEach(() => {
    event = new BallEvent();
    game = new Game();
    config = new GameConfig();
    gameState = new GameState(config);
  });

  it('should initialize with timestamp and end flags', () => {
    expect(event.timestamp).toBeDefined();
    expect(event.plateAppearanceEnds).toBe(false);
    expect(event.inningEnds).toBe(false);
  });

  it('should increment balls when added to game', () => {
    game.addEvent(event);
    expect(game.state.balls).toBe(1);
  });

  it('should be tracked in game events', () => {
    game.addEvent(event);
    expect(game.events).toContain(event);
  });

  test('increments ball count', () => {
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(1);
  });

  test('walks batter with empty bases', () => {
    gameState.state.balls = 3;
    gameState.state.homeTeam.lineupPosition = 0; // first batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(0); // batter at first
    expect(newState.baseRunners[1]).toBeNull();
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('walks batter with bases loaded', () => {
    gameState.state.balls = 3;
    gameState.state.baseRunners = [2, 1, 0]; // runners on all bases
    gameState.state.homeTeam.lineupPosition = 3; // fourth batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(3); // batter at first
    expect(newState.baseRunners[1]).toBe(2); // runner from first to second
    expect(newState.baseRunners[2]).toBe(1); // runner from second to third
    // runner from third scores (not tracked in baseRunners)
  });

  test('walks batter with runners on first and second', () => {
    gameState.state.balls = 3;
    gameState.state.baseRunners = [1, 0, null]; // runners on first and second
    gameState.state.homeTeam.lineupPosition = 2; // third batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(2); // batter at first
    expect(newState.baseRunners[1]).toBe(1); // runner from first to second
    expect(newState.baseRunners[2]).toBe(0); // runner from second to third
  });

  test('walks batter with runner on first only', () => {
    gameState.state.balls = 3;
    gameState.state.baseRunners = [0, null, null]; // runner on first only
    gameState.state.homeTeam.lineupPosition = 1; // second batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(1); // batter at first
    expect(newState.baseRunners[1]).toBe(0); // runner from first to second
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('walks batter with runner on second only', () => {
    gameState.state.balls = 3;
    gameState.state.baseRunners = [null, 0, null]; // runner on second only
    gameState.state.homeTeam.lineupPosition = 1; // second batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(1); // batter at first
    expect(newState.baseRunners[1]).toBe(0); // runner stays on second
    expect(newState.baseRunners[2]).toBeNull();
  });

  test('walks batter with runners on first and third', () => {
    gameState.state.balls = 3;
    gameState.state.baseRunners = [1, null, 0]; // runners on first and third
    gameState.state.homeTeam.lineupPosition = 2; // third batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(2); // batter at first
    expect(newState.baseRunners[1]).toBe(1); // runner from first to second
    expect(newState.baseRunners[2]).toBe(0); // runner stays on third
  });

  test('walks batter late in lineup', () => {
    gameState.state.balls = 3;
    const lastPosition = config.playersPerRoster - 1;
    const secondToLastPosition = config.playersPerRoster - 2;
    gameState.state.baseRunners = [secondToLastPosition, null, null]; // runner on first
    gameState.state.homeTeam.lineupPosition = lastPosition; // last batter
    const newState = event.apply(gameState);
    expect(newState.balls).toBe(0);
    expect(newState.strikes).toBe(0);
    expect(newState.baseRunners[0]).toBe(lastPosition); // batter at first
    expect(newState.baseRunners[1]).toBe(secondToLastPosition); // runner from first to second
    expect(newState.baseRunners[2]).toBeNull();
  });
}); 