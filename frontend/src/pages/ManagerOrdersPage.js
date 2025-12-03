// frontend/src/pages/ManagerOrdersPage.js
import React, { useEffect, useState, useContext } from 'react';
import { apiFetch } from '../api/api';
import { SocketContext } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';

export default function ManagerOrdersPage(){
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [orders, setOrders] = useState([]);

  useEffect(()=> {
    // load recent orders (server doesn't have dedicated endpoint; use /orders? for extension if needed)
    // We'll fetch recent orders for user's country by querying restaurants then orders (simple approach)
    async function loadInitial(){
      try {
        // naive: get restaurants for user's country then fetch their orders
        if (!user?.country?.id) return;
        const res = await apiFetch(`/restaurants?country=${user.country.code}`, { method:'GET' });
        const restaurantIds = res.map(r=>r._id);
        // fetch orders by scanning all (you might add an endpoint to query by country); for demo do many requests (but this can be optimized)
        const allOrders = [];
        for (const rid of restaurantIds) {
          // This assumes there's an endpoint to get orders by restaurant; if not, backend change needed.
          // For now, we will fetch all orders and filter by restaurant (requires /api/orders GET endpoint).
          // If not available, skip initial fetch.
        }
        setOrders([]); // start empty; real-time will populate
      } catch (err) {
        console.error(err);
      }
    }
    loadInitial();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    function onCreated(order) {
      // country room ensures only relevant orders arrive
      setOrders(prev => [order, ...prev]);
    }
    function onUpdated(order) {
      setOrders(prev => prev.map(o => o._id === order._id ? order : o));
    }
    function onCancelled(order) {
      setOrders(prev => prev.map(o => o._id === order._id ? order : o));
    }
    socket.on('order:created', onCreated);
    socket.on('order:updated', onUpdated);
    socket.on('order:cancelled', onCancelled);
    return () => {
      socket.off('order:created', onCreated);
      socket.off('order:updated', onUpdated);
      socket.off('order:cancelled', onCancelled);
    };
  }, [socket]);

  return (
    <div className="container">
      <h2 style={{fontWeight:800}}>Live Orders (Managers)</h2>
      <div style={{marginTop:12}}>
        {orders.length===0 && <div className="small-muted">No live orders yet</div>}
        <ul style={{marginTop:12, display:'grid', gap:10}}>
          {orders.map(o => (
            <li key={o._id} className="card" style={{padding:12}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                  <div style={{fontWeight:700}}>{o.restaurant?.name}</div>
                  <div className="small-muted">Order {o._id} • {o.items.length} items</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:800}}>₹{(o.totalCents/100).toFixed(2)}</div>
                  <div className="small-muted">{o.status}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
    