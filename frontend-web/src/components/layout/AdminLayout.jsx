import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';
import Emblem from '../common/Emblem';

const AdminLayout = () => {
  const { user } = useAuth();
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
          style={{ borderBottom: '1px solid #EFF3FA', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.02)' }}
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
            <h2 className="text-sm font-black italic tracking-[0.1em] uppercase opacity-40 ml-10" style={{ color: '#1A237E' }}>
              « La Patrie ou la Mort, Nous Vaincrons »
            </h2>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Administrateur</p>
              <p className="text-sm font-black" style={{ color: '#1A237E' }}>{user?.name || 'Session Admin'}</p>
            </div>
            <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-2">
              <Emblem className="w-full h-full" />
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
