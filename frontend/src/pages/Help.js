import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'bundles', name: 'Bundle Plans', icon: '📦' },
    { id: 'payments', name: 'Payments & Billing', icon: '💳' },
    { id: 'account', name: 'Account Management', icon: '👤' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'enterprise', name: 'Enterprise', icon: '🏢' }
  ];

  const helpArticles = {
    'getting-started': [
      {
        title: 'How to create your first workspace',
        content: 'Learn how to set up your MEWAYZ V2 workspace in under 5 minutes with our guided onboarding wizard.',
        tags: ['onboarding', 'workspace', 'setup']
      },
      {
        title: 'Choosing the right bundle for your needs',
        content: 'Understand the differences between Creator, E-commerce, Business, and other bundle plans.',
        tags: ['bundles', 'pricing', 'plans']
      },
      {
        title: 'Navigating your dashboard',
        content: 'Get familiar with the MEWAYZ V2 dashboard layout and key features.',
        tags: ['dashboard', 'navigation', 'interface']
      },
      {
        title: 'Setting up your profile',
        content: 'Customize your profile settings and preferences for optimal experience.',
        tags: ['profile', 'settings', 'customization']
      }
    ],
    'bundles': [
      {
        title: 'Understanding multi-bundle discounts',
        content: 'Learn how our 20-40% multi-bundle discounts work and how to maximize savings.',
        tags: ['discounts', 'savings', 'multiple-bundles']
      },
      {
        title: 'Switching between bundle plans',
        content: 'How to upgrade, downgrade, or change your bundle combination.',
        tags: ['upgrade', 'downgrade', 'plan-change']
      },
      {
        title: 'Creator Bundle features',
        content: 'Detailed overview of all tools and features included in the Creator Bundle.',
        tags: ['creator', 'features', 'tools']
      },
      {
        title: 'E-commerce Bundle setup',
        content: 'Step-by-step guide to setting up your online store with the E-commerce Bundle.',
        tags: ['ecommerce', 'store', 'setup']
      }
    ],
    'payments': [
      {
        title: 'Managing saved payment methods',
        content: 'How to add, remove, and manage your saved credit cards and payment methods.',
        tags: ['payment-methods', 'cards', 'billing']
      },
      {
        title: 'Understanding your subscription',
        content: 'Learn about billing cycles, renewal dates, and subscription management.',
        tags: ['subscription', 'billing-cycle', 'renewal']
      },
      {
        title: 'Refund and cancellation policy',
        content: 'Information about our refund policy and how to cancel your subscription.',
        tags: ['refund', 'cancellation', 'policy']
      },
      {
        title: 'Failed payment troubleshooting',
        content: 'Steps to resolve common payment issues and failed transactions.',
        tags: ['payment-failed', 'troubleshooting', 'issues']
      }
    ],
    'account': [
      {
        title: 'Changing your password',
        content: 'How to update your account password and enable two-factor authentication.',
        tags: ['password', 'security', '2fa']
      },
      {
        title: 'Updating account information',
        content: 'How to change your email address, name, and other account details.',
        tags: ['account', 'email', 'profile']
      },
      {
        title: 'Privacy settings',
        content: 'Managing your privacy preferences and data sharing settings.',
        tags: ['privacy', 'data', 'settings']
      },
      {
        title: 'Deleting your account',
        content: 'Steps to permanently delete your MEWAYZ V2 account and data.',
        tags: ['delete', 'account-removal', 'data-deletion']
      }
    ],
    'technical': [
      {
        title: 'Browser compatibility',
        content: 'Supported browsers and minimum system requirements for MEWAYZ V2.',
        tags: ['browsers', 'compatibility', 'requirements']
      },
      {
        title: 'API integration guide',
        content: 'Documentation for integrating with MEWAYZ V2 APIs and webhooks.',
        tags: ['api', 'integration', 'webhooks']
      },
      {
        title: 'Troubleshooting common errors',
        content: 'Solutions for the most common technical issues users encounter.',
        tags: ['errors', 'troubleshooting', 'fixes']
      },
      {
        title: 'Performance optimization',
        content: 'Tips to optimize your MEWAYZ V2 experience for better performance.',
        tags: ['performance', 'optimization', 'speed']
      }
    ],
    'enterprise': [
      {
        title: 'Enterprise plan features',
        content: 'Comprehensive overview of enterprise features and custom solutions.',
        tags: ['enterprise', 'features', 'custom']
      },
      {
        title: 'Revenue sharing model',
        content: 'How our enterprise revenue sharing program works.',
        tags: ['revenue-share', 'partnership', 'enterprise']
      },
      {
        title: 'Custom integrations',
        content: 'Information about custom API integrations and development services.',
        tags: ['custom', 'integrations', 'development']
      },
      {
        title: 'Dedicated support',
        content: 'Enterprise support options and dedicated account management.',
        tags: ['support', 'dedicated', 'account-manager']
      }
    ]
  };

  const filteredArticles = helpArticles[activeCategory]?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const quickLinks = [
    { title: 'Contact Support', description: 'Get help from our team', link: '/contact', icon: '💬' },
    { title: 'Video Tutorials', description: 'Watch step-by-step guides', link: '#', icon: '🎥' },
    { title: 'Community Forum', description: 'Connect with other users', link: '#', icon: '👥' },
    { title: 'System Status', description: 'Check service availability', link: '#', icon: '📊' }
  ];

  return (
    <div className="help-page">
      {/* Navigation Header */}
      <header className="help-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <h1>MEWAYZ</h1>
            <span className="version-badge">V2</span>
          </div>
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <div className="help-container">
        {/* Hero Section */}
        <section className="help-hero">
          <div className="hero-content">
            <h1>Help Center</h1>
            <p>Find answers to your questions and get the most out of MEWAYZ V2</p>
            
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="quick-links-section">
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => (
              <div key={index} className="quick-link-card" onClick={() => link.link !== '#' ? navigate(link.link) : null}>
                <div className="quick-link-icon">{link.icon}</div>
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="help-content">
          <div className="content-layout">
            {/* Sidebar */}
            <aside className="help-sidebar">
              <h3>Categories</h3>
              <nav className="category-nav">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Articles */}
            <main className="help-articles">
              <div className="articles-header">
                <h2>
                  {categories.find(cat => cat.id === activeCategory)?.name}
                  {searchQuery && ` - Search: "${searchQuery}"`}
                </h2>
                <p>{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found</p>
              </div>

              <div className="articles-grid">
                {filteredArticles.map((article, index) => (
                  <article key={index} className="article-card">
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                    <div className="article-tags">
                      {article.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <button className="read-more-btn">Read More →</button>
                  </article>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No articles found</h3>
                  <p>Try adjusting your search terms or browse different categories.</p>
                </div>
              )}
            </main>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="need-help-section">
          <div className="need-help-card">
            <h2>Still need help?</h2>
            <p>Can't find what you're looking for? Our support team is here to help.</p>
            <div className="help-actions">
              <button 
                className="contact-btn"
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </button>
              <button className="chat-btn">
                Start Live Chat
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;