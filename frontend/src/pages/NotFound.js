import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { title: 'Help Center', path: '/help', icon: '❓' },
    { title: 'Contact Support', path: '/contact', icon: '💬' },
    { title: 'Login', path: '/login', icon: '🔑' }
  ];

  return (
    <div className="not-found-page">
      {/* Animated Background */}
      <div className="error-background">
        <div className="floating-number">4</div>
        <div className="floating-number">0</div>
        <div className="floating-number">4</div>
      </div>

      <div className="error-container">
        {/* Logo */}
        <div className="error-logo" onClick={() => navigate('/')}>
          <h1>MEWAYZ</h1>
          <span className="version-badge">V2</span>
        </div>

        {/* Main Error Content */}
        <div className="error-content">
          <div className="error-code">404</div>
          <h2>Oops! Page Not Found</h2>
          <p>
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>

          {/* Search Bar */}
          <div className="error-search">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search for what you need..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/help?search=' + e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  className="action-card"
                  onClick={() => navigate(link.path)}
                >
                  <span className="action-icon">{link.icon}</span>
                  <span className="action-title">{link.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Actions */}
          <div className="main-actions">
            <button 
              className="primary-btn"
              onClick={() => navigate('/')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              Go Home
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Go Back
            </button>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="fun-fact">
          <div className="fact-card">
            <h4>🎯 Fun Fact</h4>
            <p>
              404 errors are named after room "404" at CERN where the first web server was located. 
              When files couldn't be found, researchers jokingly referenced the room number!
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="error-footer">
          <div className="footer-links">
            <span onClick={() => navigate('/help')} className="footer-link">Help Center</span>
            <span onClick={() => navigate('/contact')} className="footer-link">Contact Us</span>
            <span onClick={() => navigate('/privacy')} className="footer-link">Privacy Policy</span>
          </div>
          <div className="footer-text">
            <p>© 2025 MEWAYZ V2 - The Complete Creator Economy Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;