import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/api';
import Cart from '../components/Cart';
import { AuthContext } from '../contexts/AuthContext';
import MenuFilters from '../components/MenuFilters';
import { SocketContext } from '../contexts/SocketContext';
import LiveToast from '../components/LiveToast';

// Stars rating component
function Stars({ value }) {
  const v = Math.round((value || 0) * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (v >= i) stars.push(<span key={i} className="star">★</span>);
    else if (v >= i - 0.5) stars.push(<span key={i} className="star">☆</span>);
    else stars.push(<span key={i} className="star empty">★</span>);
  }
  return <div className="stars">{stars}</div>;
}

// Restaurant-specific food images database
const RESTAURANT_FOOD_IMAGES = {
  // Bombay Bites - Indian Restaurant
  'Bombay Bites': {
    'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    'Smokey Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    'Spring Rolls': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
    'Crispy Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
    'Garlic Naan': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop',
    'Mango Lassi': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&h=600&fit=crop',
    'Palak Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
    'Tandoori Chicken': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    'Masala Dosa': 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=800&h=600&fit=crop',
    'Chole Bhature': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    'Gulab Jamun': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop'
  },
  // Delhi Durbar - North Indian
  'Delhi Durbar': {
    'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    'Chicken Tikka': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    'Rogan Josh': 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=800&h=600&fit=crop',
    'Naan Bread': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop',
    'Pani Puri': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    'Kheer': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
    'Vegetable Korma': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
    'Lamb Curry': 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&h=600&fit=crop'
  },
  // NYC Pizza Co - American/Italian
  'NYC Pizza Co': {
    'Pepperoni Pizza': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop',
    'Margherita Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'BBQ Chicken Pizza': 'https://images.unsplash.com/photo-1559182184-4b7a4a9dae2b?w=800&h=600&fit=crop',
    'Garlic Bread': 'https://images.unsplash.com/photo-1573140400713-c5b6e27cb89c?w=800&h=600&fit=crop',
    'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
    'Pasta Alfredo': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
    'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
    'Chocolate Brownie': 'https://images.unsplash.com/photo-1579500965798-8d1592a5d6e2?w=800&h=600&fit=crop'
  },
  // Texas BBQ Hut - American
  'Texas BBQ Hut': {
    'BBQ Ribs': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    'Smoked Brisket': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop',
    'Grilled Chicken': 'https://images.unsplash.com/photo-1606509036990-8d4c78692b16?w=800&h=600&fit=crop',
    'Corn Bread': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
    'Coleslaw': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
    'Mac & Cheese': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop',
    'Apple Pie': 'https://images.unsplash.com/photo-1562007908-17c67e878c0c?w=800&h=600&fit=crop',
    'Sweet Tea': 'https://images.unsplash.com/photo-1597481499753-6e0c3c5d7b2c?w=800&h=600&fit=crop'
  },
  // Chennai Chettinad - South Indian
  'Chennai Chettinad': {
    'Masala Dosa': 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=800&h=600&fit=crop',
    'Idli Sambhar': 'https://images.unsplash.com/photo-1631163190830-8770a0ad11f8?w=800&h=600&fit=crop',
    'Vada': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
    'Sambar Rice': 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&h=600&fit=crop',
    'Rasam': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
    'Filter Coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    'Payasam': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
    'Chicken Curry': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop'
  },
  // LA Burger Club - American
  'LA Burger Club': {
    'Classic Cheeseburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    'Bacon Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
    'Veggie Burger': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
    'French Fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=600&fit=crop',
    'Onion Rings': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
    'Chocolate Milkshake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop',
    'Chicken Wings': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&h=600&fit=crop',
    'Nachos': 'https://images.unsplash.com/photo-1611690826743-d0c8b0ad3715?w=800&h=600&fit=crop'
  },
  // Default fallback images for unknown restaurants
  'default': {
    'Indian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'American': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop',
    'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'Chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
    'Mexican': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
    'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    'general': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'
  }
};

