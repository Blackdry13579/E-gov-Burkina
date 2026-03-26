import React, { useEffect, useState } from 'react';
import { fetchRequests, approveRequest, rejectRequest } from '../../services/api';
import { Search, MoreVertical, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); 
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination Logic
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    // Normalisation
    const s = status?.toUpperCase() || '';
    if (s.includes('COURS')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">EN COURS</span>;
    }
    if (s.includes('ATTENTE')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/60 text-amber-600">EN ATTENTE</span>;
    }
    if (s.includes('VALID') || s.includes('APPROUV')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">APPROUVÉ</span>;
    }
    if (s.includes('REJET')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100/60 text-red-500">REJETÉ</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">{s}</span>;
  };

  return (
    <div className="font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Demandes</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Validation et suivi des dossiers citoyens</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => { setFilter('ALL'); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-[#1A237E] text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Toutes
          </button>
          <button 
            onClick={() => { setFilter('PENDING'); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'PENDING' ? 'bg-orange-500 text-white shadow-md shadow-orange-900/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            En attente
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-[2rem] p-3 border border-gray-100 shadow-sm mb-6 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une référence ou un nom..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-6 py-3 border-transparent rounded-2xl focus:bg-gray-50 focus:ring-0 transition-all font-medium text-gray-800 outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">ID DOSSIER</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">CITOYEN</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">TYPE DE DOCUMENT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">DATE SOUMISSION</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">STATUT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-t-[#1A237E] border-blue-50 rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-gray-500">Chargement des dossiers...</p>
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-black text-gray-400">Aucune demande correspondante</h3>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map(req => {
                  // Format reference e.g. BF-2026-001 (fallback to original ID)
                  const displayId = req.id.startsWith('BF-') ? req.id : `#BF-${new Date().getFullYear()}-${req.id.slice(-3)}`;
                  
                  return (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5 align-middle">
                        <span className="text-sm font-black text-[#1A237E] font-mono whitespace-nowrap">{displayId}</span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.citizen)}&background=F1F5F9&color=1A237E&bold=true`} 
                            alt={req.citizen} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                          />
                          <span className="text-sm font-black text-gray-800 whitespace-nowrap">{req.citizen}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className="text-sm font-semibold text-gray-600 line-clamp-2 max-w-[200px]">{req.document}</span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{req.date}</span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-5 align-middle text-center">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 rounded-xl text-gray-400 hover:text-[#1A237E] hover:bg-blue-50 transition-colors inline-block"
                          title="Étudier le dossier"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredRequests.length > 0 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs font-semibold text-gray-500">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, totalItems)} sur {totalItems.toLocaleString('fr-FR')} demandes
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Generate page numbers (simple version) */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Only show a few pages around current to avoid long lists
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-colors ${
                        currentPage === page 
                          ? 'bg-[#1A237E] text-white border border-[#1A237E]' 
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                // Ellipses
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
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
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.citizen)}&background=F1F5F9&color=1A237E&bold=true`} 
                  alt={selectedRequest.citizen} 
                  className="w-14 h-14 rounded-full object-cover border border-blue-100 bg-white"
                />
                <div>
                  <p className="text-xs font-black text-[#1A237E] uppercase tracking-widest mb-1">Citoyen</p>
                  <p className="text-lg font-black text-gray-800 leading-none">{selectedRequest.citizen}</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">{selectedRequest.document}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Note de l'instructeur</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Inscrivez ici vos remarques ou motifs de rejet..."
                  className="w-full p-5 bg-gray-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-medium text-gray-800 min-h-[120px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  disabled={submitting}
                  onClick={() => handleAction('REJECT')}
                  className="py-5 bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 rounded-[1.5rem] font-black tracking-tight transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <XCircle size={24} />
                  <span>Rejeter</span>
                </button>
                <button 
                  disabled={submitting}
                  onClick={() => handleAction('APPROVE')}
                  className="py-5 bg-green-600 text-white shadow-lg shadow-green-900/20 hover:scale-[1.02] rounded-[1.5rem] font-black tracking-tight transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50"
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
