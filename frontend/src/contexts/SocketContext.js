// frontend/src/contexts/SocketContext.js
import React, { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('socket connected', socket.id);
    });
    socket.on('connect_error', (err) => {
      console.warn('socket connect_error', err.message);
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}
