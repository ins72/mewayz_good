import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import './PublicLayout.css';

const PublicLayout = ({ children, className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Header = () => (
    <header className={`public-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="public-nav">
        <Logo size="medium" />
        
        <ul className="nav-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>

        <div className="nav-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </button>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-links">
            <li><Link to="/features" onClick={() => setIsMobileMenuOpen(false)}>Features</Link></li>
            <li><Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link></li>
            <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/help" onClick={() => setIsMobileMenuOpen(false)}>Help</Link></li>
          </ul>
          
          <div className="mobile-nav-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                navigate('/register');
                setIsMobileMenuOpen(false);
              }}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="public-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Logo size="medium" clickable={false} />
          <p>The complete creator economy platform for modern businesses</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/bundles/creator">Creator Bundle</Link>
            <Link to="/bundles/ecommerce">E-commerce Bundle</Link>
            <Link to="/bundles/business">Business Bundle</Link>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help Center</Link>
            <a href="#careers">Careers</a>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Support</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#blog">Blog</a>
            <a href="#documentation">Documentation</a>
            <a href="#api">API</a>
            <a href="#status">Status</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 MEWAYZ V2. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="#cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );

  return (
    <div className={`public-layout ${className}`}>
      <Header />
      <main className="public-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;