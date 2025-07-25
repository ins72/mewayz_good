import React, { useState, useEffect } from 'react';
import './EducationBundleDashboard.css';

const EducationBundleDashboard = () => {
  const [educationMetrics, setEducationMetrics] = useState({
    totalStudents: 1245,
    activeCourses: 12,
    completionRate: 78.5,
    totalRevenue: 34567.89,
    avgRating: 4.7,
    totalCertificates: 892
  });

  const [activeCourses, setActiveCourses] = useState([
    {
      id: 1,
      title: 'Digital Marketing Mastery',
      category: 'Marketing',
      students: 234,
      progress: 85,
      rating: 4.8,
      revenue: 9870,
      status: 'active',
      icon: '📈'
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      category: 'Technology',
      students: 189,
      progress: 65,
      rating: 4.6,
      revenue: 7560,
      status: 'active',
      icon: '💻'
    },
    {
      id: 3,
      title: 'Creative Photography',
      category: 'Arts',
      students: 156,
      progress: 92,
      rating: 4.9,
      revenue: 6240,
      status: 'active',
      icon: '📸'
    },
    {
      id: 4,
      title: 'Business Leadership',
      category: 'Business',
      students: 98,
      progress: 45,
      rating: 4.5,
      revenue: 4410,
      status: 'draft',
      icon: '👔'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'enrollment',
      student: 'Sarah Johnson',
      course: 'Digital Marketing Mastery',
      action: 'enrolled',
      timestamp: '2024-12-20T14:30:00Z',
      icon: '🎓'
    },
    {
      id: 2,
      type: 'completion',
      student: 'Mike Chen',
      course: 'Creative Photography',
      action: 'completed',
      timestamp: '2024-12-20T12:15:00Z',
      icon: '🏆'
    },
    {
      id: 3,
      type: 'review',
      student: 'Emily Davis',
      course: 'Web Development Fundamentals',
      action: 'reviewed (5 stars)',
      timestamp: '2024-12-20T10:00:00Z',
      icon: '⭐'
    },
    {
      id: 4,
      type: 'certificate',
      student: 'Alex Rodriguez',
      course: 'Digital Marketing Mastery',
      action: 'earned certificate',
      timestamp: '2024-12-20T08:45:00Z',
      icon: '📜'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Live Q&A Session - Marketing Strategies',
      course: 'Digital Marketing Mastery',
      date: '2024-12-21T16:00:00Z',
      attendees: 45,
      type: 'live_session',
      icon: '🎥'
    },
    {
      id: 2,
      title: 'Assignment Deadline - Portfolio Project',
      course: 'Web Development Fundamentals',
      date: '2024-12-22T23:59:00Z',
      attendees: 28,
      type: 'deadline',
      icon: '📋'
    },
    {
      id: 3,
      title: 'New Course Launch - Advanced Analytics',
      course: 'New Course',
      date: '2024-12-25T12:00:00Z',
      attendees: 0,
      type: 'launch',
      icon: '🚀'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      draft: '#f59e0b',
      archived: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      live_session: '#3b82f6',
      deadline: '#f59e0b',
      launch: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  return (
    <div className="education-dashboard">
      {/* Dashboard Header */}
      <div className="education-header">
        <div className="header-content">
          <h1>Education Dashboard</h1>
          <p>Manage your courses, students, and educational content</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>➕</span>
            Create Course
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            Analytics
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card students">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{educationMetrics.totalStudents.toLocaleString()}</div>
            <div className="metric-label">Total Students</div>
            <div className="metric-change positive">+89 this month</div>
          </div>
        </div>

        <div className="metric-card courses">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <div className="metric-value">{educationMetrics.activeCourses}</div>
            <div className="metric-label">Active Courses</div>
            <div className="metric-change positive">+2 this week</div>
          </div>
        </div>

        <div className="metric-card completion">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{educationMetrics.completionRate}%</div>
            <div className="metric-label">Completion Rate</div>
            <div className="metric-change positive">+3.2% vs last month</div>
          </div>
        </div>

        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(educationMetrics.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-change positive">+15.4% this month</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="education-grid">
        {/* Active Courses */}
        <div className="dashboard-card active-courses">
          <div className="card-header">
            <h3>Course Overview</h3>
            <button className="view-all-btn">Manage All Courses</button>
          </div>
          <div className="courses-list">
            {activeCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div className="course-icon">{course.icon}</div>
                <div className="course-info">
                  <div className="course-title">{course.title}</div>
                  <div className="course-category">{course.category}</div>
                  <div className="course-stats">
                    <span className="students-count">{course.students} students</span>
                    <span className="course-rating">
                      ⭐ {course.rating}
                    </span>
                  </div>
                </div>
                <div className="course-progress">
                  <div className="progress-info">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="course-revenue">
                  <div className="revenue-amount">{formatCurrency(course.revenue)}</div>
                  <div className={`course-status ${course.status}`}>
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(course.status) }}
                    ></div>
                    {course.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <span className="subtitle">Last 24 hours</span>
          </div>
          <div className="activity-feed">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-message">
                    <strong>{activity.student}</strong> {activity.action} in{' '}
                    <span className="course-name">{activity.course}</span>
                  </div>
                  <div className="activity-time">{formatDate(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-card upcoming-events">
          <div className="card-header">
            <h3>Upcoming Events</h3>
            <span className="subtitle">{upcomingEvents.length} scheduled</span>
          </div>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-icon">{event.icon}</div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-course">{event.course}</div>
                  <div className="event-meta">
                    <span className="event-date">{formatDate(event.date)}</span>
                    {event.attendees > 0 && (
                      <span className="event-attendees">
                        {event.attendees} attendees
                      </span>
                    )}
                  </div>
                </div>
                <div className="event-type">
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  >
                    {event.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Analytics */}
        <div className="dashboard-card learning-analytics">
          <div className="card-header">
            <h3>Learning Analytics</h3>
            <button className="view-all-btn">View Detailed Analytics</button>
          </div>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-icon">📈</div>
              <div className="analytics-content">
                <div className="analytics-title">Avg. Session Time</div>
                <div className="analytics-value">28 min</div>
                <div className="analytics-trend positive">+5 min vs last week</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">🏆</div>
              <div className="analytics-content">
                <div className="analytics-title">Certificates Issued</div>
                <div className="analytics-value">{educationMetrics.totalCertificates}</div>
                <div className="analytics-trend positive">+12 this week</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">⭐</div>
              <div className="analytics-content">
                <div className="analytics-title">Avg. Rating</div>
                <div className="analytics-value">{educationMetrics.avgRating}</div>
                <div className="analytics-trend positive">+0.2 vs last month</div>
              </div>
            </div>
            <div className="analytics-item">
              <div className="analytics-icon">📊</div>
              <div className="analytics-content">
                <div className="analytics-title">Quiz Pass Rate</div>
                <div className="analytics-value">87%</div>
                <div className="analytics-trend positive">+4% improvement</div>
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
              <div className="action-label">Create Course</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-label">Add Lesson</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🎯</div>
              <div className="action-label">Create Quiz</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📜</div>
              <div className="action-label">Issue Certificate</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">View Analytics</div>
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

export default EducationBundleDashboard;