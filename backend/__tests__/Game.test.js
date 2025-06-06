const Game = require('../models/Game');
const GameEvent = require('../models/GameEvent');
const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');
const BallEvent = require('../models/BallEvent');

describe('Game', () => {
  let game;
  let config;

  beforeEach(() => {
    game = new Game();
    config = new GameConfig();
  });

  test('should start with initial state', () => {
    const expectedState = new GameState();
    expect(game.state).toEqual(expectedState);
  });

  test('should validate and apply event before adding to events list', () => {
    // Create a mock event that tracks if validate and apply were called
    class MockEvent extends GameEvent {
      constructor(beforeState, config) {
        super(beforeState, config);
        this.validateCalled = false;
        this.applyCalled = false;
      }

      validate() {
        this.validateCalled = true;
        return true;
      }

      apply() {
        this.applyCalled = true;
      }
    }

    const event = new MockEvent(game.state, game.config);
    game.addEvent(event);

    expect(event.validateCalled).toBe(true);
    expect(event.applyCalled).toBe(true);
    expect(game.events).toContain(event);
  });

  test('should not add event if validation fails', () => {
    // Create a mock event that fails validation
    class MockEvent extends GameEvent {
      constructor(beforeState, config) {
        super(beforeState, config);
        this.applyCalled = false;
      }

      validate() {
        throw new Error('Validation failed');
      }

      apply() {
        this.applyCalled = true;
      }
    }

    const event = new MockEvent(game.state, game.config);
    expect(() => game.addEvent(event)).toThrow('Validation failed');
    expect(event.applyCalled).toBe(false);
    expect(game.events).not.toContain(event);
  });

  test('should not add event if apply fails', () => {
    // Create a mock event that fails during apply
    class MockEvent extends GameEvent {
      constructor(beforeState, config) {
        super(beforeState, config);
      }

      validate() {
        return true;
      }

      apply() {
        throw new Error('Apply failed');
      }
    }

    const event = new MockEvent(game.state, game.config);
    expect(() => game.addEvent(event)).toThrow('Apply failed');
    expect(game.events).not.toContain(event);
  });

  test('lastEvent should return null when no events exist', () => {
    expect(game.lastEvent).toBeNull();
  });

  test('lastEvent should return most recent event', () => {
    const event1 = new BallEvent(game.state, config);
    const event2 = new BallEvent(game.state, config);
    
    game.addEvent(event1);
    expect(game.lastEvent).toBe(event1);
    
    game.addEvent(event2);
    expect(game.lastEvent).toBe(event2);
  });
});