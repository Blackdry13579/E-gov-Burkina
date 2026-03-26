import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import CitizenSidebar from './CitizenSidebar';
import { LayoutDashboard, FolderOpen, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const bottomNavItems = [
  { to: '/services',       icon: LayoutDashboard, label: 'Catalogue' },
  { to: '/demandes',       icon: FolderOpen,      label: 'Demandes' },
  { to: '/notifications',  icon: Bell,            label: 'Alertes' },
  { to: '/profil',         icon: UserCircle,      label: 'Profil' },
];

const CitizenLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans text-gray-800">
      {/* Desktop Sidebar */}
      <CitizenSidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative lg:ml-64">
        {/* Desktop Header Topbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">République du Burkina Faso</p>
            <h2 className="text-lg font-bold text-gray-800">Espace Citoyen</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">{user?.name || 'Citoyen'}</span>
          </div>
        </header>

        {/* Main Content Area — Scrollable */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 relative z-0">
          <div className="max-w-4xl mx-auto h-full w-full">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation (Mobile focused) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50">
          <div className="flex justify-between items-center px-2 py-2">
            {bottomNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 w-1/4 text-xs transition-colors ${
                    isActive ? 'text-institutional font-bold' : 'text-gray-400 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={22} className={isActive ? 'text-institutional' : 'text-gray-400'} strokeWidth={isActive ? 2.5 : 2} />
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

export default CitizenLayout;
