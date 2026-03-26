import React, { useEffect, useState } from 'react';
import { fetchRequests, approveRequest, rejectRequest, getAgentRequestDetail } from '../../services/api';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar, FileText, Download } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Validation flow state
  // null = closed, { data, step } where step = 'DETAILS' | 'REJECT_FORM' | 'SUCCESS'
  const [activeRequest, setActiveRequest] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pagination
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

  const handleOpenDetails = async (reqSummary) => {
    setActiveRequest({ id: reqSummary.id, step: 'DETAILS' });
    setLoadingDetail(true);
    try {
      // Dans la vraie vie, on fetch les détails. Si pas dispo, on mock.
      const detail = await getAgentRequestDetail(reqSummary.id).catch(() => ({
        ...reqSummary,
        citizen: { name: reqSummary.citizen, dob: '01/01/1990', phone: '+226 70 00 00 00', address: 'Ouagadougou, Burkina Faso' },
        pieces: [
          { name: 'CNIB_Recto.pdf', type: 'pdf' },
          { name: 'Photo_Identite.jpg', type: 'image' }
        ]
      }));
      // On s'assure que le citizen name est bien un objet si l'API renvoie juste la str
      if (typeof detail.citizen === 'string') {
        detail.citizen = { name: detail.citizen, phone: '+226 XX XX XX XX' };
      }
      setDetailData(detail);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAction = async (action) => {
    setSubmitting(true);
    try {
      if (action === 'APPROVE') {
        await approveRequest(activeRequest.id, 'Dossier conforme et validé.');
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'APPROVE' });
      } else if (action === 'REJECT') {
        if (!comment.trim()) { alert('Motif obligatoire'); setSubmitting(false); return; }
        await rejectRequest(activeRequest.id, comment);
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'REJECT' });
      }
      loadRequests();
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
      setComment('');
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.citizen.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status.toUpperCase().includes(statusFilter);
    const matchesType = typeFilter === 'ALL' || r.document.includes(typeFilter); // Simplifié
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('COURS')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 whitespace-nowrap">En cours</span>;
    if (s.includes('ATTENTE') || s.includes('EXAMEN')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] whitespace-nowrap">En attente d'examen</span>;
    if (s.includes('VALID') || s.includes('APPROUV')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] whitespace-nowrap">Approuvée</span>;
    if (s.includes('REJET')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] whitespace-nowrap">Rejetée</span>;
    return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 whitespace-nowrap">{status}</span>;
  };

  return (
    <div className="font-sans pb-20">
      
      {/* ── Filters Bar ── */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par ID (CDB-2026-XXXX) ou nom du citoyen..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-[1.25rem] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 text-sm font-medium text-gray-800 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0">
          <div className="relative shrink-0">
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 cursor-pointer shadow-sm"
            >
              <option value="ALL">Type de Document</option>
              <option value="CNI">CNI</option>
              <option value="Passeport">Passeport</option>
              <option value="Naissance">Acte de Naissance</option>
            </select>
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="relative shrink-0">
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 cursor-pointer shadow-sm"
            >
              <option value="ALL">Statut</option>
              <option value="ATTENTE">En attente</option>
              <option value="COURS">En cours</option>
              <option value="VALID">Approuvée</option>
              <option value="REJET">Rejetée</option>
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[4px] border-[#1A237E]" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="relative shrink-0">
            <select 
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 cursor-pointer shadow-sm"
            >
              <option>Période</option>
            </select>
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">ID DEMANDE</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">CITOYEN</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">TYPE DE DOCUMENT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">DATE DE SOUMISSION</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">STATUT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold">Chargement...</td></tr>
              ) : paginatedRequests.length === 0 ? (
                <tr><td colSpan="6" className="py-20 text-center text-gray-400 font-bold">Aucun résultat</td></tr>
              ) : (
                paginatedRequests.map(req => {
                  // Format match design (e.g. CDB-2026-8812)
                  const displayId = req.id.includes('-') ? req.id : `CDB-${new Date().getFullYear()}-${req.id.slice(-4).padStart(4,'0')}`;
                  
                  return (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-bold text-[#334155]">{displayId}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.citizen)}&background=F1F5F9&color=334155&bold=true`} 
                            alt={req.citizen} 
                            className="w-8 h-8 rounded-full border border-gray-200"
                          />
                          <span className="text-sm font-bold text-[#1E293B] whitespace-nowrap">{req.citizen}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-medium text-[#475569]">{req.document}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-medium text-[#64748B] whitespace-nowrap">{req.date}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <button 
                          onClick={() => handleOpenDetails(req)}
                          className="text-sm font-bold text-[#0F5F9E] hover:text-[#1A237E] transition-colors whitespace-nowrap"
                        >
                          Voir Détails
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && filteredRequests.length > 0 && (
          <div className="px-6 py-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              AFFICHAGE DE {startIndex + 1} À {Math.min(startIndex + itemsPerPage, totalItems)} SUR {totalItems} RÉSULTATS
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-colors ${
                        currentPage === page 
                          ? 'bg-[#1A56DB] text-white shadow-md shadow-blue-900/20' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2) return <span key={page} className="px-1 text-gray-400 text-xs">...</span>;
                return null;
              })}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Multi-step Validation Modal ── */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2244]/80 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* STEP 1: DETAILS & ACTIONS */}
          {activeRequest.step === 'DETAILS' && (
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="text-xl font-black text-[#1A1A2E]">Détails de la demande</h3>
                  <p className="text-sm font-medium text-gray-400 mt-1">Demande {detailData?.id || activeRequest.id}</p>
                </div>
                <button onClick={() => setActiveRequest(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                {loadingDetail ? (
                  <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Chargement des données...</div>
                ) : (
                  <>
                    {/* Citoyen Info */}
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Informations Citoyen</h4>
                      <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex items-center gap-5">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(detailData?.citizen?.name || 'C')}&background=E2E8F0&color=1A237E&bold=true&size=128`} 
                          alt="Citoyen" 
                          className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-black text-[#1A1A2E]">{detailData?.citizen?.name}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                            <span className="text-sm font-medium text-gray-500">📞 {detailData?.citizen?.phone}</span>
                            <span className="text-sm font-medium text-gray-500">📅 Née le {detailData?.citizen?.dob || '--/--/----'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fichiers */}
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Pièces Jointes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(detailData?.pieces || []).map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 hover:border-[#1A237E]/30 transition-colors cursor-pointer group bg-white">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A237E] flex items-center justify-center shrink-0">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                              <p className="text-xs font-semibold text-gray-400 uppercase">{file.type}</p>
                            </div>
                            <Download size={16} className="text-gray-300 group-hover:text-[#1A237E] transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Actions */}
              {!loadingDetail && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
                  <button 
                    onClick={() => setActiveRequest({ ...activeRequest, step: 'REJECT_FORM' })}
                    className="flex-1 py-4 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} /> Rejeter
                  </button>
                  <button 
                    onClick={() => handleAction('APPROVE')}
                    disabled={submitting}
                    className="flex-1 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl font-black transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? <span className="animate-pulse">Validation...</span> : <><CheckCircle size={20} /> Valider</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: REJECT FORM */}
          {activeRequest.step === 'REJECT_FORM' && (
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Motif du Rejet</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Veuillez indiquer précisément pourquoi ce dossier est rejeté. Le citoyen sera notifié avec ce message.
              </p>
              
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: La pièce d'identité est expirée..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-800 min-h-[120px] outline-none text-left mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-bold transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => handleAction('REJECT')}
                  disabled={submitting || !comment.trim()}
                  className="flex-[2] py-3.5 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 rounded-xl font-black transition-all shadow-lg shadow-red-900/20"
                >
                  {submitting ? 'Traitement...' : 'Confirmer le rejet'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {activeRequest.step === 'SUCCESS' && (
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${activeRequest.type === 'APPROVE' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Terminé !</h3>
              <p className="text-sm text-gray-500 mb-8">
                Le dossier a été {activeRequest.type === 'APPROVE' ? 'approuvé' : 'rejeté'} avec succès. Le citoyen sera notifié.
              </p>
              <button 
                onClick={() => setActiveRequest(null)}
                className="w-full py-4 bg-[#1A1A2E] text-white rounded-2xl font-black hover:bg-black transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
          
        </div>
      )}

    </div>
  );
};

export default Requests;
