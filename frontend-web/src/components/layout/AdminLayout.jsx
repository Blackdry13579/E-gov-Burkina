import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 288;

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#F5F7FA' }}>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slides in */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      </div>

      {/* Content area */}
      <div
        className="flex-1 flex flex-col transition-all duration-300 min-w-0"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <header
          className="h-16 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-20"
          style={{ borderBottom: '1px solid #E2E8F0' }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors mr-3"
            onClick={() => setMobileOpen(o => !o)}
          >
            <Menu size={22} style={{ color: '#1A237E' }} />
          </button>

          {/* Devise */}
          <div className="flex-1 text-center hidden sm:block">
            <h2 className="text-lg font-serif italic tracking-wide" style={{ color: '#4A5568' }}>
              « La Patrie ou la Mort, Nous Vaincrons »
            </h2>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-black" style={{ color: '#1A237E' }}>{user?.name}</p>
            </div>
            <div
              className="w-10 h-10 text-white rounded-xl shadow-md flex items-center justify-center font-black text-lg"
              style={{ background: 'linear-gradient(135deg, #1A237E 0%, #2952A3 100%)' }}
            >
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
