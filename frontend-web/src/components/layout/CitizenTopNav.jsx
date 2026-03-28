import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, FileText, Bell, UserCircle, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import Emblem from '../common/Emblem';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/citoyen/accueil',        label: 'Accueil',       icon: LayoutDashboard },
  { to: '/citoyen/services',       label: 'Catalogue',     icon: FolderOpen },
  { to: '/citoyen/demandes',       label: 'Mes Demandes',  icon: FileText },
  { to: '/citoyen/notifications',  label: 'Notifications', icon: Bell },
];

const CitizenTopNav = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/citoyen/accueil')}>
            <Emblem className="w-12 h-12 drop-shadow-sm" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black text-[#1A3A5C] uppercase tracking-tighter leading-none">E-GOV</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Document Request</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-[#1A237E]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-4 border-l border-gray-50 pl-6 ml-4">
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1A237E] flex items-center justify-center text-white text-xs font-black shadow-lg">
                  {user?.prenom?.charAt(0) || 'C'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-gray-900 leading-none">{user?.prenom || 'Citoyen'}</span>
                  <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-1">Citoyen Vérifié</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                  <NavLink to="/citoyen/profil" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                    <UserCircle size={18} className="text-gray-400" />
                    Mon Profil
                  </NavLink>
                  <div className="h-px bg-gray-50 my-1 mx-4" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-sm font-bold text-red-600"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-1 shadow-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-black transition-all ${
                  isActive 
                    ? 'bg-[#1A237E] text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-black text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={22} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CitizenTopNav;
