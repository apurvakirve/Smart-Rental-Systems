import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';

const LOCATIONS = ['', 'Andheri', 'Thane', 'Bandra', 'Pune', 'Dadar', 'Borivali'];
const TYPES     = ['', '1BHK', '2BHK', 'PG'];

export default function PropertyListingPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState({ location: '', type: '', max_budget: '' });

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.location)   params.location   = filters.location;
      if (filters.type)       params.type       = filters.type;
      if (filters.max_budget) params.max_budget = filters.max_budget;
      const res = await api.get('/get_properties.php', { params });
      setProperties(res.data.properties || []);
    } catch {
      setError('Could not load properties. Is XAMPP running?');
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleReset = () => {
    setFilters({ location: '', type: '', max_budget: '' });
    // Reset fires fetchProperties via useEffect after state update
    setProperties([]);
    setTimeout(fetchProperties, 50);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">🔍 Browse Properties</h2>
          <span style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} found
          </span>
        </div>

        {/* Filters */}
        <form className="filter-bar" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="fl-location">Location</label>
            <select id="fl-location" name="location" className="form-control" value={filters.location} onChange={handleFilter}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l || 'All Locations'}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fl-type">Property Type</label>
            <select id="fl-type" name="type" className="form-control" value={filters.type} onChange={handleFilter}>
              {TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fl-budget">Max Budget (₹)</label>
            <input id="fl-budget" name="max_budget" type="number" className="form-control"
              placeholder="e.g. 25000" min="0" value={filters.max_budget} onChange={handleFilter} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '🔍 Search'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {/* Results */}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">
            <div className="emoji">⏳</div>
            <h3>Searching properties…</h3>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🏚️</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters or increasing budget.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
