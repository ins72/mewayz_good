import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BundleDashboard.css';

const BundleDashboard = () => {
  const [activeBundles, setActiveBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBundles();
  }, []);

  const fetchUserBundles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/bundles/user/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveBundles(data.data?.active_bundles || []);
      } else {
        // Mock data for development/testing
        setActiveBundles([
          {
            bundle_type: 'creator',
            bundle_name: 'Creator Bundle',
            features: ['advanced_bio_links', 'website_builder', 'ai_content_creation'],
            status: 'active'
          },
          {
            bundle_type: 'ecommerce', 
            bundle_name: 'E-commerce Bundle',
            features: ['online_store', 'multi_vendor', 'payment_processing'],
            status: 'active'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching bundles:', err);
      setError('Failed to load your bundles');
      // Fallback to mock data
      setActiveBundles([
        {
          bundle_type: 'creator',
          bundle_name: 'Creator Bundle', 
          features: ['advanced_bio_links', 'website_builder', 'ai_content_creation'],
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBundleConfig = (bundleType) => {
    const configs = {
      creator: {
        icon: '🎨',
        color: 'from-purple-500 to-pink-500',
        description: 'Bio links, websites, and AI content creation',
        quickActions: [
          { label: 'Bio Link Builder', path: '/dashboard/bio-links', icon: '🔗' },
          { label: 'Website Builder', path: '/dashboard/websites', icon: '🌐' },
          { label: 'AI Content', path: '/dashboard/ai-content', icon: '🤖' },
          { label: 'Templates', path: '/dashboard/templates', icon: '🎨' }
        ]
      },
      ecommerce: {
        icon: '🛍️',
        color: 'from-green-500 to-emerald-500',
        description: 'Online stores, multi-vendor marketplace, payments',
        quickActions: [
          { label: 'Store Manager', path: '/dashboard/store', icon: '🏪' },
          { label: 'Products', path: '/dashboard/products', icon: '📦' },
          { label: 'Orders', path: '/dashboard/orders', icon: '📋' },
          { label: 'Vendors', path: '/dashboard/vendors', icon: '🏬' }
        ]
      },
      social_media: {
        icon: '📱',
        color: 'from-blue-500 to-cyan-500', 
        description: 'Social media management and analytics',
        quickActions: [
          { label: 'Social Scheduler', path: '/dashboard/social-scheduler', icon: '📅' },
          { label: 'Instagram Tools', path: '/dashboard/instagram', icon: '📸' },
          { label: 'Analytics', path: '/dashboard/social-analytics', icon: '📊' },
          { label: 'Hashtag Research', path: '/dashboard/hashtags', icon: '#️⃣' }
        ]
      },
      education: {
        icon: '🎓',
        color: 'from-indigo-500 to-blue-500',
        description: 'Course platform and student management',
        quickActions: [
          { label: 'Course Builder', path: '/dashboard/courses', icon: '📚' },
          { label: 'Students', path: '/dashboard/students', icon: '👥' },
          { label: 'Live Classes', path: '/dashboard/live-classes', icon: '📺' },
          { label: 'Certificates', path: '/dashboard/certificates', icon: '🏆' }
        ]
      },
      business: {
        icon: '💼',
        color: 'from-orange-500 to-red-500',
        description: 'CRM, email marketing, and automation',
        quickActions: [
          { label: 'CRM Dashboard', path: '/dashboard/crm', icon: '👤' },
          { label: 'Email Campaigns', path: '/dashboard/email-marketing', icon: '📧' },
          { label: 'Leads', path: '/dashboard/leads', icon: '🎯' },
          { label: 'Workflows', path: '/dashboard/workflows', icon: '🔄' }
        ]
      },
      operations: {
        icon: '⚙️',
        color: 'from-gray-500 to-slate-500',
        description: 'Booking, financial management, and forms',
        quickActions: [
          { label: 'Booking System', path: '/dashboard/bookings', icon: '📅' },
          { label: 'Financial Manager', path: '/dashboard/finance', icon: '💰' },
          { label: 'Form Builder', path: '/dashboard/forms', icon: '📝' },
          { label: 'Surveys', path: '/dashboard/surveys', icon: '📊' }
        ]
      },
      enterprise: {
        icon: '🏢',
        color: 'from-yellow-500 to-orange-500',
        description: 'All features with white-label and premium support',
        quickActions: [
          { label: 'Admin Dashboard', path: '/dashboard/admin', icon: '⚡' },
          { label: 'White Label', path: '/dashboard/white-label', icon: '🏷️' },
          { label: 'Team Management', path: '/dashboard/team', icon: '👥' },
          { label: 'Support Center', path: '/dashboard/support', icon: '🎧' }
        ]
      }
    };

    return configs[bundleType] || {
      icon: '📦',
      color: 'from-gray-400 to-gray-600',
      description: 'Bundle features and tools',
      quickActions: []
    };
  };

  if (loading) {
    return (
      <div className="bundle-dashboard">
        <div className="dashboard-header">
          <h1>My Bundles</h1>
          <p>Loading your active bundles...</p>
        </div>
        <div className="loading-bundles">
          {[1, 2, 3].map(i => (
            <div key={i} className="bundle-card loading">
              <div className="bundle-card-header">
                <div className="loading-icon"></div>
                <div className="loading-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bundle-dashboard">
        <div className="dashboard-header">
          <h1>My Bundles</h1>
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchUserBundles} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bundle-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Bundles</h1>
          <p>Manage your active feature bundles and access your tools</p>
        </div>
        <div className="header-actions">
          <Link to="/pricing" className="upgrade-btn">
            <span>⭐</span>
            Upgrade Bundles
          </Link>
          <Link to="/account" className="settings-btn">
            <span>⚙️</span>
            Settings
          </Link>
        </div>
      </div>

      {/* Active Bundles */}
      {activeBundles.length > 0 ? (
        <div className="bundles-grid">
          {activeBundles.map((bundle, index) => {
            const config = getBundleConfig(bundle.bundle_type);
            return (
              <div key={index} className="bundle-card">
                <div className="bundle-card-header">
                  <div className={`bundle-icon bg-gradient-to-r ${config.color}`}>
                    <span>{config.icon}</span>
                  </div>
                  <div className="bundle-info">
                    <h3>{bundle.bundle_name}</h3>
                    <p>{config.description}</p>
                    <div className="bundle-status">
                      <span className="status-dot active"></span>
                      <span>Active</span>
                    </div>
                  </div>
                </div>

                <div className="bundle-features">
                  <h4>Available Features</h4>
                  <div className="features-list">
                    {bundle.features?.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <span className="feature-dot">✓</span>
                        <span>{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                    ))}
                    {bundle.features?.length > 4 && (
                      <div className="feature-item">
                        <span className="feature-dot">+</span>
                        <span>{bundle.features.length - 4} more features</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bundle-quick-actions">
                  <h4>Quick Actions</h4>
                  <div className="actions-grid">
                    {config.quickActions.map((action, idx) => (
                      <Link key={idx} to={action.path} className="action-item">
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-label">{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bundle-card-footer">
                  <Link to={`/dashboard/${bundle.bundle_type}`} className="primary-action">
                    Open Dashboard
                  </Link>
                  <button className="secondary-action">
                    Manage Bundle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-bundles">
          <div className="no-bundles-content">
            <span className="no-bundles-icon">📦</span>
            <h2>No Active Bundles</h2>
            <p>You don't have any active bundles yet. Choose a bundle to get started with powerful features.</p>
            <Link to="/pricing" className="get-started-btn">
              <span>🚀</span>
              Explore Bundles
            </Link>
          </div>
        </div>
      )}

      {/* Bundle Recommendations */}
      <div className="bundle-recommendations">
        <h2>Recommended for You</h2>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="recommendation-header">
              <span className="rec-icon">🎨</span>
              <h3>Creator Bundle</h3>
            </div>
            <p>Perfect for content creators who need bio links, websites, and AI tools</p>
            <div className="rec-price">
              <span className="price">$19/month</span>
              <span className="savings">Save $70/month</span>
            </div>
            <Link to="/pricing" className="rec-cta">
              Learn More
            </Link>
          </div>

          <div className="recommendation-card">
            <div className="recommendation-header">
              <span className="rec-icon">🛍️</span>
              <h3>E-commerce Bundle</h3>
            </div>
            <p>Launch your online store with multi-vendor marketplace support</p>
            <div className="rec-price">
              <span className="price">$24/month</span>
              <span className="savings">Save $75/month</span>
            </div>
            <Link to="/pricing" className="rec-cta">
              Learn More
            </Link>
          </div>

          <div className="recommendation-card">
            <div className="recommendation-header">
              <span className="rec-icon">💼</span>
              <h3>Business Bundle</h3>
            </div>
            <p>Advanced CRM, email marketing, and workflow automation</p>
            <div className="rec-price">
              <span className="price">$39/month</span>
              <span className="savings">Save $109/month</span>
            </div>
            <Link to="/pricing" className="rec-cta">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDashboard;