const BaseAdvanceEvent = require('./BaseAdvanceEvent');

class BallEvent {
  constructor() {
    this.timestamp = Date.now();
    this.plateAppearanceEnds = false;
    this.inningEnds = false;
  }

  apply(gameState) {
    const newState = { ...gameState.state };
    newState.balls += 1;

    // Check for walk
    if (newState.balls >= gameState.config.ballsForWalk) {
      const team = gameState.currentBattingTeam;
      const batterPosition = team.lineupPosition;

      // Move runners based on forced runner rules
      if (newState.baseRunners[0] !== null && newState.baseRunners[1] !== null && newState.baseRunners[2] !== null) {
        // Bases loaded - all runners advance
        const homeEvent = new BaseAdvanceEvent(2, 3, newState.baseRunners[2]);
        Object.assign(newState, homeEvent.apply(gameState));
        const thirdEvent = new BaseAdvanceEvent(1, 2, newState.baseRunners[1]);
        Object.assign(newState, thirdEvent.apply(gameState));
        const secondEvent = new BaseAdvanceEvent(0, 1, newState.baseRunners[0]);
        Object.assign(newState, secondEvent.apply(gameState));
      } else if (newState.baseRunners[0] !== null && newState.baseRunners[1] !== null) {
        // Runners on first and second - both advance
        const thirdEvent = new BaseAdvanceEvent(1, 2, newState.baseRunners[1]);
        Object.assign(newState, thirdEvent.apply(gameState));
        const secondEvent = new BaseAdvanceEvent(0, 1, newState.baseRunners[0]);
        Object.assign(newState, secondEvent.apply(gameState));
      } else if (newState.baseRunners[0] !== null) {
        // Runner on first only - advances to second
        const secondEvent = new BaseAdvanceEvent(0, 1, newState.baseRunners[0]);
        Object.assign(newState, secondEvent.apply(gameState));
      }

      // Move batter to first
      const firstEvent = new BaseAdvanceEvent(null, 0, batterPosition);
      Object.assign(newState, firstEvent.apply(gameState));

      // Reset count
      newState.balls = 0;
      newState.strikes = 0;
    }

    return newState;
  }
}

module.exports = BallEvent; 