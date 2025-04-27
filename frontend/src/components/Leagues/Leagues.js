import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leagues.css';

const Leagues = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      // TODO: Replace with actual API call
      const mockLeagues = [
        {
          id: 1,
          name: 'Premier League',
          numTeams: 20,
          season: '2023-2024',
          primaryColor: '#1a3a14'
        },
        {
          id: 2,
          name: 'La Liga',
          numTeams: 20,
          season: '2023-2024',
          primaryColor: '#FF0000'
        }
      ];
      setLeagues(mockLeagues);
    } catch (err) {
      setError('Failed to fetch leagues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeague = () => {
    navigate('/leagues/new');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="leagues-container">
      <div className="leagues-header">
        <h1>Leagues</h1>
        <button 
          className="create-league-btn"
          onClick={handleCreateLeague}
        >
          Create New League
        </button>
      </div>

      <div className="leagues-grid">
        {leagues.map(league => (
          <div key={league.id} className="league-card">
            <div 
              className="league-logo" 
              style={{ backgroundColor: league.primaryColor }}
            >
              {league.name.charAt(0)}
            </div>
            <div className="league-info">
              <h2>{league.name}</h2>
              <p>{league.numTeams} Teams</p>
              <p>{league.season}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues; 