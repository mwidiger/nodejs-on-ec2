class GameState {
  constructor(config) {
    this.config = config;
    this.state = {
      balls: config.initialBalls,
      strikes: config.initialStrikes,
      outs: 0,
      inning: 1,
      isTopInning: true,
      baseRunners: [null, null, null], // 1st, 2nd, 3rd base
      homeTeam: {
        name: 'Home',
        lineup: Array(config.playersPerRoster).fill().map((_, i) => ({
          id: `H${i + 1}`,
          name: `Home Player ${i + 1}`,
          position: i + 1
        })),
        substitutes: [
          { id: `H${config.playersPerRoster + 1}`, name: 'Home Sub 1', position: 0 },
          { id: `H${config.playersPerRoster + 2}`, name: 'Home Sub 2', position: 0 }
        ],
        lineupPosition: 0,
        inningScores: {}, // inning number -> runs
        hits: 0,
        errors: 0,
        runs: 0
      },
      awayTeam: {
        name: 'Away',
        lineup: Array(config.playersPerRoster).fill().map((_, i) => ({
          id: `A${i + 1}`,
          name: `Away Player ${i + 1}`,
          position: i + 1
        })),
        substitutes: [
          { id: `A${config.playersPerRoster + 1}`, name: 'Away Sub 1', position: 0 },
          { id: `A${config.playersPerRoster + 2}`, name: 'Away Sub 2', position: 0 }
        ],
        lineupPosition: 0,
        inningScores: {}, // inning number -> runs
        hits: 0,
        errors: 0,
        runs: 0
      }
    };
  }

  resetCount() {
    this.state.balls = this.config.initialBalls;
    this.state.strikes = this.config.initialStrikes;
    this.state.outs = 0;
  }

  get currentBatter() {
    const team = this.state.isTopInning ? this.state.awayTeam : this.state.homeTeam;
    return team.lineup[team.lineupPosition];
  }

  advanceLineup() {
    const team = this.state.isTopInning ? this.state.awayTeam : this.state.homeTeam;
    team.lineupPosition = (team.lineupPosition + 1) % team.lineup.length;
  }

  handleInningEnd() {
    this.state.outs = 0;
    if (!this.state.isTopInning) {
      this.state.inning++;
    }
    this.state.isTopInning = !this.state.isTopInning;
  }

  get currentBattingTeam() {
    return this.state.isTopInning ? this.state.awayTeam : this.state.homeTeam;
  }

  get currentFieldingTeam() {
    return this.state.isTopInning ? this.state.homeTeam : this.state.awayTeam;
  }

  get totalRuns() {
    return {
      home: Object.values(this.state.homeTeam.inningScores).reduce((sum, runs) => sum + runs, 0),
      away: Object.values(this.state.awayTeam.inningScores).reduce((sum, runs) => sum + runs, 0)
    };
  }
}

module.exports = GameState; 