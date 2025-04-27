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
    <div className="leagues">
      <div className="leagues__header">
        <h1 className="leagues__title">Baseball Leagues</h1>
        <p className="leagues__description">Browse and manage your favorite baseball leagues</p>
      </div>

      <div className="leagues__grid">
        {leagues.map(league => (
          <Link to={`/leagues/${league.id}`} key={league.id} className="leagues__card">
            <div className="leagues__card-content" style={{ backgroundColor: league.color }}>
              <div className="leagues__logo">
                <img src={league.logo} alt={`${league.name} logo`} className="leagues__logo-image" />
              </div>
              <div className="leagues__info">
                <h2 className="leagues__name">{league.name}</h2>
                <div className="leagues__stats">
                  <div className="leagues__stat">
                    <i className="fas fa-users leagues__stat-icon"></i>
                    <span>{league.teams} Teams</span>
                  </div>
                  <div className="leagues__stat">
                    <i className="fas fa-calendar leagues__stat-icon"></i>
                    <span>{league.season}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="leagues__actions">
        <button className="leagues__create-button">
          <i className="fas fa-plus leagues__create-icon"></i>
          Create New League
        </button>
      </div>
    </div>
  );
};

export default Leagues; 