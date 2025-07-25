import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './MEWAYZ_V2_LANDING_PAGE';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OnboardingWizard from './pages/OnboardingWizard';
import './App.css';

// Protected Route Component - requires authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component - redirect to appropriate page if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const hasWorkspace = localStorage.getItem('has_workspace');
  
  if (token) {
    // User is logged in, redirect based on workspace status
    return hasWorkspace === 'true' ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />;
  }
  
  return children;
};

// Workspace Route Component - requires authentication and redirects based on workspace status
const WorkspaceRoute = ({ children, requiresWorkspace = true }) => {
  const token = localStorage.getItem('access_token');
  const hasWorkspace = localStorage.getItem('has_workspace');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiresWorkspace && hasWorkspace !== 'true') {
    return <Navigate to="/onboarding" />;
  }
  
  if (!requiresWorkspace && hasWorkspace === 'true') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Onboarding (authenticated but no workspace) */}
          <Route 
            path="/onboarding" 
            element={
              <WorkspaceRoute requiresWorkspace={false}>
                <OnboardingWizard />
              </WorkspaceRoute>
            } 
          />
          
          {/* Protected Routes - Dashboard (authenticated with workspace) */}
          <Route 
            path="/dashboard" 
            element={
              <WorkspaceRoute requiresWorkspace={true}>
                <Dashboard />
              </WorkspaceRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
