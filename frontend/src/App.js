// frontend/src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantPage from './pages/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';

function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{padding:20}}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><RestaurantsPage /></RequireAuth>} />
        <Route path="/restaurants/:id" element={<RequireAuth><RestaurantPage /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/admin/payments" element={<RequireAuth><AdminPaymentsPage /></RequireAuth>} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
