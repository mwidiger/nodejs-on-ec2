import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './LeagueForm.css';

const LeagueForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    numTeams: '',
    season: '',
    primaryColor: '#1a3a14'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchLeague();
    }
  }, [isEdit, id]);

  const fetchLeague = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockLeague = {
        name: 'Premier League',
        numTeams: 20,
        season: '2023-2024',
        primaryColor: '#1a3a14'
      };
      setFormData(mockLeague);
    } catch (err) {
      setError('Failed to fetch league data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log(isEdit ? 'Updating league' : 'Creating league', formData);
      navigate('/');
    } catch (err) {
      setError('Failed to save league');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="league-form">
      <div className="league-form__header">
        <h1 className="league-form__title">
          {isEdit ? 'Edit League' : 'Create New League'}
        </h1>
      </div>

      <form className="league-form__form" onSubmit={handleSubmit}>
        {error && <div className="league-form__error">{error}</div>}

        <div className="league-form__group">
          <label className="league-form__label" htmlFor="name">League Name</label>
          <input
            className="league-form__input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="league-form__group">
          <label className="league-form__label" htmlFor="numTeams">Number of Teams</label>
          <input
            className="league-form__input"
            type="number"
            id="numTeams"
            name="numTeams"
            value={formData.numTeams}
            onChange={handleChange}
            min="2"
            required
          />
        </div>

        <div className="league-form__group">
          <label className="league-form__label" htmlFor="season">Season</label>
          <input
            className="league-form__input"
            type="text"
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          />
        </div>

        <div className="league-form__group">
          <label className="league-form__label">Primary Color</label>
          <div className="league-form__color-input">
            <input
              className="league-form__color-picker"
              type="color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleChange}
            />
            <span className="league-form__color-value">{formData.primaryColor}</span>
          </div>
        </div>

        <div className="league-form__actions">
          <button
            type="button"
            className="league-form__button league-form__button--cancel"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="league-form__button league-form__button--submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update League' : 'Create League')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeagueForm; 