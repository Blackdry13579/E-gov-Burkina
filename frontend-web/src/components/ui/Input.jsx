import React from 'react';

const Input = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-body font-semibold" style={{ color: 'var(--color-text-accent)' }}>{label}</label>}
      <div 
        className="flex items-center px-4 py-3 bg-surface border"
        style={{
          borderColor: 'var(--color-border-input)',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {icon && <div className="mr-3" style={{ color: 'var(--color-text-muted)' }}>{icon}</div>}
        <input 
          className="w-full text-body"
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--color-text-main)',
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
