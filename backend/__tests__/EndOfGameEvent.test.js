const EndOfGameEvent = require('../models/EndOfGameEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');

describe('EndOfGameEvent', () => {
  let beforeState;
  let config;

  beforeEach(() => {
    beforeState = new GameState();
    config = new GameConfig();
  });

  test('should set game as ended', () => {
    const event = new EndOfGameEvent(beforeState, config, 'weather');
    event.apply();
    expect(event.afterState.isGameOver).toBe(true);
  });

  test('should store game end reason', () => {
    const reason = 'weather';
    const event = new EndOfGameEvent(beforeState, config, reason);
    event.apply();
    expect(event.afterState.gameEndReason).toBe(reason);
  });

  test('should throw error when trying to apply event after game is over', () => {
    beforeState.isGameOver = true;
    const event = new EndOfGameEvent(beforeState, config, 'weather');
    expect(() => {
      event.validate();
    }).toThrow('Cannot add events after game has ended');
  });

  test('should allow creating and applying EndOfGameEvent when game is not over', () => {
    beforeState.isGameOver = false;
    const event = new EndOfGameEvent(beforeState, config, 'weather');
    expect(() => {
      event.validate();
      event.apply();
    }).not.toThrow();
    expect(event.afterState.isGameOver).toBe(true);
  });

  test('should handle different end reasons', () => {
    const reasons = ['weather', 'time_limit', 'mercy_rule', 'darkness', 'curfew'];
    reasons.forEach(reason => {
      const event = new EndOfGameEvent(beforeState, config, reason);
      event.apply();
      expect(event.afterState.gameEndReason).toBe(reason);
    });
  });
}); 