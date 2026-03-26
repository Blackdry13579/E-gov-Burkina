import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldCheck, 
  Settings,
  LogOut,
  UserCircle,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Emblem from '../common/Emblem';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard',  icon: LayoutDashboard },
    { name: 'Gestion des demandes', path: '/admin/requests',   icon: FileText },
    { name: 'Agents',          path: '/admin/agents',    icon: Users },
    { name: 'Rôles & Perms',   path: '/admin/roles',     icon: ShieldCheck },
    { name: 'Documents',       path: '/admin/services',  icon: Settings },
    { name: 'Statistiques',    path: '/admin/security',  icon: BarChart2 },
    { name: 'Mon Profil',      path: '/admin/profile',   icon: UserCircle },
  ];

  return (
    /* Sidebar blanche avec ombre légère — style mobile screenshot */
    <div
      className="w-64 h-screen flex flex-col fixed left-0 top-0"
      style={{
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <Emblem className="w-9 h-9" />
        <div>
          <h1 className="text-base font-black tracking-tight" style={{ color: '#1A237E' }}>
            E-GOV BF
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#718096' }}>
            Portail Administratif
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'font-bold'
                      : 'hover:bg-gray-50'
                  }`
                }
                style={({ isActive }) => ({
                  /* Actif  : fond bleu très clair (comme le screenshot) + texte navy */
                  /* Inactif: texte gris moyen */
                  backgroundColor: isActive ? '#EFF3FA' : 'transparent',
                  color: isActive ? '#1A237E' : '#4A5568',
                  /* Barre verticale droite sur l'élément actif */
                  borderRight: isActive ? '3px solid #1A237E' : '3px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      style={{ color: isActive ? '#1A237E' : '#94A3B8' }}
                    />
                    <span>{name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="mt-3 flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-semibold transition-all hover:bg-red-50 group"
          style={{ color: '#718096' }}
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors" style={{ color: '#94A3B8' }} />
          <span className="group-hover:text-red-500 transition-colors">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
