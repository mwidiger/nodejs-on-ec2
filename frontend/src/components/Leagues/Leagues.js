import React from 'react';
import { Link } from 'react-router-dom';
import './Leagues.css';

const Leagues = () => {
  const leagues = [
    {
      id: 1,
      name: 'Major League Baseball',
      teams: 30,
      season: '2024',
      logo: '/mlb-logo.png',
      color: '#002D72'
    },
    {
      id: 2,
      name: 'Minor League Baseball',
      teams: 120,
      season: '2024',
      logo: '/milb-logo.png',
      color: '#003366'
    },
    {
      id: 3,
      name: 'College Baseball',
      teams: 300,
      season: '2024',
      logo: '/ncaa-logo.png',
      color: '#0033A0'
    }
  ];

  return (
    <div className="leagues-container">
      <div className="leagues-header">
        <h1>Baseball Leagues</h1>
        <p>Browse and manage your favorite baseball leagues</p>
      </div>

      <div className="leagues-grid">
        {leagues.map(league => (
          <Link to={`/leagues/${league.id}`} key={league.id} className="league-card">
            <div className="league-card-content" style={{ backgroundColor: league.color }}>
              <div className="league-logo">
                <img src={league.logo} alt={`${league.name} logo`} />
              </div>
              <div className="league-info">
                <h2>{league.name}</h2>
                <div className="league-stats">
                  <div className="stat">
                    <i className="fas fa-users"></i>
                    <span>{league.teams} Teams</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-calendar"></i>
                    <span>{league.season}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="leagues-actions">
        <button className="create-league-btn">
          <i className="fas fa-plus"></i>
          Create New League
        </button>
      </div>
    </div>
  );
};

export default Leagues; 