import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AgentSidebar from './AgentSidebar';
import { LayoutDashboard, ClipboardList, Bell, MessageSquare, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const bottomNavItems = [
  { to: '/agent/dashboard',     icon: LayoutDashboard, label: 'Accueil' },
  { to: '/agent/requests',      icon: ClipboardList,   label: 'Requêtes' },
  { to: '/agent/notifications', icon: Bell,            label: 'Alertes' },
  { to: '/agent/messaging',     icon: MessageSquare,   label: 'Messages' },
  { to: '/agent/profile',       icon: UserCircle,      label: 'Profil' },
];

const AgentLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 256;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans text-gray-800">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: slides in */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <AgentSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">E-GOV Document Request</p>
            <h2 className="text-base font-black text-gray-800">Espace Agent</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              En ligne
            </span>
            <span className="text-sm text-gray-600 font-medium">{user?.name || 'Agent'}</span>
          </div>
        </header>

        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1A237E] text-white shadow sticky top-0 z-20">
          <button
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
          >
            <Menu size={20} />
          </button>
          <div className="text-center">
            <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest">E-GOV Document Request</p>
            <h2 className="text-sm font-bold">Espace Agent</h2>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'text-[#1A237E]' : 'text-gray-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={isActive ? 'text-[#1A237E]' : 'text-gray-400'} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AgentLayout;
