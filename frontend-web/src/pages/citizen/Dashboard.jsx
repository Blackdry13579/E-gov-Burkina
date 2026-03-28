import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, Shield, FileCheck, ArrowRight,
  ClipboardList, CheckCircle, Bell, LayoutDashboard, AlertCircle,
  Loader2
} from 'lucide-react';
import { getCitizenRequests, getCitizenServices } from '../../services/api';
import Emblem from '../../components/common/Emblem';

// Mappage des icônes par code de document
const getIconForCode = (code) => {
  switch (code) {
    case 'NAISSANCE': return FileText;
    case 'MARIAGE': return FileCheck;
    case 'DECES': return FileText;
    case 'CASIER': return Shield;
    case 'NATIONALITE': return Shield;
    default: return FileText;
  }
};

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popularDocs, setPopularDocs] = useState([]);
  const [statsData, setStatsData] = useState({
    enCours: 0,
    delivres: 0,
    rejetes: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Parallélisation des appels
        const [requests, services] = await Promise.all([
          getCitizenRequests(),
          getCitizenServices()
        ]);
        
        // 1. Calcul des stats
        const counts = requests.reduce((acc, curr) => {
          const s = (curr.statut || '').toUpperCase();
          if (s === 'EN_ATTENTE' || s === 'EN_COURS') {
            acc.enCours += 1;
          } else if (['VALIDE', 'DISPONIBLE', 'TERMINEE', 'PRÊT', 'PRET'].includes(s)) {
            acc.delivres += 1;
          } else if (s === 'REJETE' || s === 'REJETEE') {
            acc.rejetes += 1;
          }
          return acc;
        }, { enCours: 0, delivres: 0, rejetes: 0 });

        setStatsData(counts);
        
        // 2. Préparation des documents populaires (Priorité : Naissance, Casier, Nationalité)
        // On trie pour mettre en avant ce que les citoyens demandent le plus
        const prioritizedCodes = ['NAISSANCE', 'CASIER', 'NATIONALITE', 'MARIAGE'];
        const sortedServices = [...services].sort((a, b) => {
          const indexA = prioritizedCodes.indexOf(a.code);
          const indexB = prioritizedCodes.indexOf(b.code);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });

        const docs = sortedServices.slice(0, 3).map(s => ({
          id: s.id,
          title: s.name,
          description: s.description || `Demande de ${s.name.toLowerCase()}`,
          icon: getIconForCode(s.code),
          path: `/citoyen/services/${s.id}`
        }));
        setPopularDocs(docs);

      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      value: loading ? '--' : statsData.enCours.toString().padStart(2, '0'),
      label: 'DEMANDES EN COURS',
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      value: loading ? '--' : statsData.delivres.toString().padStart(2, '0'),
      label: 'DOCUMENTS DÉLIVRÉS',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      value: loading ? '--' : statsData.rejetes.toString().padStart(2, '0'),
      label: 'DOCUMENTS REJETÉS',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const getFirstName = () => {
    if (user?.prenom && user.prenom.toLowerCase() !== 'mairie') return user.prenom;
    if (user?.name && user.name.toLowerCase() !== 'mairie') return user.name.split(' ')[0];
    return 'Citoyen';
  };
  const firstName = getFirstName();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-6 sticky top-0 z-10 shadow-sm lg:px-8">
        <div className="flex items-center space-x-3 lg:hidden">
          <Emblem className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#1A237E] leading-tight tracking-tight uppercase">Burkina Faso</span>
            <span className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase">E-Services Officiels</span>
          </div>
        </div>
        <div className="hidden lg:block text-center flex-1">
          <h1 className="text-2xl font-extrabold text-[#1A237E] mr-10">Tableau de Bord</h1>
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

      <div className="p-4 flex-1 mt-4 lg:mt-8">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Greeting Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Bonjour, {firstName}
              </h2>
              <p className="text-sm font-medium text-gray-500 mt-2 max-w-lg leading-relaxed">
                Bienvenue sur votre espace sécurisé. Simplifiez vos démarches administratives et accédez à vos documents officiels.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-green-50 rounded-full border border-green-100 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-green-700 tracking-widest uppercase">
                Services Opérationnels
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative w-full h-[22rem] md:h-80 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 group">
            <img 
              src="/building.png" 
              alt="Administration Burkina Faso" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A237E]/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <span className="inline-block px-4 py-1.5 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#1A237E] bg-white rounded-full shadow-lg">
                GUICHET UNIQUE NUMÉRIQUE
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                L'administration à portée de clic
              </h3>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed font-semibold opacity-90">
                Gagnez du temps en effectuant vos demandes de documents officiels en ligne. Suivez l'évolution de vos dossiers en temps réel.
              </p>
            </div>
          </div>

          {/* Popular Documents */}
          <div>
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3 text-gray-900">
                <LayoutDashboard className="text-[#1A237E]" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">Documents Populaires</h3>
              </div>
              <button 
                onClick={() => navigate('/citoyen/services')} 
                className="text-[#1A237E] text-sm font-black flex items-center gap-2 hover:bg-white px-4 py-2 rounded-xl transition-all border border-transparent hover:border-gray-100 group shadow-sm"
              >
                Tout voir <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularDocs.map((doc) => (
                <div key={doc.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col h-full group/card">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8FAFF] flex items-center justify-center text-[#1A237E] mb-6 group-hover/card:bg-[#1A237E] group-hover/card:text-white transition-colors shadow-inner">
                    <doc.icon size={32} />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2 leading-tight">{doc.title}</h4>
                  <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">{doc.description}</p>
                  
                  <button 
                    onClick={() => navigate(doc.path)} 
                    className="w-full py-4 bg-gray-50 text-[#1A237E] hover:bg-[#1A237E] hover:text-white font-black text-sm rounded-2xl transition-all active:scale-[0.98] shadow-sm"
                  >
                    Démarrer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6 cursor-pointer hover:-translate-y-1 transition-all group">
                <div className={`w-16 h-16 rounded-[1.5rem] ${stat.bgColor} flex items-center justify-center shrink-0 shadow-inner`}>
                  {loading ? (
                    <Loader2 className={`animate-spin ${stat.color}`} size={24} />
                  ) : (
                    <stat.icon className={stat.color} size={32} />
                  )}
                </div>
                <div>
                  <p className="text-4xl font-black text-gray-900 leading-none mb-1.5 tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
