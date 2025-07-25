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
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import Enterprise from './pages/Enterprise';
import Features from './pages/Features';
import About from './pages/About';
import NotFound from './pages/NotFound';
import AccountSettings from './pages/AccountSettings';
// Bundle Pages
import CreatorBundle from './pages/bundles/CreatorBundle';
import EcommerceBundle from './pages/bundles/EcommerceBundle';
import BusinessBundle from './pages/bundles/BusinessBundle';
// Bundle Dashboard Components
import BundleDashboard from './components/BundleDashboard';
import CreatorBundleDashboard from './components/CreatorBundleDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

// Workspace Route Component - checks if user needs onboarding
const WorkspaceRoute = ({ children, requiresWorkspace = true }) => {
  const token = localStorage.getItem('access_token');
  const hasWorkspace = localStorage.getItem('user_workspace_id');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (requiresWorkspace && !hasWorkspace) {
    return <Navigate to="/onboarding" />;
  }
  
  if (!requiresWorkspace && hasWorkspace) {
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
          <Route path="/" element={<MEWAYZ_V2_LANDING_PAGE />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Bundle Pages */}
          <Route path="/bundles/creator" element={<CreatorBundle />} />
          <Route path="/bundles/ecommerce" element={<EcommerceBundle />} />
          <Route path="/bundles/business" element={<BusinessBundle />} />

          {/* Protected Routes */}
          <Route 
            path="/onboarding" 
            element={
              <WorkspaceRoute requiresWorkspace={false}>
                <OnboardingWizard />
              </WorkspaceRoute>
            } 
          />
          {/* Bundle Dashboards */}
          <Route path="/dashboard/creator" element={<CreatorBundleDashboard />} />
          <Route path="/dashboard/bundles" element={<BundleDashboard />} />
          
          <Route 
            path="/dashboard" 
            element={
              <WorkspaceRoute requiresWorkspace={true}>
                <Dashboard />
              </WorkspaceRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;