// Helper function to get specific food image
const getFoodImage = (restaurantName, foodName, cuisine) => {
  // Try to get restaurant-specific image
  if (RESTAURANT_FOOD_IMAGES[restaurantName] && RESTAURANT_FOOD_IMAGES[restaurantName][foodName]) {
    return RESTAURANT_FOOD_IMAGES[restaurantName][foodName];
  }
  
  // Try to get from default images
  if (RESTAURANT_FOOD_IMAGES['default'][cuisine]) {
    return RESTAURANT_FOOD_IMAGES['default'][cuisine];
  }
  
  // Fallback to general image
  return RESTAURANT_FOOD_IMAGES['default']['general'];
};

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const { socket } = useContext(SocketContext);
  const [liveMsg, setLiveMsg] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Filters state
  const [filters, setFilters] = useState({
    cuisine: '',
    category: '',
    tag: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    q: '',
    sort: 'newest',
    page: 1,
    limit: 12,
    available: true
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fp = {};
    for (const key of ['cuisine','category','tag','minPrice','maxPrice','minRating','q','sort','page','limit','available']) {
      const v = searchParams.get(key);
      if (v !== null) fp[key] = v;
    }
    setFilters(f => ({ ...f, ...fp }));
  }, []);

  useEffect(() => { 
    load(); 
  }, [id, filters.page, filters.limit, filters.sort, filters.cuisine, filters.category, filters.tag, filters.minPrice, filters.maxPrice, filters.minRating, filters.q, filters.available]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && typeof v !== 'undefined') qs.set(k, v);
      });
      const url = `/restaurants/${id}/menu?${qs.toString()}`;
      const res = await apiFetch(url, { method: 'GET' });
      setRestaurant(res.restaurant);
      
      // Enhance menu items with proper images
      const enhancedMenu = Array.isArray(res.menu) ? res.menu.map(item => ({
        ...item,
        image: item.image || getFoodImage(res.restaurant?.name, item.name, item.cuisine)
      })) : [];
      
      setMenu(enhancedMenu);
      setSearchParams(Object.fromEntries(qs.entries()));
    } catch (err) { 
      console.error('Failed to load menu:', err); 
      alert('Failed to load menu: ' + (err.message || err)); 
      setMenu([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!socket) return;
    
    if (restaurant && restaurant._id) {
      socket.emit('join_restaurant', restaurant._id);
    }

    const onCreated = (payload) => {
      if (payload && payload.restaurant && payload.restaurant._id === (restaurant && restaurant._id)) {
        setLiveMsg({ 
          title: '🎉 New Order!', 
          body: `Order #${payload._id?.slice(-6)} placed — ₹${(payload.totalCents/100).toFixed(2)}` 
        });
      }
    };

    const onUpdated = (payload) => {
      if (!payload) return;
      setLiveMsg({ 
        title: '🔄 Order Updated', 
        body: `Order #${payload._id?.slice(-6)} — status: ${payload.status}` 
      });
    };

    const onCancelled = (payload) => {
      if (!payload) return;
      setLiveMsg({ 
        title: '❌ Order Cancelled', 
        body: `Order #${payload._id?.slice(-6)} was cancelled` 
      });
    };

    socket.on('order:created', onCreated);
    socket.on('order:updated', onUpdated);
    socket.on('order:cancelled', onCancelled);

    return () => {
      if (restaurant && restaurant._id) socket.emit('leave_restaurant', restaurant._id);
      socket.off('order:created', onCreated);
      socket.off('order:updated', onUpdated);
      socket.off('order:cancelled', onCancelled);
    };
  }, [socket, restaurant]);

  function addToCart(item) {
    const existing = cart.find(c => c.menuItemId === item._id);
    if (existing) {
      setCart(cart.map(c => c.menuItemId === item._id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, { 
        menuItemId: item._id, 
        name: item.name, 
        quantity: 1, 
        unitPriceCents: item.priceCents,
        image: item.image 
      }]);
    }
    
    setLiveMsg({
      title: '🛒 Added to Cart!',
      body: `${item.name} has been added to your cart`
    });
  }

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  async function handleDirectCheckout() {
    if (!user) { 
      alert('Please login first'); 
      nav('/login');
      return; 
    }
    if (user.role === 'MEMBER') { 
      alert('Members cannot checkout. Only Admin and Manager can checkout.'); 
      return; 
    }
    if (!restaurant) { 
      alert('No restaurant loaded'); 
      return; 
    }
    if (cart.length === 0) { 
      alert('Cart is empty'); 
      return; 
    }

    try {
      const payload = {
        restaurantId: restaurant._id,
        items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity }))
      };
      const order = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });

      if (!order || !order._id) {
        alert('Order creation failed: invalid response from server.');
        return;
      }

      await apiFetch(`/orders/${order._id}/checkout`, { method: 'POST', body: JSON.stringify({}) });

      setLiveMsg({
        title: '✅ Order Placed!',
        body: 'Your order has been placed successfully!'
      });
      
      setTimeout(() => {
        setCart([]);
        nav('/');
      }, 2000);
      
    } catch (err) {
      console.error('Checkout error', err);
      alert('Checkout failed: ' + (err.message || 'Unknown error'));
    }
  }

  async function handleQuickBuy(item) {
    if (!user || user.role === 'MEMBER') {
      alert('Only Admin and Manager can place orders directly.');
      return;
    }

    try {
      const order = await apiFetch('/orders', { 
        method: 'POST', 
        body: JSON.stringify({ 
          restaurantId: restaurant._id, 
          items: [{ menuItemId: item._id, quantity: 1 }] 
        }) 
      });
      
      await apiFetch(`/orders/${order._id}/checkout`, { method: 'POST', body: JSON.stringify({}) });
      
      setLiveMsg({
        title: '✅ Quick Order!',
        body: `${item.name} ordered successfully!`
      });
      
    } catch (e) { 
      console.error('QuickBuy error', e);
      alert('Action failed: ' + (e.message || e)); 
    }
  }

  function handleAddToCartAndNotify(item) {
    addToCart(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function changeFilter(key, value) {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  }

  function clearFilters() {
    setFilters({
      cuisine: '',
      category: '',
      tag: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      q: '',
      sort: 'newest',
      page: 1,
      limit: 12,
      available: true
    });
  }

  // Cuisine color mapping
  const cuisineColors = {
    'Indian': { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
    'American': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
    'Italian': { bg: '#FCE7F3', text: '#831843', border: '#F472B6' },
    'Chinese': { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
    'Japanese': { bg: '#F3E8FF', text: '#5B21B6', border: '#A78BFA' },
    'Mexican': { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
    'Mediterranean': { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
    'Fusion': { bg: '#E0E7FF', text: '#3730A3', border: '#818CF8' }
  };

  const getCuisineColor = (cuisine) => {
    return cuisineColors[cuisine] || { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Main': '🍽️',
      'Starter': '🥗',
      'Dessert': '🍰',
      'Drink': '🥤',
      'Street': '🌮',
      'Snack': '🍿',
      'Salad': '🥙',
      'Soup': '🍲'
    };
    return icons[category] || '🍴';
  };

  // Sort menu items
  const sortedMenu = [...menu].sort((a, b) => {
    switch (filters.sort) {
      case 'price_asc': return a.priceCents - b.priceCents;
      case 'price_desc': return b.priceCents - a.priceCents;
      case 'rating_desc': return (b.rating || 0) - (a.rating || 0);
      case 'rating_asc': return (a.rating || 0) - (b.rating || 0);
      default: return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Get restaurant image based on name
  const getRestaurantImage = (restaurantName) => {
    const restaurantImages = {
      'Bombay Bites': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop',
      'Delhi Durbar': 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&h=600&fit=crop',
      'NYC Pizza Co': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=600&fit=crop',
      'Texas BBQ Hut': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=1600&h=600&fit=crop',
      'Chennai Chettinad': 'https://images.unsplash.com/photo-1559749284-2c6c5dd67b22?w=1600&h=600&fit=crop',
      'LA Burger Club': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=1600&h=600&fit=crop'
    };
    return restaurantImages[restaurantName] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop';
  };

  return (
    <div className="restaurant-page">
      <LiveToast message={liveMsg} onClose={() => setLiveMsg(null)} />
      
      {/* Restaurant Header Banner */}
      <div 
        className="restaurant-header-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getRestaurantImage(restaurant?.name)})`
        }}
      >
        <div className="restaurant-header-content">
          <button
            onClick={() => nav('/')}
            className="back-button"
          >
            ← Back to Restaurants
          </button>
          
          <h1 className="restaurant-title">{restaurant?.name || 'Loading...'}</h1>
          
          <div className="restaurant-meta">
            <div className="restaurant-info">
              <span className="restaurant-address">📍 {restaurant?.address}</span>
              {restaurant?.country?.code && (
                <span className="restaurant-country">
                  <span className="country-flag">
                    {restaurant.country.code === 'IN' ? '🇮🇳' : '🇺🇸'}
                  </span>
                  {restaurant.country.code}
                </span>
              )}
            </div>
            
            <div className="restaurant-rating">
              <span className="rating-stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-value">{restaurant?.rating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="restaurant-layout">
        {/* Main Content */}
        <div className="restaurant-main">
          {/* Filters Section */}
          <div className="filters-section card">
            <h2 className="section-title">Filter Menu Items</h2>
            <MenuFilters filters={filters} onChange={changeFilter} onClear={clearFilters} />
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading delicious items...</p>
            </div>
          ) : sortedMenu.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">🍽️</div>
              <h3>No menu items found</h3>
              <p>Try adjusting your filters or check back later.</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="menu-header">
                <h2 className="menu-title">
                  {restaurant?.name}'s Menu 
                  <span className="menu-count">({sortedMenu.length} items)</span>
                </h2>
                <div className="sort-controls">
                  <span>Sort by:</span>
                  <select 
                    value={filters.sort} 
                    onChange={e => changeFilter('sort', e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Rating: High to Low</option>
                    <option value="rating_asc">Rating: Low to High</option>
                  </select>
                </div>
              </div>

              <div className="menu-grid">
                {sortedMenu.map((item) => {
                  const cuisineColor = getCuisineColor(item.cuisine);
                  const categoryIcon = getCategoryIcon(item.category);
                  const imageUrl = imageErrors[item._id] ? 
                    getFoodImage(restaurant?.name, item.name, item.cuisine) : 
                    (item.image || getFoodImage(restaurant?.name, item.name, item.cuisine));

                  return (
                    <div key={item._id} className="menu-item card">
                      {/* Food Image Section */}
                      <div className="food-image-section">
                        <div className="food-image-container">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="food-image"
                            onError={() => handleImageError(item._id)}
                            loading="lazy"
                          />
                          <div className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                            {item.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                          </div>
                          
                          {/* Cuisine Tag */}
                          <div 
                            className="cuisine-tag" 
                            style={{ 
                              backgroundColor: cuisineColor.bg,
                              color: cuisineColor.text,
                              borderColor: cuisineColor.border
                            }}
                          >
                            {item.cuisine}
                          </div>
                          
                          {/* Special Badge for Popular Items */}
                          {(item.tags?.includes('popular') || item.rating >= 4.5) && (
                            <div className="popular-badge">
                              ⭐ Popular
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Food Details */}
                      <div className="food-details">
                        <div className="food-header">
                          <h3 className="food-name">{item.name}</h3>
                          <div className="food-price">
                            ₹{(item.priceCents / 100).toFixed(2)}
                          </div>
                        </div>

                        <p className="food-description">{item.description}</p>

                        <div className="food-meta">
                          <div className="meta-item">
                            <span className="meta-icon">{categoryIcon}</span>
                            <span className="meta-text">{item.category}</span>
                          </div>
                          
                          <div className="meta-item">
                            <Stars value={item.rating || 4.5} />
                          </div>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="meta-item">
                              <span className="meta-icon">🏷️</span>
                              <span className="meta-text">{item.tags[0]}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="food-tags">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="food-tag">{tag}</span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="food-tag">+{item.tags.length - 3} more</span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="food-actions">
                          <button
                            onClick={() => handleAddToCartAndNotify(item)}
                            disabled={!item.isAvailable}
                            className={`btn add-to-cart-btn ${!item.isAvailable ? 'disabled' : ''}`}
                          >
                            {item.isAvailable ? (
                              <>
                                <span className="btn-icon">🛒</span>
                                Add to Cart
                              </>
                            ) : 'Unavailable'}
                          </button>

                          {user?.role !== 'MEMBER' && (
                            <button
                              onClick={() => handleQuickBuy(item)}
                              disabled={!item.isAvailable}
                              className="btn quick-buy-btn"
                            >
                              <span className="btn-icon">⚡</span>
                              Quick Buy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button 
                  onClick={() => setFilters(f => ({ ...f, page: Math.max(1, Number(f.page) - 1) }))} 
                  disabled={filters.page <= 1} 
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                
                <span className="page-info">
                  Page {filters.page} of {Math.ceil(sortedMenu.length / filters.limit)}
                </span>
                
                <button 
                  onClick={() => setFilters(f => ({ ...f, page: Number(f.page) + 1 }))} 
                  disabled={sortedMenu.length < filters.limit} 
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Cart Sidebar */}
        <aside className="restaurant-sidebar">
          <div className="cart-sticky">
            <Cart cart={cart} setCart={setCart} onCheckout={handleDirectCheckout} />
            
            {/* Restaurant Info Card */}
            <div className="restaurant-info-card card">
              <h3 className="card-title">{restaurant?.name || 'Restaurant'}</h3>
              {restaurant && (
                <>
                  <div className="info-item">
                    <span className="info-label">📍 Address:</span>
                    <span className="info-value">{restaurant.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🏪 Cuisine:</span>
                    <span className="info-value">{restaurant.cuisine || 'Multi-cuisine'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🕐 Hours:</span>
                    <span className="info-value">11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🚚 Delivery:</span>
                    <span className="info-value success">30-45 minutes</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">⭐ Rating:</span>
                    <span className="info-value">{restaurant.rating?.toFixed(1) || '4.5'}/5</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .restaurant-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .restaurant-header-banner {
          position: relative;
          height: 300px;
          background-size: cover;
          background-position: center;
          color: white;
          padding: 40px 5%;
          display: flex;
          align-items: flex-end;
        }

        .restaurant-header-content {
          width: 100%;
          z-index: 2;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .restaurant-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .restaurant-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .restaurant-info {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .restaurant-address {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .restaurant-country {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .country-flag {
          font-size: 16px;
        }

        .restaurant-rating {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(10px);
        }

        .rating-value {
          font-weight: 700;
          font-size: 18px;
        }

        .restaurant-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          padding: 40px 5%;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1200px) {
          .restaurant-layout {
            grid-template-columns: 1fr;
          }
        }

        .filters-section {
          background: white;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .loading-container {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .menu-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-count {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 400;
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sort-select {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: #6366f1;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .menu-item {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .menu-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: #6366f1;
        }

        .food-image-section {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .food-image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .food-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .menu-item:hover .food-image {
          transform: scale(1.1);
        }

        .availability-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          z-index: 2;
        }

        .availability-badge.available {
          background: rgba(34, 197, 94, 0.9);
          color: white;
        }

        .availability-badge.unavailable {
          background: rgba(239, 68, 68, 0.9);
          color: white;
        }

        .cuisine-tag {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 2px solid;
          z-index: 2;
          backdrop-filter: blur(5px);
        }

        .popular-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(251, 191, 36, 0.9);
          color: #92400e;
          z-index: 2;
          backdrop-filter: blur(5px);
        }

        .food-details {
          padding: 25px;
        }

        .food-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .food-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          flex: 1;
          line-height: 1.3;
        }

        .food-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #059669;
          margin-left: 15px;
        }

        .food-description {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .food-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding: 15px 0;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .meta-icon {
          font-size: 18px;
        }

        .meta-text {
          font-weight: 500;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #fbbf24;
          font-size: 16px;
        }

        .star.empty {
          color: #d1d5db;
        }

        .food-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .food-tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .food-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .add-to-cart-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .quick-buy-btn {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
        }

        .quick-buy-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .btn.disabled {
          background: #9ca3af;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-icon {
          font-size: 18px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 40px 0;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .pagination-btn {
          padding: 12px 24px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
          transform: translateY(-2px);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-weight: 600;
          color: #4b5563;
          font-size: 16px;
        }

        .restaurant-sidebar {
          position: sticky;
          top: 30px;
          height: fit-content;
        }

        .cart-sticky {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .restaurant-info-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f3f4f6;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #6b7280;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-value {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .info-value.success {
          color: #059669;
        }

        @media (max-width: 768px) {
          .restaurant-header-banner {
            height: 250px;
            padding: 20px;
          }
          
          .restaurant-title {
            font-size: 2.2rem;
          }
          
          .restaurant-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .menu-grid {
            grid-template-columns: 1fr;
          }
          
          .food-actions {
            flex-direction: column;
          }
          
          .restaurant-layout {
            padding: 20px;
          }
          
          .menu-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}