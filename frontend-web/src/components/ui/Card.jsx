import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-surface p-4 flex flex-col ${className}`}
      onClick={onClick}
      style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        cursor: onClick ? 'pointer' : 'default',
        padding: '1rem'
      }}
    >
      {children}
    </div>
  );
};

export default Card;
