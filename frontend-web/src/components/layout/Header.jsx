import React from 'react';
import { Menu, Bell } from 'lucide-react';
import Emblem from '../common/Emblem';

const Header = ({ title, showMenu = true, showNotification = false, rightElement }) => {
  return (
    <header className="header flex items-center justify-between p-4 bg-surface" style={{ height: '60px', backgroundColor: 'var(--color-surface)', position: 'sticky', top: 0, zIndex: 10 }}>
      {showMenu ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Emblem className="w-9 h-9" />
          </div>
          <span className="font-bold text-h2" style={{ color: '#1A237E' }}>E-Gov</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
           {title && <span className="font-bold text-h2">{title}</span>}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {rightElement && rightElement}
        {showNotification && (
          <div className="relative">
            <Bell size={24} color="#1A237E" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" style={{ backgroundColor: 'var(--color-danger)' }}></span>
          </div>
        )}
        {showMenu && <Menu size={24} color="#1A237E" />}
      </div>
    </header>
  );
};

export default Header;
