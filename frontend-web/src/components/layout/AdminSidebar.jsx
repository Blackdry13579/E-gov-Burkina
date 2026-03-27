import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  FolderOpen,
  BarChart2,
  UserCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Emblem from '../common/Emblem';

const groups = [
  {
    label: 'Principal',
    items: [
      { name: 'Tableau de bord',     path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Gestion des demandes',path: '/admin/requests',  icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { name: 'Utilisateurs', path: '/admin/users',   icon: Users },
      { name: 'Rôles & Perms',path: '/admin/roles',    icon: ShieldCheck },
      { name: 'Documents',    path: '/admin/services', icon: FolderOpen },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { name: 'Statistiques', path: '/admin/security', icon: BarChart2 },
      { name: 'Mon Profil',   path: '/admin/profile',  icon: UserCircle },
    ],
  },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div
      className="w-64 h-screen flex flex-col fixed left-0 top-0 select-none"
      style={{
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EFF3FA',
        boxShadow: '4px 0 24px 0 rgba(26,35,126,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        {/* Emblème national directement, plus lisible */}
        <Emblem className="w-12 h-12 shrink-0 drop-shadow-sm" />
        <div>
          <p className="text-base font-black tracking-tight leading-none" style={{ color: '#1A1A2E' }}>
            E-Gov Burkina
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5" style={{ color: '#94A3B8' }}>
            Portail Admin
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 mb-4" style={{ height: 1, backgroundColor: '#EFF3FA' }} />

      {/* ── Nav groups ── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: '#CBD5E1' }}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ name, path, icon: Icon }) => (
                <li key={path}>
                  <NavLink to={path}>
                    {({ isActive }) => (
                      <div
                        className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 group"
                        style={{
                          backgroundColor: isActive ? '#EFF3FA' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFF';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {/* Active pill indicator */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                            style={{ backgroundColor: '#1A237E' }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            backgroundColor: isActive ? '#1A237E' : '#F1F5F9',
                          }}
                        >
                          <Icon
                            size={16}
                            style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className="flex-1 text-sm font-semibold transition-colors"
                          style={{ color: isActive ? '#1A237E' : '#4A5568' }}
                        >
                          {name}
                        </span>

                        {/* Arrow on active */}
                        {isActive && (
                          <ChevronRight size={14} style={{ color: '#1A237E', opacity: 0.5 }} />
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

      {/* ── User card + logout ── */}
      <div className="p-3 mt-2" style={{ borderTop: '1px solid #EFF3FA' }}>
        {/* Mini user card */}
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-1"
          style={{ backgroundColor: '#F8FAFF' }}
        >
          {/* Emblème à la place de l'initiale */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ backgroundColor: '#EFF3FA', borderColor: '#E2E8F0' }}
          >
            <Emblem className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate" style={{ color: '#1A1A2E' }}>
              {user?.name ?? 'Administrateur'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
              Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-2xl text-sm font-semibold transition-all group"
          style={{ color: '#94A3B8' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
            e.currentTarget.style.color = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#F1F5F9' }}
          >
            <LogOut size={16} style={{ color: '#94A3B8' }} />
          </div>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
