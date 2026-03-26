import React, { useEffect, useState } from 'react';
import { fetchRequests, approveRequest, rejectRequest } from '../../services/api';
import { Search, Eye, Filter, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchRequests();
      setRequests(data);
    } catch (error) {
      console.error('Erreur', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      if (action === 'APPROVE') {
        await approveRequest(selectedRequest.id, comment);
      } else {
        await rejectRequest(selectedRequest.id, comment);
      }
      setSelectedRequest(null);
      setComment('');
      loadRequests();
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.citizen.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || r.status === 'EN ATTENTE';
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Demandes</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Validation et suivi des dossiers citoyens</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-[#1A237E] text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Toutes
          </button>
          <button 
            onClick={() => setFilter('PENDING')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'PENDING' ? 'bg-orange-500 text-white shadow-md shadow-orange-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            En attente
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm mb-8">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une référence ou un nom..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-medium text-gray-800"
          />
        </div>
      </div>

      {/* Requests Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="w-12 h-12 border-4 border-t-[#1A237E] border-blue-50 rounded-full animate-spin mb-4"></div>
            <p className="font-bold">Chargement des dossiers...</p>
          </div>
        ) : filteredRequests.map(req => (
          <div key={req.id} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              req.status === 'EN ATTENTE' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-[#00875A]'
            }`}>
              <FileText size={28} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <p className="text-sm font-black text-[#1A237E] font-mono tracking-tighter uppercase">{req.id}</p>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  req.status === 'EN ATTENTE' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-[#00875A]'
                }`}>
                  {req.status}
                </span>
              </div>
              <h4 className="text-lg font-black text-gray-900">{req.citizen}</h4>
              <p className="text-sm text-gray-400 font-medium">{req.document} • {req.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedRequest(req)}
                className="px-6 py-3 bg-[#1A237E] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-blue-900/10"
              >
                <Eye size={18} />
                Étudier
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-black text-gray-400">Aucune demande correspondant</h3>
          </div>
        )}
      </div>

      {/* Validation Modal (Mobile Style) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Étude du dossier</h3>
                <p className="text-sm text-gray-400 font-medium">Réf: {selectedRequest.id}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900">
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-black text-[#1A237E] uppercase tracking-widest mb-1">Citoyen</p>
                <p className="text-lg font-black text-gray-800">{selectedRequest.citizen}</p>
                <p className="text-sm text-blue-600 font-medium mt-1">{selectedRequest.document}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Note de l'instructeur</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Inscrivez ici vos remarques ou motifs de rejet..."
                  className="w-full p-5 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-medium text-gray-800 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  disabled={submitting}
                  onClick={() => handleAction('REJECT')}
                  className="py-5 bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 rounded-[1.5rem] font-black tracking-tight transition-all flex flex-col items-center justify-center gap-1"
                >
                  <XCircle size={24} />
                  <span>Rejeter</span>
                </button>
                <button 
                  disabled={submitting}
                  onClick={() => handleAction('APPROVE')}
                  className="py-5 bg-[#00875A] text-white shadow-lg shadow-green-900/20 hover:scale-[1.02] rounded-[1.5rem] font-black tracking-tight transition-all flex flex-col items-center justify-center gap-1"
                >
                  <CheckCircle size={24} />
                  <span>Approuver</span>
                </button>
              </div>
              
              {submitting && (
                <p className="text-center text-xs font-bold text-gray-400 animate-pulse">Signature électronique en cours...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;

export default Requests;
