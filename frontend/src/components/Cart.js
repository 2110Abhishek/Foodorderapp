import React, { useState } from 'react';

export default function Cart({ cart, setCart, onCheckout }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + change;
    
    if (newQuantity <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = newQuantity;
    }
    
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h3 className="cart-empty-title">Your cart is empty</h3>
        <p className="cart-empty-text">Add some delicious items to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      {/* Header */}
      <div 
        className="cart-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cart-header-content">
          <div className="cart-icon-count">
            <div className="cart-count-badge">{itemCount}</div>
            <div className="cart-title-group">
              <h3 className="cart-title">Your Order</h3>
              <p className="cart-subtitle">{cart.length} items</p>
            </div>
          </div>
          <div className="cart-total-group">
            <div className="cart-total">₹{(total / 100).toFixed(2)}</div>
            <div className="cart-expand">
              {isExpanded ? 'Collapse' : 'Expand'}
              <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      {isExpanded && (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-header">
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">₹{(item.unitPriceCents / 100).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="cart-item-remove"
                  >
                    ×
                  </button>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    ₹{((item.quantity * item.unitPriceCents) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{(total / 100).toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span className="text-success">Free</span>
            </div>
            <div className="summary-line text-sm">
              <span>Taxes</span>
              <span>Included</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">₹{(total / 100).toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              className="btn btn-primary checkout-btn"
            >
              Proceed to Checkout
            </button>
            
            <p className="checkout-note">
              Free delivery • 30-min guarantee
            </p>
          </div>
        </div>
      )}
    </div>
  );
}