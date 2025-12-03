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

  const getPaymentIcon = (paymentType) => {
    return paymentType === 'CARD' ? '💳' : '📱';
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="status-badge active">Active</span>
    ) : (
      <span className="status-badge inactive">Inactive</span>
    );
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
        {/* Header */}
        <div className="payments-header">
          <div className="header-content">
            <h1 className="payments-title">Payment Methods</h1>
            <p className="payments-subtitle">
              Manage payment methods available in the system
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{list.length}</div>
              <div className="stat-label">Total Methods</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {list.filter(p => p.isActive).length}
              </div>
              <div className="stat-label">Active</div>
            </div>
          </div>
        </div>

        {/* Add Payment Method Card */}
        <div className="add-payment-card card">
          <h3 className="card-title">Add New Payment Method</h3>
          <div className="payment-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Provider</label>
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
                  onChange={e => setLast4(e.target.value)}
                  className="input-modern"
                  maxLength="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select 
                  value={type} 
                  onChange={e => setType(e.target.value)}
                  className="payment-type-select"
                >
                  <option value="CARD">💳 Credit/Debit Card</option>
                  <option value="UPI">📱 UPI Payment</option>
                </select>
              </div>
            </div>
            <button 
              onClick={add} 
              disabled={adding}
              className="btn btn-primary add-btn"
            >
              {adding ? (
                <>
                  <div className="loading-spinner small"></div>
                  Adding...
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

        {/* Payment Methods List */}
        <div className="payments-list-section">
          <div className="section-header">
            <h2>Available Payment Methods</h2>
            <div className="section-actions">
              <button onClick={load} className="btn btn-secondary refresh-btn">
                🔄 Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-payments">
              <div className="loading-spinner"></div>
              <p>Loading payment methods...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="no-payments">
              <div className="no-payments-icon">💳</div>
              <h3>No payment methods</h3>
              <p>Get started by adding your first payment method above.</p>
            </div>
          ) : (
            <div className="payments-grid">
              {list.map((payment, index) => (
                <div 
                  key={payment._id} 
                  className="payment-card card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="payment-card-header">
                    <div className="payment-icon">
                      {getPaymentIcon(payment.type)}
                    </div>
                    <div className="payment-info">
                      <h4 className="payment-provider">{payment.provider}</h4>
                      <p className="payment-details">
                        {payment.type} •••• {payment.last4}
                      </p>
                    </div>
                    {getStatusBadge(payment.isActive)}
                  </div>

                  <div className="payment-card-footer">
                    <div className="payment-actions">
                      <button className="btn btn-outline small">
                        Edit
                      </button>
                      <button 
                        className={`btn small ${payment.isActive ? 'btn-warning' : 'btn-success'}`}
                      >
                        {payment.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <div className="payment-meta">
                      <span className="meta-item">
                        Added {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Payment Info */}
        <div className="system-info card">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h4>Payment System Information</h4>
            <p>
              All payment methods are securely stored and processed. 
              Active payment methods will be available to managers during checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}