import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { Link } from 'react-router-dom';

export default function RestaurantsPage() {
  const [list, setList] = useState([]);
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    load(); 
  }, [country]);

  async function load() {
    setLoading(true);
    try {
      const qs = country ? `?country=${country}` : '';
      const res = await apiFetch('/restaurants' + qs, { method: 'GET' });
      setList(res);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  }

  const getRestaurantIcon = (name) => {
    const icons = ['🍕', '🍔', '🍣', '🥗', '🌮', '🍝', '🥘', '🍛', '🍜', '🍱', '🥙', '🍤'];
    return icons[name.length % icons.length];
  };

  const getCountryFlag = (code) => {
    return code === 'IN' ? '🇮🇳' : '🇺🇸';
  };

  return (
    <div className="restaurants-page">
      <div className="restaurants-container">
        {/* Header Section */}
        <div className="restaurants-header">
          <h1 className="restaurants-title">Discover Amazing Restaurants</h1>
          <p className="restaurants-subtitle">Find the perfect place for your next meal</p>
        </div>

        {/* Filter Section */}
        <div className="filter-section card">
          <div className="filter-content">
            <div className="filter-icon">🌍</div>
            <div className="filter-controls">
              <label className="filter-label">Filter by Country</label>
              <select 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                className="country-select"
              >
                <option value="">All Countries</option>
                <option value="IN">India 🇮🇳</option>
                <option value="US">United States 🇺🇸</option>
              </select>
            </div>
            <div className="restaurant-count">
              <span className="count-number">{list.length}</span>
              <span className="count-label">restaurants found</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-restaurants">
            <div className="loading-spinner large"></div>
            <p>Discovering amazing restaurants...</p>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && (
          <div className="restaurants-grid">
            {list.map((restaurant, index) => (
              <Link 
                key={restaurant._id} 
                to={`/restaurants/${restaurant._id}`}
                className="restaurant-card-link"
              >
                <div 
                  className="restaurant-card card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="restaurant-card-header">
                    <div className="restaurant-icon">
                      {getRestaurantIcon(restaurant.name)}
                    </div>
                    <div className="restaurant-badge">
                      {getCountryFlag(restaurant.country?.code)}
                      <span>{restaurant.country?.code}</span>
                    </div>
                  </div>
                  
                  <div className="restaurant-card-content">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <p className="restaurant-address">{restaurant.address}</p>
                  </div>

                  <div className="restaurant-card-footer">
                    <div className="view-restaurant">
                      <span>View Menu</span>
                      <div className="arrow-icon">→</div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="card-hover-effect"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && list.length === 0 && (
          <div className="empty-restaurants">
            <div className="empty-icon">🏪</div>
            <h3>No restaurants found</h3>
            <p>Try changing your country filter or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}