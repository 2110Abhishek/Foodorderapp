import React, { useEffect, useState } from 'react';

const cuisines = ['','Indian','Italian','Chinese','American','Mexican','Japanese','Mediterranean','Fusion'];
const categories = ['','Main','Starter','Dessert','Drink','Street','Snack','Salad','Soup'];

export default function MenuFilters({ filters, onChange, onClear }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters]);

  function apply() {
    Object.entries(local).forEach(([k, v]) => onChange(k, v));
  }

  function clearAll() {
    onClear();
  }

  return (
    <div className="menu-filters">
      <div className="filters-row">
        <input 
          placeholder="Search name/description" 
          value={local.q || ''} 
          onChange={e => setLocal({...local, q: e.target.value})} 
          className="input-modern search-input"
        />
        <select 
          value={local.cuisine || ''} 
          onChange={e => setLocal({...local, cuisine: e.target.value})}
          className="filter-select"
        >
          {cuisines.map(c => <option key={c} value={c}>{c || 'Any Cuisine'}</option>)}
        </select>
        <select 
          value={local.category || ''} 
          onChange={e => setLocal({...local, category: e.target.value})}
          className="filter-select"
        >
          {categories.map(c => <option key={c} value={c}>{c || 'Any Category'}</option>)}
        </select>
        <input 
          placeholder="Tag (e.g. spicy)" 
          value={local.tag || ''} 
          onChange={e => setLocal({...local, tag: e.target.value})} 
          className="input-modern tag-input"
        />
      </div>

      <div className="filters-row secondary">
        <div className="price-inputs">
          <input 
            placeholder="Min price (₹)" 
            type="number" 
            value={local.minPrice ? (local.minPrice/100) : ''} 
            onChange={e => setLocal({...local, minPrice: e.target.value ? Math.round(Number(e.target.value)*100) : ''})} 
            className="input-modern price-input"
          />
          <input 
            placeholder="Max price (₹)" 
            type="number" 
            value={local.maxPrice ? (local.maxPrice/100) : ''} 
            onChange={e => setLocal({...local, maxPrice: e.target.value ? Math.round(Number(e.target.value)*100) : ''})} 
            className="input-modern price-input"
          />
        </div>
        <input 
          placeholder="Min rating" 
          type="number" 
          step="0.1" 
          max="5" 
          min="0" 
          value={local.minRating || ''} 
          onChange={e => setLocal({...local, minRating: e.target.value})} 
          className="input-modern rating-input"
        />
        <select 
          value={local.sort || 'newest'} 
          onChange={e => setLocal({...local, sort: e.target.value})}
          className="filter-select"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating_desc">Rating ↓</option>
          <option value="rating_asc">Rating ↑</option>
        </select>
        <label className="availability-checkbox">
          <input 
            type="checkbox" 
            checked={local.available === true || local.available === 'true' || local.available === undefined} 
            onChange={e => setLocal({...local, available: e.target.checked})} 
          />
          Only Available
        </label>
        <button onClick={apply} className="btn btn-primary">Apply</button>
        <button onClick={clearAll} className="btn btn-secondary">Clear</button>
      </div>
    </div>
  );
}