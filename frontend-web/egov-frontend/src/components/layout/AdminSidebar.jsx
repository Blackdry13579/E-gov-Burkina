import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldCheck, 
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Emblem from '../common/Emblem';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Agents / RH', path: '/admin/agents', icon: <Users size={20} /> },
    { name: 'Mes Demandes', path: '/admin/requests', icon: <FileText size={20} /> },
    { name: 'Rôles & Perms', path: '/admin/roles', icon: <ShieldCheck size={20} /> },
    { name: 'Configuration', path: '/admin/services', icon: <Settings size={20} /> },
    { name: 'Logs de Sécurité', path: '/admin/security', icon: <ShieldCheck size={20} /> },
    { name: 'Mon Profil', path: '/admin/profile', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0" style={{ backgroundColor: '#1A237E' }}>
      {/* Logo area — navy très foncé (AppColors.primaryDark) */}
      <div className="p-6 flex items-center space-x-3" style={{ backgroundColor: '#0F2244' }}>
        <Emblem className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">E-GOV BURKINA</h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: '#EAB208' }}>Portail Administratif</p>
        </div>
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-black'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Icône — doré si actif (AppColors.accent), blanc sinon */}
                    <span style={{ color: isActive ? '#EAB208' : undefined }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {/* Indicateur actif */}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: '#EAB208' }} />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-2xl" style={{ backgroundColor: '#0F2244' }}>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="flex items-center gap-3 px-3 py-3 w-full text-left text-white/70 hover:text-white rounded-xl transition-colors group"
        >
          <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
