import React from 'react';

const STATUS_CONFIG = {
  Fair:        { className: 'badge-fair',        icon: '✅', label: 'Fair Price' },
  Overpriced:  { className: 'badge-overpriced',  icon: '🔴', label: 'Overpriced' },
  Underpriced: { className: 'badge-underpriced', icon: '🔵', label: 'Underpriced' },
  'Market New': { className: 'badge-info',        icon: '🆕', label: 'New in Market' },
};

export default function PriceBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Fair'];
  return (
    <span className={`badge ${config.className}`}>
      {config.icon} {config.label}
    </span>
  );
}
