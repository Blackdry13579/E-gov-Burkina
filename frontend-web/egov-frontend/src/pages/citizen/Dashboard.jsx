import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, Shield, FileCheck, ArrowRight,
  ClipboardList, CheckCircle, Bell, LayoutDashboard, AlertCircle
} from 'lucide-react';

const popularDocuments = [
  {
    id: 'cnib',
    title: 'CNIB',
    description: 'Carte Nationale d\'Identité Burkinabè',
    icon: Shield,
    path: '/services/cnib'
  },
  {
    id: 'acte-naissance',
    title: 'Acte de naissance',
    description: 'Copie intégrale ou extrait d\'acte de naissance',
    icon: FileText,
    path: '/services/acte-naissance'
  },
  {
    id: 'casier-judiciaire',
    title: 'Casier Judiciaire',
    description: 'Extrait de casier judiciaire (Bulletin n°3)',
    icon: FileCheck,
    path: '/services/casier-judiciaire'
  }
];

const stats = [
  {
    value: '02',
    label: 'DEMANDES EN COURS',
    icon: ClipboardList,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    value: '14',
    label: 'DOCUMENTS DÉLIVRÉS',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    value: '00',
    label: 'DOCUMENTS REJETÉS',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Bonjour, {user?.name?.split(' ')[0] || 'Ibrahim'}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2 max-w-lg leading-relaxed">
            Bienvenue sur votre espace sécurisé. Simplifiez vos démarches administratives et accédez à vos documents officiels en un clic.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-700 tracking-wide">
            Services en ligne : Opérationnels
          </span>
        </div>
      </div>

      {/* ── HERO BANNER (Building Image) ── */}
      <div className="relative w-full h-[22rem] md:h-80 rounded-[2rem] overflow-hidden shadow-xl shadow-[#1A237E]/10 group">
        <img 
          src="https://images.unsplash.com/photo-1541888049619-aaeb8051eeb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Administration Burkina Faso" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A237E]/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-[#1A237E] bg-white rounded-full shadow-sm">
            GUICHET UNIQUE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Vos démarches administratives simplifiées
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
            Gagnez du temps en effectuant vos demandes de documents officiels en ligne. Suivez l'évolution de vos dossiers en temps réel et obtenez vos actes en toute sécurité, sans vous déplacer.
          </p>
        </div>
      </div>

      {/* ── CATALOGUE POPULAIRE ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-gray-900">
            <LayoutDashboard className="text-[#1A237E]" size={20} />
            <h3 className="text-lg font-black uppercase tracking-tight">Catalogue des documents populaires</h3>
          </div>
          <button onClick={() => navigate('/services')} className="text-[#1A237E] text-sm font-bold flex items-center gap-1 hover:underline group">
            Voir tout le catalogue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#1A237E] mb-5">
                <doc.icon size={24} />
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-2">{doc.title}</h4>
              <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{doc.description}</p>
              
              <button 
                onClick={() => navigate('/demande/etape1')} 
                className="w-full py-2.5 bg-[#F5F7FA] text-[#1A237E] hover:bg-[#1A237E] hover:text-white font-bold text-sm rounded-xl transition-colors"
              >
                Demander maintenant
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 cursor-pointer hover:-translate-y-1 transition-transform">
            <div className={`w-14 h-14 rounded-full ${stat.bgColor} flex items-center justify-center shrink-0`}>
              <stat.icon className={stat.color} size={28} />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CitizenDashboard;
