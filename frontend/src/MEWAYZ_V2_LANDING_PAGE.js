import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import Logo from './components/Logo';
import './MEWAYZ_V2_LANDING_PAGE.css';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Loading screen - reduced time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animation on scroll functionality
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, [isLoading]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <PublicLayout>
      <div className="landing-page">
        {/* Loading Screen */}
        {isLoading && (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Background Effects */}
        <div className="bg-effects">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <button className="mobile-menu-close" onClick={toggleMobileMenu}>×</button>
          <div className="mobile-menu-content">
            <div className="mobile-nav-links">
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Reviews</a>
              <Link to="/help">Help</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="mobile-auth-actions">
              <button onClick={() => navigate('/login')} className="mobile-login-btn">Login</button>
              <button onClick={() => navigate('/register')} className="mobile-signup-btn">
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <HeroSection navigate={navigate} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Call to Action Section */}
        <CTASection navigate={navigate} />

        {/* Pricing Section */}
        <PricingSection navigate={navigate} />
      </div>
    </PublicLayout>
  );
};

const Header = ({ toggleMobileMenu, scrollToSection, navigate }) => {
  return (
    <header className="header">
      <nav className="nav">
        <Logo size="medium" />
        <ul className="nav-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Reviews</a></li>
          <li><Link to="/help">Help</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="nav-actions">
          <button onClick={() => navigate('/login')} className="btn btn-secondary">Login</button>
          <button onClick={() => navigate('/register')} className="btn btn-primary">
            Start Free Trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

const HeroSection = ({ navigate }) => {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="emoji">🚀</span> 
        <span className="text-content">Trusted by 10,000+ Businesses Worldwide</span>
      </div>
      <h1>
        The Complete Creator<br />
        <span className="gradient-text">Economy Platform</span>
      </h1>
      <p>Everything you need to build, manage, and scale your online business. From Instagram lead generation to multi-vendor marketplaces, courses, and AI-powered automation - all in one powerful platform.</p>
      <div className="hero-actions">
        <button onClick={() => navigate('/register')} className="btn btn-primary">
          Start Free Trial - 14 Days
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </button>
        <button onClick={() => {
          const element = document.getElementById('demo');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }} className="btn btn-secondary">
          Watch 2-Min Demo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </button>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat">
          <span className="stat-number">$2.5M+</span>
          <span className="stat-label">Revenue Generated</span>
        </div>
        <div className="stat">
          <span className="stat-number">99.9%</span>
          <span className="stat-label">Uptime SLA</span>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Instagram Lead Generation',
      description: 'Advanced Instagram database with 50M+ profiles. Filter by engagement rate, follower count, location, and hashtags. Export qualified leads with contact discovery.',
      gradient: '135deg, #667eea 0%, #764ba2 100%'
    },
    {
      icon: '🔗',
      title: 'Bio Link Builder',
      description: 'Create stunning bio link pages with custom domains, analytics tracking, payment integration, and unlimited links. Convert followers to customers instantly.',
      gradient: '135deg, #f093fb 0%, #f5576c 100%'
    },
    {
      icon: '🎓',
      title: 'Course Platform',
      description: 'Complete learning management system with video hosting, progress tracking, certificates, live sessions, and community features. Monetize your expertise.',
      gradient: '135deg, #fa709a 0%, #fee140 100%'
    },
    {
      icon: '🛍️',
      title: 'Multi-Vendor Marketplace',
      description: 'Build your own marketplace like Amazon or Etsy. Vendor management, commission tracking, payment processing, and order fulfillment - all automated.',
      gradient: '135deg, #4facfe 0%, #00f2fe 100%'
    },
    {
      icon: '👥',
      title: 'CRM & Automation',
      description: 'Advanced customer relationship management with lead scoring, email sequences, SMS marketing, and AI-powered follow-ups. Never lose a lead again.',
      gradient: '135deg, #a8edea 0%, #fed6e3 100%'
    },
    {
      icon: '📊',
      title: 'Business Analytics',
      description: 'Real-time insights across all your business channels. Track revenue, conversion rates, customer lifetime value, and ROI with beautiful visualizations.',
      gradient: '135deg, #667eea 0%, #764ba2 100%'
    }
  ];

  return (
    <section className="features" id="features">
      <div className="section-header">
        <div className="section-badge">
          <span className="emoji">⚡</span> 
          <span className="text-content">6 Powerful Tools in One Platform</span>
        </div>
        <h2>Everything You Need to Succeed</h2>
        <p>Choose from our comprehensive suite of business tools</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card animate-on-scroll">
            <div className="feature-icon" style={{background: `linear-gradient(${feature.gradient})`}}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "MEWAYZ V2 transformed my business. The creator tools helped me grow from zero to 10k followers in just 3 months!",
      author: "Sarah Johnson",
      role: "Content Creator",
      avatar: "👩‍💼"
    },
    {
      content: "The e-commerce bundle is incredible. I launched my online store in minutes and made my first sale the same day.",
      author: "Mike Chen",
      role: "Entrepreneur", 
      avatar: "👨‍💻"
    },
    {
      content: "Best investment I've made for my business. The ROI has been amazing - 300% increase in revenue!",
      author: "Emma Wilson",
      role: "Business Owner",
      avatar: "👩‍🚀"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="section-header">
        <div className="section-badge">
          <span className="emoji">💬</span> 
          <span className="text-content">Loved by Creators Worldwide</span>
        </div>
        <h2>What Our Users Say</h2>
        <p>Join thousands of successful entrepreneurs using MEWAYZ</p>
      </div>
      
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card animate-on-scroll">
            <div className="testimonial-content">
              "{testimonial.content}"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.avatar}</div>
              <div className="author-info">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTASection = ({ navigate }) => {
  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Ready to Transform Your Business?</h2>
        <p>Join thousands of successful entrepreneurs who chose MEWAYZ V2</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/register')} className="cta-button primary">
            Start Your Free Trial Today
          </button>
          <button className="cta-button secondary">
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

const PricingSection = ({ navigate }) => {
  const pricingBundles = [
    {
      id: 'creator',
      name: 'Creator Bundle',
      price: 19,
      description: 'Perfect for content creators and influencers',
      features: ['Bio Link Builder', 'Website Builder', 'SEO Tools', 'AI Content Creation', 'Template Marketplace'],
      popular: false
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Bundle', 
      price: 24,
      description: 'Complete online store solution',
      features: ['Online Store', 'Multi-vendor Support', 'Payment Processing', 'Inventory Management', 'Analytics'],
      popular: true
    },
    {
      id: 'business',
      name: 'Business Bundle',
      price: 39,
      description: 'Advanced CRM and automation',
      features: ['CRM System', 'Email Marketing', 'Lead Management', 'Workflow Automation', 'Business Analytics'],
      popular: false
    }
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="section-header">
        <div className="section-badge">
          <span className="emoji">💎</span> 
          <span className="text-content">Simple, Transparent Pricing</span>
        </div>
        <h2>Choose Your Perfect Bundle</h2>
        <p>Start with any bundle and upgrade anytime</p>
      </div>
      
      <div className="pricing-grid">
        {pricingBundles.map((bundle) => (
          <div key={bundle.id} className={`pricing-card ${bundle.popular ? 'popular' : ''}`}>
            {bundle.popular && <div className="popular-badge">Most Popular</div>}
            <div className="pricing-header">
              <h3>{bundle.name}</h3>
              <div className="pricing-price">
                <span className="currency">$</span>
                <span className="amount">{bundle.price}</span>
                <span className="period">/month</span>
              </div>
              <p>{bundle.description}</p>
            </div>
            <div className="pricing-features">
              {bundle.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/register')} 
              className="pricing-button"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Logo size="medium" clickable={false} />
          <p>The complete creator economy platform</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <a href="#demo" onClick={() => {
              const element = document.getElementById('demo');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}>Demo</a>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/help">Help Center</Link>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 MEWAYZ V2. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingPage;