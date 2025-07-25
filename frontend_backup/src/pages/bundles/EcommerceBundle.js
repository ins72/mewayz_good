import React from 'react';
import { Link } from 'react-router-dom';
import './BundlePages.css';

const EcommerceBundle = () => {
  const features = [
    {
      icon: '🏪',
      title: 'Complete Online Store',
      description: 'Full-featured e-commerce platform with unlimited products and advanced management.',
      details: ['Unlimited products', 'Inventory management', 'Order tracking', 'Customer accounts', 'Mobile responsive']
    },
    {
      icon: '🏬',
      title: 'Multi-Vendor Marketplace',
      description: 'Create a marketplace platform with support for up to 10 vendors.',
      details: ['10 vendor accounts', 'Commission management', 'Vendor dashboards', 'Product approvals', 'Payout automation']
    },
    {
      icon: '🎁',
      title: 'Advanced Promotions',
      description: 'Powerful marketing tools including coupons, discounts, and referral programs.',
      details: ['Coupon codes', 'Bulk discounts', 'Referral system', 'Loyalty programs', 'Flash sales']
    },
    {
      icon: '💳',
      title: 'Payment Processing',
      description: 'Secure payment processing with multiple gateways and global currency support.',
      details: ['Stripe integration', 'PayPal support', 'Global currencies', 'Subscription billing', 'Fraud protection']
    }
  ];

  const useCases = [
    {
      title: 'Online Retailers',
      description: 'Perfect for businesses selling physical or digital products online.',
      example: 'Launch your online store with inventory management, payment processing, and customer accounts.'
    },
    {
      title: 'Marketplace Creators',
      description: 'Build platforms where multiple vendors can sell their products.',
      example: 'Create a niche marketplace with 10 vendors, automated payouts, and commission tracking.'
    },
    {
      title: 'Subscription Businesses',
      description: 'Sell subscription products with recurring billing and customer management.',
      example: 'Set up subscription boxes, digital memberships, or SaaS products with automated billing.'
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Rodriguez',
      role: 'Online Store Owner',
      content: 'The E-commerce Bundle helped me launch my boutique online. The inventory management and payment processing made everything seamless.',
      results: '$50K revenue in first 6 months'
    },
    {
      name: 'Marcus Thompson',
      role: 'Marketplace Creator',
      content: 'I built a successful marketplace for local artisans using MEWAYZ. The vendor management tools are incredible!',
      results: '150+ vendors, $200K GMV'
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
          <div className="bundle-badge">E-commerce Bundle</div>
          <h1>Launch Your Online Store<br />in Minutes, Not Months</h1>
          <p>
            Complete e-commerce solution with everything you need to sell online - from product management 
            to payment processing, marketplace functionality to advanced promotions.
          </p>
          
          <div className="pricing-highlight">
            <div className="price-main">
              <span className="currency">$</span>
              <span className="amount">24</span>
              <span className="period">/month</span>
            </div>
            <div className="price-yearly">
              <span>$240/year (save $48)</span>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/register" className="primary-cta">Start Free Trial</Link>
            <Link to="/features" className="secondary-cta">Explore All Features</Link>
          </div>

          <div className="hero-features-quick">
            <div className="quick-feature">✓ Unlimited Products</div>
            <div className="quick-feature">✓ Multi-Vendor Support</div>
            <div className="quick-feature">✓ Payment Processing</div>
            <div className="quick-feature">✓ Advanced Promotions</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bundle-features">
        <div className="features-container">
          <h2>Everything You Need to Sell Online</h2>
          <p>Professional e-commerce tools that scale with your business</p>
          
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
          <h2>E-commerce Success Stories</h2>
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
          <h2>E-commerce Bundle vs. Competitors</h2>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="feature-col">Feature</div>
              <div className="mewayz-col">MEWAYZ E-commerce</div>
              <div className="competitor-col">Shopify</div>
              <div className="competitor-col">WooCommerce</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Product Listings</div>
              <div className="mewayz-col">✓ Unlimited</div>
              <div className="competitor-col">Unlimited</div>
              <div className="competitor-col">Unlimited</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Multi-Vendor Support</div>
              <div className="mewayz-col">✓ 10 Vendors</div>
              <div className="competitor-col">Extra $39/month</div>
              <div className="competitor-col">Plugin Required</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Transaction Fees</div>
              <div className="mewayz-col">✓ 0%</div>
              <div className="competitor-col">2.9% + 30¢</div>
              <div className="competitor-col">Payment processor fees</div>
            </div>
            <div className="comparison-row">
              <div className="feature-col">Advanced Promotions</div>
              <div className="mewayz-col">✓ Built-in</div>
              <div className="competitor-col">Limited</div>
              <div className="competitor-col">Plugin Required</div>
            </div>
            <div className="comparison-row pricing">
              <div className="feature-col">Monthly Price</div>
              <div className="mewayz-col">$24/month</div>
              <div className="competitor-col">$79/month</div>
              <div className="competitor-col">$15/month + hosting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Combinations */}
      <section className="bundle-combinations">
        <div className="combinations-container">
          <h2>Combine with Other Bundles</h2>
          <p>Save up to 40% when you combine E-commerce Bundle with others</p>
          
          <div className="combinations-grid">
            <div className="combination-card">
              <div className="combination-header">
                <h3>E-commerce + Creator</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Perfect for creators selling their own products and merchandise</p>
              <div className="price-comparison">
                <span className="original-price">$43/month</span>
                <span className="discounted-price">$34.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>E-commerce + Social Media</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Ideal for social commerce and Instagram shopping integration</p>
              <div className="price-comparison">
                <span className="original-price">$53/month</span>
                <span className="discounted-price">$42.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>

            <div className="combination-card">
              <div className="combination-header">
                <h3>E-commerce + Business</h3>
                <div className="savings-badge">Save 20%</div>
              </div>
              <p>Complete business solution with CRM and email marketing</p>
              <div className="price-comparison">
                <span className="original-price">$63/month</span>
                <span className="discounted-price">$50.40/month</span>
              </div>
              <Link to="/pricing" className="combo-cta">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bundle-cta">
        <div className="cta-container">
          <h2>Ready to Launch Your Online Store?</h2>
          <p>Join thousands of successful merchants who chose MEWAYZ for their e-commerce needs</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta-large">
              Start Your Free Trial
              <span className="cta-sub">14 days free, no credit card required</span>
            </Link>
            <Link to="/contact" className="secondary-cta">Talk to Sales</Link>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">🛒 Store setup in 15 minutes</div>
            <div className="cta-feature">💳 No transaction fees</div>
            <div className="cta-feature">📈 Scale without limits</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceBundle;