import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    /* AppColors.background = #F5F7FA */
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#F5F7FA' }}>
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header — fond blanc, bordure AppColors.divider */}
        <header className="h-20 bg-white flex items-center justify-between px-8" style={{ borderBottom: '1px solid #E2E8F0' }}>
          {/* Devise centrée */}
          <div className="flex-1 text-center">
            <h2 className="text-xl font-serif italic tracking-wide" style={{ color: '#4A5568' }}>
              « La Patrie ou la Mort, Nous Vaincrons »
            </h2>
          </div>
          {/* Info utilisateur */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right mr-2">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#718096' }}>Connecté</p>
              <p className="text-sm font-black" style={{ color: '#1A237E' }}>{user?.name}</p>
            </div>
            {/* Avatar — dégradé primary → primaryLight (AppColors) */}
            <div
              className="w-10 h-10 text-white rounded-xl shadow-md flex items-center justify-center font-black text-lg"
              style={{ background: 'linear-gradient(135deg, #1A237E 0%, #2952A3 100%)' }}
            >
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

