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
    <div className="w-64 h-screen bg-institutional text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center space-x-3">
        <Emblem className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight">E-GOV BURKINA</h1>
          <p className="text-sm text-institutional-light mt-0.5 opacity-80">Portail Administratif</p>
        </div>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 font-medium transition-colors ${
                    isActive ? 'bg-white/10 border-l-4 border-green-500' : 'hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="flex items-center gap-3 px-2 py-2 w-full text-left hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
