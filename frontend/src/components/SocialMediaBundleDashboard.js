import React, { useState, useEffect } from 'react';
import './SocialMediaBundleDashboard.css';

const SocialMediaBundleDashboard = () => {
  const [socialMetrics, setSocialMetrics] = useState({
    totalFollowers: 45267,
    totalPosts: 1248,
    engagementRate: 4.8,
    monthlyReach: 128400,
    scheduledPosts: 32,
    campaigns: 8
  });

  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      platform: 'Instagram',
      handle: '@mewayz_official',
      followers: 18400,
      posts: 445,
      engagement: 5.2,
      status: 'active',
      icon: '📸'
    },
    {
      platform: 'Twitter',
      handle: '@mewayz',
      followers: 12300,
      posts: 567,
      engagement: 3.8,
      status: 'active',
      icon: '🐦'
    },
    {
      platform: 'LinkedIn',
      handle: 'MEWAYZ',
      followers: 8900,
      posts: 123,
      engagement: 6.1,
      status: 'active',
      icon: '💼'
    },
    {
      platform: 'TikTok',
      handle: '@mewayz_creator',
      followers: 5667,
      posts: 113,
      engagement: 8.7,
      status: 'active',
      icon: '🎵'
    }
  ]);

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'New product launch! 🚀 Check out our latest features...',
      likes: 1247,
      comments: 89,
      shares: 45,
      posted: '2024-12-20T14:30:00Z',
      status: 'published',
      icon: '📸'
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'Behind the scenes of our development process 👨‍💻',
      likes: 567,
      comments: 34,
      shares: 78,
      posted: '2024-12-20T12:15:00Z',
      status: 'published',
      icon: '🐦'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      content: 'Industry insights: The future of creator economy...',
      likes: 234,
      comments: 45,
      shares: 67,
      posted: '2024-12-20T10:00:00Z',
      status: 'published',
      icon: '💼'
    }
  ]);

  const [scheduledContent, setScheduledContent] = useState([
    {
      id: 1,
      platform: 'Instagram',
      content: 'Weekly product update and user testimonials',
      scheduledFor: '2024-12-21T16:00:00Z',
      type: 'post',
      icon: '📸'
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'Thread about best practices in social media marketing',
      scheduledFor: '2024-12-21T20:00:00Z',
      type: 'thread',
      icon: '🐦'
    },
    {
      id: 3,
      platform: 'TikTok',
      content: 'Quick tutorial video on bio link optimization',
      scheduledFor: '2024-12-22T14:30:00Z',
      type: 'video',
      icon: '🎵'
    }
  ]);

  const getPlatformColor = (platform) => {
    const colors = {
      Instagram: '#e4405f',
      Twitter: '#1da1f2',
      LinkedIn: '#0077b5',
      TikTok: '#fe2c55',
      Facebook: '#1877f2',
      YouTube: '#ff0000'
    };
    return colors[platform] || '#6b7280';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="social-dashboard">
      {/* Dashboard Header */}
      <div className="social-header">
        <div className="header-content">
          <h1>Social Media Dashboard</h1>
          <p>Manage and analyze your social media presence</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>✍️</span>
            Create Post
          </button>
          <button className="action-btn secondary">
            <span>📅</span>
            Schedule Content
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card followers">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(socialMetrics.totalFollowers)}</div>
            <div className="metric-label">Total Followers</div>
            <div className="metric-change positive">+1.2K this month</div>
          </div>
        </div>

        <div className="metric-card posts">
          <div className="metric-icon">📱</div>
          <div className="metric-content">
            <div className="metric-value">{socialMetrics.totalPosts}</div>
            <div className="metric-label">Total Posts</div>
            <div className="metric-change positive">+34 this week</div>
          </div>
        </div>

        <div className="metric-card engagement">
          <div className="metric-icon">❤️</div>
          <div className="metric-content">
            <div className="metric-value">{socialMetrics.engagementRate}%</div>
            <div className="metric-label">Engagement Rate</div>
            <div className="metric-change positive">+0.8% vs last month</div>
          </div>
        </div>

        <div className="metric-card reach">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(socialMetrics.monthlyReach)}</div>
            <div className="metric-label">Monthly Reach</div>
            <div className="metric-change positive">+15.4% vs last month</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="social-grid">
        {/* Connected Accounts */}
        <div className="dashboard-card connected-accounts">
          <div className="card-header">
            <h3>Connected Accounts</h3>
            <button className="view-all-btn">Connect More</button>
          </div>
          <div className="accounts-list">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-icon">
                  <span>{account.icon}</span>
                  <div 
                    className="platform-indicator"
                    style={{ backgroundColor: getPlatformColor(account.platform) }}
                  ></div>
                </div>
                <div className="account-info">
                  <div className="platform-name">{account.platform}</div>
                  <div className="account-handle">{account.handle}</div>
                  <div className="account-stats">
                    <span className="followers">{formatNumber(account.followers)} followers</span>
                    <span className="engagement">{account.engagement}% engagement</span>
                  </div>
                </div>
                <div className="account-status">
                  <div className={`status-indicator ${account.status}`}></div>
                  <span className="status-text">{account.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="dashboard-card recent-posts">
          <div className="card-header">
            <h3>Recent Posts</h3>
            <span className="subtitle">Last 24 hours</span>
          </div>
          <div className="posts-list">
            {recentPosts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <div className="post-platform">
                    <span className="platform-icon">{post.icon}</span>
                    <span className="platform-name">{post.platform}</span>
                  </div>
                  <div className="post-time">{formatDate(post.posted)}</div>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-stats">
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-value">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💬</span>
                    <span className="stat-value">{post.comments}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">↗️</span>
                    <span className="stat-value">{post.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Content */}
        <div className="dashboard-card scheduled-content">
          <div className="card-header">
            <h3>Scheduled Content</h3>
            <span className="subtitle">{scheduledContent.length} upcoming</span>
          </div>
          <div className="scheduled-list">
            {scheduledContent.map((item) => (
              <div key={item.id} className="scheduled-item">
                <div className="scheduled-icon">
                  <span>{item.icon}</span>
                </div>
                <div className="scheduled-info">
                  <div className="scheduled-platform">{item.platform}</div>
                  <div className="scheduled-content">{item.content}</div>
                  <div className="scheduled-meta">
                    <span className="scheduled-type">{item.type}</span>
                    <span className="scheduled-time">{formatDate(item.scheduledFor)}</span>
                  </div>
                </div>
                <div className="scheduled-actions">
                  <button className="edit-btn" title="Edit">✏️</button>
                  <button className="delete-btn" title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="dashboard-card analytics-overview">
          <div className="card-header">
            <h3>Analytics Overview</h3>
            <button className="view-all-btn">View Detailed Analytics</button>
          </div>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-icon">📈</div>
              <div className="analytics-content">
                <div className="analytics-title">Growth Rate</div>
                <div className="analytics-value">+12.5%</div>
                <div className="analytics-period">This month</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">🎯</div>
              <div className="analytics-content">
                <div className="analytics-title">Best Time</div>
                <div className="analytics-value">6:00 PM</div>
                <div className="analytics-period">Peak engagement</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">🏆</div>
              <div className="analytics-content">
                <div className="analytics-title">Top Platform</div>
                <div className="analytics-value">Instagram</div>
                <div className="analytics-period">By engagement</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">📊</div>
              <div className="analytics-content">
                <div className="analytics-title">Avg Likes</div>
                <div className="analytics-value">682</div>
                <div className="analytics-period">Per post</div>
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
              <div className="action-icon">✍️</div>
              <div className="action-label">Create Post</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📅</div>
              <div className="action-label">Schedule</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Analytics</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🎨</div>
              <div className="action-label">Templates</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🤖</div>
              <div className="action-label">AI Content</div>
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

export default SocialMediaBundleDashboard;