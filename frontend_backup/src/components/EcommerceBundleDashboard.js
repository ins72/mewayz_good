import React, { useState, useEffect } from 'react';
import './EcommerceBundleDashboard.css';

const EcommerceBundleDashboard = () => {
  const [storeMetrics, setStoreMetrics] = useState({
    totalSales: 15420.50,
    totalOrders: 234,
    conversionRate: 3.8,
    avgOrderValue: 65.90,
    activeProducts: 47,
    inventory: 1247
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'ORD-1234',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      items: 3,
      total: 129.99,
      status: 'shipped',
      date: '2024-12-20T10:30:00Z'
    },
    {
      id: 'ORD-1235',
      customer: 'Mike Chen',
      email: 'mike@example.com',
      items: 1,
      total: 49.99,
      status: 'processing',
      date: '2024-12-20T09:15:00Z'
    },
    {
      id: 'ORD-1236',
      customer: 'Emily Davis',
      email: 'emily@example.com',
      items: 2,
      total: 89.99,
      status: 'pending',
      date: '2024-12-20T08:45:00Z'
    }
  ]);

  const [topProducts, setTopProducts] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      sku: 'PWH-001',
      sales: 89,
      revenue: 4450,
      stock: 23,
      image: '🎧'
    },
    {
      id: 2,
      name: 'Organic Coffee Blend',
      sku: 'OCB-002',
      sales: 156,
      revenue: 3900,
      stock: 87,
      image: '☕'
    },
    {
      id: 3,
      name: 'Smart Fitness Tracker',
      sku: 'SFT-003',
      sales: 67,
      revenue: 3350,
      stock: 12,
      image: '⌚'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      shipped: '#10b981',
      processing: '#f59e0b',
      pending: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ecommerce-dashboard">
      {/* Dashboard Header */}
      <div className="ecommerce-header">
        <div className="header-content">
          <h1>E-commerce Dashboard</h1>
          <p>Manage your online store and track performance</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary">
            <span>📦</span>
            Add Product
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            View Reports
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card sales">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(storeMetrics.totalSales)}</div>
            <div className="metric-label">Total Sales</div>
            <div className="metric-change positive">+18.2% this month</div>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <div className="metric-value">{storeMetrics.totalOrders}</div>
            <div className="metric-label">Total Orders</div>
            <div className="metric-change positive">+24 this week</div>
          </div>
        </div>

        <div className="metric-card conversion">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{storeMetrics.conversionRate}%</div>
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-change positive">+0.4% vs last month</div>
          </div>
        </div>

        <div className="metric-card aov">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(storeMetrics.avgOrderValue)}</div>
            <div className="metric-label">Avg Order Value</div>
            <div className="metric-change positive">+$5.20 vs last month</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="ecommerce-grid">
        {/* Recent Orders */}
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All Orders</button>
          </div>
          <div className="orders-table">
            <div className="table-header">
              <div className="col-order">Order ID</div>
              <div className="col-customer">Customer</div>
              <div className="col-items">Items</div>
              <div className="col-total">Total</div>
              <div className="col-status">Status</div>
              <div className="col-date">Date</div>
            </div>
            {recentOrders.map((order) => (
              <div key={order.id} className="table-row">
                <div className="col-order">
                  <span className="order-id">{order.id}</span>
                </div>
                <div className="col-customer">
                  <div className="customer-info">
                    <div className="customer-name">{order.customer}</div>
                    <div className="customer-email">{order.email}</div>
                  </div>
                </div>
                <div className="col-items">{order.items}</div>
                <div className="col-total">{formatCurrency(order.total)}</div>
                <div className="col-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="col-date">{formatDate(order.date)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card top-products">
          <div className="card-header">
            <h3>Top Products</h3>
            <span className="subtitle">By revenue</span>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={product.id} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-icon">{product.image}</div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-sku">SKU: {product.sku}</div>
                  <div className="product-stats">
                    <span className="sales-count">{product.sales} sold</span>
                    <span className="stock-info">
                      {product.stock} in stock
                      {product.stock < 20 && (
                        <span className="low-stock-warning">⚠️</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="product-revenue">
                  <div className="revenue-amount">{formatCurrency(product.revenue)}</div>
                  <div className="revenue-label">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Management */}
        <div className="dashboard-card store-management">
          <div className="card-header">
            <h3>Store Management</h3>
          </div>
          <div className="management-grid">
            <div className="management-item">
              <div className="item-icon">📦</div>
              <div className="item-content">
                <div className="item-title">Products</div>
                <div className="item-count">{storeMetrics.activeProducts}</div>
                <div className="item-action">Manage Catalog</div>
              </div>
            </div>
            <div className="management-item">
              <div className="item-icon">📋</div>
              <div className="item-content">
                <div className="item-title">Inventory</div>
                <div className="item-count">{storeMetrics.inventory}</div>
                <div className="item-action">Update Stock</div>
              </div>
            </div>
            <div className="management-item">
              <div className="item-icon">🚚</div>
              <div className="item-content">
                <div className="item-title">Shipping</div>
                <div className="item-count">3 zones</div>
                <div className="item-action">Configure</div>
              </div>
            </div>
            <div className="management-item">
              <div className="item-icon">💳</div>
              <div className="item-content">
                <div className="item-title">Payment</div>
                <div className="item-count">5 methods</div>
                <div className="item-action">Setup</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon">➕</div>
              <div className="action-label">Add Product</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📋</div>
              <div className="action-label">Process Orders</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Sales Report</div>
            </button>
            <button className="action-card">
              <div className="action-icon">🎨</div>
              <div className="action-label">Customize Store</div>
            </button>
            <button className="action-card">
              <div className="action-icon">📢</div>
              <div className="action-label">Marketing</div>
            </button>
            <button className="action-card">
              <div className="action-icon">⚙️</div>
              <div className="action-label">Settings</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceBundleDashboard;