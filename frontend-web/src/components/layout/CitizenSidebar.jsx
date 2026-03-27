import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, FileText, Bell, UserCircle, LogOut, Home, ChevronRight
} from 'lucide-react';
import Emblem from '../common/Emblem';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/accueil',        label: 'Accueil',                icon: LayoutDashboard },
  { to: '/services',       label: 'Catalogue des Services', icon: FolderOpen },
  { to: '/demandes',       label: 'Mes Demandes',           icon: FileText },
  { to: '/notifications',  label: 'Notifications',          icon: Bell },
  { to: '/profil',         label: 'Mon Profil',             icon: UserCircle },
];

const CitizenSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="hidden lg:flex w-64 h-screen flex-col fixed left-0 top-0 select-none"
      style={{
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EFF3FA',
        boxShadow: '4px 0 24px 0 rgba(26,35,126,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-4">
        <Emblem className="w-12 h-12 shrink-0 drop-shadow-sm" />
        <div className="flex flex-col">
          <p className="text-sm font-black tracking-tight leading-tight uppercase" style={{ color: '#1A3A5C' }}>
            Burkina Faso
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] mt-0.5" style={{ color: '#94A3B8' }}>
            E-Services Officiels
          </p>
        </div>
      </div>


      {/* ── Divider ── */}
      <div className="mx-5 mb-4" style={{ height: 1, backgroundColor: '#EFF3FA' }} />

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-5">
        <div>
          <p
            className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: '#CBD5E1' }}
          >
            Général
          </p>
          <ul className="space-y-0.5">
            <li>
              <NavLink to="/">
                {({ isActive }) => (
                  <div
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 group"
                    style={{ backgroundColor: isActive ? '#EFF3FA' : 'transparent' }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFF'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#1A237E' }} />}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: isActive ? '#1A237E' : '#F1F5F9' }}>
                      <Home size={16} style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                    </div>
                    <span className="flex-1 text-sm font-semibold transition-colors" style={{ color: isActive ? '#1A237E' : '#4A5568' }}>Accueil Public</span>
                  </div>
                )}
              </NavLink>
            </li>
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to}>
                  {({ isActive }) => (
                    <div
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 group"
                      style={{ backgroundColor: isActive ? '#EFF3FA' : 'transparent' }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFF'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#1A237E' }} />}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: isActive ? '#1A237E' : '#F1F5F9' }}>
                        <Icon size={16} style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }} />
                      </div>
                      <span className="flex-1 text-sm font-semibold transition-colors" style={{ color: isActive ? '#1A237E' : '#4A5568' }}>{label}</span>
                      {isActive && <ChevronRight size={14} style={{ color: '#1A237E', opacity: 0.5 }} />}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── User card + logout ── */}
      <div className="p-3 mt-2" style={{ borderTop: '1px solid #EFF3FA' }}>
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-1"
          style={{ backgroundColor: '#F8FAFF' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-sm font-bold shadow-sm"
            style={{ backgroundColor: '#1A237E', borderColor: '#1A237E', color: 'white' }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate" style={{ color: '#1A1A2E' }}>
              {user?.name || 'Citoyen'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#00875A]">
              Vérifié
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
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
            <LogOut size={16} style={{ color: '#94A3B8' }} className="group-hover:text-[#B91C1C]" />
          </div>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default CitizenSidebar;
