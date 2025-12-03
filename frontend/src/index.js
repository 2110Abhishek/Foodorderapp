// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
      <App />
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
