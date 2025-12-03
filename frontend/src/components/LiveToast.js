// frontend/src/components/LiveToast.js
import React from 'react';

export default function LiveToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      position:'fixed', right:20, bottom:20, zIndex:1000, maxWidth:320
    }}>
      <div style={{
        background:'#0f1724', color:'white', padding:12, borderRadius:10, boxShadow:'0 8px 30px rgba(2,6,23,0.2)'
      }}>
        <div style={{fontWeight:700}}>{message.title}</div>
        <div style={{fontSize:13, color:'#e6eefb', marginTop:6}}>{message.body}</div>
        <div style={{textAlign:'right', marginTop:8}}>
          <button onClick={onClose} style={{background:'transparent', border:'none', color:'#9fbef6', cursor:'pointer'}}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
