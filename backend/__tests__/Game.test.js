const Game = require('../models/Game');
const GameConfig = require('../models/GameConfig');
const BallEvent = require('../models/BallEvent');
const StrikeEvent = require('../models/StrikeEvent');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it('should initialize with default config', () => {
    expect(game.config).toBeInstanceOf(GameConfig);
  });

  it('should initialize with default counts', () => {
    expect(game.state.balls).toBe(0);
    expect(game.state.strikes).toBe(0);
    expect(game.state.outs).toBe(0);
  });

  it('should initialize with default inning state', () => {
    expect(game.state.inning).toBe(1);
    expect(game.state.isTopInning).toBe(true);
  });

  it('should initialize with teams and lineups', () => {
    expect(game.state.homeTeam.name).toBe('Home');
    expect(game.state.awayTeam.name).toBe('Away');
    expect(game.state.homeTeam.lineup).toHaveLength(game.config.playersPerRoster);
    expect(game.state.awayTeam.lineup).toHaveLength(game.config.playersPerRoster);
    expect(game.state.homeTeam.substitutes).toHaveLength(2);
    expect(game.state.awayTeam.substitutes).toHaveLength(2);
  });

  it('should support custom roster size', () => {
    const customConfig = new GameConfig({ playersPerRoster: 11 });
    const customGame = new Game(customConfig);
    expect(customGame.state.homeTeam.lineup).toHaveLength(11);
    expect(customGame.state.homeTeam.substitutes[0].id).toBe('H12');
    expect(customGame.state.homeTeam.substitutes[1].id).toBe('H13');
  });

  it('should initialize players with correct positions', () => {
    const homeLineup = game.state.homeTeam.lineup;
    expect(homeLineup[0].position).toBe(1);
    expect(homeLineup[game.config.playersPerRoster - 1].position).toBe(game.config.playersPerRoster);
    expect(game.state.homeTeam.substitutes[0].position).toBe(0);
  });

  it('should initialize lineup positions at 0', () => {
    expect(game.state.homeTeam.lineupPosition).toBe(0);
    expect(game.state.awayTeam.lineupPosition).toBe(0);
  });

  it('should get current batter based on inning', () => {
    expect(game.currentBatter).toBe(game.state.awayTeam.lineup[0]);
    game.state.isTopInning = false;
    expect(game.currentBatter).toBe(game.state.homeTeam.lineup[0]);
  });

  it('should advance lineup position', () => {
    game.advanceLineup();
    expect(game.state.awayTeam.lineupPosition).toBe(1);
    game.advanceLineup();
    expect(game.state.awayTeam.lineupPosition).toBe(2);
  });

  it('should wrap lineup position', () => {
    game.state.awayTeam.lineupPosition = game.config.playersPerRoster - 1;
    game.advanceLineup();
    expect(game.state.awayTeam.lineupPosition).toBe(0);
  });

  it('should store initial state', () => {
    expect(game.initialState).toEqual({
      balls: 0,
      strikes: 0,
      outs: 0,
      inning: 1,
      isTopInning: true,
      baseRunners: [null, null, null],
      homeTeam: expect.any(Object),
      awayTeam: expect.any(Object)
    });
  });

  it('should track events', () => {
    const event = new BallEvent();
    game.addEvent(event);
    expect(game.events).toContain(event);
  });

  it('should not change inning for non-ending events', () => {
    const event = new BallEvent();
    game.addEvent(event);
    expect(game.state.inning).toBe(1);
    expect(game.state.isTopInning).toBe(true);
  });

  it('should toggle top/bottom inning when event ends inning', () => {
    const event = new StrikeEvent();
    event.inningEnds = true;
    
    expect(game.state.isTopInning).toBe(true);
    expect(game.state.inning).toBe(1);
    
    game.addEvent(event);
    expect(game.state.isTopInning).toBe(false);
    expect(game.state.inning).toBe(1);

    game.addEvent(event);
    expect(game.state.isTopInning).toBe(true);
    expect(game.state.inning).toBe(2);
  });

  test('initializes with correct default state', () => {
    expect(game.state.balls).toBe(0);
    expect(game.state.strikes).toBe(0);
    expect(game.state.outs).toBe(0);
    expect(game.state.inning).toBe(1);
    expect(game.state.isTopInning).toBe(true);
  });

  test('stores initial state for reconstruction', () => {
    expect(game.initialState).toEqual(game.state);
    game.state.balls = 3;
    expect(game.initialState.balls).toBe(0);
  });

  test('initializes teams with correct lineup size', () => {
    expect(game.state.homeTeam.lineup).toHaveLength(game.config.playersPerRoster);
    expect(game.state.awayTeam.lineup).toHaveLength(game.config.playersPerRoster);
  });
}); 