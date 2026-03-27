import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAgentRequests } from '../../services/api';
import { Search, Clock, CheckCircle, XCircle, Loader, Eye, AlertTriangle } from 'lucide-react';

const statusConfig = {
  'EN ATTENTE': { label: 'En attente', color: 'bg-orange-100 text-orange-700', icon: Clock },
  'EN COURS':   { label: 'En cours',   color: 'bg-blue-100 text-institutional',   icon: Loader },
  'VALIDÉ':     { label: 'Validé',     color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'REJETÉ':     { label: 'Rejeté',     color: 'bg-red-100 text-red-700',     icon: XCircle },
};

const filters = ['Tous', 'EN ATTENTE', 'EN COURS', 'VALIDÉ', 'REJETÉ'];

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAgentRequests().then(d => { setRequests(d); setLoading(false); });
  }, []);

  const filtered = requests.filter(r => {
    const matchFilter = filter === 'Tous' || r.status === filter;
    const matchSearch = r.citizen.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.document.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Requêtes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{requests.length} demandes au total</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par citoyen, référence, document..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-[#1A237E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'Tous' ? 'Tous' : statusConfig[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Aucune requête trouvée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.map((req, idx) => {
            const cfg = statusConfig[req.status] || {};
            const Icon = cfg.icon || Clock;
            return (
              <div key={req.id} className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900 font-mono truncate">REF: {req.id}</p>
                      {req.priority === 'URGENT' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={10} /> URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{req.citizen} — {req.document}</p>
                    <p className="text-xs text-gray-400">{req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${cfg.color}`}>{cfg.label}</span>
                  <NavLink to={`/agent/requests/${req.id}/detail`} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#1A237E] hover:bg-blue-50 transition-colors">
                    <Eye size={16} />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestsList;
