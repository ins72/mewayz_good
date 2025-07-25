import React, { useState, useEffect } from 'react';
import BundleDashboard from '../components/BundleDashboard';
import CreatorBundleDashboard from '../components/CreatorBundleDashboard';
import EcommerceBundleDashboard from '../components/EcommerceBundleDashboard';
import SocialMediaBundleDashboard from '../components/SocialMediaBundleDashboard';
import EducationBundleDashboard from '../components/EducationBundleDashboard';
import BusinessBundleDashboard from '../components/BusinessBundleDashboard';
import OperationsBundleDashboard from '../components/OperationsBundleDashboard';
import EnterpriseBundleDashboard from '../components/EnterpriseBundleDashboard';
import AdminDashboard from '../components/AdminDashboard';
import NotificationSystem from '../components/NotificationSystem';
import './Dashboard.css';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('bundles');
  const [activeBundles, setActiveBundles] = useState([]);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'

  useEffect(() => {
    // Simulate fetching user bundles and role
    setActiveBundles(['creator', 'ecommerce', 'business', 'enterprise']);
    
    // Check if user is admin (in a real app, this would come from JWT token or API)
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload.role === 'admin' || tokenPayload.is_admin) {
          setUserRole('admin');
        }
      } catch (error) {
        console.log('Could not parse token for role');
      }
    }
  }, []);

  const renderDashboardContent = () => {
    switch (currentView) {
      case 'admin':
        return <AdminDashboard />;
      case 'bundles':
        return <BundleDashboard />;
      case 'creator':
        return <CreatorBundleDashboard />;
      case 'ecommerce':
        return <EcommerceBundleDashboard />;
      case 'social-media':
        return <SocialMediaBundleDashboard />;
      case 'education':
        return <EducationBundleDashboard />;
      case 'business':
        return <BusinessBundleDashboard />;
      case 'operations':
        return <OperationsBundleDashboard />;
      case 'enterprise':
        return <EnterpriseBundleDashboard />;
      default:
        return <BundleDashboard />;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <button 
            className={`nav-btn ${currentView === 'bundles' ? 'active' : ''}`}
            onClick={() => setCurrentView('bundles')}
          >
            📦 Bundle Overview
          </button>
          
          {/* Bundle-specific dashboards - show based on active bundles */}
          {activeBundles.includes('creator') && (
            <button 
              className={`nav-btn ${currentView === 'creator' ? 'active' : ''}`}
              onClick={() => setCurrentView('creator')}
            >
              🎨 Creator
            </button>
          )}
          
          {activeBundles.includes('ecommerce') && (
            <button 
              className={`nav-btn ${currentView === 'ecommerce' ? 'active' : ''}`}
              onClick={() => setCurrentView('ecommerce')}
            >
              🛍️ E-commerce
            </button>
          )}
          
          {activeBundles.includes('social_media') && (
            <button 
              className={`nav-btn ${currentView === 'social-media' ? 'active' : ''}`}
              onClick={() => setCurrentView('social-media')}
            >
              📱 Social Media
            </button>
          )}
          
          {activeBundles.includes('education') && (
            <button 
              className={`nav-btn ${currentView === 'education' ? 'active' : ''}`}
              onClick={() => setCurrentView('education')}
            >
              🎓 Education
            </button>
          )}
          
          {activeBundles.includes('business') && (
            <button 
              className={`nav-btn ${currentView === 'business' ? 'active' : ''}`}
              onClick={() => setCurrentView('business')}
            >
              💼 Business
            </button>
          )}
          
          {activeBundles.includes('operations') && (
            <button 
              className={`nav-btn ${currentView === 'operations' ? 'active' : ''}`}
              onClick={() => setCurrentView('operations')}
            >
              ⚙️ Operations
            </button>
          )}
          
          {userRole === 'admin' && (
            <button 
              className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              👑 Admin Console
            </button>
          )}
        </div>
        <div className="dashboard-actions">
          <NotificationSystem />
        </div>
      </div>
      <div className="dashboard-content">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;