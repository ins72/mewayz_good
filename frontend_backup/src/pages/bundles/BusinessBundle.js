import React from 'react';
import { Link } from 'react-router-dom';
import './BundlePages.css';

const BusinessBundle = () => {
  const features = [
    {
      icon: '👤',
      title: 'Advanced CRM System',
      description: 'Comprehensive customer relationship management with unlimited contacts.',
      details: ['Unlimited contacts', 'Pipeline management', 'Deal tracking', 'Custom fields', 'Activity logging']
    },
    {
      icon: '📧',
      title: 'Email Marketing',
      description: 'Powerful email marketing campaigns with 10,000 emails per month.',
      details: ['10,000 emails/month', 'Campaign automation', 'A/B testing', 'Segmentation', 'Performance tracking']
    },
    {
      icon: '🎯',
      title: 'Lead Management',
      description: 'Advanced lead scoring, tracking, and nurturing capabilities.',
      details: ['Lead scoring', 'Source tracking', 'Automated nurturing', 'Conversion tracking', 'Lead routing']
    },
    {
      icon: '🔄',
      title: 'Workflow Automation',
      description: 'Create and manage up to 10 automated workflows for your business processes.',
      details: ['10 workflows', 'Trigger conditions', 'Multi-step automation', 'Integration support', 'Performance monitoring']
    }
  ];

  const useCases = [
    {
      title: 'Growing Businesses',
      description: 'Perfect for businesses that need professional CRM and marketing automation.',
      example: 'Manage 5,000+ contacts, automate email campaigns, and track deals through your sales pipeline.'
    },
    {
      title: 'Service Providers',
      description: 'Ideal for agencies, consultants, and professional service businesses.',
      example: 'Track client relationships, automate follow-ups, and manage project communications in one place.'
    },
    {
      title: 'Sales Teams',
      description: 'Essential tools for sales teams to manage leads and close more deals.',
      example: 'Score leads automatically, nurture prospects with email sequences, and track deal progress.'
    }
  ];

  const testimonials = [
    {
      name: 'David Kim',
      role: 'Marketing Agency Owner',
      content: 'The Business Bundle transformed how we manage client relationships. Our conversion rate increased by 45% with the automated workflows.',
      results: '45% increase in conversions'
    },
    {
      name: 'Lisa Martinez',
      role: 'Sales Director',
      content: 'Having everything in one platform - CRM, email marketing, and automation - streamlined our entire sales process.',
      results: '60% reduction in admin time'
    }
  ];

  return (
    <div className="bundle-page">
      {/* Navigation */}
      <nav className="bundle-nav">
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
      <section className="bundle-hero">
        <div className="hero-container">
          <div className="bundle-badge">Business Bundle</div>
          <h1>Scale Your Business<br />with Professional CRM</h1>
          <p>
            Complete business management solution with advanced CRM, email marketing, 
            lead management, and workflow automation - everything you need to grow efficiently.
          </p>
          
          <div className="pricing-highlight">
            <div className="price-main">
              <span className="currency">$</span>
              <span className="amount">39</span>
              <span className="period">/month</span>
            </div>
            <div className="price-yearly">
              <span>$390/year (save $78)</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/register" className="primary-cta">Start Free Trial</Link>
            <Link to="/features" className="secondary-cta">Explore All Features</Link>
          </div>

          <div className="hero-features-quick">
            <div className="quick-feature">✓ Unlimited Contacts</div>
            <div className="quick-feature">✓ 10K Email Credits</div>
            <div className="quick-feature">✓ Advanced CRM</div>
            <div className="quick-feature">✓ Workflow Automation</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bundle-features">
        <div className="features-container">
          <h2>Professional Business Tools</h2>
          <p>Everything you need to manage, nurture, and grow your business relationships</p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-details">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="detail-item">
                      <span className="check">✓</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases">
        <div className="use-cases-container">
          <h2>Perfect For</h2>
          <div className="use-cases-grid">
            {useCases.map((useCase, index) => (
              <div key={index} className="use-case-card">
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
                <div className="use-case-example">
                  <strong>Example:</strong> {useCase.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bundle-testimonials">
        <div className="testimonials-container">
          <h2>Business Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                  <div className="author-results">
                    <span className="results-badge">{testimonial.results}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="pricing-comparison">
        <div className="comparison-container">
          <h2>Business Bundle vs. Competitors</h2>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="feature-col">Feature</div>
              <div className="mewayz-col">MEWAYZ Business</div>
              <div className="competitor-col">HubSpot</div>
              <div className="competitor-col">Salesforce</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Contact Management</div>
              <div className="mewayz-col">✓ Unlimited</div>
              <div className="competitor-col">1,000 contacts</div>
              <div className="competitor-col">Unlimited</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Email Marketing</div>
              <div className="mewayz-col">✓ 10,000/month</div>
              <div className="competitor-col">2,000/month</div>
              <div className="competitor-col">Extra cost</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Workflow Automation</div>
              <div className="mewayz-col">✓ 10 workflows</div>
              <div className="competitor-col">5 workflows</div>
              <div className="competitor-col">Limited</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Lead Scoring</div>
              <div className="mewayz-col">✓ Advanced</div>
              <div className="competitor-col">Basic</div>
              <div className="competitor-col">✓</div>
            </div>
            <div className="comparison-row pricing">
              <div className="feature-col">Monthly Price</div>
              <div className="mewayz-col">$39/month</div>
              <div className="competitor-col">$50/month</div>
              <div className="competitor-col">$150/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Combinations */}
      <section className="bundle-combinations">
        <div className="combinations-container">
          <h2>Combine with Other Bundles</h2>
          <p>Save up to 40% when you combine Business Bundle with others</p>
          
          <div className="combinations-grid">
            <div className="combination-card">
              <div className="combination-header">
                <h3>Business + E-commerce</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Complete solution for online businesses with CRM and store management</p>
              <div className="price-comparison">
                <span className="original-price">$63/month</span>
                <span className="discounted-price">$50.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>Business + Operations</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Perfect for service businesses with booking and financial management</p>
              <div className="price-comparison">
                <span className="original-price">$63/month</span>
                <span className="discounted-price">$50.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>Business + Social Media</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Comprehensive marketing solution with CRM and social management</p>
              <div className="price-comparison">
                <span className="original-price">$68/month</span>
                <span className="discounted-price">$54.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bundle-cta">
        <div className="cta-container">
          <h2>Ready to Scale Your Business?</h2>
          <p>Join thousands of growing businesses who chose MEWAYZ for their CRM and automation needs</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta-large">
              Start Your Free Trial
              <span className="cta-sub">14 days free, no credit card required</span>
            </Link>
            <Link to="/contact" className="secondary-cta">Talk to Sales</Link>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">⚡ Setup in 30 minutes</div>
            <div className="cta-feature">📊 Data import included</div>
            <div className="cta-feature">🔧 Free migration support</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessBundle;