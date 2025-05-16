class BaseAdvanceEvent {
  static instanceCount = 0;

  constructor(fromBase, toBase) {
    BaseAdvanceEvent.instanceCount++;
    this.timestamp = Date.now();
    this.fromBase = fromBase; // null for batter
    this.toBase = toBase; // 0-2 for bases, 3 for home
    this.childEvents = [];

    // Validate base numbers immediately
    if (this.toBase < 0 || this.toBase > 3) {
      throw new Error(`Invalid base number: ${this.toBase}`);
    }
    if (this.fromBase !== null && (this.fromBase < 0 || this.fromBase > 2)) {
      throw new Error(`Invalid base number: ${this.fromBase}`);
    }
  }

  getBaseName(base) {
    if (base === null) return 'batter\'s box';
    if (base === 0) return 'first base';
    if (base === 1) return 'second base';
    if (base === 2) return 'third base';
    if (base === 3) return 'home';
    return `base ${base}`;
  }

  validateBaseNumbers() {
    // Validation moved to constructor
  }

  isBaseOccupied(base, state) {
    return base !== 3 && state.baseRunners[base] !== null;
  }

  getRunnersBetween(fromBase, toBase, state) {
    if (fromBase === null) return [];
    const minBase = Math.min(fromBase, toBase);
    const maxBase = Math.max(fromBase, toBase);
    const runners = [];
    for (let base = minBase + 1; base < maxBase; base++) {
      if (state.baseRunners[base] !== null) {
        runners.push({ base, rosterPosition: state.baseRunners[base] });
      }
    }
    return runners;
  }

  handleScoring(state) {
    if (this.toBase === 3) {
      const team = this.getCurrentBattingTeam(state);
      team.runs = (team.runs || 0) + 1;
      return true;
    }
    return false;
  }

  validateMove(state) {
    // Validate there's a runner at fromBase (unless it's the batter)
    if (this.fromBase !== null && !this.isBaseOccupied(this.fromBase, state)) {
      throw new Error(`Cannot move from ${this.getBaseName(this.fromBase)} - no runner on base`);
    }

    if (this.fromBase !== null && this.toBase <= this.fromBase) {
      throw new Error(`Cannot move backwards from ${this.getBaseName(this.fromBase)} to ${this.getBaseName(this.toBase)}`);
    }
  }

  getRosterPosition(state) {
    if (this.fromBase === null) {
      const team = state.isTopInning ? state.awayTeam : state.homeTeam;
      return team.lineupPosition;
    }
    return state.baseRunners[this.fromBase];
  }

  moveRunner(state) {
    const rosterPosition = this.getRosterPosition(state);
    if (this.fromBase !== null) {
      state.baseRunners[this.fromBase] = null;
    }
    if (this.toBase !== 3) {
      state.baseRunners[this.toBase] = rosterPosition;
    }
  }

  getCurrentBattingTeam(state) {
    return state.isTopInning ? state.awayTeam : state.homeTeam;
  }

  getCurrentFieldingTeam(state) {
    return state.isTopInning ? state.homeTeam : state.awayTeam;
  }

  getCurrentInning(state) {
    return state.inning;
  }

  pushRunners(state) {
    const events = [];
    const baseAdvanceCount = this.toBase - (this.fromBase === null ? -1 : this.fromBase);

    // Iterate from third base down to fromBase+1
    for (let base = 2; base > (this.fromBase === null ? -1 : this.fromBase); base--) {
      if (this.isBaseOccupied(base, state)) {
        // Count unoccupied bases between this base and fromBase
        let unoccupiedCount = 0;
        for (let checkBase = base - 1; checkBase > (this.fromBase === null ? -1 : this.fromBase); checkBase--) {
          if (!this.isBaseOccupied(checkBase, state)) {
            unoccupiedCount++;
          }
        }

        // Calculate how many bases this runner needs to move
        const pushDistance = Math.max(0, baseAdvanceCount - unoccupiedCount);
        if (pushDistance > 0) {
          // If pushing to home or beyond, send to home
          const nextBase = base + pushDistance >= 3 ? 3 : base + pushDistance;
          const event = new BaseAdvanceEvent(base, nextBase);
          events.push(event);
        }
      }
    }

    return events;
  }

  validate(state) {
    this.validateBaseNumbers();
    this.validateMove(state);
  }

  apply(gameState) {
    const newState = { ...gameState.state };
    
    try {
      // Validate first
      this.validate(newState);
      
      // Get any events needed to push runners
      const pushEvents = this.pushRunners(newState);
      this.childEvents = pushEvents;
      
      // Apply push events first
      for (const event of pushEvents) {
        event.moveRunner(newState);
        event.handleScoring(newState);
      }
      
      // Then apply this event
      this.moveRunner(newState);
      this.handleScoring(newState);
      
      return newState;
    } catch (error) {
      // Ensure we don't modify state if validation fails
      throw error;
    }
  }
}

module.exports = BaseAdvanceEvent; 