import React, { useState, useEffect, useContext } from 'react';
import { apiFetch } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminPaymentsPage() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [type, setType] = useState('CARD');
  const [provider, setProvider] = useState('');
  const [last4, setLast4] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => { 
    load(); 
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch('/payments', { method: 'GET' });
      setList(res);
    } catch (err) {
      alert('Failed to load payment methods: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!provider.trim() || !last4.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setAdding(true);
    try {
      await apiFetch('/payments', { 
        method: 'POST', 
        body: JSON.stringify({ type, provider, last4 }) 
      });
      setType('CARD'); 
      setProvider(''); 
      setLast4('');
      await load();
    } catch (err) {
      alert('Create failed: ' + err.message);
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(paymentId, currentStatus) {
    try {
      // This would be your actual toggle endpoint
      // await apiFetch(`/payments/${paymentId}/toggle`, { method: 'PUT' });
      await load();
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  }

  const getPaymentIcon = (paymentType) => {
    const icons = {
      'CARD': '💳',
      'UPI': '📱',
      'BANK': '🏦',
      'WALLET': '👛'
    };
    return icons[paymentType] || '💳';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <div className="status-badge active">
        <div className="status-dot"></div>
        Active
      </div>
    ) : (
      <div className="status-badge inactive">
        <div className="status-dot"></div>
        Inactive
      </div>
    );
  };

  const getCardType = (provider) => {
    const providers = {
      'Visa': 'visa',
      'Mastercard': 'mastercard',
      'Amex': 'amex',
      'Discover': 'discover',
      'MockBank': 'visa'
    };
    return providers[provider] || 'default';
  };

  const filteredPayments = list.filter(payment => {
    const matchesSearch = payment.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && payment.isActive) ||
                         (filterStatus === 'INACTIVE' && !payment.isActive);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: list.length,
    active: list.filter(p => p.isActive).length,
    inactive: list.filter(p => !p.isActive).length
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-required">
        <div className="admin-required-content">
          <div className="admin-icon">👑</div>
          <h2>Admin Access Required</h2>
          <p>This section is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payments-page">
      <div className="payments-container">
        {/* Header Section */}
        <div className="payments-header">
          <div className="header-content">
            <h1 className="payments-title">Payment Methods</h1>
            <p className="payments-subtitle">
              Manage and configure payment methods for the platform
            </p>
          </div>
          <div className="header-actions">
            <button onClick={load} className="btn btn-secondary refresh-btn">
              <span className="btn-icon">🔄</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Methods</div>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
          <div className="stat-card inactive">
            <div className="stat-icon">⏸️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.inactive}</div>
              <div className="stat-label">Inactive</div>
            </div>
          </div>
        </div>

        {/* Add Payment Method Card */}
        <div className="add-payment-section card">
          <div className="section-header">
            <h3 className="section-title">Add New Payment Method</h3>
            <div className="section-subtitle">
              Configure new payment methods for the platform
            </div>
          </div>
          
          <div className="payment-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Provider Name</label>
                <input 
                  placeholder="e.g., Stripe, PayPal, Bank Name" 
                  value={provider} 
                  onChange={e => setProvider(e.target.value)}
                  className="input-modern"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last 4 Digits</label>
                <input 
                  placeholder="4242" 
                  value={last4} 
                  onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="input-modern"
                  maxLength="4"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-option ${type === 'CARD' ? 'active' : ''}`}
                    onClick={() => setType('CARD')}
                  >
                    <span className="option-icon">💳</span>
                    <span className="option-label">Card</span>
                  </button>
                  <button
                    type="button"
                    className={`type-option ${type === 'UPI' ? 'active' : ''}`}
                    onClick={() => setType('UPI')}
                  >
                    <span className="option-icon">📱</span>
                    <span className="option-label">UPI</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={add} 
              disabled={adding || !provider.trim() || !last4.trim()}
              className="btn btn-primary add-btn"
            >
              {adding ? (
                <>
                  <div className="loading-spinner small white"></div>
                  Adding Payment Method...
                </>
              ) : (
                <>
                  <span className="btn-icon">+</span>
                  Add Payment Method
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search payment methods..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ACTIVE')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setFilterStatus('INACTIVE')}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="payments-list-section">
          <div className="section-header">
            <h3 className="section-title">
              Payment Methods
              <span className="items-count">({filteredPayments.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="loading-payments">
              <div className="loading-spinner large"></div>
              <p>Loading payment methods...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="no-payments card">
              <div className="no-payments-icon">💳</div>
              <h3>No payment methods found</h3>
              <p>
                {searchTerm || filterStatus !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first payment method'
                }
              </p>
            </div>
          ) : (
            <div className="payments-grid">
              {filteredPayments.map((payment, index) => (
                <div 
                  key={payment._id} 
                  className="payment-card card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="payment-card-header">
                    <div className="payment-icon-container">
                      <div className="payment-icon">
                        {getPaymentIcon(payment.type)}
                      </div>
                      <div className="payment-type-badge">
                        {payment.type}
                      </div>
                    </div>
                    
                    {getStatusBadge(payment.isActive)}
                  </div>

                  <div className="payment-card-content">
                    <h4 className="payment-provider">{payment.provider || 'Unknown Provider'}</h4>
                    
                    {payment.type === 'CARD' && (
                      <div className="card-preview">
                        <div className={`card-type ${getCardType(payment.provider)}`}>
                          {getCardType(payment.provider).toUpperCase()}
                        </div>
                        <div className="card-number">
                          <span className="card-masked">•••• •••• ••••</span>
                          <span className="card-last4">{payment.last4}</span>
                        </div>
                      </div>
                    )}
                    
                    {payment.type === 'UPI' && (
                      <div className="upi-preview">
                        <div className="upi-id">
                          {payment.provider} ••••{payment.last4}
                        </div>
                      </div>
                    )}

                    <div className="payment-meta">
                      <div className="meta-item">
                        <span className="meta-label">Added</span>
                        <span className="meta-value">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {payment.user && (
                        <div className="meta-item">
                          <span className="meta-label">User</span>
                          <span className="meta-value">
                            {payment.user.displayName || payment.user.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="payment-card-actions">
                    <button 
                      onClick={() => toggleActive(payment._id, payment.isActive)}
                      className={`btn btn-sm ${payment.isActive ? 'btn-warning' : 'btn-success'}`}
                    >
                      {payment.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-cards">
            <div className="action-card card">
              <div className="action-icon">⚙️</div>
              <h4>Payment Settings</h4>
              <p>Configure global payment settings and preferences</p>
            </div>
            <div className="action-card card">
              <div className="action-icon">📊</div>
              <h4>Analytics</h4>
              <p>View payment analytics and transaction reports</p>
            </div>
            <div className="action-card card">
              <div className="action-icon">🔒</div>
              <h4>Security</h4>
              <p>Manage payment security and compliance settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}