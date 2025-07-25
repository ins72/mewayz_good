import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CreatorBundleDashboard.css';

const CreatorBundleDashboard = () => {
  const [stats, setStats] = useState({
    bioLinks: 3,
    websites: 2,
    aiCredits: 427,
    templates: 8,
    totalClicks: 1243,
    monthlyVisitors: 892
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'bio_link',
      action: 'Created new bio link',
      item: 'Instagram Profile',
      timestamp: '2 hours ago',
      icon: '🔗'
    },
    {
      id: 2,
      type: 'ai_content',
      action: 'Generated AI content',
      item: 'Blog post about social media tips',
      timestamp: '5 hours ago', 
      icon: '🤖'
    },
    {
      id: 3,
      type: 'website',
      action: 'Updated website',
      item: 'Portfolio Site',
      timestamp: '1 day ago',
      icon: '🌐'
    },
    {
      id: 4,
      type: 'template',
      action: 'Purchased template',
      item: 'Modern Portfolio Template',
      timestamp: '2 days ago',
      icon: '🎨'
    }
  ]);

  const [quickTools, setQuickTools] = useState([
    {
      title: 'Bio Link Builder',
      description: 'Create and manage your bio link pages',
      icon: '🔗',
      path: '/dashboard/bio-links',
      color: 'from-purple-500 to-pink-500',
      usage: '3 of unlimited'
    },
    {
      title: 'Website Builder',
      description: 'Build professional websites with ease',
      icon: '🌐',
      path: '/dashboard/websites',
      color: 'from-blue-500 to-cyan-500',
      usage: '2 of 10 pages'
    },
    {
      title: 'AI Content Generator',
      description: 'Create engaging content with AI',
      icon: '🤖',
      path: '/dashboard/ai-content',
      color: 'from-green-500 to-emerald-500',
      usage: '73 of 500 credits'
    },
    {
      title: 'Template Marketplace',
      description: 'Buy and sell premium templates',
      icon: '🎨',
      path: '/dashboard/templates',
      color: 'from-orange-500 to-red-500',
      usage: '8 templates owned'
    }
  ]);

  return (
    <div className="creator-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="bundle-badge creator">
            <span>🎨</span>
            Creator Bundle
          </div>
          <h1>Creator Dashboard</h1>
          <p>Build your online presence with powerful creator tools</p>
        </div>
        <div className="header-right">
          <div className="credits-display">
            <span className="credits-icon">⚡</span>
            <div className="credits-info">
              <div className="credits-amount">{stats.aiCredits}</div>
              <div className="credits-label">AI Credits Left</div>
            </div>
          </div>
          <Link to="/pricing" className="upgrade-btn">
            <span>⭐</span>
            Upgrade
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bio-links">
            <span>🔗</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.bioLinks}</div>
            <div className="stat-label">Bio Links</div>
            <div className="stat-change positive">+1 this week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon websites">
            <span>🌐</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.websites}</div>
            <div className="stat-label">Websites</div>
            <div className="stat-change neutral">No change</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visitors">
            <span>👥</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.monthlyVisitors.toLocaleString()}</div>
            <div className="stat-label">Monthly Visitors</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clicks">
            <span>📈</span>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalClicks.toLocaleString()}</div>
            <div className="stat-label">Total Clicks</div>
            <div className="stat-change positive">+23% this month</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Quick Tools */}
        <div className="quick-tools-section">
          <h2>Your Creator Tools</h2>
          <div className="tools-grid">
            {quickTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="tool-card">
                <div className={`tool-icon bg-gradient-to-r ${tool.color}`}>
                  <span>{tool.icon}</span>
                </div>
                <div className="tool-content">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <div className="tool-usage">
                    {tool.usage}
                  </div>
                </div>
                <div className="tool-arrow">
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/dashboard/activity" className="view-all">View All</Link>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  <span>{activity.icon}</span>
                </div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-item-name">{activity.item}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Templates Section */}
      <div className="featured-section">
        <div className="section-header">
          <h2>Featured Templates</h2>
          <Link to="/dashboard/templates" className="view-all">Browse All</Link>
        </div>
        <div className="templates-grid">
          <div className="template-card">
            <div className="template-preview">
              <div className="template-image gradient-1"></div>
            </div>
            <div className="template-info">
              <h3>Modern Portfolio</h3>
              <p>Clean, minimalist design</p>
              <div className="template-price">$12</div>
            </div>
          </div>

          <div className="template-card">
            <div className="template-preview">
              <div className="template-image gradient-2"></div>
            </div>
            <div className="template-info">
              <h3>Creative Agency</h3>
              <p>Bold, colorful layout</p>
              <div className="template-price">$15</div>
            </div>
          </div>

          <div className="template-card">
            <div className="template-preview">
              <div className="template-image gradient-3"></div>
            </div>
            <div className="template-info">
              <h3>Personal Blog</h3>
              <p>Content-focused design</p>
              <div className="template-price">$10</div>
            </div>
          </div>

          <div className="template-card">
            <div className="template-preview">
              <div className="template-image gradient-4"></div>
            </div>
            <div className="template-info">
              <h3>Business Landing</h3>
              <p>Professional layout</p>
              <div className="template-price">$18</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="quick-actions-footer">
        <div className="action-item">
          <Link to="/dashboard/bio-links/new" className="action-btn primary">
            <span>🔗</span>
            Create Bio Link
          </Link>
        </div>
        <div className="action-item">
          <Link to="/dashboard/websites/new" className="action-btn secondary">
            <span>🌐</span>
            New Website
          </Link>
        </div>
        <div className="action-item">
          <Link to="/dashboard/ai-content" className="action-btn secondary">
            <span>🤖</span>
            Generate Content
          </Link>
        </div>
        <div className="action-item">
          <Link to="/dashboard/templates" className="action-btn secondary">
            <span>🎨</span>
            Browse Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorBundleDashboard;