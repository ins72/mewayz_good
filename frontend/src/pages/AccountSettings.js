import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AccountSettings.css';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'Creative Studios',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    avatar: null
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expMonth: 12,
      expYear: 2026,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      last4: '0005',
      brand: 'mastercard',
      expMonth: 8,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const [subscription, setSubscription] = useState({
    bundles: ['creator', 'ecommerce'],
    status: 'active',
    nextBilling: '2025-08-25',
    amount: 34.40,
    interval: 'monthly'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'subscription', name: 'Subscription', icon: '📦' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Mock API call
    console.log('Profile updated:', user);
  };

  const addPaymentMethod = () => {
    // Mock adding payment method
    const newMethod = {
      id: Date.now(),
      type: 'card',
      last4: '1234',
      brand: 'visa',
      expMonth: 12,
      expYear: 2027,
      isDefault: false
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  return (
    <div className="account-settings">
      {/* Navigation */}
      <nav className="settings-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      <div className="settings-container">
        <div className="settings-sidebar">
          <h2>Account Settings</h2>
          <div className="tabs-list">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h3>Profile Information</h3>
              <p>Update your account profile and personal details.</p>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      value={user.company}
                      onChange={(e) => setUser({...user, company: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={user.phone}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={user.timezone}
                    onChange={(e) => setUser({...user, timezone: e.target.value})}
                    className="form-input"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">GMT</option>
                  </select>
                </div>

                <button type="submit" className="primary-btn">
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="tab-content">
              <h3>Payment Methods</h3>
              <p>Manage your payment methods and billing information.</p>

              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div key={method.id} className={`payment-card ${method.isDefault ? 'default' : ''}`}>
                    <div className="card-info">
                      <div className="card-brand">
                        <span className="card-icon">💳</span>
                        <span className="brand-name">{method.brand.toUpperCase()}</span>
                        {method.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <div className="card-number">•••• •••• •••• {method.last4}</div>
                      <div className="card-expiry">Expires {method.expMonth}/{method.expYear}</div>
                    </div>
                    <div className="card-actions">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="secondary-btn"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => removePaymentMethod(method.id)}
                        className="danger-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addPaymentMethod} className="primary-btn">
                + Add Payment Method
              </button>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="tab-content">
              <h3>Subscription Details</h3>
              <p>Manage your bundles and subscription preferences.</p>

              <div className="subscription-info">
                <div className="subscription-card">
                  <div className="subscription-header">
                    <h4>Current Plan</h4>
                    <div className={`status-badge ${subscription.status}`}>
                      {subscription.status}
                    </div>
                  </div>
                  
                  <div className="subscription-details">
                    <div className="detail-item">
                      <strong>Bundles:</strong>
                      <div className="bundles-list">
                        {subscription.bundles.map(bundle => (
                          <span key={bundle} className="bundle-tag">
                            {bundle.charAt(0).toUpperCase() + bundle.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <strong>Next Billing:</strong>
                      <span>{new Date(subscription.nextBilling).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="detail-item">
                      <strong>Amount:</strong>
                      <span>${subscription.amount}/{subscription.interval}</span>
                    </div>
                  </div>

                  <div className="subscription-actions">
                    <Link to="/pricing" className="primary-btn">
                      Change Plan
                    </Link>
                    <button className="secondary-btn">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <h3>Security Settings</h3>
              <p>Manage your password and security preferences.</p>

              <div className="security-section">
                <h4>Change Password</h4>
                <form className="password-form">
                  <div className="form-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input
                      type="password"
                      id="current-password"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      type="password"
                      id="new-password"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="form-input"
                    />
                  </div>
                  <button type="submit" className="primary-btn">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="security-section">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account.</p>
                <button className="primary-btn">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <h3>Notification Preferences</h3>
              <p>Choose what notifications you'd like to receive.</p>

              <div className="notifications-section">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your account and billing</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Marketing Emails</h4>
                    <p>Get tips, feature updates, and special offers</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Security Alerts</h4>
                    <p>Important security notifications about your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked disabled />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;