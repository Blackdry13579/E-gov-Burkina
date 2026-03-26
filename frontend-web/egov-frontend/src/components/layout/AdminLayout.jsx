import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-serif italic text-gray-700 tracking-wide">
              "La Patrie ou la Mort, Nous Vaincrons"
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right mr-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Connecté</p>
              <p className="text-sm font-black text-[#1A237E]">{user?.name}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-[#1A237E] to-[#3949AB] text-white rounded-xl shadow-md flex items-center justify-center font-black text-lg">
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
