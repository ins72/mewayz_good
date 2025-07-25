import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 34567.89,
    bundleDistribution: {
      creator: 234,
      ecommerce: 189,
      business: 156,
      social_media: 134,
      education: 98,
      operations: 81
    }
  });

  const [systemHealth, setSystemHealth] = useState({
    database: { status: 'healthy', responseTime: 23 },
    api: { status: 'healthy', responseTime: 45 },
    stripe: { status: 'healthy', responseTime: 167 },
    services: { status: 'healthy', activeServices: 38 }
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user_signup', message: 'New user registration: alex@example.com', timestamp: '2 minutes ago', severity: 'info' },
    { id: 2, type: 'subscription', message: 'Creator Bundle activated by user: sarah@example.com', timestamp: '5 minutes ago', severity: 'success' },
    { id: 3, type: 'payment', message: 'Payment processed: $39.00 Business Bundle', timestamp: '8 minutes ago', severity: 'success' },
    { id: 4, type: 'error', message: 'Bio Link service: Rate limit reached for user ID 1234', timestamp: '12 minutes ago', severity: 'warning' },
    { id: 5, type: 'system', message: 'Backup completed successfully (2.3GB)', timestamp: '1 hour ago', severity: 'info' }
  ]);

  const [topUsers, setTopUsers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@creator.co', bundles: ['creator', 'business'], revenue: 468, joinDate: '2024-01-15' },
    { id: 2, name: 'Mike Chen', email: 'mike@store.com', bundles: ['ecommerce', 'operations'], revenue: 432, joinDate: '2024-02-03' },
    { id: 3, name: 'Alex Rodriguez', email: 'alex@social.pro', bundles: ['social_media', 'creator'], revenue: 384, joinDate: '2024-01-28' }
  ]);

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>MEWAYZ V2 Admin Dashboard</h1>
          <p>System overview and management console</p>
        </div>
        <div className="header-right">
          <button className="admin-action-btn primary">
            <span>📊</span>
            Generate Report
          </button>
          <button className="admin-action-btn secondary">
            <span>⚙️</span>
            System Settings
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(systemStats.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-change positive">+12.5% this month</div>
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{systemStats.totalUsers.toLocaleString()}</div>
            <div className="metric-label">Total Users</div>
            <div className="metric-change positive">+67 this week</div>
          </div>
        </div>

        <div className="metric-card subscriptions">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <div className="metric-value">{systemStats.activeSubscriptions}</div>
            <div className="metric-label">Active Subscriptions</div>
            <div className="metric-change positive">85.2% retention</div>
          </div>
        </div>

        <div className="metric-card conversion">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">23.4%</div>
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-change positive">+2.1% vs last month</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* System Health */}
        <div className="dashboard-card system-health">
          <div className="card-header">
            <h3>System Health</h3>
            <div className="health-overall">
              <div className="health-dot healthy"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
          <div className="health-items">
            {Object.entries(systemHealth).map(([service, health]) => (
              <div key={service} className="health-item">
                <div className="health-service">
                  <div 
                    className="health-indicator"
                    style={{ backgroundColor: getHealthStatusColor(health.status) }}
                  ></div>
                  <span className="service-name">{service.charAt(0).toUpperCase() + service.slice(1)}</span>
                </div>
                <div className="health-details">
                  <span className="response-time">{health.responseTime}ms</span>
                  <span className="health-status">{health.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Distribution */}
        <div className="dashboard-card bundle-distribution">
          <div className="card-header">
            <h3>Bundle Distribution</h3>
            <span className="total-count">{Object.values(systemStats.bundleDistribution).reduce((a, b) => a + b, 0)} total</span>
          </div>
          <div className="bundle-chart">
            {Object.entries(systemStats.bundleDistribution).map(([bundle, count]) => (
              <div key={bundle} className="bundle-bar">
                <div className="bundle-info">
                  <span className="bundle-name">{bundle.replace('_', ' ').toUpperCase()}</span>
                  <span className="bundle-count">{count}</span>
                </div>
                <div className="bundle-progress">
                  <div 
                    className={`progress-fill ${bundle}`}
                    style={{ 
                      width: `${(count / Math.max(...Object.values(systemStats.bundleDistribution))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all-btn">View All Logs</button>
          </div>
          <div className="activity-feed">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-indicator">
                  <div 
                    className="activity-dot"
                    style={{ backgroundColor: getSeverityColor(activity.severity) }}
                  ></div>
                </div>
                <div className="activity-content">
                  <div className="activity-message">{activity.message}</div>
                  <div className="activity-meta">
                    <span className="activity-time">{activity.timestamp}</span>
                    <span className={`activity-type ${activity.severity}`}>
                      {activity.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="dashboard-card top-users">
          <div className="card-header">
            <h3>Top Users</h3>
            <span className="subtitle">By revenue contribution</span>
          </div>
          <div className="users-list">
            {topUsers.map((user, index) => (
              <div key={user.id} className="user-item">
                <div className="user-rank">#{index + 1}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-bundles">
                    {user.bundles.map(bundle => (
                      <span key={bundle} className={`bundle-tag ${bundle}`}>
                        {bundle.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="user-revenue">
                  <div className="revenue-amount">{formatCurrency(user.revenue)}</div>
                  <div className="join-date">Joined {new Date(user.joinDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-label">Manage Users</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📦</div>
              <div className="action-label">Bundle Settings</div>
            </button>
            <button className="action-card">
              <div className="action-icon">💳</div>
              <div className="action-label">Payment Config</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🔧</div>
              <div className="action-label">System Config</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Analytics</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🚨</div>
              <div className="action-label">Alerts</div>
            </button>
          </div>
        </div>

        {/* Service Status */}
        <div className="dashboard-card service-status">
          <div className="card-header">
            <h3>Service Status</h3>
            <div className="services-count">{systemHealth.services.activeServices} Active</div>
          </div>
          <div className="services-grid">
            <div className="service-item operational">
              <div className="service-name">Bundle Management</div>
              <div className="service-status">Operational</div>
            </div>
            <div className="service-item operational">
              <div className="service-name">Bio Link Service</div>
              <div className="service-status">Operational</div>
            </div>
            <div className="service-item operational">
              <div className="service-name">E-commerce Service</div>
              <div className="service-status">Operational</div>
            </div>
            <div className="service-item operational">
              <div className="service-name">CRM Service</div>
              <div className="service-status">Operational</div>
            </div>
            <div className="service-item warning">
              <div className="service-name">Email Marketing</div>
              <div className="service-status">Rate Limited</div>
            </div>
            <div className="service-item operational">
              <div className="service-name">Analytics</div>
              <div className="service-status">Operational</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;