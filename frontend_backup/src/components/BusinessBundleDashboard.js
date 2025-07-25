import React, { useState, useEffect } from 'react';
import './BusinessBundleDashboard.css';

const BusinessBundleDashboard = () => {
  const [businessMetrics, setBusinessMetrics] = useState({
    totalRevenue: 125670.89,
    monthlyGrowth: 18.5,
    totalCustomers: 2847,
    conversionRate: 12.8,
    activeLeads: 156,
    teamMembers: 24
  });

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 85420, target: 80000 },
    { month: 'Feb', revenue: 92350, target: 85000 },
    { month: 'Mar', revenue: 105670, target: 95000 },
    { month: 'Apr', revenue: 118920, target: 110000 },
    { month: 'May', revenue: 125670, target: 120000 }
  ]);

  const [leadsPipeline, setLeadsPipeline] = useState([
    {
      stage: 'Lead',
      count: 245,
      value: 367500,
      color: '#3b82f6',
      icon: '👋'
    },
    {
      stage: 'Qualified',
      count: 156,
      value: 234000,
      color: '#8b5cf6',
      icon: '🎯'
    },
    {
      stage: 'Proposal',
      count: 89,
      value: 178000,
      color: '#f59e0b',
      icon: '📋'
    },
    {
      stage: 'Negotiation',
      count: 34,
      value: 102000,
      color: '#ef4444',
      icon: '🤝'
    },
    {
      stage: 'Closed',
      count: 67,
      value: 201000,
      color: '#10b981',
      icon: '✅'
    }
  ]);

  const [recentDeals, setRecentDeals] = useState([
    {
      id: 1,
      client: 'TechCorp Solutions',
      value: 45000,
      stage: 'closed_won',
      probability: 100,
      closeDate: '2024-12-20T00:00:00Z',
      rep: 'Sarah Johnson',
      icon: '🏢'
    },
    {
      id: 2,
      client: 'StartupXYZ',
      value: 28000,
      stage: 'negotiation',
      probability: 75,
      closeDate: '2024-12-25T00:00:00Z',
      rep: 'Mike Chen',
      icon: '🚀'
    },
    {
      id: 3,
      client: 'GlobalCorp Ltd',
      value: 67000,
      stage: 'proposal',
      probability: 60,
      closeDate: '2024-12-30T00:00:00Z',
      rep: 'Emily Davis',
      icon: '🌍'
    },
    {
      id: 4,
      client: 'InnovateNow',
      value: 32000,
      stage: 'qualified',
      probability: 45,
      closeDate: '2025-01-05T00:00:00Z',
      rep: 'Alex Rodriguez',
      icon: '💡'
    }
  ]);

  const [teamPerformance, setTeamPerformance] = useState([
    {
      name: 'Sarah Johnson',
      role: 'Senior Sales Rep',
      quota: 50000,
      achieved: 67500,
      deals: 12,
      performance: 135,
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Sales Rep',
      quota: 40000,
      achieved: 43200,
      deals: 8,
      performance: 108,
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Davis',
      role: 'Account Manager',
      quota: 60000,
      achieved: 72800,
      deals: 15,
      performance: 121,
      avatar: '👩‍💻'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Business Dev',
      quota: 35000,
      achieved: 31500,
      deals: 6,
      performance: 90,
      avatar: '👨‍💻'
    }
  ]);

  const [businessInsights, setBusinessInsights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Peak Sales Performance',
      description: 'Q4 sales are 25% above target. Consider expanding marketing budget.',
      priority: 'high',
      icon: '📈'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Lead Response Time',
      description: 'Average response time is 18 hours. Industry benchmark is 5 hours.',
      priority: 'medium',
      icon: '⏰'
    },
    {
      id: 3,
      type: 'success',
      title: 'Customer Retention',
      description: 'Customer retention rate increased to 94% this quarter.',
      priority: 'low',
      icon: '🎉'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Pipeline Risk',
      description: 'Several high-value deals are stalled in negotiation stage.',
      priority: 'high',
      icon: '⚠️'
    }
  ]);

  const getStageColor = (stage) => {
    const colors = {
      lead: '#3b82f6',
      qualified: '#8b5cf6',
      proposal: '#f59e0b',
      negotiation: '#ef4444',
      closed_won: '#10b981',
      closed_lost: '#6b7280'
    };
    return colors[stage] || '#6b7280';
  };

  const getInsightColor = (type) => {
    const colors = {
      opportunity: '#10b981',
      warning: '#f59e0b',
      success: '#10b981',
      alert: '#ef4444'
    };
    return colors[type] || '#6b7280';
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
      day: 'numeric'
    });
  };

  return (
    <div className="business-dashboard">
      {/* Dashboard Header */}
      <div className="business-header">
        <div className="header-content">
          <h1>Business Dashboard</h1>
          <p>Monitor your business performance and growth metrics</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>➕</span>
            Add Deal
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            View Reports
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(businessMetrics.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-change positive">+{businessMetrics.monthlyGrowth}% this month</div>
          </div>
        </div>

        <div className="metric-card customers">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{businessMetrics.totalCustomers.toLocaleString()}</div>
            <div className="metric-label">Total Customers</div>
            <div className="metric-change positive">+147 this month</div>
          </div>
        </div>

        <div className="metric-card conversion">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{businessMetrics.conversionRate}%</div>
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-change positive">+2.3% vs last month</div>
          </div>
        </div>

        <div className="metric-card leads">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{businessMetrics.activeLeads}</div>
            <div className="metric-label">Active Leads</div>
            <div className="metric-change positive">+23 this week</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="business-grid">
        {/* Sales Pipeline */}
        <div className="dashboard-card sales-pipeline">
          <div className="card-header">
            <h3>Sales Pipeline</h3>
            <div className="pipeline-total">
              Total Value: {formatCurrency(leadsPipeline.reduce((sum, stage) => sum + stage.value, 0))}
            </div>
          </div>
          <div className="pipeline-stages">
            {leadsPipeline.map((stage, index) => (
              <div key={index} className="pipeline-stage">
                <div className="stage-header">
                  <div className="stage-icon">{stage.icon}</div>
                  <div className="stage-info">
                    <div className="stage-name">{stage.stage}</div>
                    <div className="stage-count">{stage.count} deals</div>
                  </div>
                </div>
                <div className="stage-value">{formatCurrency(stage.value)}</div>
                <div className="stage-bar">
                  <div 
                    className="stage-fill"
                    style={{ 
                      backgroundColor: stage.color,
                      width: `${(stage.count / Math.max(...leadsPipeline.map(s => s.count))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="dashboard-card recent-deals">
          <div className="card-header">
            <h3>Recent Deals</h3>
            <button className="view-all-btn">View All Deals</button>
          </div>
          <div className="deals-list">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="deal-item">
                <div className="deal-icon">{deal.icon}</div>
                <div className="deal-info">
                  <div className="deal-client">{deal.client}</div>
                  <div className="deal-meta">
                    <span className="deal-rep">Rep: {deal.rep}</span>
                    <span className="deal-close">Close: {formatDate(deal.closeDate)}</span>
                  </div>
                </div>
                <div className="deal-value">
                  <div className="value-amount">{formatCurrency(deal.value)}</div>
                  <div className="deal-probability">{deal.probability}% probability</div>
                </div>
                <div className="deal-stage">
                  <span 
                    className="stage-badge"
                    style={{ backgroundColor: getStageColor(deal.stage) }}
                  >
                    {deal.stage.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="dashboard-card team-performance">
          <div className="card-header">
            <h3>Team Performance</h3>
            <span className="subtitle">Monthly quota achievement</span>
          </div>
          <div className="team-list">
            {teamPerformance.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                  <div className="member-stats">
                    <span className="deals-count">{member.deals} deals</span>
                    <span className="performance-rate">{member.performance}% quota</span>
                  </div>
                </div>
                <div className="member-progress">
                  <div className="progress-header">
                    <span className="achieved">{formatCurrency(member.achieved)}</span>
                    <span className="quota">/ {formatCurrency(member.quota)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${member.performance >= 100 ? 'success' : 'partial'}`}
                      style={{ width: `${Math.min(member.performance, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Insights */}
        <div className="dashboard-card business-insights">
          <div className="card-header">
            <h3>Business Insights</h3>
            <span className="subtitle">AI-powered recommendations</span>
          </div>
          <div className="insights-list">
            {businessInsights.map((insight) => (
              <div key={insight.id} className="insight-item">
                <div className="insight-icon" style={{ color: getInsightColor(insight.type) }}>
                  {insight.icon}
                </div>
                <div className="insight-content">
                  <div className="insight-title">{insight.title}</div>
                  <div className="insight-description">{insight.description}</div>
                </div>
                <div className="insight-priority">
                  <span 
                    className={`priority-badge ${insight.priority}`}
                    style={{ 
                      backgroundColor: insight.priority === 'high' ? '#ef4444' : 
                                     insight.priority === 'medium' ? '#f59e0b' : '#10b981' 
                    }}
                  >
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart Preview */}
        <div className="dashboard-card revenue-chart">
          <div className="card-header">
            <h3>Revenue Trend</h3>
            <button className="view-all-btn">View Detailed Analytics</button>
          </div>
          <div className="chart-preview">
            <div className="chart-bars">
              {revenueData.map((data, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-container">
                    <div 
                      className="bar-fill actual"
                      style={{ 
                        height: `${(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bar-fill target"
                      style={{ 
                        height: `${(data.target / Math.max(...revenueData.map(d => d.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="bar-label">{data.month}</div>
                  <div className="bar-values">
                    <div className="actual-value">{formatCurrency(data.revenue)}</div>
                    <div className="target-value">Target: {formatCurrency(data.target)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color actual"></div>
                <span>Actual Revenue</span>
              </div>
              <div className="legend-item">
                <div className="legend-color target"></div>
                <span>Target Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon">➕</div>
              <div className="action-label">Add Deal</div>
            </button>
            <button className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-label">Add Contact</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Generate Report</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📧</div>
              <div className="action-label">Email Campaign</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📅</div>
              <div className="action-label">Schedule Meeting</div>
            </button>
            <button className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-label">Settings</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessBundleDashboard;