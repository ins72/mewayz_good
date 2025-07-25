import React, { useState, useEffect } from 'react';
import './EnterpriseClientManager.css';

const EnterpriseClientManager = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [clients, setClients] = useState([
    {
      id: 1,
      companyName: 'GlobalTech Solutions',
      contactName: 'Sarah Mitchell',
      email: 'sarah@globaltech.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinDate: '2024-09-15T00:00:00Z',
      subscriptionTier: 'Business Bundle',
      monthlyRevenue: 1950.00, // $39 x 50 users
      users: 50,
      customDomain: 'globaltech.mewayz.com',
      whitelabelStatus: 'active',
      lastActive: '2024-12-20T15:30:00Z',
      totalRevenue: 7800.00,
      logo: '🏢'
    },
    {
      id: 2,
      companyName: 'CreativeAgency Pro',
      contactName: 'Mike Johnson',
      email: 'mike@creativeagency.com',
      phone: '+1 (555) 987-6543',
      status: 'active',
      joinDate: '2024-10-22T00:00:00Z',
      subscriptionTier: 'Creator Bundle',
      monthlyRevenue: 570.00, // $19 x 30 users
      users: 30,
      customDomain: 'ca-pro.mewayz.com',
      whitelabelStatus: 'setup',
      lastActive: '2024-12-20T14:15:00Z',
      totalRevenue: 1710.00,
      logo: '🎨'
    },
    {
      id: 3,
      companyName: 'StartupHub Inc',
      contactName: 'Emily Davis',
      email: 'emily@startuphub.com',
      phone: '+1 (555) 456-7890',
      status: 'trial',
      joinDate: '2024-12-01T00:00:00Z',
      subscriptionTier: 'E-commerce Bundle',
      monthlyRevenue: 0.00, // Trial period
      users: 5,
      customDomain: 'pending',
      whitelabelStatus: 'pending',
      lastActive: '2024-12-19T16:45:00Z',
      totalRevenue: 0.00,
      logo: '💡'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);

  const [newClientForm, setNewClientForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    subscriptionTier: 'Creator Bundle',
    customDomain: '',
    users: 1,
    trialDays: 14
  });

  const [clientMetrics, setClientMetrics] = useState({
    totalClients: 47,
    activeClients: 44,
    trialClients: 3,
    totalMRR: 28450.00, // Monthly Recurring Revenue
    avgRevenuePerClient: 604.26,
    churnRate: 2.1
  });

  const bundlePlans = [
    { name: 'Free Starter', price: 0, color: '#6b7280' },
    { name: 'Creator Bundle', price: 19, color: '#8b5cf6' },
    { name: 'E-commerce Bundle', price: 24, color: '#10b981' },
    { name: 'Social Media Bundle', price: 29, color: '#3b82f6' },
    { name: 'Education Bundle', price: 34, color: '#6366f1' },
    { name: 'Business Bundle', price: 39, color: '#f59e0b' },
    { name: 'Operations Bundle', price: 44, color: '#64748b' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      trial: '#f59e0b',
      suspended: '#ef4444',
      cancelled: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getWhitelabelStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      setup: '#f59e0b',
      pending: '#6b7280',
      failed: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClientSelect = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleAddClient = () => {
    const newClient = {
      id: Date.now(),
      ...newClientForm,
      status: newClientForm.trialDays > 0 ? 'trial' : 'active',
      joinDate: new Date().toISOString(),
      monthlyRevenue: newClientForm.trialDays > 0 ? 0 : 
        (bundlePlans.find(p => p.name === newClientForm.subscriptionTier)?.price || 0) * newClientForm.users,
      customDomain: newClientForm.customDomain || 'pending',
      whitelabelStatus: 'pending',
      lastActive: new Date().toISOString(),
      totalRevenue: 0.00,
      logo: '🏢'
    };

    setClients([newClient, ...clients]);
    setShowClientModal(false);
    setNewClientForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      subscriptionTier: 'Creator Bundle',
      customDomain: '',
      users: 1,
      trialDays: 14
    });
  };

  const renderOverview = () => (
    <>
      {/* Client Metrics */}
      <div className="client-metrics-grid">
        <div className="metric-card total-clients">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <div className="metric-value">{clientMetrics.totalClients}</div>
            <div className="metric-label">Total Clients</div>
            <div className="metric-change positive">+3 this month</div>
          </div>
        </div>

        <div className="metric-card active-clients">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{clientMetrics.activeClients}</div>
            <div className="metric-label">Active Clients</div>
            <div className="metric-change positive">{((clientMetrics.activeClients / clientMetrics.totalClients) * 100).toFixed(1)}% active rate</div>
          </div>
        </div>

        <div className="metric-card monthly-revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(clientMetrics.totalMRR)}</div>
            <div className="metric-label">Monthly Recurring Revenue</div>
            <div className="metric-change positive">+15.2% vs last month</div>
          </div>
        </div>

        <div className="metric-card avg-revenue">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(clientMetrics.avgRevenuePerClient)}</div>
            <div className="metric-label">Avg Revenue Per Client</div>
            <div className="metric-change positive">+{formatCurrency(45)} vs last month</div>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="clients-table-container">
        <div className="table-header-controls">
          <div className="table-title">
            <h3>Client Portfolio ({clients.length})</h3>
            <div className="table-filters">
              <select className="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Trial</option>
                <option>Suspended</option>
              </select>
              <select className="filter-select">
                <option>All Plans</option>
                {bundlePlans.map(plan => (
                  <option key={plan.name}>{plan.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-actions">
            {selectedClients.length > 0 && (
              <button className="bulk-action-btn" onClick={() => setShowBulkActions(true)}>
                Bulk Actions ({selectedClients.length})
              </button>
            )}
            <button className="add-client-btn" onClick={() => setShowClientModal(true)}>
              <span>➕</span>
              Add Client
            </button>
          </div>
        </div>

        <div className="clients-table">
          <div className="table-header">
            <div className="col-select">
              <input 
                type="checkbox" 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClients(clients.map(c => c.id));
                  } else {
                    setSelectedClients([]);
                  }
                }}
                checked={selectedClients.length === clients.length}
              />
            </div>
            <div className="col-company">Company</div>
            <div className="col-contact">Contact</div>
            <div className="col-status">Status</div>
            <div className="col-plan">Plan</div>
            <div className="col-revenue">Revenue</div>
            <div className="col-users">Users</div>
            <div className="col-domain">Domain</div>
            <div className="col-actions">Actions</div>
          </div>
          {clients.map((client) => (
            <div key={client.id} className="table-row">
              <div className="col-select">
                <input 
                  type="checkbox" 
                  checked={selectedClients.includes(client.id)}
                  onChange={() => handleClientSelect(client.id)}
                />
              </div>
              <div className="col-company">
                <div className="company-info">
                  <div className="company-logo">{client.logo}</div>
                  <div className="company-details">
                    <div className="company-name">{client.companyName}</div>
                    <div className="join-date">Joined {formatDate(client.joinDate)}</div>
                  </div>
                </div>
              </div>
              <div className="col-contact">
                <div className="contact-info">
                  <div className="contact-name">{client.contactName}</div>
                  <div className="contact-email">{client.email}</div>
                </div>
              </div>
              <div className="col-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(client.status) }}
                >
                  {client.status}
                </span>
              </div>
              <div className="col-plan">
                <div className="plan-info">
                  <div className="plan-name">{client.subscriptionTier}</div>
                  <div className="plan-price">{formatCurrency(bundlePlans.find(p => p.name === client.subscriptionTier)?.price || 0)}/user</div>
                </div>
              </div>
              <div className="col-revenue">
                <div className="revenue-info">
                  <div className="monthly-revenue">{formatCurrency(client.monthlyRevenue)}/mo</div>
                  <div className="total-revenue">{formatCurrency(client.totalRevenue)} total</div>
                </div>
              </div>
              <div className="col-users">
                <div className="users-count">{client.users}</div>
              </div>
              <div className="col-domain">
                <div className="domain-info">
                  {client.customDomain === 'pending' ? (
                    <span className="domain-pending">Setup Required</span>
                  ) : (
                    <span className="domain-active">{client.customDomain}</span>
                  )}
                  <span 
                    className="whitelabel-status"
                    style={{ color: getWhitelabelStatusColor(client.whitelabelStatus) }}
                  >
                    {client.whitelabelStatus}
                  </span>
                </div>
              </div>
              <div className="col-actions">
                <button 
                  className="view-client-btn"
                  onClick={() => setSelectedClient(client)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderClientDetails = () => (
    <div className="client-details-view">
      {selectedClient && (
        <>
          <div className="client-details-header">
            <button 
              className="back-btn"
              onClick={() => setSelectedClient(null)}
            >
              ← Back to Clients
            </button>
            <div className="client-title">
              <div className="client-logo-large">{selectedClient.logo}</div>
              <div className="client-info">
                <h2>{selectedClient.companyName}</h2>
                <p>Contact: {selectedClient.contactName} ({selectedClient.email})</p>
              </div>
            </div>
            <div className="client-actions">
              <button className="action-btn secondary">Edit Client</button>
              <button className="action-btn primary">Manage Billing</button>
            </div>
          </div>

          <div className="client-details-grid">
            {/* Client Overview */}
            <div className="detail-card overview">
              <h3>Client Overview</h3>
              <div className="overview-stats">
                <div className="stat-item">
                  <div className="stat-label">Status</div>
                  <span 
                    className="stat-value status"
                    style={{ color: getStatusColor(selectedClient.status) }}
                  >
                    {selectedClient.status}
                  </span>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Plan</div>
                  <div className="stat-value">{selectedClient.subscriptionTier}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Users</div>
                  <div className="stat-value">{selectedClient.users}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Monthly Revenue</div>
                  <div className="stat-value">{formatCurrency(selectedClient.monthlyRevenue)}</div>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="detail-card billing">
              <h3>Billing Information</h3>
              <div className="billing-details">
                <div className="billing-row">
                  <span>Plan:</span>
                  <span>{selectedClient.subscriptionTier}</span>
                </div>
                <div className="billing-row">
                  <span>Monthly Revenue:</span>
                  <span>{formatCurrency(selectedClient.monthlyRevenue)}</span>
                </div>
                <div className="billing-row">
                  <span>Total Revenue:</span>
                  <span>{formatCurrency(selectedClient.totalRevenue)}</span>
                </div>
                <div className="billing-row">
                  <span>Next Billing:</span>
                  <span>Dec 25, 2024</span>
                </div>
              </div>
            </div>

            {/* White-label Setup */}
            <div className="detail-card whitelabel">
              <h3>White-label Configuration</h3>
              <div className="whitelabel-status-detail">
                <div className="status-row">
                  <span>Domain Status:</span>
                  <span 
                    className="status-value"
                    style={{ color: getWhitelabelStatusColor(selectedClient.whitelabelStatus) }}
                  >
                    {selectedClient.whitelabelStatus}
                  </span>
                </div>
                <div className="status-row">
                  <span>Custom Domain:</span>
                  <span>{selectedClient.customDomain}</span>
                </div>
                <div className="status-row">
                  <span>SSL Certificate:</span>
                  <span className="ssl-active">✅ Active</span>
                </div>
                <div className="whitelabel-actions">
                  <button className="config-btn">Configure Branding</button>
                  <button className="domain-btn">Manage Domain</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="enterprise-client-manager">
      {selectedClient ? renderClientDetails() : renderOverview()}

      {/* Add Client Modal */}
      {showClientModal && (
        <div className="modal-overlay">
          <div className="client-modal">
            <div className="modal-header">
              <h3>Add New Client</h3>
              <button className="close-btn" onClick={() => setShowClientModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    value={newClientForm.companyName}
                    onChange={(e) => setNewClientForm({...newClientForm, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    type="text"
                    value={newClientForm.contactName}
                    onChange={(e) => setNewClientForm({...newClientForm, contactName: e.target.value})}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({...newClientForm, email: e.target.value})}
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({...newClientForm, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Subscription Plan *</label>
                  <select
                    value={newClientForm.subscriptionTier}
                    onChange={(e) => setNewClientForm({...newClientForm, subscriptionTier: e.target.value})}
                  >
                    {bundlePlans.filter(p => p.name !== 'Free Starter').map(plan => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} - {formatCurrency(plan.price)}/user
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Users *</label>
                  <input
                    type="number"
                    min="1"
                    value={newClientForm.users}
                    onChange={(e) => setNewClientForm({...newClientForm, users: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Custom Domain (Optional)</label>
                  <input
                    type="text"
                    value={newClientForm.customDomain}
                    onChange={(e) => setNewClientForm({...newClientForm, customDomain: e.target.value})}
                    placeholder="company.mewayz.com"
                  />
                </div>
                <div className="form-group">
                  <label>Trial Days</label>
                  <select
                    value={newClientForm.trialDays}
                    onChange={(e) => setNewClientForm({...newClientForm, trialDays: parseInt(e.target.value)})}
                  >
                    <option value={0}>No Trial - Start Billing Immediately</option>
                    <option value={7}>7 Days Trial</option>
                    <option value={14}>14 Days Trial</option>
                    <option value={30}>30 Days Trial</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowClientModal(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleAddClient}>
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseClientManager;