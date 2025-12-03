import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const demoAccounts = [
  { 
    email: 'admin@foodapp.com', 
    password: 'adminpass', 
    role: 'Admin',
    description: 'Full system access',
    color: 'var(--primary)'
  },
  { 
    email: 'manager@in.com', 
    password: 'managerpass', 
    role: 'Manager',
    description: 'Restaurant management',
    color: 'var(--accent)'
  },
  { 
    email: 'member@us.com', 
    password: 'memberpass', 
    role: 'Member',
    description: 'Browse and view menus',
    color: 'var(--success)'
  },
];

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const nav = useNavigate();

  const handleDemoLogin = async (demoEmail, demoPassword, index) => {
    setActiveDemo(index);
    setEmail(demoEmail);
    setPassword(demoPassword);
    await handleSubmit(demoEmail, demoPassword);
  };

  const handleSubmit = async (submitEmail = email, submitPassword = password) => {
    setLoading(true);
    setError(null);
    
    try {
      await login(submitEmail, submitPassword);
      nav('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
      setActiveDemo(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Background Animation */}
        <div className="login-background">
          <div className="floating-icon">🍕</div>
          <div className="floating-icon">🍔</div>
          <div className="floating-icon">🍣</div>
          <div className="floating-icon">🥗</div>
        </div>

        {/* Login Card */}
        <div className="login-card card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🍔</span>
            </div>
            <div className="login-title-group">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your FoodExpress account</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="login-form">
            {error && (
              <div className="error-message animate-fadeIn">
                <div className="error-icon">⚠️</div>
                <div className="error-text">{error}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary login-btn"
            >
              {loading ? (
                <>
                  <div className="loading-spinner small white"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="demo-section">
            <div className="demo-header">
              <span className="demo-title">Quick Access Demo Accounts</span>
            </div>
            <div className="demo-accounts">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className={`demo-account-card ${activeDemo === index ? 'active' : ''}`}
                  onClick={() => handleDemoLogin(account.email, account.password, index)}
                >
                  <div 
                    className="account-color-bar"
                    style={{ backgroundColor: account.color }}
                  ></div>
                  <div className="account-content">
                    <div className="account-header">
                      <h4 className="account-role">{account.role}</h4>
                      <div className="account-arrow">→</div>
                    </div>
                    <p className="account-email">{account.email}</p>
                    <p className="account-description">{account.description}</p>
                  </div>
                  {activeDemo === index && (
                    <div className="account-loading">
                      <div className="loading-spinner small"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="feature-highlights">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h4>Fast Delivery</h4>
            <p>Get your food delivered in 30 minutes or less</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h4>Premium Quality</h4>
            <p>Only the best restaurants and food items</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h4>Secure Payments</h4>
            <p>Your payment information is always safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}