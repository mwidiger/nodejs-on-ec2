import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </head>
      <div className="layout">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">
              <img src="/logo192.png" alt="Baseball Scorer" />
              <span>BaseballScorer</span>
            </Link>
            <nav className="nav">
              <Link to="/games">Games</Link>
              <Link to="/teams">Teams</Link>
              <Link to="/stats">Stats</Link>
              <Link to="/scoreboard">Scoreboard</Link>
            </nav>
            <div className="auth">
              <Link to="/login" className="login-btn">Sign In</Link>
            </div>
          </div>
        </header>

        <main className="main">
          {children}
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} BaseballScorer</p>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout; 