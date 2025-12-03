import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const NavLink = ({ to, children, mobile = false }) => (
    <Link
      to={to}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={`
        nav-link ${isActiveRoute(to) ? 'nav-link-active' : ''}
        ${mobile ? 'nav-link-mobile' : ''}
      `}
    >
      {children}
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div 
          className="navbar-brand"
          onClick={() => navigate('/')}
        >
          <div className="navbar-logo">
            <span className="logo-icon">🍔</span>
          </div>
          <div className="navbar-brand-text">
            <h1 className="brand-title">FoodExpress</h1>
            <p className="brand-subtitle">Delicious Delivered</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <NavLink to="/">Restaurants</NavLink>
          {user && user.role !== 'MEMBER' && (
            <NavLink to="/checkout">Orders</NavLink>
          )}
          {user && user.role === 'ADMIN' && (
            <NavLink to="/admin/payments">Payments</NavLink>
          )}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </div>
                <div className="user-details">
                  <p className="user-name">{user.displayName}</p>
                  <p className="user-role">{user.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <NavLink to="/" mobile={true}>Restaurants</NavLink>
            {user && user.role !== 'MEMBER' && (
              <NavLink to="/checkout" mobile={true}>Orders</NavLink>
            )}
            {user && user.role === 'ADMIN' && (
              <NavLink to="/admin/payments" mobile={true}>Payments</NavLink>
            )}
            {user ? (
              <div className="mobile-user-section">
                <div className="user-info mobile">
                  <div className="user-avatar">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                  <div className="user-details">
                    <p className="user-name">{user.displayName}</p>
                    <p className="user-role">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" mobile={true}>Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}