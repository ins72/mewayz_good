import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MEWAYZ_V2_LANDING_PAGE.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>MEWAYZ</h1>
            <span className="version-badge">V2</span>
          </div>
          <nav className="nav">
            <button 
              onClick={() => navigate('/login')}
              className="nav-button login"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="nav-button register"
            >
              Start Free Trial
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀</span>
              <span>Trusted by 10,000+ Businesses Worldwide</span>
            </div>
            
            <h1 className="hero-title">
              The Complete Creator<br />
              <span className="hero-highlight">Economy Platform</span>
            </h1>
            
            <p className="hero-description">
              Everything you need to build, manage, and scale your online business. 
              From Instagram lead generation to multi-vendor marketplaces, courses, and AI-powered automation - all in one powerful platform.
            </p>
            
            <div className="hero-buttons">
              <button 
                onClick={() => navigate('/register')}
                className="hero-button primary"
              >
                Start Free Trial - 14 Days
                <span>→</span>
              </button>
              <button className="hero-button secondary">
                ▶ Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Succeed</h2>
            <p>Choose from our comprehensive suite of business tools</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card creator">
              <div className="feature-icon">🎨</div>
              <h3>Creator Bundle</h3>
              <p className="feature-price">$19/month</p>
              <p>Professional bio links, content creation tools, and analytics.</p>
              <div className="feature-status available">✅ Available</div>
            </div>

            <div className="feature-card ecommerce">
              <div className="feature-icon">🛒</div>
              <h3>E-commerce Bundle</h3>
              <p className="feature-price">$24/month</p>
              <p>Online store, inventory management, and payment processing.</p>
              <div className="feature-status available">✅ Available</div>
            </div>

            <div className="feature-card social">
              <div className="feature-icon">📱</div>
              <h3>Social Media Bundle</h3>
              <p className="feature-price">$29/month</p>
              <p>Post scheduling, analytics, and multi-platform management.</p>
              <div className="feature-status coming-soon">⏳ Coming Soon</div>
            </div>

            <div className="feature-card education">
              <div className="feature-icon">🎓</div>
              <h3>Education Bundle</h3>
              <p className="feature-price">$29/month</p>
              <p>Course creation, student management, and certificates.</p>
              <div className="feature-status coming-soon">⏳ Coming Soon</div>
            </div>

            <div className="feature-card business">
              <div className="feature-icon">💼</div>
              <h3>Business Bundle</h3>
              <p className="feature-price">$39/month</p>
              <p>CRM, team management, and business intelligence.</p>
              <div className="feature-status coming-soon">⏳ Coming Soon</div>
            </div>

            <div className="feature-card operations">
              <div className="feature-icon">⚙️</div>
              <h3>Operations Bundle</h3>
              <p className="feature-price">$24/month</p>
              <p>Booking system, forms, and workflow automation.</p>
              <div className="feature-status coming-soon">⏳ Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Creators Worldwide</h2>
            <p>Join thousands of successful entrepreneurs using MEWAYZ</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "MEWAYZ V2 transformed my business. The creator tools helped me grow from zero to 10k followers in just 3 months!"
              </div>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Content Creator</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                "The e-commerce bundle is incredible. I launched my online store in minutes and made my first sale the same day."
              </div>
              <div className="testimonial-author">
                <strong>Mike Chen</strong>
                <span>Entrepreneur</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                "Best investment I've made for my business. The ROI has been amazing - 300% increase in revenue!"
              </div>
              <div className="testimonial-author">
                <strong>Emma Wilson</strong>
                <span>Business Owner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>Join thousands of successful entrepreneurs who chose MEWAYZ V2</p>
            <div className="cta-buttons">
              <button 
                onClick={() => navigate('/register')}
                className="cta-button primary"
              >
                Start Your Free Trial Today
              </button>
              <button className="cta-button secondary">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <h3>MEWAYZ</h3>
                <span className="version-badge">V2</span>
              </div>
              <p>The complete creator economy platform</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#status">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MEWAYZ V2. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;