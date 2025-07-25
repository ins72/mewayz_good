import React, { useState, useEffect } from 'react';
import './StarterBundleDashboard.css';

const StarterBundleDashboard = () => {
  const [starterMetrics, setStarterMetrics] = useState({
    totalProjects: 3,
    storageUsed: 125.5, // MB
    storageLimit: 500, // MB
    monthlyViews: 1247,
    viewsLimit: 5000,
    featuresUnlocked: 5,
    totalFeatures: 25
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'project_created',
      title: 'Created new project "My Portfolio"',
      timestamp: '2024-12-20T14:30:00Z',
      icon: '📁'
    },
    {
      id: 2,
      type: 'limit_reached',
      title: 'Reached 80% of monthly views limit',
      timestamp: '2024-12-19T10:15:00Z',
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'feature_used',
      title: 'Used Bio Link Builder',
      timestamp: '2024-12-18T16:45:00Z',
      icon: '🔗'
    }
  ]);

  const [availableFeatures, setAvailableFeatures] = useState([
    {
      name: 'Basic Bio Links',
      description: 'Create simple bio link pages',
      status: 'available',
      used: true,
      icon: '🔗'
    },
    {
      name: 'Basic Analytics',
      description: 'View basic visitor statistics',
      status: 'available',
      used: true,
      icon: '📊'
    },
    {
      name: 'Social Media Links',
      description: 'Add links to your social profiles',
      status: 'available',
      used: false,
      icon: '📱'
    },
    {
      name: 'Custom Themes',
      description: 'Choose from 3 basic themes',
      status: 'available',
      used: false,
      icon: '🎨'
    },
    {
      name: 'Contact Form',
      description: 'Simple contact form for visitors',
      status: 'available',
      used: false,
      icon: '📧'
    }
  ]);

  const [premiumFeatures, setPremiumFeatures] = useState([
    {
      name: 'Advanced Analytics',
      description: 'Detailed visitor insights and conversion tracking',
      bundle: 'Creator Bundle',
      price: 19,
      icon: '📈'
    },
    {
      name: 'E-commerce Store',
      description: 'Sell products directly from your bio link',
      bundle: 'E-commerce Bundle', 
      price: 24,
      icon: '🛍️'
    },
    {
      name: 'Email Marketing',
      description: 'Build and manage email lists',
      bundle: 'Creator Bundle',
      price: 19,
      icon: '✉️'
    },
    {
      name: 'Custom Domain',
      description: 'Use your own domain name',
      bundle: 'Creator Bundle',
      price: 19,
      icon: '🌐'
    },
    {
      name: 'Team Collaboration',
      description: 'Work with team members',
      bundle: 'Business Bundle',
      price: 39,
      icon: '👥'
    },
    {
      name: 'API Access',
      description: 'Integrate with external tools',
      bundle: 'Business Bundle',
      price: 39,
      icon: '⚙️'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      available: '#10b981',
      premium: '#8b5cf6',
      locked: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getBundleColor = (bundle) => {
    const colors = {
      'Creator Bundle': '#8b5cf6',
      'E-commerce Bundle': '#10b981',
      'Business Bundle': '#f59e0b',
      'Social Media Bundle': '#3b82f6',
      'Education Bundle': '#6366f1',
      'Operations Bundle': '#64748b'
    };
    return colors[bundle] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStorage = (mb) => {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  return (
    <div className="starter-dashboard">
      {/* Dashboard Header */}
      <div className="starter-header">
        <div className="header-content">
          <h1>Free Starter Dashboard</h1>
          <p>Get started with basic features - upgrade anytime for more power</p>
        </div>
        <div className="header-actions">
          <button className="action-btn upgrade">
            <span>⭐</span>
            Upgrade Plan
          </button>
          <button className="action-btn secondary">
            <span>📖</span>
            View Tutorials
          </button>
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="usage-grid">
        <div className="usage-card projects">
          <div className="usage-header">
            <div className="usage-icon">📁</div>
            <div className="usage-info">
              <h3>Projects</h3>
              <div className="usage-value">
                {starterMetrics.totalProjects} <span className="limit">/ 5 limit</span>
              </div>
            </div>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill"
              style={{ width: `${(starterMetrics.totalProjects / 5) * 100}%` }}
            ></div>
          </div>
          {starterMetrics.totalProjects >= 4 && (
            <div className="limit-warning">Nearly at project limit</div>
          )}
        </div>

        <div className="usage-card storage">
          <div className="usage-header">
            <div className="usage-icon">💾</div>
            <div className="usage-info">
              <h3>Storage</h3>
              <div className="usage-value">
                {formatStorage(starterMetrics.storageUsed)} <span className="limit">/ {formatStorage(starterMetrics.storageLimit)}</span>
              </div>
            </div>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill"
              style={{ width: `${(starterMetrics.storageUsed / starterMetrics.storageLimit) * 100}%` }}
            ></div>
          </div>
          <div className="usage-percentage">
            {((starterMetrics.storageUsed / starterMetrics.storageLimit) * 100).toFixed(1)}% used
          </div>
        </div>

        <div className="usage-card views">
          <div className="usage-header">
            <div className="usage-icon">👀</div>
            <div className="usage-info">
              <h3>Monthly Views</h3>
              <div className="usage-value">
                {starterMetrics.monthlyViews.toLocaleString()} <span className="limit">/ {starterMetrics.viewsLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill"
              style={{ width: `${(starterMetrics.monthlyViews / starterMetrics.viewsLimit) * 100}%` }}
            ></div>
          </div>
          <div className="usage-percentage">
            {((starterMetrics.monthlyViews / starterMetrics.viewsLimit) * 100).toFixed(1)}% of monthly limit
          </div>
        </div>

        <div className="usage-card features">
          <div className="usage-header">
            <div className="usage-icon">⚡</div>
            <div className="usage-info">
              <h3>Features Unlocked</h3>
              <div className="usage-value">
                {starterMetrics.featuresUnlocked} <span className="limit">/ {starterMetrics.totalFeatures} total</span>
              </div>
            </div>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill limited"
              style={{ width: `${(starterMetrics.featuresUnlocked / starterMetrics.totalFeatures) * 100}%` }}
            ></div>
          </div>
          <div className="upgrade-hint">Upgrade to unlock all features</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="starter-grid">
        {/* Available Features */}
        <div className="dashboard-card available-features">
          <div className="card-header">
            <h3>Available Features</h3>
            <span className="subtitle">Free Starter includes</span>
          </div>
          <div className="features-list">
            {availableFeatures.map((feature, index) => (
              <div key={index} className={`feature-item ${feature.used ? 'used' : 'unused'}`}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <div className="feature-name">{feature.name}</div>
                  <div className="feature-description">{feature.description}</div>
                </div>
                <div className="feature-status">
                  {feature.used ? (
                    <span className="status-used">✅ Used</span>
                  ) : (
                    <button className="use-feature-btn">Try Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <span className="subtitle">Last 7 days</span>
          </div>
          <div className="activity-feed">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{formatDate(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="dashboard-card premium-features">
          <div className="card-header">
            <h3>Unlock Premium Features</h3>
            <span className="subtitle">Upgrade to access</span>
          </div>
          <div className="premium-list">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="premium-item">
                <div className="premium-icon">{feature.icon}</div>
                <div className="premium-info">
                  <div className="premium-name">{feature.name}</div>
                  <div className="premium-description">{feature.description}</div>
                  <div className="premium-bundle">
                    <span 
                      className="bundle-badge"
                      style={{ backgroundColor: getBundleColor(feature.bundle) }}
                    >
                      {feature.bundle} - ${feature.price}/mo
                    </span>
                  </div>
                </div>
                <div className="premium-action">
                  <button className="upgrade-btn">Upgrade</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Promotion */}
        <div className="dashboard-card upgrade-promotion">
          <div className="card-header">
            <h3>Ready to Unlock Your Potential?</h3>
          </div>
          <div className="promotion-content">
            <div className="promotion-stats">
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Premium Features</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">Storage & Views</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Priority Support</div>
              </div>
            </div>
            <div className="promotion-cta">
              <h4>Choose Your Perfect Bundle</h4>
              <p>Each bundle includes everything in Free Starter, plus premium features tailored to your needs.</p>
              <div className="bundle-options">
                <button className="bundle-option creator">
                  <span>🎨</span>
                  Creator - $19/mo
                </button>
                <button className="bundle-option ecommerce">
                  <span>🛍️</span>
                  E-commerce - $24/mo
                </button>
                <button className="bundle-option business">
                  <span>💼</span>
                  Business - $39/mo
                </button>
              </div>
              <button className="view-all-plans-btn">View All Plans & Features</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterBundleDashboard;