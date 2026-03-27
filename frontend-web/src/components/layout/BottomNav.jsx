import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav flex justify-between items-center bg-surface" style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '0.75rem 1rem',
      paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      zIndex: 10
    }}>
      {items.map((item, index) => {
        const isActive = location.pathname.includes(item.path) || (item.exact && location.pathname === item.path);
        const color = isActive ? 'var(--color-primary)' : 'var(--color-text-muted)';
        
        return (
          <div 
            key={index}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => navigate(item.path)}
            style={{ minWidth: '60px' }}
          >
            {React.cloneElement(item.icon, { 
              size: 24, 
              color: color,
              strokeWidth: isActive ? 2.5 : 2
            })}
            <span className="text-caption font-semibold" style={{ color, fontSize: '0.65rem' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNav;
