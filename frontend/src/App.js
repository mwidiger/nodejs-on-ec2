import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LeagueList from './components/Leagues/LeagueList';
import LeagueForm from './components/Leagues/LeagueForm';
import GameScoring from './components/GameScoring/GameScoring';
import Scorecard from './components/Scorecard/Scorecard';
import './App.css';

const HomePage = () => (
  <div className="home-content">
    <LeagueList />
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GameScoring />} />
        <Route path="/games/:id" element={<Scorecard />} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/stats" element={<div>Stats Page</div>} />
        <Route path="/scoreboard" element={<div>Live Scoreboard</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/leagues/new" element={<LeagueForm isEdit={false} />} />
        <Route path="/leagues/:id/edit" element={<LeagueForm isEdit={true} />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;