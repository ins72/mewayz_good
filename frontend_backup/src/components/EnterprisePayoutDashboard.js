import React, { useState, useEffect } from 'react';
import './EnterprisePayoutDashboard.css';

const EnterprisePayoutDashboard = () => {
  const [payoutMetrics, setPayoutMetrics] = useState({
    totalEarnings: 45628.75,
    unpaidBalance: 12458.30,
    pendingRequests: 3,
    lastPayoutDate: '2024-11-30T00:00:00Z',
    lastPayoutAmount: 8950.45,
    nextPayoutEligible: 12458.30
  });

  const [earningsHistory, setEarningsHistory] = useState([
    {
      period: 'December 2024 - Week 3',
      customerRevenue: 15680.00,
      yourShare: 13328.00, // 85%
      mewayzFee: 2352.00, // 15%
      customerCount: 23,
      status: 'confirmed',
      confirmedDate: '2024-12-20T00:00:00Z'
    },
    {
      period: 'December 2024 - Week 2', 
      customerRevenue: 14250.00,
      yourShare: 12112.50,
      mewayzFee: 2137.50,
      customerCount: 21,
      status: 'confirmed',
      confirmedDate: '2024-12-13T00:00:00Z'
    },
    {
      period: 'December 2024 - Week 1',
      customerRevenue: 13890.00,
      yourShare: 11806.50,
      mewayzFee: 2083.50,
      customerCount: 19,
      status: 'confirmed',
      confirmedDate: '2024-12-06T00:00:00Z'
    },
    {
      period: 'November 2024 - Week 4',
      customerRevenue: 12340.00,
      yourShare: 10489.00,
      mewayzFee: 1851.00,
      customerCount: 18,
      status: 'paid',
      confirmedDate: '2024-11-29T00:00:00Z',
      paidDate: '2024-12-15T00:00:00Z',
      paidAmount: 10489.00
    }
  ]);

  const [payoutRequests, setPayoutRequests] = useState([
    {
      id: 'REQ-2024-003',
      requestedAmount: 4125.75,
      requestDate: '2024-12-18T14:30:00Z',
      status: 'pending_review',
      invoiceAttached: true,
      invoiceNumber: 'INV-2024-1218',
      adminNotes: '',
      expectedPayoutDate: '2024-12-30T00:00:00Z'
    },
    {
      id: 'REQ-2024-002',
      requestedAmount: 3890.25,
      requestDate: '2024-12-15T10:15:00Z',
      status: 'approved',
      invoiceAttached: true,
      invoiceNumber: 'INV-2024-1215',
      adminNotes: 'Approved for payout on Dec 30th',
      expectedPayoutDate: '2024-12-30T00:00:00Z'
    },
    {
      id: 'REQ-2024-001',
      requestedAmount: 8950.45,
      requestDate: '2024-11-25T09:00:00Z',
      status: 'paid',
      invoiceAttached: true,
      invoiceNumber: 'INV-2024-1125',
      adminNotes: 'Paid via bank wire transfer',
      expectedPayoutDate: '2024-11-30T00:00:00Z',
      paidDate: '2024-11-30T15:30:00Z',
      transactionId: 'TXN-20241130-8950'
    }
  ]);

  const [currentCustomers, setCurrentCustomers] = useState([
    {
      id: 1,
      customerEmail: 'sarah@designstudio.com',
      bundle: 'Creator Bundle',
      monthlyRevenue: 19.00,
      yourShare: 16.15, // 85%
      joinDate: '2024-10-15T00:00:00Z',
      status: 'active',
      lastPayment: '2024-12-15T00:00:00Z'
    },
    {
      id: 2,
      customerEmail: 'mike@techstore.com',
      bundle: 'E-commerce Bundle',
      monthlyRevenue: 24.00,
      yourShare: 20.40,
      joinDate: '2024-11-02T00:00:00Z',
      status: 'active',
      lastPayment: '2024-12-15T00:00:00Z'
    },
    {
      id: 3,
      customerEmail: 'team@marketingpro.com',
      bundle: 'Business Bundle',
      monthlyRevenue: 39.00,
      yourShare: 33.15,
      joinDate: '2024-09-20T00:00:00Z',
      status: 'active',
      lastPayment: '2024-12-15T00:00:00Z'
    },
    {
      id: 4,
      customerEmail: 'info@localbiz.com',
      bundle: 'Creator Bundle',
      monthlyRevenue: 19.00,
      yourShare: 16.15,
      joinDate: '2024-12-01T00:00:00Z',
      status: 'trial',
      lastPayment: null
    }
  ]);

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    invoiceFile: null,
    invoiceNumber: '',
    notes: ''
  });

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#3b82f6',
      paid: '#10b981',
      pending_review: '#f59e0b',
      approved: '#8b5cf6',
      rejected: '#ef4444',
      active: '#10b981',
      trial: '#f59e0b',
      cancelled: '#ef4444'
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePayoutRequest = () => {
    if (payoutMetrics.unpaidBalance <= 0) {
      alert('No unpaid balance available for payout request.');
      return;
    }
    setShowPayoutModal(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setPayoutForm({ ...payoutForm, invoiceFile: file });
    } else {
      alert('Please upload a PDF or image file for your invoice.');
    }
  };

  const submitPayoutRequest = () => {
    if (!payoutForm.amount || !payoutForm.invoiceFile || !payoutForm.invoiceNumber) {
      alert('Please fill in all required fields and upload your invoice.');
      return;
    }

    const requestAmount = parseFloat(payoutForm.amount);
    if (requestAmount > payoutMetrics.unpaidBalance || requestAmount <= 0) {
      alert(`Invalid amount. Maximum available: ${formatCurrency(payoutMetrics.unpaidBalance)}`);
      return;
    }

    // Simulate API call
    const newRequest = {
      id: `REQ-2024-${String(payoutRequests.length + 1).padStart(3, '0')}`,
      requestedAmount: requestAmount,
      requestDate: new Date().toISOString(),
      status: 'pending_review',
      invoiceAttached: true,
      invoiceNumber: payoutForm.invoiceNumber,
      adminNotes: '',
      expectedPayoutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    };

    setPayoutRequests([newRequest, ...payoutRequests]);
    setPayoutMetrics({
      ...payoutMetrics,
      pendingRequests: payoutMetrics.pendingRequests + 1
    });

    setShowPayoutModal(false);
    setPayoutForm({ amount: '', invoiceFile: null, invoiceNumber: '', notes: '' });
    
    alert('Payout request submitted successfully! You will be notified once it\'s reviewed.');
  };

  return (
    <div className="enterprise-payout-dashboard">
      {/* Header */}
      <div className="payout-header">
        <div className="header-content">
          <h1>Enterprise Partner Payouts</h1>
          <p>Track your earnings, request payouts, and manage customer revenue share</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn primary"
            onClick={handlePayoutRequest}
            disabled={payoutMetrics.unpaidBalance <= 0}
          >
            <span>💰</span>
            Request Payout
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="payout-metrics-grid">
        <div className="metric-card total-earnings">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(payoutMetrics.totalEarnings)}</div>
            <div className="metric-label">Total Lifetime Earnings</div>
            <div className="metric-change">Your 85% revenue share</div>
          </div>
        </div>

        <div className="metric-card unpaid-balance">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(payoutMetrics.unpaidBalance)}</div>
            <div className="metric-label">Unpaid Balance</div>
            <div className="metric-change">Available for payout request</div>
          </div>
        </div>

        <div className="metric-card pending-requests">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <div className="metric-value">{payoutMetrics.pendingRequests}</div>
            <div className="metric-label">Pending Requests</div>
            <div className="metric-change">Awaiting admin review</div>
          </div>
        </div>

        <div className="metric-card last-payout">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(payoutMetrics.lastPayoutAmount)}</div>
            <div className="metric-label">Last Payout</div>
            <div className="metric-change">{formatDate(payoutMetrics.lastPayoutDate)}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="payout-grid">
        {/* Earnings History */}
        <div className="dashboard-card earnings-history">
          <div className="card-header">
            <h3>Earnings History</h3>
            <span className="subtitle">Weekly revenue breakdown</span>
          </div>
          <div className="earnings-table">
            <div className="table-header">
              <div className="col">Period</div>
              <div className="col">Customer Revenue</div>
              <div className="col">Your Share (85%)</div>
              <div className="col">MEWAYZ Fee (15%)</div>
              <div className="col">Customers</div>
              <div className="col">Status</div>
            </div>
            {earningsHistory.map((earning, index) => (
              <div key={index} className="table-row">
                <div className="col">
                  <div className="period-info">
                    <div className="period-name">{earning.period}</div>
                    <div className="confirmed-date">Confirmed: {formatDate(earning.confirmedDate)}</div>
                  </div>
                </div>
                <div className="col">
                  <div className="revenue-amount">{formatCurrency(earning.customerRevenue)}</div>
                </div>
                <div className="col">
                  <div className="share-amount">{formatCurrency(earning.yourShare)}</div>
                </div>
                <div className="col">
                  <div className="fee-amount">{formatCurrency(earning.mewayzFee)}</div>
                </div>
                <div className="col">
                  <div className="customer-count">{earning.customerCount}</div>
                </div>
                <div className="col">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(earning.status) }}
                  >
                    {earning.status}
                  </span>
                  {earning.status === 'paid' && (
                    <div className="paid-info">Paid: {formatDate(earning.paidDate)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Requests */}
        <div className="dashboard-card payout-requests">
          <div className="card-header">
            <h3>Payout Requests</h3>
            <button className="view-all-btn">View All Requests</button>
          </div>
          <div className="requests-list">
            {payoutRequests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-header">
                  <div className="request-id">{request.id}</div>
                  <div className="request-amount">{formatCurrency(request.requestedAmount)}</div>
                </div>
                <div className="request-details">
                  <div className="detail-row">
                    <span className="detail-label">Requested:</span>
                    <span className="detail-value">{formatDateTime(request.requestDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Invoice:</span>
                    <span className="detail-value">
                      {request.invoiceNumber}
                      {request.invoiceAttached && <span className="attached-icon">📎</span>}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  {request.adminNotes && (
                    <div className="admin-notes">
                      <strong>Admin Notes:</strong> {request.adminNotes}
                    </div>
                  )}
                  {request.status === 'paid' && request.transactionId && (
                    <div className="transaction-info">
                      <strong>Transaction ID:</strong> {request.transactionId}
                      <br />
                      <strong>Paid:</strong> {formatDateTime(request.paidDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Customers */}
        <div className="dashboard-card current-customers">
          <div className="card-header">
            <h3>Current Customers</h3>
            <span className="subtitle">{currentCustomers.length} active customers</span>
          </div>
          <div className="customers-list">
            {currentCustomers.map((customer) => (
              <div key={customer.id} className="customer-item">
                <div className="customer-info">
                  <div className="customer-email">{customer.customerEmail}</div>
                  <div className="customer-details">
                    <span className="bundle-name">{customer.bundle}</span>
                    <span className="join-date">Joined: {formatDate(customer.joinDate)}</span>
                  </div>
                </div>
                <div className="customer-revenue">
                  <div className="monthly-revenue">
                    <div className="revenue-label">Monthly Revenue</div>
                    <div className="revenue-amount">{formatCurrency(customer.monthlyRevenue)}</div>
                  </div>
                  <div className="your-share">
                    <div className="share-label">Your Share</div>
                    <div className="share-amount">{formatCurrency(customer.yourShare)}</div>
                  </div>
                </div>
                <div className="customer-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(customer.status) }}
                  >
                    {customer.status}
                  </span>
                  {customer.lastPayment && (
                    <div className="last-payment">Last: {formatDate(customer.lastPayment)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="modal-overlay">
          <div className="payout-modal">
            <div className="modal-header">
              <h3>Request Payout</h3>
              <button className="close-btn" onClick={() => setShowPayoutModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="available-balance">
                <strong>Available Balance: {formatCurrency(payoutMetrics.unpaidBalance)}</strong>
              </div>
              
              <div className="form-group">
                <label>Payout Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  max={payoutMetrics.unpaidBalance}
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  placeholder="Enter amount to request"
                />
              </div>

              <div className="form-group">
                <label>Invoice Number *</label>
                <input
                  type="text"
                  value={payoutForm.invoiceNumber}
                  onChange={(e) => setPayoutForm({ ...payoutForm, invoiceNumber: e.target.value })}
                  placeholder="e.g., INV-2024-1220"
                />
              </div>

              <div className="form-group">
                <label>Upload Invoice * (PDF or Image)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                />
                {payoutForm.invoiceFile && (
                  <div className="file-info">
                    Selected: {payoutForm.invoiceFile.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={payoutForm.notes}
                  onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                  placeholder="Any additional information for admin review"
                  rows={3}
                />
              </div>

              <div className="payout-info">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>Invoice is required for tax purposes</li>
                  <li>Payouts are processed at the end of each month</li>
                  <li>Payments are sent via bank wire transfer</li>
                  <li>Admin review typically takes 3-5 business days</li>
                </ul>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowPayoutModal(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={submitPayoutRequest}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterprisePayoutDashboard;