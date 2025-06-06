const GameConfig = require('./GameConfig');

class GameState {
  constructor(config = new GameConfig()) {
    this.config = config;
    this.reset();
  }

  reset() {
    this.inning = 1;
    this.isTopInning = true;
    this.balls = this.config.initialCount.balls;
    this.strikes = this.config.initialCount.strikes;
    this.outs = 0;
    this.homeTeam = {
      runs: 0,
      runsPerInning: []
    };
    this.awayTeam = {
      runs: 0,
      runsPerInning: []
    };
    this.baseRunners = [null, null, null]; // 1st, 2nd, 3rd base
    this.isGameOver = false;
    this.gameEndReason = null;
    this.homeTeam.lineupPosition = 0;
    this.homeTeam.lineup = [
      'Mike Trout',
      'Shohei Ohtani',
      'Mookie Betts',
      'Freddie Freeman',
      'Ronald Acuña Jr.',
      'Juan Soto',
      'Aaron Judge',
      'Yordan Alvarez',
      'Manny Machado'
    ];
    this.homeTeam.substitutes = [
      'Jose Altuve',
      'Fernando Tatis Jr.'
    ];
    this.awayTeam.lineupPosition = 0;
    this.awayTeam.lineup = [
      'Bryce Harper',
      'Trea Turner',
      'Francisco Lindor',
      'Jose Ramirez',
      'Vladimir Guerrero Jr.',
      'Rafael Devers',
      'Carlos Correa',
      'Corey Seager',
      'Xander Bogaerts',
      'Kyle Tucker',
      'Austin Riley'
    ];
    this.awayTeam.substitutes = [
      'Pete Alonso',
      'Jazz Chisholm Jr.'
    ];
  }

  clone() {
    const cloned = new GameState(this.config);
    cloned.inning = this.inning;
    cloned.isTopInning = this.isTopInning;
    cloned.balls = this.balls;
    cloned.strikes = this.strikes;
    cloned.outs = this.outs;
    cloned.homeTeam = {
      runs: this.homeTeam.runs,
      runsPerInning: [...this.homeTeam.runsPerInning]
    };
    cloned.awayTeam = {
      runs: this.awayTeam.runs,
      runsPerInning: [...this.awayTeam.runsPerInning]
    };
    cloned.baseRunners = [...this.baseRunners];
    cloned.isGameOver = this.isGameOver;
    cloned.gameEndReason = this.gameEndReason;
    cloned.homeTeam.lineupPosition = this.homeTeam.lineupPosition;
    cloned.homeTeam.lineup = [...this.homeTeam.lineup];
    cloned.homeTeam.substitutes = [...this.homeTeam.substitutes];
    cloned.awayTeam.lineupPosition = this.awayTeam.lineupPosition;
    cloned.awayTeam.lineup = [...this.awayTeam.lineup];
    cloned.awayTeam.substitutes = [...this.awayTeam.substitutes];
    return cloned;
  }

  get battingTeam() {
    return this.isTopInning ? this.awayTeam : this.homeTeam;
  }

  get defendingTeam() {
    return this.isTopInning ? this.homeTeam : this.awayTeam;
  }
}

module.exports = GameState; 