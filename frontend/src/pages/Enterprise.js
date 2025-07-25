import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Enterprise.css';

const Enterprise = () => {
  const [revenueSlider, setRevenueSlider] = useState(5000);
  
  const calculateCost = (revenue) => {
    const cost = Math.max(revenue * 0.15, 99);
    return cost;
  };

  const revenueExamples = [
    { revenue: 1000, cost: 99, note: "Minimum pricing applies" },
    { revenue: 5000, cost: 750, note: "15% revenue share" },
    { revenue: 10000, cost: 1500, note: "15% revenue share" },
    { revenue: 25000, cost: 3750, note: "15% revenue share" },
    { revenue: 50000, cost: 7500, note: "15% revenue share" },
    { revenue: 100000, cost: 15000, note: "15% revenue share" }
  ];

  return (
    <div className="enterprise-page">
      {/* Navigation */}
      <nav className="enterprise-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="cta-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="enterprise-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>MEWAYZ Enterprise</h1>
            <h2>We grow when you grow</h2>
            <p>Revolutionary revenue-share pricing that aligns our success with yours. Pay based on your platform revenue, not arbitrary user limits.</p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">15%</div>
                <div className="stat-label">Revenue Share</div>
              </div>
              <div className="stat">
                <div className="stat-number">$99</div>
                <div className="stat-label">Minimum/Month</div>
              </div>
              <div className="stat">
                <div className="stat-number">99%</div>
                <div className="stat-label">Uptime SLA</div>
              </div>
            </div>
            
            <div className="hero-cta">
              <button className="primary-cta">Schedule Demo</button>
              <button className="secondary-cta">Calculate Your Cost</button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="revenue-calculator">
              <h3>Revenue Calculator</h3>
              <div className="calculator-content">
                <label>Monthly Platform Revenue:</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    value={revenueSlider}
                    onChange={(e) => setRevenueSlider(parseInt(e.target.value))}
                    className="revenue-slider"
                  />
                  <div className="slider-labels">
                    <span>$1K</span>
                    <span>$100K</span>
                  </div>
                </div>
                
                <div className="calculation-result">
                  <div className="revenue-display">${revenueSlider.toLocaleString()}/mo revenue</div>
                  <div className="cost-display">= ${Math.round(calculateCost(revenueSlider)).toLocaleString()}/mo cost</div>
                  <div className="percentage">
                    ({revenueSlider < 660 ? 'Minimum pricing applies' : '15% of revenue'})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Revenue Share */}
      <section className="why-revenue-share">
        <div className="section-container">
          <h2>Why Revenue-Share Makes Sense</h2>
          <p className="section-subtitle">Traditional SaaS pricing punishes growth. We believe in aligned incentives.</p>
          
          <div className="comparison-grid">
            <div className="comparison-card traditional">
              <div className="card-header">
                <h3>Traditional SaaS Pricing</h3>
                <div className="pricing-model">$500-$5000/month</div>
              </div>
              <div className="pain-points">
                <div className="pain-point">
                  <span className="icon">❌</span>
                  <span>Pay the same whether you make $1K or $100K</span>
                </div>
                <div className="pain-point">
                  <span className="icon">❌</span>
                  <span>Expensive when starting, cheap when successful</span>
                </div>
                <div className="pain-point">
                  <span className="icon">❌</span>
                  <span>Arbitrary limits on users, features, storage</span>
                </div>
                <div className="pain-point">
                  <span className="icon">❌</span>
                  <span>Vendor success not tied to your success</span>
                </div>
              </div>
            </div>
            
            <div className="comparison-card revenue-share">
              <div className="card-header">
                <h3>MEWAYZ Revenue-Share</h3>
                <div className="pricing-model">15% of platform revenue</div>
              </div>
              <div className="benefits">
                <div className="benefit">
                  <span className="icon">✅</span>
                  <span>Pay proportional to your success</span>
                </div>
                <div className="benefit">
                  <span className="icon">✅</span>
                  <span>Affordable when starting, scales with growth</span>
                </div>
                <div className="benefit">
                  <span className="icon">✅</span>
                  <span>No arbitrary limits - grow without restrictions</span>
                </div>
                <div className="benefit">
                  <span className="icon">✅</span>
                  <span>We succeed only when you succeed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="pricing-examples">
        <div className="section-container">
          <h2>Real Pricing Examples</h2>
          <p>See exactly what you'd pay at different revenue levels</p>
          
          <div className="examples-grid">
            {revenueExamples.map((example, index) => (
              <div key={index} className={`example-card ${example.revenue <= 1000 ? 'minimum' : ''}`}>
                <div className="revenue-amount">${example.revenue.toLocaleString()}</div>
                <div className="revenue-label">Monthly Revenue</div>
                <div className="cost-arrow">↓</div>
                <div className="cost-amount">${example.cost.toLocaleString()}</div>
                <div className="cost-label">You Pay</div>
                <div className="cost-note">{example.note}</div>
              </div>
            ))}
          </div>
          
          <div className="pricing-note">
            <p><strong>How it works:</strong> We automatically calculate 15% of all revenue processed through your MEWAYZ platform. If that amount is less than $99/month, you pay our minimum of $99/month.</p>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="enterprise-features">
        <div className="section-container">
          <h2>Everything You Need to Scale</h2>
          <p>All premium bundles included, plus enterprise-grade features</p>
          
          <div className="features-grid">
            <div className="feature-category">
              <h3>🎯 All Premium Bundles</h3>
              <ul>
                <li>Creator Bundle - Advanced bio links & websites</li>
                <li>E-commerce Bundle - Full online store platform</li>
                <li>Social Media Bundle - Advanced social management</li>
                <li>Education Bundle - Complete course platform</li>
                <li>Business Bundle - Advanced CRM & automation</li>
                <li>Operations Bundle - Booking & financial management</li>
              </ul>
            </div>
            
            <div className="feature-category">
              <h3>🏢 Enterprise Infrastructure</h3>
              <ul>
                <li>White-label solution (your branding everywhere)</li>
                <li>Custom domain management</li>
                <li>Advanced API access & webhooks</li>
                <li>99% uptime SLA with monitoring</li>
                <li>Priority support (email, chat, phone)</li>
                <li>Dedicated account manager</li>
              </ul>
            </div>
            
            <div className="feature-category">
              <h3>📊 Advanced Analytics</h3>
              <ul>
                <li>Revenue tracking & automatic calculation</li>
                <li>Custom reporting & dashboards</li>
                <li>Advanced user behavior analytics</li>
                <li>Performance optimization insights</li>
                <li>Export capabilities (CSV, API)</li>
                <li>Real-time monitoring & alerts</li>
              </ul>
            </div>
            
            <div className="feature-category">
              <h3>🔧 Developer Tools</h3>
              <ul>
                <li>Full REST API access</li>
                <li>Custom integrations & webhooks</li>
                <li>SDK for popular languages</li>
                <li>Staging environments</li>
                <li>Advanced security controls</li>
                <li>SSO integration support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Special */}
      <section className="launch-special">
        <div className="section-container">
          <div className="special-card">
            <div className="special-badge">🎉 Launch Special</div>
            <h2>First 50 Enterprise Customers</h2>
            <div className="special-offer">
              <span className="special-percentage">10%</span>
              <span className="special-text">revenue share for first 6 months</span>
            </div>
            <p>Lock in our launch pricing before we move to standard 15% revenue share</p>
            <div className="special-cta">
              <button className="special-btn">Claim Launch Pricing</button>
              <span className="spots-remaining">42 spots remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <div className="section-container">
          <h2>Enterprise Success Stories</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-metrics">
                <div className="metric">
                  <span className="metric-number">$45K</span>
                  <span className="metric-label">Monthly Revenue</span>
                </div>
                <div className="metric">
                  <span className="metric-number">$6.8K</span>
                  <span className="metric-label">Monthly MEWAYZ Cost</span>
                </div>
              </div>
              <blockquote>
                "The revenue-share model made it possible for us to start without massive upfront costs. Now that we're generating $45K/month, the 15% feels totally fair."
              </blockquote>
              <div className="story-author">
                <div className="author-info">
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-title">CEO, CreatorHub Pro</div>
                </div>
              </div>
            </div>
            
            <div className="story-card">
              <div className="story-metrics">
                <div className="metric">
                  <span className="metric-number">$12K</span>
                  <span className="metric-label">Monthly Revenue</span>
                </div>
                <div className="metric">
                  <span className="metric-number">$1.8K</span>
                  <span className="metric-label">Monthly MEWAYZ Cost</span>
                </div>
              </div>
              <blockquote>
                "We tried three other platforms with traditional pricing. MEWAYZ Enterprise saved us $2,000/month while providing better features."
              </blockquote>
              <div className="story-author">
                <div className="author-info">
                  <div className="author-name">Marcus Rodriguez</div>
                  <div className="author-title">Founder, EduTech Solutions</div>
                </div>
              </div>
            </div>
            
            <div className="story-card">
              <div className="story-metrics">
                <div className="metric">
                  <span className="metric-number">$89K</span>
                  <span className="metric-label">Monthly Revenue</span>
                </div>
                <div className="metric">
                  <span className="metric-number">$13.4K</span>
                  <span className="metric-label">Monthly MEWAYZ Cost</span>
                </div>
              </div>
              <blockquote>
                "The aligned incentive model means MEWAYZ is genuinely invested in our success. Their support has been incredible as we scaled to $89K/month."
              </blockquote>
              <div className="story-author">
                <div className="author-info">
                  <div className="author-name">Alex Thompson</div>
                  <div className="author-title">Co-founder, Social Commerce Co</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="enterprise-faq">
        <div className="section-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do you track revenue?</h3>
              <p>We automatically track all revenue processed through your MEWAYZ platform - e-commerce sales, course sales, booking payments, template sales, and subscription revenues. You get full transparency with detailed reporting.</p>
            </div>
            
            <div className="faq-item">
              <h3>What counts as "platform revenue"?</h3>
              <p>Any money earned through features powered by MEWAYZ: online store sales, course enrollments, appointment bookings, template marketplace sales, subscription services, and digital product sales.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I switch from another pricing model?</h3>
              <p>Yes! We can migrate your existing setup from any platform. Most enterprise customers save 40-60% compared to traditional per-seat or tiered pricing models.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if my revenue fluctuates?</h3>
              <p>You pay based on actual revenue each month. High month? You pay 15%. Low month? You pay 15%. If you're under $660 revenue, you pay our $99 minimum. It's always fair and proportional.</p>
            </div>
            
            <div className="faq-item">
              <h3>Is there a contract or commitment?</h3>
              <p>No long-term contracts required. Month-to-month billing. However, we offer additional discounts for annual commitments and provide 30-day money-back guarantee for new enterprise customers.</p>
            </div>
            
            <div className="faq-item">
              <h3>How does onboarding work?</h3>
              <p>Dedicated onboarding manager, white-glove migration assistance, custom integration support, and ongoing success management. Most enterprise customers are fully operational within 1-2 weeks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Sales */}
      <section className="contact-sales">
        <div className="section-container">
          <div className="contact-card">
            <h2>Ready to Scale with MEWAYZ Enterprise?</h2>
            <p>Join the companies that are growing faster with aligned-incentive pricing</p>
            
            <div className="contact-options">
              <div className="contact-option">
                <h3>Schedule a Demo</h3>
                <p>See MEWAYZ Enterprise in action with a personalized demo</p>
                <button className="contact-btn primary">Book Demo Call</button>
              </div>
              
              <div className="contact-option">
                <h3>Talk to Sales</h3>
                <p>Get answers to your questions and custom pricing estimates</p>
                <button className="contact-btn secondary">Contact Sales</button>
              </div>
              
              <div className="contact-option">
                <h3>Start Free Trial</h3>
                <p>Try MEWAYZ risk-free for 30 days with full enterprise features</p>
                <Link to="/register" className="contact-btn trial">Start Free Trial</Link>
              </div>
            </div>
            
            <div className="contact-info">
              <div className="info-item">
                <strong>Enterprise Sales:</strong> enterprise@mewayz.com
              </div>
              <div className="info-item">
                <strong>Phone:</strong> 1-800-MEWAYZ-1
              </div>
              <div className="info-item">
                <strong>Response Time:</strong> < 2 hours during business hours
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enterprise;