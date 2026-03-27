import React, { useEffect, useState } from 'react';
import { getAgentHistory } from '../../services/api';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const ActionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgentHistory().then(d => { setHistory(d); setLoading(false); });
  }, []);

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des Actions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Flux chronologique de vos traitements</p>
        </div>
        <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter size={15} /> Filtrer
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100 z-0"></div>

          <div className="space-y-3 relative z-10">
            {history.map((item) => (
              <div key={item.id} className="flex items-start gap-4 pl-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ${
                  item.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {item.color === 'green'
                    ? <CheckCircle size={16} className="text-[#00875A]" />
                    : <XCircle size={16} className="text-[#E52E2E]" />
                  }
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Vous avez <span className={`font-bold ${item.color === 'green' ? 'text-[#00875A]' : 'text-[#E52E2E]'}`}>{item.action.toLowerCase()}</span> le dossier <span className="font-mono">{item.dossier}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.citizen} — {item.document}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                      <Clock size={11} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionHistory;
