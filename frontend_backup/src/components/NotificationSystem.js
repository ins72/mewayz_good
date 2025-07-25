import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Bundle Activated',
      message: 'Your Creator Bundle has been successfully activated!',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      icon: '🎉'
    },
    {
      id: 2,
      type: 'info',
      title: 'Payment Processed',
      message: 'Monthly subscription payment of $19.00 processed successfully.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      icon: '💳'
    },
    {
      id: 3,
      type: 'warning',
      title: 'API Rate Limit',
      message: 'You are approaching your AI content generation limit (450/500 credits used).',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      icon: '⚠️'
    },
    {
      id: 4,
      type: 'feature',
      title: 'New Feature Available',
      message: 'Bio Link Analytics is now available in your Creator Bundle!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      icon: '✨'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      feature: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Add a random notification occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification = {
          id: Date.now(),
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)],
          title: 'System Update',
          message: 'Your account data has been synced successfully.',
          timestamp: new Date().toISOString(),
          read: false,
          icon: '🔄'
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Notification Bell */}
      <div className="notification-trigger">
        <button 
          className={`notification-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bell-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div 
            className="notification-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="notification-panel">
            <div className="panel-header">
              <h3>Notifications</h3>
              <div className="header-actions">
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  className="close-panel"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="panel-filters">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
              <button 
                className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                onClick={() => setFilter('read')}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            <div className="notifications-list">
              {getFilteredNotifications().length === 0 ? (
                <div className="no-notifications">
                  <div className="no-notifications-icon">📭</div>
                  <p>No {filter === 'all' ? '' : filter} notifications</p>
                </div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <div className="notification-header">
                        <div className="notification-icon">
                          <span 
                            style={{ color: getTypeColor(notification.type) }}
                          >
                            {notification.icon}
                          </span>
                        </div>
                        <div className="notification-meta">
                          <h4 className="notification-title">{notification.title}</h4>
                          <span className="notification-time">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <div className="notification-actions">
                          {!notification.read && (
                            <button 
                              className="mark-read-btn"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button 
                            className="delete-btn"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      {!notification.read && (
                        <div className="unread-indicator"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="panel-footer">
                <button className="view-all-btn">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NotificationSystem;