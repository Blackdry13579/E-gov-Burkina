import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, FileText, Shield, FileCheck, 
  CreditCard, Truck, ArrowRight, LayoutGrid,
  Bell
} from 'lucide-react';
import { getCitizenServices } from '../../services/api';
import Emblem from '../../components/common/Emblem';

const ServicesCatalog = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filters = ['Tout', 'Identité', 'État Civil', 'Justice', 'Transports'];

  useEffect(() => {
    getCitizenServices().then(data => setServices(data));
  }, []);

  const getIcon = (categorie) => {
    switch(categorie) {
      case 'Identité': return Shield;
      case 'État Civil': return FileText;
      case 'Justice': return FileCheck;
      default: return FileText;
    }
  };

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'Tout' || s.categorie === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">

      <div className="p-4 flex-1 mt-0">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* ── Page Title (Mobile Only) ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:hidden">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <LayoutGrid className="text-[#1A237E]" size={24} />
                Catalogue
              </h1>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Services Publics Numériques</p>
            </div>
          </div>

          {/* ── Search & Filters ── */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A237E] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un document officiel (ex: CNIB, Acte de naissance...)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFF] border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 focus:border-[#1A237E] transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-gray-100 mr-1">
                <Filter size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégories</span>
              </div>
              {filters.map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f 
                      ? 'bg-[#1A237E] text-white shadow-lg shadow-[#1A237E]/20' 
                      : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => {
              const IconComponent = getIcon(service.categorie);
              return (
                <div key={service.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl hover:shadow-blue-900/5 transition-all group/card relative overflow-hidden">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-[#F8FAFF] rounded-2xl flex items-center justify-center text-[#1A237E] group-hover/card:bg-[#1A237E] group-hover/card:text-white transition-colors shadow-inner">
                      <IconComponent size={32} />
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-[9px] font-black rounded-full border border-green-100 uppercase tracking-widest">
                      Disponible
                    </span>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-extrabold text-gray-900 text-xl leading-tight mb-2 group-hover/card:text-[#1A237E] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                      {service.categorie}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-[#F8FAFF] rounded-2xl border border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Frais d'acte</span>
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={14} className="text-institutional" />
                        <span className="text-sm font-black text-gray-700">{service.prix_fcfa.toLocaleString()} <small className="text-[9px] opacity-60">FCFA</small></span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Transmission</span>
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className="text-institutional" />
                        <span className="text-sm font-black text-gray-700 truncate">{service.livraison}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/citoyen/services/${service.id}`)}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-gray-50 text-[#1A237E] hover:bg-[#1A237E] hover:text-white hover:border-[#1A237E] font-black text-sm rounded-2xl transition-all shadow-sm active:scale-[0.98] group/btn"
                  >
                    Démarrer la procédure 
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}

            {filteredServices.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6 shadow-inner">
                  <Search size={48} />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Aucun service administratif correspondant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCatalog;
