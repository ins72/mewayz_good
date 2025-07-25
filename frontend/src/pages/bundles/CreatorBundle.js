import React from 'react';
import { Link } from 'react-router-dom';
import './BundlePages.css';

const CreatorBundle = () => {
  const features = [
    {
      icon: '🔗',
      title: 'Advanced Bio Link Builder',
      description: 'Create stunning, customizable bio link pages with unlimited links and custom domains.',
      details: ['Unlimited links', 'Custom domains', 'Analytics tracking', 'Theme customization', 'Click tracking']
    },
    {
      icon: '🌐',
      title: 'Professional Website Builder',
      description: 'Build professional websites with drag-and-drop simplicity.',
      details: ['10 pages included', 'Responsive design', 'SEO optimization', 'Custom domains', 'SSL certificates']
    },
    {
      icon: '🤖',
      title: 'AI Content Creation',
      description: 'Generate engaging content with AI-powered writing and design tools.',
      details: ['500 credits/month', 'Multiple content types', 'Brand voice training', 'Auto-posting', 'Content calendar']
    },
    {
      icon: '🎨',
      title: 'Template Marketplace',
      description: 'Access thousands of professional templates and earn by selling your designs.',
      details: ['Buy premium templates', 'Sell your designs', 'Revenue sharing', 'Template customization', 'Version control']
    }
  ];

  const useCases = [
    {
      title: 'Content Creators',
      description: 'Perfect for YouTubers, podcasters, and bloggers who need a professional online presence.',
      example: 'Create a stunning bio link page with links to all your content, plus a website to showcase your portfolio.'
    },
    {
      title: 'Influencers',
      description: 'Build your personal brand with professional tools designed for creators.',
      example: 'Use AI to generate engaging captions and content, then share everything through your custom website.'
    },
    {
      title: 'Artists & Designers',
      description: 'Showcase your work and sell templates through the marketplace.',
      example: 'Display your portfolio on a beautiful website and earn passive income selling design templates.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'YouTuber (500K subscribers)',
      content: 'The Creator Bundle transformed my online presence. I went from having scattered links to a professional website that showcases everything I do.',
      results: '300% increase in click-through rates'
    },
    {
      name: 'Mike Chen',
      role: 'Digital Artist',
      content: 'Not only do I have an amazing portfolio site, but I\'m earning $500/month selling templates in their marketplace!',
      results: '$6K additional revenue in first year'
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
          <div className="bundle-badge">Creator Bundle</div>
          <h1>Everything You Need to<br />Build Your Creator Brand</h1>
          <p>
            From professional bio links to stunning websites and AI-powered content creation - 
            everything a modern creator needs to establish their online presence and grow their audience.
          </p>
          
          <div className="pricing-highlight">
            <div className="price-main">
              <span className="currency">$</span>
              <span className="amount">19</span>
              <span className="period">/month</span>
            </div>
            <div className="price-yearly">
              <span>$190/year (save $38)</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/register" className="primary-cta">Start Free Trial</Link>
            <Link to="/features" className="secondary-cta">Explore All Features</Link>
          </div>

          <div className="hero-features-quick">
            <div className="quick-feature">✓ Unlimited Bio Links</div>
            <div className="quick-feature">✓ Professional Website</div>
            <div className="quick-feature">✓ AI Content Tools</div>
            <div className="quick-feature">✓ Template Marketplace</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bundle-features">
        <div className="features-container">
          <h2>Powerful Features for Creators</h2>
          <p>Everything you need to build, showcase, and monetize your creative work</p>
          
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
          <h2>Creator Success Stories</h2>
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
          <h2>Creator Bundle vs. Competitors</h2>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="feature-col">Feature</div>
              <div className="mewayz-col">MEWAYZ Creator</div>
              <div className="competitor-col">Linktree Pro</div>
              <div className="competitor-col">Squarespace</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Bio Link Builder</div>
              <div className="mewayz-col">✓ Unlimited</div>
              <div className="competitor-col">Limited</div>
              <div className="competitor-col">❌</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Website Builder</div>
              <div className="mewayz-col">✓ 10 Pages</div>
              <div className="competitor-col">❌</div>
              <div className="competitor-col">✓</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">AI Content Creation</div>
              <div className="mewayz-col">✓ 500 credits</div>
              <div className="competitor-col">❌</div>
              <div className="competitor-col">❌</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Template Marketplace</div>
              <div className="mewayz-col">✓ Buy & Sell</div>
              <div className="competitor-col">❌</div>
              <div className="competitor-col">Limited</div>
            </div>
            <div className="comparison-row pricing">
              <div className="feature-col">Monthly Price</div>
              <div className="mewayz-col">$19/month</div>
              <div className="competitor-col">$24/month</div>
              <div className="competitor-col">$18/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Combinations */}
      <section className="bundle-combinations">
        <div className="combinations-container">
          <h2>Combine with Other Bundles</h2>
          <p>Save up to 40% when you combine Creator Bundle with others</p>
          
          <div className="combinations-grid">
            <div className="combination-card">
              <div className="combination-header">
                <h3>Creator + E-commerce</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Perfect for creators selling products or merchandise</p>
              <div className="price-comparison">
                <span className="original-price">$43/month</span>
                <span className="discounted-price">$34.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>Creator + Social Media</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Ideal for influencers managing multiple social platforms</p>
              <div className="price-comparison">
                <span className="original-price">$48/month</span>
                <span className="discounted-price">$38.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>Creator + Education</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Great for content creators launching online courses</p>
              <div className="price-comparison">
                <span className="original-price">$48/month</span>
                <span className="discounted-price">$38.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bundle-cta">
        <div className="cta-container">
          <h2>Ready to Build Your Creator Brand?</h2>
          <p>Join thousands of creators who chose MEWAYZ to power their online presence</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta-large">
              Start Your Free Trial
              <span className="cta-sub">14 days free, no credit card required</span>
            </Link>
            <Link to="/contact" className="secondary-cta">Talk to Sales</Link>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">🚀 Setup in minutes</div>
            <div className="cta-feature">💳 Cancel anytime</div>
            <div className="cta-feature">🎯 No long-term commitment</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatorBundle;