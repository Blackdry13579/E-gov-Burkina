import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Filter, FileText, 
  Clock, CheckCircle, AlertCircle, ChevronRight, Hash, Calendar,
  Bell
} from 'lucide-react';
import { getCitizenRequests } from '../../services/api';
import Emblem from '../../components/common/Emblem';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Tout');
  const navigate = useNavigate();

  const filters = ['Tout', 'En attente', 'Validé', 'Rejeté'];

  useEffect(() => {
    getCitizenRequests().then(data => setRequests(data));
  }, []);

  const getFilteredRequests = () => {
    if (filter === 'Tout') return requests;
    return requests.filter(r => {
      if (filter === 'En attente') return r.statut === 'EN_ATTENTE' || r.statut === 'EN_COURS';
      if (filter === 'Validé') return r.statut === 'VALIDE';
      if (filter === 'Rejeté') return r.statut === 'REJETE';
      return true;
    });
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'VALIDE': 
        return { 
          label: 'Validé', 
          color: 'text-emerald-700', 
          bg: 'bg-emerald-50', 
          icon: CheckCircle,
          border: 'border-emerald-100'
        };
      case 'REJETE': 
        return { 
          label: 'Rejeté', 
          color: 'text-red-700', 
          bg: 'bg-red-50', 
          icon: AlertCircle,
          border: 'border-red-100'
        };
      case 'EN_ATTENTE':
      case 'EN_COURS':
        return { 
          label: 'En attente', 
          color: 'text-amber-700', 
          bg: 'bg-amber-50', 
          icon: Clock,
          border: 'border-amber-100'
        };
      default: 
        return { 
          label: status, 
          color: 'text-gray-700', 
          bg: 'bg-gray-50', 
          icon: FileText,
          border: 'border-gray-100'
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">

      <div className="p-4 flex-1 mt-0">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* ── Page Title (Mobile Only) ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:hidden">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <ClipboardList className="text-[#1A237E]" size={24} />
                Mes Demandes
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">
                Suivez l'état d'avancement de vos dossiers en temps réel.
              </p>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 shrink-0 pr-2 border-r border-gray-100 mr-2">
              <Filter size={14} className="text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
            </div>
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f 
                    ? 'bg-[#1A237E] text-white shadow-md shadow-[#1A237E]/20' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── List ── */}
          <div className="space-y-4">
            {getFilteredRequests().map(req => {
              const status = getStatusConfig(req.statut);
              return (
                <div 
                  key={req.id} 
                  onClick={() => navigate(`/citoyen/suivi/${req.reference}`)}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group lg:px-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl ${status.bg} flex items-center justify-center ${status.color}`}>
                        <status.icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-[#1A237E] transition-colors leading-tight mb-1">
                          {req.service_name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <Hash size={12} />
                            {req.reference}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-l border-gray-100 pl-4">
                            <Calendar size={12} />
                            {req.date_depot}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.border} ${status.bg} ${status.color} shadow-sm`}>
                        {status.label}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1A237E] group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {getFilteredRequests().length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4 shadow-inner">
                  <ClipboardList size={36} />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucune demande archivée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
