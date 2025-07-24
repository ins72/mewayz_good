import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { 
  Header, 
  Sidebar, 
  Dashboard, 
  Apps, 
  Pricing, 
  ModuleDetail,
  mockData, 
  modules, 
  pricingBundles 
} from './components';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log('Backend connected:', response.data.message);
    } catch (e) {
      console.error('Backend connection failed:', e);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  const handleModuleSelect = (moduleId) => {
    setActiveModule(moduleId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard 
            metrics={mockData.metrics}
            activities={mockData.recentActivities}
          />
        );
      case 'apps':
        return (
          <Apps 
            modules={modules}
            onModuleSelect={handleModuleSelect}
          />
        );
      case 'pricing':
        return (
          <Pricing 
            bundles={pricingBundles}
          />
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600">Manage your account and preferences.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      value={mockData.user.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input 
                      type="text" 
                      value={mockData.user.company}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Plan</span>
                    <span className="text-sm font-medium text-gray-900">Creator Bundle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Next Billing</span>
                    <span className="text-sm font-medium text-gray-900">July 24, 2025</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        );
      default:
        if (activeModule.startsWith('module-')) {
          return (
            <ModuleDetail 
              moduleId={activeModule}
              modules={modules}
            />
          );
        }
        return <Dashboard metrics={mockData.metrics} activities={mockData.recentActivities} />;
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          activeModule={activeModule}
          onModuleSelect={handleModuleSelect}
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={mockData.user}
            onMenuToggle={handleMenuToggle}
            isSidebarOpen={isSidebarOpen}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            {renderContent()}
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;