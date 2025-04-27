import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GameScoring.css';

const GameScoring = () => {
  const { id } = useParams();
  const [gameState, setGameState] = useState({
    homeTeam: {
      name: 'New York Yankees',
      score: 0,
      lineup: [
        { number: 1, name: 'John Smith', position: 'P' },
        { number: 2, name: 'Mike Johnson', position: 'C' },
        { number: 3, name: 'Tom Wilson', position: '1B' },
        { number: 4, name: 'Bob Brown', position: '2B' },
        { number: 5, name: 'Jim Davis', position: '3B' },
        { number: 6, name: 'Sam Miller', position: 'SS' },
        { number: 7, name: 'Dave White', position: 'LF' },
        { number: 8, name: 'Paul Green', position: 'CF' },
        { number: 9, name: 'Rick Black', position: 'RF' }
      ],
      substitutes: [
        { number: 10, name: 'Steve Adams', position: 'P' },
        { number: 11, name: 'Mark Taylor', position: 'C' }
      ]
    },
    awayTeam: {
      name: 'Boston Red Sox',
      score: 0,
      lineup: [
        { number: 1, name: 'Jack Wilson', position: 'P' },
        { number: 2, name: 'Chris Lee', position: 'C' },
        { number: 3, name: 'Pat Moore', position: '1B' },
        { number: 4, name: 'Tim Clark', position: '2B' },
        { number: 5, name: 'Dan King', position: '3B' },
        { number: 6, name: 'Phil Hall', position: 'SS' },
        { number: 7, name: 'Gary Young', position: 'LF' },
        { number: 8, name: 'Ray Scott', position: 'CF' },
        { number: 9, name: 'Joe Allen', position: 'RF' }
      ],
      substitutes: [
        { number: 10, name: 'Bill Wright', position: 'P' },
        { number: 11, name: 'Matt Hill', position: 'C' }
      ]
    },
    inning: {
      number: 1,
      half: 'top'
    },
    outs: 0,
    bases: {
      first: { occupied: false, player: null },
      second: { occupied: false, player: null },
      third: { occupied: false, player: null }
    },
    count: {
      balls: 0,
      strikes: 0
    }
  });

  useEffect(() => {
    if (id) {
      // TODO: Fetch game data from API using the id
      console.log(`Fetching game data for ID: ${id}`);
    }
  }, [id]);

  return (
    <div className="game-scoring">
      <header className="game-scoring__header">
        <div className="game-scoring__scoreboard">
          <div className="game-scoring__team">
            <div className="game-scoring__team-name">{gameState.awayTeam.name}</div>
            <div className="game-scoring__score">{gameState.awayTeam.score}</div>
          </div>
          <div className="game-scoring__game-info">
            <div className="game-scoring__inning">
              {gameState.inning.half === 'top' ? 'Top' : 'Bottom'} {gameState.inning.number}
            </div>
            <div className="game-scoring__outs">
              {gameState.outs} {gameState.outs === 1 ? 'Out' : 'Outs'}
            </div>
          </div>
          <div className="game-scoring__team">
            <div className="game-scoring__team-name">{gameState.homeTeam.name}</div>
            <div className="game-scoring__score">{gameState.homeTeam.score}</div>
          </div>
        </div>
      </header>

      <div className="game-scoring__content">
        <div className="game-scoring__column game-scoring__column--left">
          <h2 className="game-scoring__column-header">{gameState.awayTeam.name} Lineup</h2>
          <div className="game-scoring__lineup">
            {gameState.awayTeam.lineup.map(player => (
              <div key={player.number} className="game-scoring__player">
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
          <h2 className="game-scoring__column-header">Game Situation</h2>
          <div className="game-scoring__game-situation">
            <div className="game-scoring__bases">
              <div className="game-scoring__bases-label">Baserunners:</div>
              <div className="game-scoring__base-label">1B: {gameState.bases.first.occupied ? gameState.bases.first.player : 'None'}</div>
              <div className="game-scoring__base-label">2B: {gameState.bases.second.occupied ? gameState.bases.second.player : 'None'}</div>
              <div className="game-scoring__base-label">3B: {gameState.bases.third.occupied ? gameState.bases.third.player : 'None'}</div>
            </div>
            <div className="game-scoring__count">
              <div className="game-scoring__count-section">
                <div className="game-scoring__count-label">Balls</div>
                <div className="game-scoring__count-circles">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`game-scoring__count-circle ${i < gameState.count.balls ? 'game-scoring__count-circle--filled' : ''}`}
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
                      className={`game-scoring__count-circle ${i < gameState.count.strikes ? 'game-scoring__count-circle--filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="game-scoring__actions">
              <button className="game-scoring__action-button">Ball</button>
              <button className="game-scoring__action-button">Strike</button>
              <button className="game-scoring__action-button">Out</button>
              <button className="game-scoring__action-button">Hit</button>
              <button className="game-scoring__action-button">Error</button>
              <button className="game-scoring__action-button">Walk</button>
              <button className="game-scoring__action-button">K</button>
              <button className="game-scoring__action-button">SB</button>
              <button className="game-scoring__action-button">CS</button>
            </div>
          </div>
        </div>

        <div className="game-scoring__column game-scoring__column--right">
          <h2 className="game-scoring__column-header">{gameState.homeTeam.name} Lineup</h2>
          <div className="game-scoring__lineup">
            {gameState.homeTeam.lineup.map(player => (
              <div key={player.number} className="game-scoring__player">
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