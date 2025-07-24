import React, { useState, useEffect } from 'react';
import { BioLinkPage, CreatorDashboard, sampleBioPageData } from './components/CreatorBundle';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You would validate the token here
    }
    
    // Fetch pricing data from our API
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await fetch('/api/bundles/pricing');
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      }
    } catch (error) {
      console.error('Failed to fetch pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const NavigationHeader = () => (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span style={{ marginRight: '8px' }}>🚀</span>
          MEWAYZ V2
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setCurrentView('landing')}
            style={{ 
              background: currentView === 'landing' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('bundles')}
            style={{ 
              background: currentView === 'bundles' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Bundles
          </button>
          <button 
            onClick={() => setCurrentView('creator-demo')}
            style={{ 
              background: currentView === 'creator-demo' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🎨 Creator Demo
          </button>
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{ 
                  background: currentView === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Dashboard
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                  setUser(null);
                  setCurrentView('landing');
                }}
                style={{ 
                  background: '#ef4444',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('login')}
                style={{ 
                  background: currentView === 'login' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                style={{ 
                  background: '#10b981',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Start Free Trial
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );

  const ProfessionalLandingPage = () => (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '8px 20px',
            display: 'inline-block',
            marginBottom: '30px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🚀</span>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Trusted by 10,000+ Businesses Worldwide</span>
          </div>
          
          <h1 style={{ 
            fontSize: '64px', 
            fontWeight: '700', 
            margin: '0 0 30px 0',
            lineHeight: '1.1'
          }}>
            The Complete Creator<br />
            <span style={{ 
              background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Economy Platform
            </span>
          </h1>
          
          <p style={{ 
            fontSize: '24px', 
            margin: '0 0 50px 0',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Everything you need to build, manage, and scale your online business. 
            From Instagram lead generation to multi-vendor marketplaces, courses, and AI-powered automation - all in one powerful platform.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setCurrentView('register')}
              style={{
                padding: '18px 36px',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Start Free Trial - 14 Days
              <span style={{ fontSize: '16px' }}>→</span>
            </button>
            <button 
              onClick={() => setCurrentView('creator-demo')}
              style={{
                padding: '18px 36px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ▶ Watch 2-Min Demo
            </button>
          </div>
          
          {/* Stats */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '60px', 
            marginTop: '80px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>10K+</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Active Users</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>$2.5M+</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Revenue Generated</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>99.9%</div>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ 
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '50px',
              padding: '8px 20px',
              display: 'inline-block',
              marginBottom: '20px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              ⚡ 12 Powerful Tools in One Platform
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>
              Everything You Need to Succeed Online
            </h2>
            <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              From lead generation to course creation, marketplace building to financial management - we've got every aspect of your digital business covered.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '30px' 
          }}>
            {[
              { icon: '🔍', title: 'Instagram Lead Generation', desc: 'Advanced Instagram database with 50M+ profiles. Filter by engagement rate, follower count, location, and hashtags.' },
              { icon: '🔗', title: 'Bio Link Builder', desc: 'Create stunning bio link pages with custom domains, analytics tracking, payment integration, and unlimited links.' },
              { icon: '🎓', title: 'Course Platform', desc: 'Complete learning management system with video hosting, progress tracking, certificates, live sessions, and community features.' },
              { icon: '🛍️', title: 'Multi-Vendor Marketplace', desc: 'Build your own marketplace like Amazon or Etsy. Vendor management, commission tracking, payment processing automated.' },
              { icon: '👥', title: 'CRM & Automation', desc: 'Advanced customer relationship management with lead scoring, email sequences, SMS marketing, and AI-powered follow-ups.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time insights across all your business channels. Track revenue, conversion rates, customer lifetime value, and ROI.' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px 0' }}>{feature.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ 
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '50px',
              padding: '8px 20px',
              display: 'inline-block',
              marginBottom: '20px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              ⭐ Success Stories
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>
              Trusted by Thousands of Creators
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '30px' 
          }}>
            {[
              {
                text: "Mewayz transformed my Instagram strategy completely. I went from 5K to 50K followers in 6 months using their lead generation tools. The bio link builder alone increased my conversion rate by 340%.",
                author: "Sarah Chen",
                role: "Digital Marketing Coach",
                avatar: "SC",
                company: "@sarahchenmarketing"
              },
              {
                text: "As a course creator, I've tried everything. Mewayz is the first platform that truly does it all - from student management to payment processing. My course revenue increased 250% in the first quarter.",
                author: "Marcus Rodriguez", 
                role: "Online Educator",
                avatar: "MR",
                company: "MasterClass Academy"
              },
              {
                text: "The marketplace feature is incredible. I built a multi-vendor platform for local artisans in just 2 weeks. We've processed over $100K in transactions with zero technical issues.",
                author: "Emily Watson",
                role: "E-commerce Entrepreneur", 
                avatar: "EW",
                company: "Artisan Collective"
              }
            ].map((testimonial, idx) => (
              <div key={idx} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '20px',
                padding: '40px',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '0 0 30px 0', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    marginRight: '16px'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>{testimonial.author}</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{testimonial.role}</div>
                    <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 30px 0' }}>
            Ready to Transform Your Business?
          </h2>
          <p style={{ fontSize: '20px', margin: '0 0 50px 0', opacity: 0.9 }}>
            Join over 10,000 successful creators, entrepreneurs, and businesses who trust Mewayz to power their growth. Start your 14-day free trial today - no credit card required.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setCurrentView('register')}
              style={{
                padding: '18px 36px',
                backgroundColor: '#ffffff',
                color: '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }}
            >
              Start Free Trial - 14 Days →
            </button>
            <button 
              onClick={() => setCurrentView('bundles')}
              style={{
                padding: '18px 36px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              View Pricing Plans
            </button>
          </div>
          
          <div style={{ marginTop: '50px', fontSize: '16px', opacity: 0.8 }}>
            <p>✨ <strong>30-day money-back guarantee</strong> • 🔒 <strong>No setup fees</strong> • 📞 <strong>24/7 support</strong></p>
          </div>
        </div>
      </section>
    </div>
  );

  const BundlesPage = () => (
    <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>
            Choose Your Growth Plan
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Start free and scale as you grow. No hidden fees, cancel anytime. Join thousands of successful creators and businesses.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading pricing information...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '60px' }}>
              {pricingData && Object.entries(pricingData.bundles).map(([key, bundle]) => (
                <div key={key} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '40px',
                  boxShadow: bundle.status?.includes('✅') ? '0 20px 40px rgba(59, 130, 246, 0.15)' : '0 8px 25px rgba(0,0,0,0.1)',
                  border: bundle.status?.includes('✅') ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                  position: 'relative',
                  transform: bundle.name === 'CREATOR' ? 'scale(1.05)' : 'scale(1)',
                  zIndex: bundle.name === 'CREATOR' ? 10 : 1
                }}>
                  {bundle.status?.includes('✅') && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      AVAILABLE NOW!
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 12px 0' }}>
                      {bundle.name}
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '48px', fontWeight: '700', color: '#3b82f6' }}>
                        ${bundle.price}
                      </span>
                      {bundle.price > 0 && <span style={{ color: '#6b7280', fontSize: '18px' }}>/month</span>}
                    </div>
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                    {bundle.features.map((feature, idx) => (
                      <li key={idx} style={{ 
                        padding: '12px 0', 
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'flex-start',
                        fontSize: '16px',
                        lineHeight: '1.5'
                      }}>
                        <span style={{ color: '#10b981', marginRight: '12px', fontSize: '18px', fontWeight: '700' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {bundle.status && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: bundle.status.includes('✅') ? '#ecfdf5' : '#fef3c7',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: bundle.status.includes('✅') ? '#065f46' : '#92400e',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      {bundle.status}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => bundle.status?.includes('✅') ? setCurrentView('register') : null}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      backgroundColor: bundle.status?.includes('✅') ? '#3b82f6' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: bundle.status?.includes('✅') ? 'pointer' : 'not-allowed',
                      boxShadow: bundle.status?.includes('✅') ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  >
                    {bundle.status?.includes('✅') ? 'Get Started' : 'Coming Soon'}
                  </button>
                </div>
              ))}
            </div>

            {/* Multi-Bundle Discounts */}
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              marginBottom: '40px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 30px 0' }}>
                🎯 Multi-Bundle Discounts
              </h3>
              <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px' }}>
                Save more when you choose multiple bundles
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#3b82f6',
                    marginBottom: '8px'
                  }}>20% OFF</div>
                  <div style={{ color: '#6b7280', fontSize: '18px' }}>2 Bundles</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#10b981',
                    marginBottom: '8px'
                  }}>30% OFF</div>
                  <div style={{ color: '#6b7280', fontSize: '18px' }}>3 Bundles</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#f59e0b',
                    marginBottom: '8px'
                  }}>40% OFF</div>
                  <div style={{ color: '#6b7280', fontSize: '18px' }}>4+ Bundles</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Simulate login
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token');
        setIsAuthenticated(true);
        setUser({ email: formData.email });
        setCurrentView('dashboard');
        setLoading(false);
      }, 1000);
    };

    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '60px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 12px 0' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>
              Sign in to your MEWAYZ account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ color: '#6b7280' }}>
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Start your free trial
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      setLoading(true);
      
      // Simulate registration
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token');
        setIsAuthenticated(true);
        setUser({ email: formData.email, name: formData.name });
        setCurrentView('dashboard');
        setLoading(false);
      }, 1000);
    };

    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '60px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 12px 0' }}>
              Start Your Free Trial
            </h1>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>
              14 days free, no credit card required
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Create a password"
                required
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating Account...' : 'Start Free Trial'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'bundles':
        return <BundlesPage />;
      case 'creator-demo':
        return <CreatorDemo />;
      case 'dashboard':
        return <CreatorDashboard />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <ProfessionalLandingPage />;
    }
  };

  const CreatorDemo = () => (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
            🎨 Creator Bundle Demo
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Live preview of a professional bio link page - powered by MEWAYZ V2
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <BioLinkPage pageData={sampleBioPageData} isPreview={true} />
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px 0' }}>
            ✨ Creator Bundle Features ($19/month)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 8px 0' }}>🔗 Bio Link Pages</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Professional link-in-bio pages with custom domains and themes</p>
            </div>
            <div>
              <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>📊 Analytics</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Track views, clicks, and engagement with detailed insights</p>
            </div>
            <div>
              <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0' }}>✍️ Content Creation</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Blog posts, articles, and content management system</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'register')}
              style={{
                padding: '14px 28px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Creating - $19/month'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <NavigationHeader />
      {renderCurrentView()}
    </div>
  );
};

export default App;
