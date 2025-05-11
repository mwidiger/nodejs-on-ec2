import React, { useState } from 'react';
import './GameScoring.css';
import {
  BallEvent,
  StrikeEvent,
  OutEvent,
  HitEvent,
  ErrorEvent,
  StrikeoutEvent,
  StolenBaseEvent,
  CaughtStealingEvent,
  WalkEvent,
  RunnerAdvanceEvent,
  FieldersChoiceEvent,
  SacrificeEvent,
  ThrowEvent,
  PickoffEvent,
  WildPitchEvent,
  PassedBallEvent,
  BalkEvent,
  InterferenceEvent
} from './GameEventTypes';

const GameScoring = () => {
  const [gameState, setGameState] = useState({
    inning: 1,
    isTopInning: true,
    outs: 0,
    balls: 0,
    strikes: 0,
    bases: {
      first: null,
      second: null,
      third: null
    },
    homeTeam: {
      name: 'Home Team',
      score: 0,
      hits: 0,
      errors: 0,
      inningScores: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      lineup: [
        { number: 1, name: 'Player 1', position: 'P' },
        { number: 2, name: 'Player 2', position: 'C' },
        { number: 3, name: 'Player 3', position: '1B' },
        { number: 4, name: 'Player 4', position: '2B' },
        { number: 5, name: 'Player 5', position: '3B' },
        { number: 6, name: 'Player 6', position: 'SS' },
        { number: 7, name: 'Player 7', position: 'LF' },
        { number: 8, name: 'Player 8', position: 'CF' },
        { number: 9, name: 'Player 9', position: 'RF' }
      ],
      substitutes: [
        { number: 10, name: 'Sub 1', position: 'P' },
        { number: 11, name: 'Sub 2', position: 'C' }
      ],
      nextBatter: 1
    },
    awayTeam: {
      name: 'Away Team',
      score: 0,
      hits: 0,
      errors: 0,
      inningScores: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      lineup: [
        { number: 1, name: 'Player 1', position: 'P' },
        { number: 2, name: 'Player 2', position: 'C' },
        { number: 3, name: 'Player 3', position: '1B' },
        { number: 4, name: 'Player 4', position: '2B' },
        { number: 5, name: 'Player 5', position: '3B' },
        { number: 6, name: 'Player 6', position: 'SS' },
        { number: 7, name: 'Player 7', position: 'LF' },
        { number: 8, name: 'Player 8', position: 'CF' },
        { number: 9, name: 'Player 9', position: 'RF' }
      ],
      substitutes: [
        { number: 10, name: 'Sub 1', position: 'P' },
        { number: 11, name: 'Sub 2', position: 'C' }
      ],
      nextBatter: 1
    },
    currentHalfInning: []
  });

  const handleAction = (action) => {
    const currentTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam;
    const currentBatter = currentTeam.lineup[currentTeam.nextBatter - 1];
    let isWalk = false;
    
    const newState = { ...gameState };
    const newHalfInning = [...newState.currentHalfInning];
    
    switch (action) {
      case 'ball':
        if (newState.balls < 3) {
          newState.balls++;
          newHalfInning.push(new BallEvent(currentBatter, newState.inning, newState.isTopInning));
        } else {
          // Walk - advance all runners one base
          const walkEvent = new WalkEvent(currentBatter, newState.inning, newState.isTopInning);
          
          // Create runner advancement events for each base
          if (newState.bases.third) {
            const runnerAdvance = new RunnerAdvanceEvent(
              newState.bases.third,
              newState.inning,
              newState.isTopInning,
              'third',
              'home',
              'walk'
            );
            walkEvent.addChildEvent(runnerAdvance);
            currentTeam.score++;
            currentTeam.inningScores[newState.inning - 1]++;
          }
          if (newState.bases.second) {
            const runnerAdvance = new RunnerAdvanceEvent(
              newState.bases.second,
              newState.inning,
              newState.isTopInning,
              'second',
              'third',
              'walk'
            );
            walkEvent.addChildEvent(runnerAdvance);
            newState.bases.third = newState.bases.second;
          }
          if (newState.bases.first) {
            const runnerAdvance = new RunnerAdvanceEvent(
              newState.bases.first,
              newState.inning,
              newState.isTopInning,
              'first',
              'second',
              'walk'
            );
            walkEvent.addChildEvent(runnerAdvance);
            newState.bases.second = newState.bases.first;
          }
          
          // Add batter to first base
          const batterAdvance = new RunnerAdvanceEvent(
            currentBatter,
            newState.inning,
            newState.isTopInning,
            'batter',
            'first',
            'walk'
          );
          walkEvent.addChildEvent(batterAdvance);
          newState.bases.first = currentBatter;
          
          // Reset count
          newState.balls = 0;
          newState.strikes = 0;
          isWalk = true;
          newHalfInning.push(walkEvent);
        }
        break;
      case 'strike':
        if (newState.strikes < 2) {
          newState.strikes++;
          newHalfInning.push(new StrikeEvent(currentBatter, newState.inning, newState.isTopInning));
        } else {
          // Strikeout
          const strikeoutEvent = new StrikeoutEvent(currentBatter, newState.inning, newState.isTopInning);
          newState.strikes = 0;
          newState.balls = 0;
          newState.outs++;
          newHalfInning.push(strikeoutEvent);
          if (newState.outs >= 3) {
            handleInningChange(newState);
          }
        }
        break;
      case 'out':
        const outEvent = new OutEvent(currentBatter, newState.inning, newState.isTopInning, 'field_out');
        newState.outs++;
        newState.strikes = 0;
        newState.balls = 0;
        newHalfInning.push(outEvent);
        if (newState.outs >= 3) {
          handleInningChange(newState);
        }
        break;
      case 'hit':
        currentTeam.hits++;
        const hitEvent = new HitEvent(currentBatter, newState.inning, newState.isTopInning, 'single');
        
        // Create runner advancement events for each base
        if (newState.bases.third) {
          const runnerAdvance = new RunnerAdvanceEvent(
            newState.bases.third,
            newState.inning,
            newState.isTopInning,
            'third',
            'home',
            'hit'
          );
          hitEvent.addChildEvent(runnerAdvance);
          currentTeam.score++;
          currentTeam.inningScores[newState.inning - 1]++;
        }
        if (newState.bases.second) {
          const runnerAdvance = new RunnerAdvanceEvent(
            newState.bases.second,
            newState.inning,
            newState.isTopInning,
            'second',
            'third',
            'hit'
          );
          hitEvent.addChildEvent(runnerAdvance);
          newState.bases.third = newState.bases.second;
        }
        if (newState.bases.first) {
          const runnerAdvance = new RunnerAdvanceEvent(
            newState.bases.first,
            newState.inning,
            newState.isTopInning,
            'first',
            'second',
            'hit'
          );
          hitEvent.addChildEvent(runnerAdvance);
          newState.bases.second = newState.bases.first;
        }
        
        // Add batter to first base
        const batterAdvance = new RunnerAdvanceEvent(
          currentBatter,
          newState.inning,
          newState.isTopInning,
          'batter',
          'first',
          'hit'
        );
        hitEvent.addChildEvent(batterAdvance);
        newState.bases.first = currentBatter;
        
        newState.strikes = 0;
        newState.balls = 0;
        newHalfInning.push(hitEvent);
        break;
      case 'error':
        currentTeam.errors++;
        const errorEvent = new ErrorEvent(currentBatter, newState.inning, newState.isTopInning, 'fielder');
        newHalfInning.push(errorEvent);
        break;
      case 'k':
        const strikeoutEvent = new StrikeoutEvent(currentBatter, newState.inning, newState.isTopInning);
        newState.strikes = 0;
        newState.balls = 0;
        newState.outs++;
        newHalfInning.push(strikeoutEvent);
        if (newState.outs >= 3) {
          handleInningChange(newState);
        }
        break;
      case 'sb':
        // Steal base
        if (newState.bases.first && !newState.bases.second) {
          const stolenBaseEvent = new StolenBaseEvent(
            newState.bases.first,
            newState.inning,
            newState.isTopInning,
            'first',
            'second'
          );
          newState.bases.second = newState.bases.first;
          newState.bases.first = null;
          newHalfInning.push(stolenBaseEvent);
        } else if (newState.bases.second && !newState.bases.third) {
          const stolenBaseEvent = new StolenBaseEvent(
            newState.bases.second,
            newState.inning,
            newState.isTopInning,
            'second',
            'third'
          );
          newState.bases.third = newState.bases.second;
          newState.bases.second = null;
          newHalfInning.push(stolenBaseEvent);
        }
        break;
      case 'cs':
        // Caught stealing
        newState.outs++;
        if (newState.bases.first) {
          const caughtStealingEvent = new CaughtStealingEvent(
            newState.bases.first,
            newState.inning,
            newState.isTopInning,
            'first'
          );
          newHalfInning.push(caughtStealingEvent);
          newState.bases.first = null;
        } else if (newState.bases.second) {
          const caughtStealingEvent = new CaughtStealingEvent(
            newState.bases.second,
            newState.inning,
            newState.isTopInning,
            'second'
          );
          newHalfInning.push(caughtStealingEvent);
          newState.bases.second = null;
        } else if (newState.bases.third) {
          const caughtStealingEvent = new CaughtStealingEvent(
            newState.bases.third,
            newState.inning,
            newState.isTopInning,
            'third'
          );
          newHalfInning.push(caughtStealingEvent);
          newState.bases.third = null;
        }
        if (newState.outs >= 3) {
          handleInningChange(newState);
        }
        break;
    }

    // Update next batter only for actions that end the plate appearance
    if (action === 'hit' || action === 'k' || action === 'out' || action === 'cs' || isWalk) {
      currentTeam.nextBatter = currentTeam.nextBatter % 9 + 1;
    }

    newState.currentHalfInning = newHalfInning;
    setGameState(newState);
  };

  const handleInningChange = (state) => {
    state.outs = 0;
    state.balls = 0;
    state.strikes = 0;
    state.bases = { first: null, second: null, third: null };
    state.currentHalfInning = [];
    
    if (state.isTopInning) {
      state.isTopInning = false;
    } else {
      state.isTopInning = true;
      state.inning++;
    }
  };

  const getCurrentBatter = () => {
    const currentTeam = gameState.isTopInning ? gameState.awayTeam : gameState.homeTeam;
    return currentTeam.lineup[currentTeam.nextBatter - 1];
  };

  return (
    <div className="game-scoring">
      <header className="game-scoring__header">
        <div className="game-scoring__scoreboard">
          <div className="game-scoring__scoreboard-header">
            <div className="game-scoring__header-cell"></div>
            <div className="game-scoring__header-cell">1</div>
            <div className="game-scoring__header-cell">2</div>
            <div className="game-scoring__header-cell">3</div>
            <div className="game-scoring__header-cell">4</div>
            <div className="game-scoring__header-cell">5</div>
            <div className="game-scoring__header-cell">6</div>
            <div className="game-scoring__header-cell">7</div>
            <div className="game-scoring__header-cell">8</div>
            <div className="game-scoring__header-cell">9</div>
            <div className="game-scoring__header-cell">R</div>
            <div className="game-scoring__header-cell">H</div>
            <div className="game-scoring__header-cell">E</div>
          </div>
          <div className="game-scoring__scoreboard-row">
            <div className="game-scoring__team-cell">{gameState.awayTeam.name}</div>
            {gameState.awayTeam.inningScores.map((score, index) => (
              <div key={index} className="game-scoring__score-cell">{score}</div>
            ))}
            <div className="game-scoring__score-cell">{gameState.awayTeam.score}</div>
            <div className="game-scoring__score-cell">{gameState.awayTeam.hits}</div>
            <div className="game-scoring__score-cell">{gameState.awayTeam.errors}</div>
          </div>
          <div className="game-scoring__scoreboard-row">
            <div className="game-scoring__team-cell">{gameState.homeTeam.name}</div>
            {gameState.homeTeam.inningScores.map((score, index) => (
              <div key={index} className="game-scoring__score-cell">{score}</div>
            ))}
            <div className="game-scoring__score-cell">{gameState.homeTeam.score}</div>
            <div className="game-scoring__score-cell">{gameState.homeTeam.hits}</div>
            <div className="game-scoring__score-cell">{gameState.homeTeam.errors}</div>
          </div>
        </div>
      </header>

      <div className="game-scoring__content">
        <div className="game-scoring__column game-scoring__column--left">
          <h2 className="game-scoring__column-header">{gameState.awayTeam.name} Lineup</h2>
          <div className="game-scoring__lineup">
            {gameState.awayTeam.lineup.map((player, index) => (
              <div 
                key={player.number} 
                className={`game-scoring__player ${index + 1 === gameState.awayTeam.nextBatter ? 'game-scoring__player--current' : ''}`}
              >
                <span className="game-scoring__player-number">{player.number}</span>
                <span className="game-scoring__player-name">{player.name}</span>
                <span className="game-scoring__player-position">{player.position}</span>
              </div>
            ))}
          </div>
          <div className="game-scoring__substitutes">
            <h3 className="game-scoring__column-header">Substitutes</h3>
            {gameState.awayTeam.substitutes.map(player => (
              <div key={player.number} className="game-scoring__substitute">
                <span className="game-scoring__player-number">{player.number}</span>
                <span className="game-scoring__player-name">{player.name}</span>
                <span className="game-scoring__player-position">{player.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="game-scoring__column game-scoring__column--center">
          <div className="game-scoring__inning-situation">
            {gameState.isTopInning ? 'Top' : 'Bottom'} of the {gameState.inning}{gameState.inning === 1 ? 'st' : gameState.inning === 2 ? 'nd' : gameState.inning === 3 ? 'rd' : 'th'} inning
          </div>
          <div className="game-scoring__game-situation">
            <div className="game-scoring__bases">
              <div className="game-scoring__bases-label">Baserunners:</div>
              <div className="game-scoring__base-label">1B: {gameState.bases.first ? `${gameState.bases.first.name} (${gameState.bases.first.number})` : 'None'}</div>
              <div className="game-scoring__base-label">2B: {gameState.bases.second ? `${gameState.bases.second.name} (${gameState.bases.second.number})` : 'None'}</div>
              <div className="game-scoring__base-label">3B: {gameState.bases.third ? `${gameState.bases.third.name} (${gameState.bases.third.number})` : 'None'}</div>
            </div>
            <div className="game-scoring__count">
              <div className="game-scoring__count-section">
                <div className="game-scoring__count-label">Balls</div>
                <div className="game-scoring__count-circles">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`game-scoring__count-circle ${i < gameState.balls ? 'game-scoring__count-circle--filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="game-scoring__count-section">
                <div className="game-scoring__count-label">Strikes</div>
                <div className="game-scoring__count-circles">
                  {[...Array(2)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`game-scoring__count-circle ${i < gameState.strikes ? 'game-scoring__count-circle--filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="game-scoring__count-section">
                <div className="game-scoring__count-label">Outs</div>
                <div className="game-scoring__count-circles">
                  {[...Array(2)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`game-scoring__count-circle ${i < gameState.outs ? 'game-scoring__count-circle--filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="game-scoring__actions">
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('ball');
                }}
              >
                Ball
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('strike');
                }}
              >
                Strike
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('out');
                }}
              >
                Out
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('hit');
                }}
              >
                Hit
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('error');
                }}
              >
                Error
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('k');
                }}
              >
                K
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('sb');
                }}
              >
                SB
              </button>
              <button 
                className="game-scoring__action-button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAction('cs');
                }}
              >
                CS
              </button>
            </div>
          </div>
        </div>

        <div className="game-scoring__column game-scoring__column--right">
          <h2 className="game-scoring__column-header">{gameState.homeTeam.name} Lineup</h2>
          <div className="game-scoring__lineup">
            {gameState.homeTeam.lineup.map((player, index) => (
              <div 
                key={player.number} 
                className={`game-scoring__player ${index + 1 === gameState.homeTeam.nextBatter ? 'game-scoring__player--current' : ''}`}
              >
                <span className="game-scoring__player-number">{player.number}</span>
                <span className="game-scoring__player-name">{player.name}</span>
                <span className="game-scoring__player-position">{player.position}</span>
              </div>
            ))}
          </div>
          <div className="game-scoring__substitutes">
            <h3 className="game-scoring__column-header">Substitutes</h3>
            {gameState.homeTeam.substitutes.map(player => (
              <div key={player.number} className="game-scoring__substitute">
                <span className="game-scoring__player-number">{player.number}</span>
                <span className="game-scoring__player-name">{player.name}</span>
                <span className="game-scoring__player-position">{player.position}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScoring; 