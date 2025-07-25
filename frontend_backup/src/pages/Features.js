import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const featureCategories = [
    { id: 'all', name: 'All Features', icon: '🎯' },
    { id: 'creator', name: 'Creator Tools', icon: '🎨' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'operations', name: 'Operations', icon: '⚙️' }
  ];

  const allFeatures = [
    // Creator Tools
    {
      category: 'creator',
      title: 'Advanced Bio Link Builder',
      description: 'Create stunning, customizable bio link pages with unlimited links and custom domains.',
      icon: '🔗',
      features: ['Unlimited links', 'Custom domains', 'Analytics tracking', 'Theme customization', 'Click tracking'],
      bundle: 'Creator Bundle',
      popular: true
    },
    {
      category: 'creator',
      title: 'Professional Website Builder',
      description: 'Build professional websites with drag-and-drop simplicity and advanced customization.',
      icon: '🌐',
      features: ['10 pages included', 'Responsive design', 'SEO optimization', 'Custom domains', 'SSL certificates'],
      bundle: 'Creator Bundle'
    },
    {
      category: 'creator',
      title: 'AI Content Creation',
      description: 'Generate engaging content with AI-powered writing and design tools.',
      icon: '🤖',
      features: ['500 credits/month', 'Multiple content types', 'Brand voice training', 'Auto-posting', 'Content calendar'],
      bundle: 'Creator Bundle'
    },
    {
      category: 'creator',
      title: 'Template Marketplace',
      description: 'Access thousands of professional templates and earn by selling your own designs.',
      icon: '🎨',
      features: ['Buy premium templates', 'Sell your designs', 'Revenue sharing', 'Template customization', 'Version control'],
      bundle: 'Creator Bundle'
    },

    // E-commerce
    {
      category: 'ecommerce',
      title: 'Complete Online Store',
      description: 'Full-featured e-commerce platform with unlimited products and advanced management.',
      icon: '🏪',
      features: ['Unlimited products', 'Inventory management', 'Order tracking', 'Customer accounts', 'Mobile responsive'],
      bundle: 'E-commerce Bundle',
      popular: true
    },
    {
      category: 'ecommerce',
      title: 'Multi-Vendor Marketplace',
      description: 'Create a marketplace platform with support for up to 10 vendors.',
      icon: '🏬',
      features: ['10 vendor accounts', 'Commission management', 'Vendor dashboards', 'Product approvals', 'Payout automation'],
      bundle: 'E-commerce Bundle'
    },
    {
      category: 'ecommerce',
      title: 'Advanced Promotions',
      description: 'Powerful marketing tools including coupons, discounts, and referral programs.',
      icon: '🎁',
      features: ['Coupon codes', 'Bulk discounts', 'Referral system', 'Loyalty programs', 'Flash sales'],
      bundle: 'E-commerce Bundle'
    },
    {
      category: 'ecommerce',
      title: 'Payment Processing',
      description: 'Secure payment processing with multiple gateways and global currency support.',
      icon: '💳',
      features: ['Stripe integration', 'PayPal support', 'Global currencies', 'Subscription billing', 'Fraud protection'],
      bundle: 'E-commerce Bundle'
    },

    // Social Media
    {
      category: 'social',
      title: 'Instagram Lead Database',
      description: 'Advanced Instagram analytics and lead generation with 1000 searches per month.',
      icon: '📊',
      features: ['1000 searches/month', 'Audience insights', 'Competitor analysis', 'Hashtag research', 'Growth tracking'],
      bundle: 'Social Media Bundle'
    },
    {
      category: 'social',
      title: 'Social Media Scheduling',
      description: 'Schedule and manage posts across all major social media platforms.',
      icon: '📅',
      features: ['Multi-platform posting', 'Content calendar', 'Bulk scheduling', 'Auto-posting', 'Performance analytics'],
      bundle: 'Social Media Bundle',
      popular: true
    },
    {
      category: 'social',
      title: 'Twitter/TikTok Tools',
      description: 'Advanced tools for Twitter engagement and TikTok content optimization.',
      icon: '🐦',
      features: ['Thread scheduling', 'TikTok analytics', 'Trend tracking', 'Engagement automation', 'Content suggestions'],
      bundle: 'Social Media Bundle'
    },
    {
      category: 'social',
      title: 'Social Analytics',
      description: 'Comprehensive analytics and insights for all your social media accounts.',
      icon: '📈',
      features: ['Cross-platform analytics', 'Engagement metrics', 'Audience demographics', 'Growth insights', 'Custom reports'],
      bundle: 'Social Media Bundle'
    },

    // Education
    {
      category: 'education',
      title: 'Complete Course Platform',
      description: 'Build and sell online courses with unlimited students and comprehensive management.',
      icon: '🎓',
      features: ['Unlimited students', 'Video hosting', 'Quiz creation', 'Certificates', 'Progress tracking'],
      bundle: 'Education Bundle',
      popular: true
    },
    {
      category: 'education',
      title: 'Student Management',
      description: 'Advanced student tracking, progress monitoring, and certificate generation.',
      icon: '👥',
      features: ['Student profiles', 'Progress tracking', 'Certificate generation', 'Gradebook', 'Communication tools'],
      bundle: 'Education Bundle'
    },
    {
      category: 'education',
      title: 'Live Streaming',
      description: 'Host live classes and webinars with interactive features.',
      icon: '🎥',
      features: ['HD streaming', 'Interactive chat', 'Screen sharing', 'Recording', 'Attendance tracking'],
      bundle: 'Education Bundle'
    },
    {
      category: 'education',
      title: 'Community Features',
      description: 'Build engaged learning communities with discussion forums and groups.',
      icon: '💬',
      features: ['Discussion forums', 'Student groups', 'Direct messaging', 'Peer learning', 'Moderation tools'],
      bundle: 'Education Bundle'
    },

    // Business
    {
      category: 'business',
      title: 'Advanced CRM System',
      description: 'Comprehensive customer relationship management with unlimited contacts.',
      icon: '👤',
      features: ['Unlimited contacts', 'Pipeline management', 'Deal tracking', 'Custom fields', 'Activity logging'],
      bundle: 'Business Bundle',
      popular: true
    },
    {
      category: 'business',
      title: 'Email Marketing',
      description: 'Powerful email marketing campaigns with 10,000 emails per month.',
      icon: '📧',
      features: ['10,000 emails/month', 'Campaign automation', 'A/B testing', 'Segmentation', 'Performance tracking'],
      bundle: 'Business Bundle'
    },
    {
      category: 'business',
      title: 'Lead Management',
      description: 'Advanced lead scoring, tracking, and nurturing capabilities.',
      icon: '🎯',
      features: ['Lead scoring', 'Source tracking', 'Automated nurturing', 'Conversion tracking', 'Lead routing'],
      bundle: 'Business Bundle'
    },
    {
      category: 'business',
      title: 'Workflow Automation',
      description: 'Create and manage up to 10 automated workflows for your business processes.',
      icon: '🔄',
      features: ['10 workflows', 'Trigger conditions', 'Multi-step automation', 'Integration support', 'Performance monitoring'],
      bundle: 'Business Bundle'
    },

    // Operations
    {
      category: 'operations',
      title: 'Booking & Appointments',
      description: 'Complete booking system with unlimited appointments and calendar management.',
      icon: '📅',
      features: ['Unlimited bookings', 'Calendar sync', 'Automated reminders', 'Payment integration', 'Staff management'],
      bundle: 'Operations Bundle'
    },
    {
      category: 'operations',
      title: 'Financial Management',
      description: 'Comprehensive invoicing, expense tracking, and financial reporting tools.',
      icon: '💰',
      features: ['Invoice generation', 'Expense tracking', 'Financial reports', 'Tax calculations', 'Payment tracking'],
      bundle: 'Operations Bundle',
      popular: true
    },
    {
      category: 'operations',
      title: 'Advanced Form Builder',
      description: 'Create unlimited forms for data collection, surveys, and lead generation.',
      icon: '📝',
      features: ['Unlimited forms', 'Conditional logic', 'Payment integration', 'File uploads', 'Analytics'],
      bundle: 'Operations Bundle'
    },
    {
      category: 'operations',
      title: 'Survey & Feedback Tools',
      description: 'Advanced survey creation and feedback collection with detailed analytics.',
      icon: '📊',
      features: ['Advanced surveys', 'Feedback collection', 'Response analytics', 'Custom branding', 'Export options'],
      bundle: 'Operations Bundle'
    }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? allFeatures 
    : allFeatures.filter(feature => feature.category === activeCategory);

  return (
    <div className="features-page">
      {/* Navigation */}
      <nav className="features-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
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
      <section className="features-hero">
        <div className="hero-container">
          <h1>Powerful Features for Every Creator</h1>
          <p>Everything you need to build, grow, and monetize your online presence. From bio links to e-commerce, social media to education - we've got you covered.</p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Powerful Features</span>
            </div>
            <div className="stat">
              <span className="stat-number">7</span>
              <span className="stat-label">Bundle Categories</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="feature-categories">
        <div className="categories-container">
          <h2>Explore by Category</h2>
          <div className="category-grid">
            {featureCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="grid-container">
          <div className="features-header">
            <h2>
              {activeCategory === 'all' ? 'All Features' : 
               featureCategories.find(cat => cat.id === activeCategory)?.name + ' Features'}
            </h2>
            <p>
              {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''} available
              {activeCategory !== 'all' && ` in ${featureCategories.find(cat => cat.id === activeCategory)?.name}`}
            </p>
          </div>

          <div className="features-list">
            {filteredFeatures.map((feature, index) => (
              <div key={index} className={`feature-card ${feature.popular ? 'popular' : ''}`}>
                {feature.popular && <div className="popular-badge">Most Popular</div>}
                
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>

                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  
                  <div className="feature-list">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="feature-item">
                        <span className="check-icon">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="feature-footer">
                  <div className="bundle-info">
                    <span className="bundle-label">Included in:</span>
                    <span className="bundle-name">{feature.bundle}</span>
                  </div>
                  <Link to="/pricing" className="feature-cta">
                    View Pricing →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Comparison */}
      <section className="bundle-comparison">
        <div className="comparison-container">
          <h2>Bundle Comparison</h2>
          <p>Choose the perfect combination of features for your needs</p>
          
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-column">Features</div>
              <div className="bundle-column">Creator</div>
              <div className="bundle-column">E-commerce</div>
              <div className="bundle-column">Social</div>
              <div className="bundle-column">Education</div>
              <div className="bundle-column">Business</div>
              <div className="bundle-column">Operations</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">Bio Link Builder</div>
              <div className="bundle-column">✓</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">E-commerce Store</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">✓</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">Social Scheduling</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">✓</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">Course Platform</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">✓</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">CRM System</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">✓</div>
              <div className="bundle-column">-</div>
            </div>
            
            <div className="table-row">
              <div className="feature-column">Booking System</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">-</div>
              <div className="bundle-column">✓</div>
            </div>
          </div>
          
          <div className="comparison-note">
            <p>💡 <strong>Pro Tip:</strong> Combine multiple bundles and save up to 40% with our multi-bundle discounts!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Choose your perfect bundle combination and start building your success today</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-cta">Start Free Trial</Link>
            <Link to="/pricing" className="secondary-cta">View All Pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;