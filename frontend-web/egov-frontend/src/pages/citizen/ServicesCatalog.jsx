import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { getCitizenServices } from '../../services/api';

const ServicesCatalog = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('Tout');
  
  const filters = ['Tout', 'Identité', 'État Civil', 'Justice', 'Transports'];

  useEffect(() => {
    getCitizenServices().then(data => setServices(data));
  }, []);

  const filteredServices = filter === 'Tout' 
    ? services 
    : services.filter(s => s.categorie === filter);

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'DISPONIBLE': return 'bg-green-100 text-green-700';
      case 'INSTANTANÉ': return 'bg-blue-100 text-institutional';
      case '48H DÉLAI': return 'bg-orange-100 text-orange-700';
      case 'NOUVEAU': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-institutional text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-full"><Emblem className="w-8 h-8" /></div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">E-Gov Burkina</span>
            <span className="text-[10px] tracking-widest text-blue-200">PORTAIL OFFICIEL</span>
          </div>
        </div>
        <Link to="/notifications" className="relative p-2 bg-white/10 rounded-full">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-institutional"></span>
        </Link>
      </header>

      <div className="p-4 bg-gray-50 flex-1">
        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher un document ou service..." 
            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-institutional/20 focus:border-institutional"
          />
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4 scrollbar-hide">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-institutional text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Documents Populaires</h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl border border-gray-100 shadow-sm group-hover:bg-institutional group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight text-base">{service.name}</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1 tracking-wider uppercase">{service.categorie}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-600 space-x-4 mb-6 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center"><span className="mr-1.5 text-base">💳</span> <span className="font-bold">{service.prix_fcfa.toLocaleString()}</span> FCFA</div>
                <div className="flex items-center font-medium"><span className="mr-1.5 text-base">{service.livraison.includes('Guichet') ? '📍' : '🖥️'}</span> {service.livraison}</div>
              </div>

              <Link to={`/services/${service.id}`} className="mt-auto w-full py-3 bg-[#1A237E] text-white text-center font-extrabold text-sm rounded-xl transition-all hover:bg-[#151b63] active:scale-95 shadow-lg shadow-blue-900/10">
                Lancer la demande <span className="ml-1">→</span>
              </Link>
            </div>
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucun service trouvé pour cette catégorie</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesCatalog;
