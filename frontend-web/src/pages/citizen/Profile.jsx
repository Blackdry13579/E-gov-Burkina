import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';

import { getCitizenProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  User, CreditCard, Phone, Mail, 
  MapPin, Lock, Bell, LogOut, 
  Edit2, ShieldCheck, ChevronRight,
  UserCircle, Info
} from 'lucide-react';



const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getCitizenProfile().then(data => setProfile(data));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-6 sticky top-0 z-10 shadow-sm lg:px-8">
        <div className="flex items-center space-x-3 lg:hidden">
          <Emblem className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#1A3A5C] leading-tight tracking-tight uppercase">Burkina Faso</span>
            <span className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase">E-Services Officiels</span>
          </div>
        </div>
        <div className="hidden lg:block">
           <h1 className="text-2xl font-extrabold text-[#1A3A5C]">Mon Profil</h1>
        </div>

        <button 
          onClick={() => navigate('/citoyen/notifications')}
          className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-institutional hover:bg-blue-100 transition-colors"
        >
          <Bell size={20} />
        </button>
      </header>



      {/* Flag Line */}
      <div className="h-1 flex w-full lg:hidden">
        <div className="h-full bg-[#EF3340] w-1/2"></div>
        <div className="h-full bg-[#009739] w-1/2"></div>
      </div>



      <div className="p-4 flex-1 pb-10 mt-4 lg:mt-8">

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mt-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-institutional mb-4 shadow-sm">
              <User size={40} strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl font-extrabold text-[#1A3A5C] mb-1">{profile.nom_complet}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 shadow-sm">
                <ShieldCheck size={14} className="fill-green-700/20" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Identité certifiée</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-[#1A237E] px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider">Compte Citoyen</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <UserCircle size={14} />
                Informations du citoyen
              </h2>
              <Link to="/citoyen/profil/modifier" className="text-[10px] font-bold text-institutional uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5">
                <Edit2 size={12} /> Modifier
              </Link>
            </div>

            {/* Nom Complet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Nom complet</label>
              <div className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[#1A3A5C] font-semibold">
                {profile.nom_complet}
              </div>
            </div>

            {/* CNIB */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Numéro CNIB (Identifiant Unique)</label>
                <ShieldCheck size={14} className="text-green-600" />
              </div>
              <div className="w-full p-4 bg-gray-50/80 rounded-2xl border border-gray-200 flex items-center gap-4 text-gray-400">
                <CreditCard size={20} className="shrink-0 opacity-40" />
                <span className="font-mono tracking-widest">{profile.cnib}</span>
              </div>
              <p className="text-[10px] text-gray-400 italic ml-1 flex items-center gap-1">
                <Info size={10} /> Donnée certifiée non modifiable
              </p>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Téléphone</label>
              <div className="flex gap-2">
                <div className="w-20 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">
                  +226
                </div>
                <div className="flex-1 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[#1A3A5C] font-bold tracking-wider">
                  {profile.telephone}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">E-mail</label>
              <div className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[#1A3A5C] font-semibold flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                {profile.email}
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Adresse de résidence</label>
              <div className="w-full p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[#1A3A5C] font-semibold flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                {profile.adresse}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button className="w-full p-5 flex items-center justify-between bg-white rounded-3xl border border-gray-100 hover:bg-gray-50 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                  <Lock size={18} />
                </div>
                <span className="text-sm font-bold text-gray-700">Sécurité & Mot de passe</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={handleLogout}
              className="w-full p-5 flex items-center justify-center gap-3 text-red-600 font-bold hover:bg-red-50 rounded-3xl transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut size={20} />
              Déconnecter ma session
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
