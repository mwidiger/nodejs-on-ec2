import React from 'react';
import { Link } from 'react-router-dom';
import './LeagueList.css';

const LeagueList = () => {
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
    <div className="league-list">
      <div className="league-list__header">
        <h1 className="league-list__title">Baseball Leagues</h1>
        <p className="league-list__description">Browse and manage your favorite baseball leagues</p>
      </div>

      <div className="league-list__list">
        {leagues.map(league => (
          <Link to={`/leagues/${league.id}`} key={league.id} className="league-list__card">
            <div className="league-list__card-content">
              <div className="league-list__left">
                <div className="league-list__logo">
                  <img src={league.logo} alt={`${league.name} logo`} className="league-list__logo-image" />
                </div>
                <h2 className="league-list__name">{league.name}</h2>
              </div>
              <div className="league-list__stats">
                <div className="league-list__stat">
                  <i className="fas fa-users league-list__stat-icon"></i>
                  <span>{league.teams} Teams</span>
                </div>
                <div className="league-list__stat">
                  <i className="fas fa-calendar league-list__stat-icon"></i>
                  <span>{league.season} Season</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="league-list__actions">
        <button className="league-list__create-button">
          <i className="fas fa-plus league-list__create-icon"></i>
          Create New League
        </button>
      </div>
    </div>
  );
};

export default LeagueList; 