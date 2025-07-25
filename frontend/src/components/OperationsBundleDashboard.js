import React, { useState, useEffect } from 'react';
import './OperationsBundleDashboard.css';

const OperationsBundleDashboard = () => {
  const [operationsMetrics, setOperationsMetrics] = useState({
    totalProjects: 24,
    activeWorkflows: 8,
    efficiency: 92.5,
    teamMembers: 12,
    completedTasks: 348,
    uptime: 99.8
  });

  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      category: 'Development',
      progress: 75,
      team: 4,
      deadline: '2024-12-25T00:00:00Z',
      status: 'in_progress',
      priority: 'high',
      icon: '🌐'
    },
    {
      id: 2,
      name: 'Marketing Campaign Q1',
      category: 'Marketing',
      progress: 45,
      team: 3,
      deadline: '2024-12-30T00:00:00Z',
      status: 'in_progress',
      priority: 'medium',
      icon: '📢'
    },
    {
      id: 3,
      name: 'Data Migration',
      category: 'IT',
      progress: 88,
      team: 2,
      deadline: '2024-12-22T00:00:00Z',
      status: 'review',
      priority: 'high',
      icon: '💾'
    },
    {
      id: 4,
      name: 'Employee Training',
      category: 'HR',
      progress: 30,
      team: 5,
      deadline: '2025-01-05T00:00:00Z',
      status: 'planning',
      priority: 'low',
      icon: '🎓'
    }
  ]);

  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Content Approval Process',
      type: 'approval',
      steps: 4,
      active: 12,
      completed: 89,
      efficiency: 94,
      icon: '✅'
    },
    {
      id: 2,
      name: 'Invoice Processing',
      type: 'finance',
      steps: 6,
      active: 8,
      completed: 156,
      efficiency: 98,
      icon: '💰'
    },
    {
      id: 3,
      name: 'Customer Onboarding',
      type: 'customer',
      steps: 5,
      active: 15,
      completed: 67,
      efficiency: 87,
      icon: '👋'
    },
    {
      id: 4,
      name: 'Bug Report Handling',
      type: 'support',
      steps: 3,
      active: 5,
      completed: 234,
      efficiency: 96,
      icon: '🐛'
    }
  ]);

  const [recentTasks, setRecentTasks] = useState([
    {
      id: 1,
      title: 'Review API documentation',
      project: 'Website Redesign',
      assignee: 'John Doe',
      status: 'completed',
      priority: 'medium',
      completedAt: '2024-12-20T14:30:00Z',
      icon: '📖'
    },
    {
      id: 2,
      title: 'Deploy staging environment',
      project: 'Data Migration',
      assignee: 'Sarah Smith',
      status: 'in_progress',
      priority: 'high',
      completedAt: null,
      icon: '🚀'
    },
    {
      id: 3,
      title: 'Create marketing assets',
      project: 'Marketing Campaign Q1',
      assignee: 'Mike Johnson',
      status: 'review',
      priority: 'medium',
      completedAt: null,
      icon: '🎨'
    },
    {
      id: 4,
      title: 'Schedule team meeting',
      project: 'Employee Training',
      assignee: 'Emily Davis',
      status: 'completed',
      priority: 'low',
      completedAt: '2024-12-20T10:15:00Z',
      icon: '📅'
    }
  ]);

  const [systemStatus, setSystemStatus] = useState([
    {
      service: 'Database Server',
      status: 'operational',
      uptime: 99.9,
      responseTime: 45,
      lastCheck: '2024-12-20T15:00:00Z',
      icon: '💾'
    },
    {
      service: 'API Gateway',
      status: 'operational',
      uptime: 99.8,
      responseTime: 23,
      lastCheck: '2024-12-20T15:00:00Z',
      icon: '🔗'
    },
    {
      service: 'File Storage',
      status: 'warning',
      uptime: 98.5,
      responseTime: 156,
      lastCheck: '2024-12-20T15:00:00Z',
      icon: '📁'
    },
    {
      service: 'Email Service',
      status: 'operational',
      uptime: 99.7,
      responseTime: 78,
      lastCheck: '2024-12-20T15:00:00Z',
      icon: '📧'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      operational: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      in_progress: '#3b82f6',
      completed: '#10b981',
      review: '#8b5cf6',
      planning: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="operations-dashboard">
      {/* Dashboard Header */}
      <div className="operations-header">
        <div className="header-content">
          <h1>Operations Dashboard</h1>
          <p>Monitor and manage your business operations and workflows</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>➕</span>
            Create Project
          </button>
          <button className="action-btn secondary">
            <span>⚙️</span>
            Manage Workflows
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card projects">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{operationsMetrics.totalProjects}</div>
            <div className="metric-label">Total Projects</div>
            <div className="metric-change positive">+3 this month</div>
          </div>
        </div>

        <div className="metric-card workflows">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{operationsMetrics.activeWorkflows}</div>
            <div className="metric-label">Active Workflows</div>
            <div className="metric-change positive">+1 this week</div>
          </div>
        </div>

        <div className="metric-card efficiency">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{operationsMetrics.efficiency}%</div>
            <div className="metric-label">Efficiency Rate</div>
            <div className="metric-change positive">+2.5% vs last month</div>
          </div>
        </div>

        <div className="metric-card uptime">
          <div className="metric-icon">🔋</div>
          <div className="metric-content">
            <div className="metric-value">{operationsMetrics.uptime}%</div>
            <div className="metric-label">System Uptime</div>
            <div className="metric-change positive">+0.2% improvement</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="operations-grid">
        {/* Active Projects */}
        <div className="dashboard-card active-projects">
          <div className="card-header">
            <h3>Active Projects</h3>
            <button className="view-all-btn">View All Projects</button>
          </div>
          <div className="projects-list">
            {activeProjects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-icon">{project.icon}</div>
                <div className="project-info">
                  <div className="project-header">
                    <div className="project-name">{project.name}</div>
                    <div className="project-category">{project.category}</div>
                  </div>
                  <div className="project-meta">
                    <span className="team-size">👥 {project.team} members</span>
                    <span className="deadline">📅 {formatDate(project.deadline)}</span>
                  </div>
                </div>
                <div className="project-progress">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="project-status">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status.replace('_', ' ')}
                  </div>
                  <div 
                    className="priority-indicator"
                    style={{ color: getPriorityColor(project.priority) }}
                  >
                    {project.priority} priority
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows */}
        <div className="dashboard-card workflows-overview">
          <div className="card-header">
            <h3>Workflow Status</h3>
            <span className="subtitle">{operationsMetrics.activeWorkflows} active</span>
          </div>
          <div className="workflows-list">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="workflow-item">
                <div className="workflow-icon">{workflow.icon}</div>
                <div className="workflow-info">
                  <div className="workflow-name">{workflow.name}</div>
                  <div className="workflow-meta">
                    <span className="workflow-steps">{workflow.steps} steps</span>
                    <span className="workflow-type">{workflow.type}</span>
                  </div>
                </div>
                <div className="workflow-stats">
                  <div className="stat-item">
                    <div className="stat-value">{workflow.active}</div>
                    <div className="stat-label">Active</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{workflow.completed}</div>
                    <div className="stat-label">Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{workflow.efficiency}%</div>
                    <div className="stat-label">Efficiency</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="dashboard-card recent-tasks">
          <div className="card-header">
            <h3>Recent Task Activity</h3>
            <span className="subtitle">Last 24 hours</span>
          </div>
          <div className="tasks-list">
            {recentTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-icon">{task.icon}</div>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className="task-project">{task.project}</span>
                    <span className="task-assignee">@{task.assignee}</span>
                  </div>
                </div>
                <div className="task-status">
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  ></div>
                  <div className="status-text">{task.status.replace('_', ' ')}</div>
                  {task.completedAt && (
                    <div className="completion-time">
                      {formatDateTime(task.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card system-status">
          <div className="card-header">
            <h3>System Status</h3>
            <div className="overall-status operational">
              <div className="status-dot"></div>
              All Systems Operational
            </div>
          </div>
          <div className="status-list">
            {systemStatus.map((system, index) => (
              <div key={index} className="status-item">
                <div className="status-icon">{system.icon}</div>
                <div className="status-info">
                  <div className="service-name">{system.service}</div>
                  <div className="status-details">
                    <span className="uptime">{system.uptime}% uptime</span>
                    <span className="response-time">{system.responseTime}ms response</span>
                  </div>
                </div>
                <div className="status-indicator">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(system.status) }}
                  >
                    {system.status}
                  </div>
                  <div className="last-check">
                    Last check: {formatDateTime(system.lastCheck)}
                  </div>
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
              <div className="action-icon">➕</div>
              <div className="action-label">Create Project</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📋</div>
              <div className="action-label">Add Task</div>
            </button>
            <button className="action-card">
              <div className="action-icon">⚡</div>
              <div className="action-label">New Workflow</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">View Reports</div>
            </button>
            <button className="action-card">
              <div className="action-icon">👥</div>
              <div className="action-label">Team Settings</div>
            </button>
            <button className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-label">System Config</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsBundleDashboard;