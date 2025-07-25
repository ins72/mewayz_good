import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userEmail = localStorage.getItem('user_email');
    const hasWorkspace = localStorage.getItem('has_workspace');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (hasWorkspace !== 'true') {
      navigate('/onboarding');
      return;
    }

    // Set basic user data from localStorage
    setUser({
      email: userEmail,
      full_name: userEmail?.split('@')[0] || 'User', // Extract name from email as fallback
      has_workspace: true
    });

    // Optionally fetch more detailed user data
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token might be expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <h1>MEWAYZ</h1>
            <span className="version-badge">V2</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.full_name || 'User'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to MEWAYZ V2, {user?.full_name?.split(' ')[0] || 'User'}!</h2>
          <p>Your all-in-one creator economy platform is ready to use.</p>
        </div>

        <div className="bundles-grid">
          <div className="bundle-card creator">
            <div className="bundle-header">
              <h3>Creator Bundle</h3>
              <span className="bundle-price">$19/month</span>
            </div>
            <div className="bundle-description">
              <p>Professional bio links, content creation tools, and analytics.</p>
            </div>
            <div className="bundle-status available">
              <span>✅ Available</span>
            </div>
            <button className="bundle-action-btn">Explore Creator Tools</button>
          </div>

          <div className="bundle-card ecommerce">
            <div className="bundle-header">
              <h3>E-commerce Bundle</h3>
              <span className="bundle-price">$24/month</span>
            </div>
            <div className="bundle-description">
              <p>Online store, inventory management, and payment processing.</p>
            </div>
            <div className="bundle-status available">
              <span>✅ Available</span>
            </div>
            <button className="bundle-action-btn">Launch Your Store</button>
          </div>

          <div className="bundle-card social-media">
            <div className="bundle-header">
              <h3>Social Media Bundle</h3>
              <span className="bundle-price">$29/month</span>
            </div>
            <div className="bundle-description">
              <p>Post scheduling, analytics, and multi-platform management.</p>
            </div>
            <div className="bundle-status coming-soon">
              <span>⏳ Coming Soon</span>
            </div>
            <button className="bundle-action-btn" disabled>Coming Soon</button>
          </div>

          <div className="bundle-card education">
            <div className="bundle-header">
              <h3>Education Bundle</h3>
              <span className="bundle-price">$29/month</span>
            </div>
            <div className="bundle-description">
              <p>Course creation, student management, and certificates.</p>
            </div>
            <div className="bundle-status coming-soon">
              <span>⏳ Coming Soon</span>
            </div>
            <button className="bundle-action-btn" disabled>Coming Soon</button>
          </div>

          <div className="bundle-card business">
            <div className="bundle-header">
              <h3>Business Bundle</h3>
              <span className="bundle-price">$39/month</span>
            </div>
            <div className="bundle-description">
              <p>CRM, team management, and business intelligence.</p>
            </div>
            <div className="bundle-status coming-soon">
              <span>⏳ Coming Soon</span>
            </div>
            <button className="bundle-action-btn" disabled>Coming Soon</button>
          </div>

          <div className="bundle-card operations">
            <div className="bundle-header">
              <h3>Operations Bundle</h3>
              <span className="bundle-price">$24/month</span>
            </div>
            <div className="bundle-description">
              <p>Booking system, forms, and workflow automation.</p>
            </div>
            <div className="bundle-status coming-soon">
              <span>⏳ Coming Soon</span>
            </div>
            <button className="bundle-action-btn" disabled>Coming Soon</button>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <h4>Account Status</h4>
            <p className="stat-value">Active</p>
            <p className="stat-label">Your account is ready to use</p>
          </div>
          <div className="stat-card">
            <h4>Available Bundles</h4>
            <p className="stat-value">2/6</p>
            <p className="stat-label">Creator & E-commerce bundles ready</p>
          </div>
          <div className="stat-card">
            <h4>Member Since</h4>
            <p className="stat-value">Today</p>
            <p className="stat-label">Welcome to MEWAYZ V2!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;