import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="layout__nav">
          <Link to="/" className="layout__logo">
            <img src="/5050logo.jpg" alt="50/50 Scorer" />
            <span>50/50 Scorer</span>
          </Link>
          <div className="layout__links">
            <Link to="/games" className="layout__link">Games</Link>
            <Link to="/teams" className="layout__link">Teams</Link>
            <Link to="/stats" className="layout__link">Stats</Link>
            <Link to="/scoreboard" className="layout__link">Scoreboard</Link>
          </div>
          <div className="layout__auth">
            <Link to="/login" className="layout__auth-link">Sign In</Link>
          </div>
        </nav>
      </header>

      <main className="layout__main">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} 50/50 Scorer</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 