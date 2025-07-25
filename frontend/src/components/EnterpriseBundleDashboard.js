import React, { useState, useEffect } from 'react';
import EnterprisePayoutDashboard from './EnterprisePayoutDashboard';
import './EnterpriseBundleDashboard.css';

const EnterpriseBundleDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [enterpriseMetrics, setEnterpriseMetrics] = useState({
    totalRevenue: 2456789.50,
    revenueShare: 368518.43, // 15% of total revenue
    totalClients: 47,
    activeWorkspaces: 156,
    totalUsers: 3248,
    uptime: 99.94
  });

  const [clientPortfolios, setClientPortfolios] = useState([
    {
      id: 1,
      clientName: 'GlobalTech Solutions',
      logo: '🏢',
      users: 245,
      workspaces: 8,
      revenue: 87500,
      revenueShare: 13125, // 15%
      growth: 23.5,
      status: 'active',
      lastActive: '2024-12-20T15:30:00Z',
      tier: 'premium'
    },
    {
      id: 2,
      clientName: 'InnovateNow Corp',
      logo: '🚀',
      users: 156,
      workspaces: 5,
      revenue: 64200,
      revenueShare: 9630,
      growth: 18.2,
      status: 'active',
      lastActive: '2024-12-20T14:45:00Z',
      tier: 'standard'
    },
    {
      id: 3,
      clientName: 'CreativeAgency Pro',
      logo: '🎨',
      users: 89,
      workspaces: 12,
      revenue: 52800,
      revenueShare: 7920,
      growth: 31.7,
      status: 'active',
      lastActive: '2024-12-20T16:15:00Z',
      tier: 'premium'
    },
    {
      id: 4,
      clientName: 'StartupHub Inc',
      logo: '💡',
      users: 67,
      workspaces: 3,
      revenue: 34500,
      revenueShare: 5175,
      growth: -5.2,
      status: 'warning',
      lastActive: '2024-12-19T10:20:00Z',
      tier: 'standard'
    }
  ]);

  const [whitelabelRequests, setWhitelabelRequests] = useState([
    {
      id: 1,
      client: 'GlobalTech Solutions',
      type: 'Custom Domain Setup',
      priority: 'high',
      status: 'in_progress',
      submittedAt: '2024-12-20T09:00:00Z',
      estimatedCompletion: '2024-12-22T17:00:00Z',
      icon: '🌐'
    },
    {
      id: 2,
      client: 'CreativeAgency Pro',
      type: 'Brand Asset Integration',
      priority: 'medium',
      status: 'pending',
      submittedAt: '2024-12-20T11:30:00Z',
      estimatedCompletion: '2024-12-24T15:00:00Z',
      icon: '🎨'
    },
    {
      id: 3,
      client: 'InnovateNow Corp',
      type: 'API Integration Setup',
      priority: 'high',
      status: 'completed',
      submittedAt: '2024-12-19T14:00:00Z',
      estimatedCompletion: '2024-12-20T16:00:00Z',
      icon: '🔗'
    },
    {
      id: 4,
      client: 'StartupHub Inc',
      type: 'SSL Certificate Installation',
      priority: 'medium',
      status: 'review',
      submittedAt: '2024-12-20T13:15:00Z',
      estimatedCompletion: '2024-12-21T12:00:00Z',
      icon: '🔐'
    }
  ]);

  const [revenueAnalytics, setRevenueAnalytics] = useState([
    { month: 'Aug', total: 1890000, share: 283500, clients: 42 },
    { month: 'Sep', total: 2120000, share: 318000, clients: 44 },
    { month: 'Oct', total: 2280000, share: 342000, clients: 45 },
    { month: 'Nov', total: 2340000, share: 351000, clients: 46 },
    { month: 'Dec', total: 2456789, share: 368518, clients: 47 }
  ]);

  const [systemStatus, setSystemStatus] = useState([
    {
      service: 'Enterprise API Gateway',
      status: 'operational',
      uptime: 99.98,
      responseTime: 12,
      clients: 47,
      icon: '🔗'
    },
    {
      service: 'Multi-Tenant Database',
      status: 'operational',
      uptime: 99.95,
      responseTime: 8,
      clients: 47,
      icon: '💾'
    },
    {
      service: 'White-label Engine',
      status: 'operational',
      uptime: 99.92,
      responseTime: 35,
      clients: 34,
      icon: '🎨'
    },
    {
      service: 'Revenue Analytics',
      status: 'warning',
      uptime: 98.7,
      responseTime: 89,
      clients: 47,
      icon: '📊'
    },
    {
      service: 'Custom Domain Manager',
      status: 'operational',
      uptime: 99.89,
      responseTime: 45,
      clients: 29,
      icon: '🌐'
    }
  ]);

  const [enterpriseInsights, setEnterpriseInsights] = useState([
    {
      id: 1,
      type: 'growth',
      title: 'Exceptional Q4 Performance',
      description: 'Revenue up 28% from Q3. Consider expanding enterprise sales team.',
      priority: 'high',
      impact: 'positive',
      icon: '📈'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Client Churn Alert',
      description: 'StartupHub Inc showing negative growth (-5.2%). Immediate intervention needed.',
      priority: 'critical',
      impact: 'negative',
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Upsell Opportunity',
      description: 'GlobalTech Solutions requesting additional workspace licenses (+50 users).',
      priority: 'high',
      impact: 'positive',
      icon: '🎯'
    },
    {
      id: 4,
      type: 'technical',
      title: 'Infrastructure Scaling',
      description: 'Revenue Analytics service experiencing high load. Consider scaling up.',
      priority: 'medium',
      impact: 'neutral',
      icon: '⚙️'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      operational: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      active: '#10b981',
      inactive: '#6b7280',
      in_progress: '#3b82f6',
      pending: '#f59e0b',
      completed: '#10b981',
      review: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const getTierColor = (tier) => {
    const colors = {
      premium: '#8b5cf6',
      standard: '#3b82f6',
      basic: '#6b7280'
    };
    return colors[tier] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatGrowth = (growth) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'payouts':
        return <EnterprisePayoutDashboard />;
      case 'overview':
      default:
        return (
          <>
            {/* Key Enterprise Metrics */}
            <div className="metrics-grid">
              <div className="metric-card total-revenue">
                <div className="metric-icon">💰</div>
                <div className="metric-content">
                  <div className="metric-value">{formatCurrency(enterpriseMetrics.totalRevenue)}</div>
                  <div className="metric-label">Total Revenue</div>
                  <div className="metric-change positive">+28% this quarter</div>
                </div>
              </div>

              <div className="metric-card revenue-share">
                <div className="metric-icon">🤝</div>
                <div className="metric-content">
                  <div className="metric-value">{formatCurrency(enterpriseMetrics.revenueShare)}</div>
                  <div className="metric-label">Revenue Share (15%)</div>
                  <div className="metric-change positive">+{formatCurrency(45680)} this month</div>
                </div>
              </div>

              <div className="metric-card enterprise-clients">
                <div className="metric-icon">🏢</div>
                <div className="metric-content">
                  <div className="metric-value">{enterpriseMetrics.totalClients}</div>
                  <div className="metric-label">Enterprise Clients</div>
                  <div className="metric-change positive">+3 this quarter</div>
                </div>
              </div>

              <div className="metric-card system-uptime">
                <div className="metric-icon">⚡</div>
                <div className="metric-content">
                  <div className="metric-value">{enterpriseMetrics.uptime}%</div>
                  <div className="metric-label">System Uptime</div>
                  <div className="metric-change positive">+0.12% vs last month</div>
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="enterprise-grid">
              {/* Client Portfolio Overview */}
              <div className="dashboard-card client-portfolio">
                <div className="card-header">
                  <h3>Client Portfolio</h3>
                  <div className="portfolio-stats">
                    <span className="total-users">{enterpriseMetrics.totalUsers.toLocaleString()} total users</span>
                  </div>
                </div>
                <div className="clients-list">
                  {clientPortfolios.map((client) => (
                    <div key={client.id} className="client-item">
                      <div className="client-header">
                        <div className="client-logo">{client.logo}</div>
                        <div className="client-info">
                          <div className="client-name">{client.clientName}</div>
                          <div className="client-tier">
                            <span 
                              className="tier-badge"
                              style={{ backgroundColor: getTierColor(client.tier) }}
                            >
                              {client.tier}
                            </span>
                          </div>
                        </div>
                        <div className="client-status">
                          <div 
                            className={`status-indicator ${client.status}`}
                            style={{ backgroundColor: getStatusColor(client.status) }}
                          ></div>
                        </div>
                      </div>
                      <div className="client-metrics">
                        <div className="metric-row">
                          <div className="metric-item">
                            <span className="metric-label">Users</span>
                            <span className="metric-value">{client.users}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Workspaces</span>
                            <span className="metric-value">{client.workspaces}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Revenue</span>
                            <span className="metric-value">{formatCurrency(client.revenue)}</span>
                          </div>
                        </div>
                        <div className="revenue-share-row">
                          <div className="revenue-share">
                            <span className="share-label">Your Share (15%)</span>
                            <span className="share-amount">{formatCurrency(client.revenueShare)}</span>
                          </div>
                          <div className="growth-indicator">
                            <span 
                              className={`growth-value ${client.growth >= 0 ? 'positive' : 'negative'}`}
                            >
                              {formatGrowth(client.growth)}
                            </span>
                            <span className="growth-period">this month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* White-label Requests */}
              <div className="dashboard-card whitelabel-requests">
                <div className="card-header">
                  <h3>White-label Requests</h3>
                  <span className="subtitle">{whitelabelRequests.filter(r => r.status !== 'completed').length} active</span>
                </div>
                <div className="requests-list">
                  {whitelabelRequests.map((request) => (
                    <div key={request.id} className="request-item">
                      <div className="request-icon">{request.icon}</div>
                      <div className="request-info">
                        <div className="request-type">{request.type}</div>
                        <div className="request-client">{request.client}</div>
                        <div className="request-meta">
                          <span className="submitted-date">Submitted {formatDate(request.submittedAt)}</span>
                          <span className="estimated-completion">ETA: {formatDate(request.estimatedCompletion)}</span>
                        </div>
                      </div>
                      <div className="request-status">
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(request.priority) }}
                        >
                          {request.priority}
                        </span>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Analytics Chart */}
              <div className="dashboard-card revenue-analytics">
                <div className="card-header">
                  <h3>Revenue Analytics</h3>
                  <div className="analytics-controls">
                    <button className="view-btn active">5 Months</button>
                    <button className="view-btn">YTD</button>
                    <button className="view-btn">Annual</button>
                  </div>
                </div>
                <div className="analytics-chart">
                  <div className="chart-bars">
                    {revenueAnalytics.map((data, index) => (
                      <div key={index} className="chart-month">
                        <div className="bar-container">
                          <div className="bar-stack">
                            <div 
                              className="bar-segment total"
                              style={{ 
                                height: `${(data.revenue / Math.max(...revenueAnalytics.map(d => d.revenue))) * 100}%` 
                              }}
                              title={`Total: ${formatCurrency(data.revenue)}`}
                            ></div>
                            <div 
                              className="bar-segment share"
                              style={{ 
                                height: `${(data.share / Math.max(...revenueAnalytics.map(d => d.revenue))) * 100}%` 
                              }}
                              title={`Your Share: ${formatCurrency(data.share)}`}
                            ></div>
                          </div>
                        </div>
                        <div className="month-label">{data.month}</div>
                        <div className="month-data">
                          <div className="total-revenue">{formatCurrency(data.revenue)}</div>
                          <div className="share-revenue">{formatCurrency(data.share)} share</div>
                          <div className="client-count">{data.clients} clients</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color total"></div>
                      <span>Total Client Revenue</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color share"></div>
                      <span>Your Revenue Share (15%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enterprise System Status */}
              <div className="dashboard-card system-status">
                <div className="card-header">
                  <h3>Enterprise System Status</h3>
                  <div className="overall-status operational">
                    <div className="status-dot"></div>
                    All Systems Operational
                  </div>
                </div>
                <div className="systems-grid">
                  {systemStatus.map((system, index) => (
                    <div key={index} className="system-item">
                      <div className="system-icon">{system.icon}</div>
                      <div className="system-info">
                        <div className="system-name">{system.service}</div>
                        <div className="system-metrics">
                          <span className="uptime">{system.uptime}% uptime</span>
                          <span className="response-time">{system.responseTime}ms avg</span>
                          <span className="client-count">{system.clients} clients</span>
                        </div>
                      </div>
                      <div className="system-status">
                        <div 
                          className={`status-indicator ${system.status}`}
                          style={{ backgroundColor: getStatusColor(system.status) }}
                        ></div>
                        <span className="status-text">{system.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Insights */}
              <div className="dashboard-card enterprise-insights">
                <div className="card-header">
                  <h3>Enterprise Insights</h3>
                  <span className="subtitle">AI-powered business intelligence</span>
                </div>
                <div className="insights-list">
                  {enterpriseInsights.map((insight) => (
                    <div key={insight.id} className={`insight-item ${insight.impact}`}>
                      <div className="insight-icon">{insight.icon}</div>
                      <div className="insight-content">
                        <div className="insight-header">
                          <div className="insight-title">{insight.title}</div>
                          <div className="insight-priority">
                            <span 
                              className="priority-badge"
                              style={{ backgroundColor: getPriorityColor(insight.priority) }}
                            >
                              {insight.priority}
                            </span>
                          </div>
                        </div>
                        <div className="insight-description">{insight.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Quick Actions */}
              <div className="dashboard-card enterprise-actions">
                <div className="card-header">
                  <h3>Enterprise Operations</h3>
                </div>
                <div className="enterprise-actions-grid">
                  <button className="action-card">
                    <div className="action-icon">🏢</div>
                    <div className="action-label">Add Client</div>
                  </button>
                  <button className="action-card">
                    <div className="action-icon">🎨</div>
                    <div className="action-label">White-label Setup</div>
                  </button>
                  <button className="action-card">
                    <div className="action-icon">🌐</div>
                    <div className="action-label">Custom Domain</div>
                  </button>
                  <button className="action-card">
                    <div className="action-icon">📊</div>
                    <div className="action-label">Analytics Export</div>
                  </button>
                  <button className="action-card">
                    <div className="action-icon">🔐</div>
                    <div className="action-label">Security Config</div>
                  </button>
                  <button className="action-card">
                    <div className="action-icon">⚙️</div>
                    <div className="action-label">System Admin</div>
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="enterprise-dashboard">
      {/* Dashboard Header */}
      <div className="enterprise-header">
        <div className="header-content">
          <h1>Enterprise Command Center</h1>
          <p>Multi-tenant management, revenue analytics, and white-label operations</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>🏢</span>
            Add Client
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            Revenue Report
          </button>
          <button className="action-btn tertiary">
            <span>⚙️</span>
            System Config
          </button>
        </div>
      </div>

      {/* Key Enterprise Metrics */}
      <div className="metrics-grid">
        <div className="metric-card total-revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(enterpriseMetrics.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-change positive">+28% this quarter</div>
          </div>
        </div>

        <div className="metric-card revenue-share">
          <div className="metric-icon">🤝</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(enterpriseMetrics.revenueShare)}</div>
            <div className="metric-label">Revenue Share (15%)</div>
            <div className="metric-change positive">+{formatCurrency(45680)} this month</div>
          </div>
        </div>

        <div className="metric-card enterprise-clients">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <div className="metric-value">{enterpriseMetrics.totalClients}</div>
            <div className="metric-label">Enterprise Clients</div>
            <div className="metric-change positive">+3 this quarter</div>
          </div>
        </div>

        <div className="metric-card system-uptime">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{enterpriseMetrics.uptime}%</div>
            <div className="metric-label">System Uptime</div>
            <div className="metric-change positive">+0.12% vs last month</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="enterprise-grid">
        {/* Client Portfolio Overview */}
        <div className="dashboard-card client-portfolio">
          <div className="card-header">
            <h3>Client Portfolio</h3>
            <div className="portfolio-stats">
              <span className="total-users">{enterpriseMetrics.totalUsers.toLocaleString()} total users</span>
            </div>
          </div>
          <div className="clients-list">
            {clientPortfolios.map((client) => (
              <div key={client.id} className="client-item">
                <div className="client-header">
                  <div className="client-logo">{client.logo}</div>
                  <div className="client-info">
                    <div className="client-name">{client.clientName}</div>
                    <div className="client-tier">
                      <span 
                        className="tier-badge"
                        style={{ backgroundColor: getTierColor(client.tier) }}
                      >
                        {client.tier}
                      </span>
                    </div>
                  </div>
                  <div className="client-status">
                    <div 
                      className={`status-indicator ${client.status}`}
                      style={{ backgroundColor: getStatusColor(client.status) }}
                    ></div>
                  </div>
                </div>
                <div className="client-metrics">
                  <div className="metric-row">
                    <div className="metric-item">
                      <span className="metric-label">Users</span>
                      <span className="metric-value">{client.users}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Workspaces</span>
                      <span className="metric-value">{client.workspaces}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Revenue</span>
                      <span className="metric-value">{formatCurrency(client.revenue)}</span>
                    </div>
                  </div>
                  <div className="revenue-share-row">
                    <div className="revenue-share">
                      <span className="share-label">Your Share (15%)</span>
                      <span className="share-amount">{formatCurrency(client.revenueShare)}</span>
                    </div>
                    <div className="growth-indicator">
                      <span 
                        className={`growth-value ${client.growth >= 0 ? 'positive' : 'negative'}`}
                      >
                        {formatGrowth(client.growth)}
                      </span>
                      <span className="growth-period">this month</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* White-label Requests */}
        <div className="dashboard-card whitelabel-requests">
          <div className="card-header">
            <h3>White-label Requests</h3>
            <span className="subtitle">{whitelabelRequests.filter(r => r.status !== 'completed').length} active</span>
          </div>
          <div className="requests-list">
            {whitelabelRequests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-icon">{request.icon}</div>
                <div className="request-info">
                  <div className="request-type">{request.type}</div>
                  <div className="request-client">{request.client}</div>
                  <div className="request-meta">
                    <span className="submitted-date">Submitted {formatDate(request.submittedAt)}</span>
                    <span className="estimated-completion">ETA: {formatDate(request.estimatedCompletion)}</span>
                  </div>
                </div>
                <div className="request-status">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(request.priority) }}
                  >
                    {request.priority}
                  </span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Analytics Chart */}
        <div className="dashboard-card revenue-analytics">
          <div className="card-header">
            <h3>Revenue Analytics</h3>
            <div className="analytics-controls">
              <button className="view-btn active">5 Months</button>
              <button className="view-btn">YTD</button>
              <button className="view-btn">Annual</button>
            </div>
          </div>
          <div className="analytics-chart">
            <div className="chart-bars">
              {revenueAnalytics.map((data, index) => (
                <div key={index} className="chart-month">
                  <div className="bar-container">
                    <div className="bar-stack">
                      <div 
                        className="bar-segment total"
                        style={{ 
                          height: `${(data.total / Math.max(...revenueAnalytics.map(d => d.total))) * 100}%` 
                        }}
                        title={`Total: ${formatCurrency(data.total)}`}
                      ></div>
                      <div 
                        className="bar-segment share"
                        style={{ 
                          height: `${(data.share / Math.max(...revenueAnalytics.map(d => d.total))) * 100}%` 
                        }}
                        title={`Your Share: ${formatCurrency(data.share)}`}
                      ></div>
                    </div>
                  </div>
                  <div className="month-label">{data.month}</div>
                  <div className="month-data">
                    <div className="total-revenue">{formatCurrency(data.total)}</div>
                    <div className="share-revenue">{formatCurrency(data.share)} share</div>
                    <div className="client-count">{data.clients} clients</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color total"></div>
                <span>Total Client Revenue</span>
              </div>
              <div className="legend-item">
                <div className="legend-color share"></div>
                <span>Your Revenue Share (15%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise System Status */}
        <div className="dashboard-card system-status">
          <div className="card-header">
            <h3>Enterprise System Status</h3>
            <div className="overall-status operational">
              <div className="status-dot"></div>
              All Systems Operational
            </div>
          </div>
          <div className="systems-grid">
            {systemStatus.map((system, index) => (
              <div key={index} className="system-item">
                <div className="system-icon">{system.icon}</div>
                <div className="system-info">
                  <div className="system-name">{system.service}</div>
                  <div className="system-metrics">
                    <span className="uptime">{system.uptime}% uptime</span>
                    <span className="response-time">{system.responseTime}ms avg</span>
                    <span className="client-count">{system.clients} clients</span>
                  </div>
                </div>
                <div className="system-status">
                  <div 
                    className={`status-indicator ${system.status}`}
                    style={{ backgroundColor: getStatusColor(system.status) }}
                  ></div>
                  <span className="status-text">{system.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Insights */}
        <div className="dashboard-card enterprise-insights">
          <div className="card-header">
            <h3>Enterprise Insights</h3>
            <span className="subtitle">AI-powered business intelligence</span>
          </div>
          <div className="insights-list">
            {enterpriseInsights.map((insight) => (
              <div key={insight.id} className={`insight-item ${insight.impact}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <div className="insight-header">
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-priority">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(insight.priority) }}
                      >
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                  <div className="insight-description">{insight.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Quick Actions */}
        <div className="dashboard-card enterprise-actions">
          <div className="card-header">
            <h3>Enterprise Operations</h3>
          </div>
          <div className="enterprise-actions-grid">
            <button className="action-card">
              <div className="action-icon">🏢</div>
              <div className="action-label">Add Client</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🎨</div>
              <div className="action-label">White-label Setup</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🌐</div>
              <div className="action-label">Custom Domain</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Analytics Export</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🔐</div>
              <div className="action-label">Security Config</div>
            </button>
            <button className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-label">System Admin</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseBundleDashboard;