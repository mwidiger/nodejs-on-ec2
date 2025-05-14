class BaseAdvanceEvent {
  constructor(fromBase, toBase, rosterPosition) {
    this.timestamp = Date.now();
    this.fromBase = fromBase; // null for batter
    this.toBase = toBase; // 0-2 for bases, 3 for home
    this.rosterPosition = rosterPosition; // 0 to n-1 for lineup position
  }

  apply(gameState) {
    const newState = { ...gameState.state };
    
    // If moving from a base, clear that base
    if (this.fromBase !== null) {
      newState.baseRunners[this.fromBase] = null;
    }

    // If moving to home, don't update baseRunners
    if (this.toBase === 3) {
      return newState;
    }

    // Store roster position on base
    newState.baseRunners[this.toBase] = this.rosterPosition;
    return newState;
  }
}

module.exports = BaseAdvanceEvent; 