import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      bio: 'Former creator economy executive with 10+ years building platforms for digital entrepreneurs.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'Ex-Stripe engineer passionate about building scalable creator tools and payment systems.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Product',
      bio: 'Product leader who has helped launch multiple successful SaaS platforms and creator tools.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      bio: 'Award-winning UX designer focused on creating intuitive experiences for creators.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'MEWAYZ Founded',
      description: 'Started with the vision to democratize the creator economy for everyone.'
    },
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Launched beta with 1,000+ creators and received overwhelming positive feedback.'
    },
    {
      year: '2024',
      title: 'V2 Development',
      description: 'Rebuilt from ground up as comprehensive all-in-one creator platform.'
    },
    {
      year: '2025',
      title: 'Public Launch',
      description: 'Officially launching MEWAYZ V2 with revolutionary pricing model.'
    }
  ];

  const values = [
    {
      icon: '🚀',
      title: 'Innovation First',
      description: 'We constantly push boundaries to create tools that didn\'t exist before.'
    },
    {
      icon: '🤝',
      title: 'Creator Success',
      description: 'Your success is our success. We grow when you grow.'
    },
    {
      icon: '⚡',
      title: 'Simplicity',
      description: 'Complex features made simple. Professional tools for everyone.'
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Empowering creators worldwide to build sustainable businesses.'
    },
    {
      icon: '🔒',
      title: 'Trust & Security',
      description: 'Your data and business are protected with enterprise-grade security.'
    },
    {
      icon: '💡',
      title: 'Continuous Learning',
      description: 'We listen, learn, and evolve based on creator feedback and needs.'
    }
  ];

  return (
    <div className="about-page">
      {/* Navigation */}
      <nav className="about-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/enterprise">Enterprise</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="cta-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-container">
          <h1>Empowering the Creator Economy</h1>
          <p>
            We're on a mission to democratize the creator economy by providing professional-grade tools 
            at accessible prices, enabling every creator to build, grow, and monetize their passion.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Creators Served</span>
            </div>
            <div className="stat">
              <span className="stat-number">$2M+</span>
              <span className="stat-label">Revenue Generated</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                The creator economy is worth over $100 billion, yet most creators struggle with 
                fragmented tools, high costs, and complex systems. We believe every creator deserves 
                access to professional-grade tools without the enterprise price tag.
              </p>
              <p>
                MEWAYZ V2 solves this by combining everything creators need into one unified platform 
                with revolutionary pricing that scales with success - not arbitrary user limits.
              </p>
              <div className="mission-highlights">
                <div className="highlight">
                  <span className="highlight-icon">🎯</span>
                  <div>
                    <strong>Unified Platform</strong>
                    <p>Everything you need in one place</p>
                  </div>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">💰</span>
                  <div>
                    <strong>Fair Pricing</strong>
                    <p>Pay for value, not artificial limits</p>
                  </div>
                </div>
                <div className="highlight">
                  <span className="highlight-icon">🚀</span>
                  <div>
                    <strong>Creator First</strong>
                    <p>Built by creators, for creators</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="visual-card">
                <h3>The Creator Problem</h3>
                <div className="problem-list">
                  <div className="problem-item">❌ Using 5-10 different tools</div>
                  <div className="problem-item">❌ Paying $200-500/month</div>
                  <div className="problem-item">❌ Complex integrations</div>
                  <div className="problem-item">❌ Limited by user seats</div>
                </div>
              </div>
              <div className="arrow-down">↓</div>
              <div className="visual-card solution">
                <h3>The MEWAYZ Solution</h3>
                <div className="solution-list">
                  <div className="solution-item">✅ One unified platform</div>
                  <div className="solution-item">✅ $19-39/month bundles</div>
                  <div className="solution-item">✅ Seamless integration</div>
                  <div className="solution-item">✅ Scales with success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-container">
          <h2>Our Journey</h2>
          <p>From startup idea to the platform that's revolutionizing the creator economy</p>
          
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span>{milestone.year}</span>
                </div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <h2>Our Values</h2>
          <p>The principles that guide everything we do</p>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <span>{value.icon}</span>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <h2>Meet Our Team</h2>
          <p>Passionate individuals working to empower creators worldwide</p>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <div className="image-placeholder">
                    <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-role">{member.role}</div>
                  <p>{member.bio}</p>
                  <div className="member-social">
                    <a href={member.linkedin} aria-label="LinkedIn">💼</a>
                    <a href={member.twitter} aria-label="Twitter">🐦</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="innovation-section">
        <div className="innovation-container">
          <h2>Innovation at Our Core</h2>
          <div className="innovation-content">
            <div className="innovation-stats">
              <div className="innovation-stat">
                <h3>Revolutionary Pricing</h3>
                <p>
                  Our revenue-share Enterprise model aligns our success with yours. 
                  We only win when you win.
                </p>
              </div>
              <div className="innovation-stat">
                <h3>Multi-Bundle Discounts</h3>
                <p>
                  Up to 40% savings when combining bundles - because creators 
                  need multiple tools to succeed.
                </p>
              </div>
              <div className="innovation-stat">
                <h3>Creator-First Design</h3>
                <p>
                  Every feature is designed by creators who understand the real 
                  challenges of building an online business.
                </p>
              </div>
            </div>
            
            <div className="innovation-features">
              <h3>What Makes Us Different</h3>
              <div className="feature-comparison">
                <div className="comparison-column">
                  <h4>Traditional Platforms</h4>
                  <ul>
                    <li>Per-seat pricing</li>
                    <li>Feature limitations</li>
                    <li>Multiple tool subscriptions</li>
                    <li>Complex integrations</li>
                    <li>High monthly costs</li>
                  </ul>
                </div>
                <div className="comparison-column">
                  <h4>MEWAYZ V2</h4>
                  <ul>
                    <li>Bundle-based pricing</li>
                    <li>Unlimited usage within bundles</li>
                    <li>All-in-one platform</li>
                    <li>Seamless integration</li>
                    <li>Affordable monthly costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <h2>Join the Creator Revolution</h2>
          <p>
            Be part of the movement that's democratizing the creator economy. 
            Start building your success story today.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta">Start Your Journey</Link>
            <Link to="/contact" className="secondary-cta">Talk to Our Team</Link>
          </div>
          
          <div className="cta-social-proof">
            <p>Trusted by creators in 50+ countries</p>
            <div className="social-proof-logos">
              <div className="proof-item">🎨 Creators</div>
              <div className="proof-item">🛍️ E-commerce</div>
              <div className="proof-item">📱 Influencers</div>
              <div className="proof-item">🎓 Educators</div>
              <div className="proof-item">💼 Businesses</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;