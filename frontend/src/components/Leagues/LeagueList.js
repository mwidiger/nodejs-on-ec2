import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LeagueList.css';

const LeagueList = () => {
  const navigate = useNavigate();
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

  const handleCreateLeague = () => {
    navigate('/leagues/new');
  };

  const handleEditLeague = (id) => {
    navigate(`/leagues/${id}/edit`);
  };

  const handleDeleteLeague = (id) => {
    // TODO: Implement delete functionality
    console.log('Delete league:', id);
  };

  return (
    <div className="league-list">
      <div className="league-list__header">
      </div>

      <div className="league-list__list">
        {leagues.map(league => (
          <div key={league.id} className="league-list__card">
            <Link to={`/leagues/${league.id}`} className="league-list__card-content">
              <div className="league-list__left">
                <div className="league-list__logo">
                  <img src={league.logo} alt={`${league.name} logo`} className="league-list__logo-image" />
                </div>
                <h2 className="league-list__name">{league.name}</h2>
              </div>
              <div className="league-list__stats">
                <div className="league-list__stat">
                  <i className="fas fa-users league-list__stat-icon"></i>
                  <span>{league.teams}</span>
                </div>
                <div className="league-list__stat">
                  <i className="fas fa-calendar league-list__stat-icon"></i>
                  <span>{league.season}</span>
                </div>
              </div>
            </Link>
            <div className="league-list__card-actions">
              <button 
                className="league-list__action-button league-list__action-button--edit"
                onClick={() => handleEditLeague(league.id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="league-list__action-button league-list__action-button--delete"
                onClick={() => handleDeleteLeague(league.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="league-list__footer">
        <button 
          className="league-list__create-button"
          onClick={handleCreateLeague}
        >
          <i className="fas fa-plus league-list__create-icon"></i>
          Create New League
        </button>
      </div>
    </div>
  );
};

export default LeagueList; 