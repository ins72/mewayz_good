import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MEWAYZ_V2_LANDING_PAGE from './MEWAYZ_V2_LANDING_PAGE';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingWizard from './pages/OnboardingWizard';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import './App.css';

// Protected route component that checks authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Workspace route component that checks if user has workspace
const WorkspaceRoute = ({ children, requiresWorkspace = true }) => {
  const token = localStorage.getItem('access_token');
  const hasWorkspace = localStorage.getItem('has_workspace') === 'true';
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiresWorkspace && !hasWorkspace) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (!requiresWorkspace && hasWorkspace) {
    return <Navigate to="/dashboard" replace />;
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
