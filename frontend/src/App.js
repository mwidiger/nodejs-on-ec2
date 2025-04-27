import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './App.css';

const HomePage = () => (
  <div className="home-content">
    <h1>Welcome to BaseballScorer</h1>
    <p>Your ultimate baseball scoring companion</p>
  </div>
);

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<div>Games Page</div>} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/stats" element={<div>Stats Page</div>} />
        <Route path="/scoreboard" element={<div>Live Scoreboard</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;