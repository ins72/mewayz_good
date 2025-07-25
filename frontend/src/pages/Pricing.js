import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import './Pricing.css';

const Pricing = () => {
  const [paymentInterval, setPaymentInterval] = useState('monthly');

  const pricingBundles = [
    {
      id: 'free_starter',
      name: 'Free Starter',
      description: 'Perfect for testing the platform and personal use',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '1 Bio Link Page (with 5 external links allowed)',
        'Basic Form Builder (1 form, 50 submissions/month)',
        'Simple Analytics (7 days data retention)',
        'Template Marketplace: Buy templates only (cannot sell)',
        'Mewayz Branding: Required on all external-facing content',
        'Support: Community support only'
      ],
      badge: 'Free Forever',
      launchSpecial: 'Always free - perfect for getting started',
      isFree: true,
      isPopular: false
    },
    {
      id: 'creator',
      name: 'Creator Bundle',
      description: 'Perfect for content creators and influencers',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Advanced Bio Link Builder (unlimited links, custom domain)',
        'Professional Website Builder (10 pages, custom domain)',
        'SEO Optimization Suite (basic SEO tools)',
        'AI Content Creation (500 credits/month)',
        'Template Marketplace (buy & sell templates)',
        'Remove Mewayz Branding',
        'Email Support'
      ],
      badge: 'Most Popular',
      launchSpecial: 'First 1000 users get 3 months for $9/month',
      savings: 'Save $38/year',
      isPopular: true
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Bundle',
      description: 'Complete online store solution',
      monthlyPrice: 24,
      yearlyPrice: 240,
      features: [
        'Complete E-commerce Store (unlimited products)',
        'Multi-vendor Marketplace (up to 10 vendors)',
        'Advanced Promotions (coupons, discounts, referrals)',
        'Payment Processing (Stripe/PayPal integration)',
        'Inventory Management',
        'Basic Analytics',
        'Priority Email Support'
      ],
      badge: 'Best for Sales',
      launchSpecial: 'First 500 users get 2 months free',
      savings: 'Save $48/year'
    },
    {
      id: 'social_media',
      name: 'Social Media Bundle',
      description: 'Advanced social media management and growth',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Instagram Lead Database (1000 searches/month)',
        'Social Media Scheduling (all major platforms)',
        'Twitter/TikTok Tools (advanced features)',
        'Social Analytics (detailed insights)',
        'Hashtag Research (trending hashtags)',
        'Priority Support'
      ],
      badge: 'Growth Focused',
      launchSpecial: 'First 2 weeks free trial',
      savings: 'Save $58/year'
    },
    {
      id: 'education',
      name: 'Education Bundle',
      description: 'Complete course platform and student management',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Complete Course Platform (unlimited students)',
        'Template Marketplace (create & sell course templates)',
        'Student Management (progress tracking, certificates)',
        'Live Streaming (basic streaming capabilities)',
        'Community Features (student discussions)',
        'Priority Support'
      ],
      badge: 'Learning Hub',
      launchSpecial: 'First month free',
      savings: 'Save $58/year'
    },
    {
      id: 'business',
      name: 'Business Bundle',
      description: 'Advanced CRM and business automation tools',
      monthlyPrice: 39,
      yearlyPrice: 390,
      features: [
        'Advanced CRM System (unlimited contacts)',
        'Email Marketing (10,000 emails/month)',
        'Lead Management (advanced scoring & tracking)',
        'Workflow Automation (10 workflows)',
        'Campaign Management (multi-channel campaigns)',
        'Business Analytics (detailed reporting)',
        'Phone + Email Support'
      ],
      badge: 'Most Powerful',
      launchSpecial: '50% off first 3 months',
      savings: 'Save $78/year'
    },
    {
      id: 'operations',
      name: 'Operations Bundle',
      description: 'Booking, financial management and business operations',
      monthlyPrice: 24,
      yearlyPrice: 240,
      features: [
        'Booking & Appointments (unlimited bookings)',
        'Financial Management (invoicing, expenses)',
        'Advanced Form Builder (unlimited forms)',
        'Survey & Feedback Tools (advanced surveys)',
        'Basic Reporting',
        'Email Support'
      ],
      badge: 'Efficiency Pro',
      launchSpecial: 'First month free',
      savings: 'Save $48/year'
    }
  ];

  const calculateDiscount = (bundleCount) => {
    if (bundleCount >= 4) return 0.40; // 40% discount
    if (bundleCount === 3) return 0.30; // 30% discount
    if (bundleCount === 2) return 0.20; // 20% discount
    return 0;
  };

  return (
    <div className="pricing-page">
      {/* Navigation Header */}
      <nav className="pricing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="cta-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="hero-container">
          <h1>Choose Your Perfect Plan</h1>
          <p>Start with our free plan or unlock powerful features with our premium bundles. Mix and match for the perfect solution.</p>
          
          {/* Payment Toggle */}
          <div className="payment-toggle">
            <label className={`toggle-option ${paymentInterval === 'monthly' ? 'active' : ''}`}>
              <input
                type="radio"
                value="monthly"
                checked={paymentInterval === 'monthly'}
                onChange={(e) => setPaymentInterval(e.target.value)}
              />
              Monthly
            </label>
            <label className={`toggle-option ${paymentInterval === 'yearly' ? 'active' : ''}`}>
              <input
                type="radio"
                value="yearly"
                checked={paymentInterval === 'yearly'}
                onChange={(e) => setPaymentInterval(e.target.value)}
              />
              Yearly <span className="save-badge">Save up to 20%</span>
            </label>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pricing-grid">
        <div className="grid-container">
          {pricingBundles.map((bundle, index) => (
            <div 
              key={bundle.id}
              className={`pricing-card ${bundle.isFree ? 'free-card' : ''} ${bundle.isPopular ? 'popular-card' : ''}`}
            >
              {bundle.badge && <div className="card-badge">{bundle.badge}</div>}
              
              <div className="card-header">
                <h3>{bundle.name}</h3>
                <div className="price-display">
                  {bundle.isFree ? (
                    <span className="free-price">Free</span>
                  ) : (
                    <>
                      <span className="currency">$</span>
                      <span className="amount">
                        {paymentInterval === 'monthly' ? bundle.monthlyPrice : bundle.yearlyPrice}
                      </span>
                      <span className="period">/{paymentInterval === 'monthly' ? 'mo' : 'yr'}</span>
                    </>
                  )}
                </div>
                <p className="description">{bundle.description}</p>
                {bundle.savings && paymentInterval === 'yearly' && (
                  <div className="yearly-savings">{bundle.savings}</div>
                )}
              </div>

              <div className="card-features">
                {bundle.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              {bundle.launchSpecial && (
                <div className="launch-offer">
                  🎉 {bundle.launchSpecial}
                </div>
              )}

              <div className="card-action">
                {bundle.isFree ? (
                  <Link to="/register" className="select-btn free-btn">
                    Start Free Forever
                  </Link>
                ) : (
                  <Link to="/register" className="select-btn premium-btn">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Bundle Discounts */}
      <section className="bundle-discounts">
        <div className="discounts-container">
          <h2>Multi-Bundle Savings</h2>
          <p>Combine bundles and save big with our launch pricing strategy</p>
          
          <div className="discount-grid">
            <div className="discount-card">
              <div className="discount-badge">20% OFF</div>
              <h3>2 Bundles</h3>
              <p>Choose any 2 bundles and save 20% on your total</p>
              <div className="example">
                Example: Creator + E-commerce = $43/mo → $34.40/mo
              </div>
            </div>
            
            <div className="discount-card featured">
              <div className="discount-badge">30% OFF</div>
              <h3>3 Bundles</h3>
              <p>Perfect for growing businesses - 30% savings</p>
              <div className="example">
                Example: Creator + E-commerce + Social = $72/mo → $50.40/mo
              </div>
            </div>
            
            <div className="discount-card">
              <div className="discount-badge">40% OFF</div>
              <h3>4+ Bundles</h3>
              <p>Ultimate package for serious businesses</p>
              <div className="example">
                All 6 bundles = $184/mo → $110.40/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="enterprise-section">
        <div className="enterprise-container">
          <h2>Need Something Bigger?</h2>
          <div className="enterprise-card">
            <h3>MEWAYZ Enterprise</h3>
            <div className="enterprise-pricing">
              <span className="revenue-share">15%</span>
              <span className="pricing-text">of platform revenue</span>
              <span className="minimum">Min. $99/month</span>
            </div>
            <p>Pay based on your success. We grow when you grow.</p>
            
            <div className="enterprise-features">
              <div className="feature-column">
                <h4>Everything Included</h4>
                <ul>
                  <li>All premium bundles included</li>
                  <li>White-label solution</li>
                  <li>Custom domain management</li>
                  <li>Dedicated support</li>
                </ul>
              </div>
              <div className="feature-column">
                <h4>Enterprise Benefits</h4>
                <ul>
                  <li>API access & integrations</li>
                  <li>Advanced analytics & reporting</li>
                  <li>99% uptime SLA</li>
                  <li>Revenue tracking integration</li>
                </ul>
              </div>
            </div>
            
            <Link to="/enterprise" className="enterprise-btn">
              Learn More About Enterprise →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I change plans anytime?</h3>
              <p>Yes! You can upgrade, downgrade, or change your bundle combination at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h3>What happens to my data if I downgrade?</h3>
              <p>Your data is never deleted. If you downgrade, some features may be limited, but all your content remains safe.</p>
            </div>
            <div className="faq-item">
              <h3>Are there any setup fees?</h3>
              <p>No setup fees, no hidden costs. You only pay for the bundles you select, with transparent pricing.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use multiple bundles together?</h3>
              <p>Absolutely! Our platform is designed for bundle combinations. Plus, you get increasing discounts for multiple bundles.</p>
            </div>
          </div>
          
          <div className="faq-cta">
            <p>Still have questions?</p>
            <Link to="/help" className="help-link">Visit our Help Center</Link>
            <span> or </span>
            <Link to="/contact" className="contact-link">Contact Support</Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pricing-footer-cta">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of creators, businesses, and entrepreneurs building their success with MEWAYZ V2</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta">Start Free Trial</Link>
            <Link to="/contact" className="secondary-cta">Talk to Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;