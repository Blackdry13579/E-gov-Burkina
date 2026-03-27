import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  fullWidth = true,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#1A237E',
          color: 'white',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: '#1A237E',
          border: '1px solid #1A237E',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger)',
          color: 'white',
          border: 'none',
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success)',
          color: 'white',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
      case 'lg': return { padding: '1rem 1.5rem', fontSize: '1rem' };
      default: return { padding: '0.75rem 1.5rem', fontSize: '0.875rem' }; // md
    }
  };

  return (
    <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }}
      className={`flex items-center justify-center gap-2 font-semibold rounded ${className}`}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: 'var(--radius-xl)',
        width: fullWidth ? '100%' : 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;
