import React, { useState, useEffect } from 'react';
import BundleDashboard from '../components/BundleDashboard';
import CreatorBundleDashboard from '../components/CreatorBundleDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('bundles');
  const [activeBundles, setActiveBundles] = useState([]);

  useEffect(() => {
    // Simulate fetching user bundles
    setActiveBundles(['creator', 'ecommerce']);
  }, []);

  const renderDashboardContent = () => {
    switch (currentView) {
      case 'bundles':
        return <BundleDashboard />;
      case 'creator':
        return <CreatorBundleDashboard />;
      default:
        return <BundleDashboard />;
    }
  };

  return (
    <div className="dashboard">
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;