import React from 'react';

const Badge = ({ children, variant = 'secondary', className = '' }) => {
  const getVariantClass = () => {
    switch(variant) {
      case 'success': return 'badge-success';
      case 'danger': return 'badge-danger';
      case 'warning': return 'badge-warning';
      case 'ghost': return 'badge-ghost';
      default: return 'badge-secondary';
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
