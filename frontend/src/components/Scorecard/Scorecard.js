import React, { useState } from 'react';
//import './Scorecard.css';

const Scorecard = () => {
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
    homeTeamRoster: {
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
    awayTeamRoster: {
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
    currentRoster: gameState.awayTeamRoster,
    currentHalfInning: []
  });

  return (
    <div className="scorecard">
      <div className="gameDescriptor">
        <div className="score">
          <div className="awayTeamName">{gameState.homeTeamRoster.name}</div> 
          <div className="awayTeamScore">{gameState.homeTeamRoster.score}</div> - 
          <div className="homeTeamName">{gameState.awayTeamRoster.name}</div>
          <div className="homeTeamScore">{gameState.awayTeamRoster.score}</div>
        </div>
        <div className="inningInfo">
          <div className="inningNumber">{gameState.isTopInning ? 'Top' : 'Bottom'} {gameState.inning}</div>
          <div className="count">Count: {gameState.balls}-{gameState.strikes}</div>
          <div className="outsCount">Outs: {gameState.outs}</div>
          <div className="currentBatter">{gameState.currentRoster.lineup[gameState.currentRoster.nextBatter - 1].name}</div>
        </div>
      </div>
    </div>
  )
};

export default Scorecard;