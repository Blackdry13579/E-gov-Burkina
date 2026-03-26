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
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
            La Patrie ou la Mort, Nous Vaincrons
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <div className="w-8 h-8 bg-[#1A237E] text-white rounded-full flex items-center justify-center font-bold text-sm">
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
