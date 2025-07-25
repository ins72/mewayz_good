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
    <PublicLayout>
      <div className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="hero-container">
            <div className="hero-badge">
              <span>💰</span>
              <span>Simple, Transparent Pricing</span>
            </div>
            
            <h1>Choose Your Perfect Bundle</h1>
            <p>Start with any bundle and upgrade anytime. No hidden fees, no surprises.</p>
            
            <div className="pricing-toggle">
              <button 
                className={`toggle-btn ${paymentInterval === 'monthly' ? 'active' : ''}`}
                onClick={() => setPaymentInterval('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`toggle-btn ${paymentInterval === 'yearly' ? 'active' : ''}`}
                onClick={() => setPaymentInterval('yearly')}
              >
                Yearly
                <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pricing-cards">
          <div className="cards-container">
            <div className="pricing-grid">
              {pricingBundles.map((bundle) => (
                <div key={bundle.id} className={`pricing-card ${bundle.isPopular ? 'popular' : ''}`}>
                  {bundle.badge && (
                    <div className="card-badge">
                      {bundle.badge}
                    </div>
                  )}
                  
                  <div className="card-header">
                    <h3>{bundle.name}</h3>
                    <p className="card-description">{bundle.description}</p>
                  </div>
                  
                  <div className="card-pricing">
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">
                        {paymentInterval === 'monthly' ? bundle.monthlyPrice : Math.floor(bundle.yearlyPrice / 12)}
                      </span>
                      <span className="period">
                        {bundle.isFree ? '' : '/month'}
                      </span>
                    </div>
                    
                    {paymentInterval === 'yearly' && !bundle.isFree && (
                      <div className="yearly-price">
                        <span className="billed-yearly">
                          Billed yearly (${bundle.yearlyPrice})
                        </span>
                        {bundle.savings && (
                          <span className="savings">{bundle.savings}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="card-features">
                    <ul>
                      {bundle.features.map((feature, index) => (
                        <li key={index}>
                          <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {bundle.launchSpecial && (
                    <div className="launch-special">
                      <span className="special-icon">🎉</span>
                      <span>{bundle.launchSpecial}</span>
                    </div>
                  )}
                  
                  <div className="card-action">
                    <Link 
                      to="/register" 
                      className={`select-btn ${bundle.isPopular ? 'popular-btn' : bundle.isFree ? 'free-btn' : 'premium-btn'}`}
                    >
                      {bundle.isFree ? 'Start Free Forever' : 'Get Started'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Bundle Discounts */}
        <section className="bundle-discounts">
          <div className="discounts-container">
            <div className="section-header">
              <h2>Multi-Bundle Savings</h2>
              <p>Combine bundles and save big with our launch pricing strategy</p>
            </div>
            
            <div className="discount-grid">
              <div className="discount-card">
                <div className="discount-header">
                  <div className="discount-badge">20% OFF</div>
                  <h3>2 Bundles</h3>
                </div>
                <p>Choose any 2 bundles and save 20% on your total</p>
                <div className="example">
                  <span className="example-label">Example:</span>
                  <span className="calculation">Creator + E-commerce = $43/mo → $34.40/mo</span>
                </div>
              </div>
              
              <div className="discount-card featured">
                <div className="discount-header">
                  <div className="discount-badge popular">30% OFF</div>
                  <h3>3 Bundles</h3>
                </div>
                <p>Perfect for growing businesses - 30% savings</p>
                <div className="example">
                  <span className="example-label">Example:</span>
                  <span className="calculation">Creator + E-commerce + Social = $72/mo → $50.40/mo</span>
                </div>
              </div>
              
              <div className="discount-card">
                <div className="discount-header">
                  <div className="discount-badge">40% OFF</div>
                  <h3>4+ Bundles</h3>
                </div>
                <p>Ultimate package for serious businesses</p>
                <div className="example">
                  <span className="example-label">Example:</span>
                  <span className="calculation">All 6 bundles = $184/mo → $110.40/mo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="enterprise-section">
          <div className="enterprise-container">
            <div className="section-header">
              <h2>Need Something Bigger?</h2>
              <p>Enterprise solutions for growing businesses</p>
            </div>
            
            <div className="enterprise-card">
              <div className="enterprise-header">
                <h3>MEWAYZ Enterprise</h3>
                <div className="enterprise-pricing">
                  <div className="revenue-share">
                    <span className="percentage">15%</span>
                    <span className="revenue-text">of platform revenue</span>
                  </div>
                  <div className="minimum">
                    <span className="min-label">Minimum</span>
                    <span className="min-price">$99/month</span>
                  </div>
                </div>
                <p className="enterprise-subtitle">Pay based on your success. We grow when you grow.</p>
              </div>
              
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
              
              <div className="enterprise-action">
                <Link to="/enterprise" className="enterprise-btn">
                  Learn More About Enterprise
                  <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about our pricing</p>
            </div>
            
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Can I change my bundle anytime?</h3>
                <p>Yes! You can upgrade or downgrade your bundle at any time. Changes take effect immediately, and we'll prorate your billing.</p>
              </div>
              
              <div className="faq-item">
                <h3>What happens to my data if I downgrade?</h3>
                <p>Your data is never deleted. If you downgrade, some features may be limited, but all your content remains safe and accessible.</p>
              </div>
              
              <div className="faq-item">
                <h3>Are there any setup fees?</h3>
                <p>No setup fees, no hidden costs. You only pay for the bundles you select, with transparent pricing and no surprises.</p>
              </div>
              
              <div className="faq-item">
                <h3>Can I use multiple bundles together?</h3>
                <p>Absolutely! Our platform is designed for bundle combinations. Plus, you get increasing discounts for multiple bundles.</p>
              </div>
              
              <div className="faq-item">
                <h3>What payment methods do you accept?</h3>
                <p>We accept all major credit cards, PayPal, and offer invoice billing for enterprise customers.</p>
              </div>
              
              <div className="faq-item">
                <h3>Is there a free trial?</h3>
                <p>Yes! We offer a 14-day free trial for all paid bundles. No credit card required to start.</p>
              </div>
            </div>
            
            <div className="faq-cta">
              <h3>Still have questions?</h3>
              <div className="cta-links">
                <Link to="/help" className="help-link">Visit Help Center</Link>
                <span className="divider">or</span>
                <Link to="/contact" className="contact-link">Contact Support</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of creators, businesses, and entrepreneurs building their success with MEWAYZ V2</p>
              
              <div className="cta-buttons">
                <Link to="/register" className="primary-cta">
                  Start Free Trial
                  <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="/contact" className="secondary-cta">
                  Talk to Sales
                </Link>
              </div>
              
              <div className="trust-indicators">
                <div className="indicator">
                  <span className="indicator-icon">🔒</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="indicator">
                  <span className="indicator-icon">💳</span>
                  <span>Secure Payment</span>
                </div>
                <div className="indicator">
                  <span className="indicator-icon">🚫</span>
                  <span>No Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Pricing;