import React from 'react';
import PriceBadge from './PriceBadge';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const {
    title, location, type, rent, description,
    price_status, avg_rent, owner_name
  } = property;

  return (
    <div className="card property-card">
      <div className="prop-card-header">
        <span className="prop-type-chip">{type}</span>
        <PriceBadge status={price_status} />
      </div>

      <h3 className="prop-title">{title}</h3>

      <div className="prop-meta">
        <span className="prop-location">📍 {location}</span>
        {owner_name && <span className="prop-owner">👤 {owner_name}</span>}
      </div>

      {description && (
        <p className="prop-desc">{description}</p>
      )}

      <div className="prop-footer">
        <div className="prop-rent">
          <span className="rent-label">Monthly Rent</span>
          <span className="rent-value">₹{Number(rent).toLocaleString('en-IN')}</span>
        </div>
        {avg_rent && (
          <div className="prop-avg">
            <span className="avg-label">Area Avg</span>
            <span className="avg-value">₹{Number(avg_rent).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
