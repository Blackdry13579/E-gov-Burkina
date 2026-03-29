import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Bell, MessageSquare,
  UserCircle, PenTool, History, Shield, LogOut, ChevronRight,
  ChevronsLeft, ChevronsRight, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Emblem from '../common/Emblem';

const navItems = [
  { to: '/agent/dashboard',       label: 'Tableau de bord',   icon: LayoutDashboard },
  { to: '/agent/requests',        label: 'Gestion des demandes', icon: ClipboardList },
  { to: '/agent/notifications',   label: 'Notifications',     icon: Bell },
  { to: '/agent/profile',         label: 'Mon Profil',        icon: UserCircle },
];

const NavItem = ({ to, label, icon: Icon, collapsed }) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <div
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150"
        style={{ backgroundColor: isActive ? '#EFF3FA' : 'transparent' }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFF'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
        title={collapsed ? label : undefined}
      >
        {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#1A237E' }} />}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: isActive ? '#1A237E' : '#F1F5F9' }}>
          <Icon size={16} style={{ color: isActive ? '#FFFFFF' : '#94A3B8' }} />
        </div>
        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-semibold transition-colors whitespace-nowrap" style={{ color: isActive ? '#1A237E' : '#4A5568' }}>{label}</span>
            {isActive && <ChevronRight size={14} style={{ color: '#1A237E', opacity: 0.5 }} />}
          </>
        )}
      </div>
    )}
  </NavLink>
);

const AgentSidebar = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex flex-col fixed left-0 top-0 select-none z-40 transition-all duration-300"
      style={{
        width: collapsed ? '72px' : '256px',
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
        <Emblem className="w-10 h-10 shrink-0 drop-shadow-sm" />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-black tracking-tight leading-none truncate" style={{ color: '#1A1A2E' }}>Mairie de Ouaga</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5 truncate" style={{ color: '#94A3B8' }}>Portail Agent</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 mb-4" style={{ height: 1, backgroundColor: '#EFF3FA' }} />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-5 overflow-x-hidden">
        <div>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#CBD5E1' }}>
              Espace Travail
            </p>
          )}
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.to}><NavItem {...item} collapsed={collapsed} /></li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User card + logout */}
      <div className="p-2 mt-2" style={{ borderTop: '1px solid #EFF3FA' }}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 overflow-hidden" style={{ backgroundColor: '#F8FAFF' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold" style={{ backgroundColor: '#1A237E', color: 'white' }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate" style={{ color: '#1A1A2E' }}>{user?.name || 'Agent'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A237E]">Connecté</p>
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

export default AgentSidebar;
