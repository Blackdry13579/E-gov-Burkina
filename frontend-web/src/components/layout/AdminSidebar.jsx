import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, FolderOpen,
  BarChart2, UserCircle, LogOut, ChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const groups = [
  {
    label: 'Principal',
    items: [
      { name: 'Tableau de bord',      path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Gestion des demandes', path: '/admin/requests',  icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { name: 'Utilisateurs',          path: '/admin/users',    icon: Users },
      { name: 'Documents & Services',  path: '/admin/services', icon: FolderOpen },
      { name: 'Mon Profil',            path: '/admin/profile',  icon: UserCircle },
    ],
  },
];

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div
      className="h-screen flex flex-col fixed left-0 top-0 select-none z-40 transition-all duration-300"
      style={{
        width: collapsed ? '72px' : '288px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EFF3FA',
        boxShadow: '4px 0 24px 0 rgba(26,35,126,0.06)',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-6 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center z-50 hover:bg-blue-50 transition-colors"
        style={{ color: '#1A237E' }}
      >
        {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
      </button>

      {/* Logo */}
      <div className="px-4 pt-6 pb-5 flex items-center gap-3 overflow-hidden">
        <div className="w-11 h-11 rounded-xl bg-[#1A237E] flex items-center justify-center shrink-0">
          <UserCircle size={24} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-black tracking-tight leading-none truncate" style={{ color: '#1A1A2E' }}>E-GOV</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mt-0.5 truncate" style={{ color: '#1A237E' }}>Document Request</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5 truncate" style={{ color: '#94A3B8' }}>Profil Administrateur</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 mb-4" style={{ height: 1, backgroundColor: '#EFF3FA' }} />

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-5 overflow-x-hidden">
        {groups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#CBD5E1' }}>
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ name, path, icon: Icon }) => (
                <li key={path}>
                  <NavLink to={path}>
                    {({ isActive }) => (
                      <div
                        className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150"
                        style={{ backgroundColor: isActive ? '#EFF3FA' : 'transparent' }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFF'; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        title={collapsed ? name : undefined}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#1A237E' }} />
                        )}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: isActive ? '#1A237E' : '#F1F5F9' }}>
                          <Icon size={16} style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                        </div>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm font-semibold whitespace-nowrap" style={{ color: isActive ? '#1A237E' : '#4A5568' }}>{name}</span>
                            {isActive && <ChevronRight size={14} style={{ color: '#1A237E', opacity: 0.5 }} />}
                          </>
                        )}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User card + logout */}
      <div className="p-2 mt-2" style={{ borderTop: '1px solid #EFF3FA' }}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-1" style={{ backgroundColor: '#F8FAFF' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-sm" style={{ backgroundColor: '#1A237E' }}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate" style={{ color: '#1A1A2E' }}>{user?.name ?? 'Administrateur'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-2xl text-sm font-semibold transition-all"
          style={{ color: '#94A3B8' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#B91C1C'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F5F9' }}>
            <LogOut size={16} style={{ color: '#94A3B8' }} />
          </div>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
