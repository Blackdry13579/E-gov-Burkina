import React, { useState } from 'react';
import { useAgentRequests } from '../../hooks/useAgent';
import { approveRequest, rejectRequest, getRequestDetail } from '../../services/agentService';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar, FileText, Download, User, MapPin, Eye } from 'lucide-react';

const RequestsList = () => {
  const { requests, loading, refresh } = useAgentRequests();
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customDate, setCustomDate] = useState('');
  
  // Validation flow state
  // null = closed, { id, step } where step = 'DETAILS' | 'REJECT_FORM' | 'SUCCESS'
  const [activeRequest, setActiveRequest] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleOpenDetails = async (reqSummary) => {
    setActiveRequest({ id: reqSummary.id, step: 'DETAILS' });
    setLoadingDetail(true);
    try {
      const detail = await getRequestDetail(reqSummary.id).catch(() => ({
        ...reqSummary,
        citizen: { 
          name: reqSummary.citizen, 
          dob: 'Non renseignée', 
          phone: 'Non renseigné', 
          address: 'Non renseignée',
          nationalId: '—'
        },
        pieces: [],
        submittedAt: reqSummary.date || '—'
      }));
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
        const res = await approveRequest(activeRequest.id, 'Dossier conforme et validé.');
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'APPROVE' });
      } else if (action === 'REJECT') {
        if (!comment.trim()) { alert('Le motif est obligatoire pour un rejet.'); setSubmitting(false); return; }
        const res = await rejectRequest(activeRequest.id, comment);
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'REJECT' });
      }
      refresh(); // Refresh list after action
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
      setComment('');
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = (r.citizen || '').toLowerCase().includes(search.toLowerCase()) || 
                          (r.id || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (r.status || '').toUpperCase().includes(statusFilter);
    
    let matchesPeriode = true;
    if (customDate && r.date) {
      const parts = r.date.split('/');
      const reqDate = new Date(parts[2], parts[1]-1, parts[0]);
      matchesPeriode = reqDate.toDateString() === new Date(customDate).toDateString();
    }
    
    return matchesSearch && matchesStatus && matchesPeriode;
  });

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('ATTENTE')) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] whitespace-nowrap">En attente</span>;
    if (s.includes('VALID')) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] whitespace-nowrap">Validée</span>;
    if (s.includes('REJET')) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626] whitespace-nowrap">Rejetée</span>;
    return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 whitespace-nowrap">{status}</span>;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#1A237E] tracking-tight uppercase">Gestion des Demandes</h1>
        <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-wider">Traitement intégré des dossiers nationaux.</p>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par référence ou nom..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-[#1A237E]/10 shadow-sm text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/10 shadow-sm cursor-pointer"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ATTENTE">En attente</option>
            <option value="VALID">Validées</option>
            <option value="REJET">Rejetées</option>
          </select>

          {/* Calendrier Picker */}
          <div className="relative shrink-0 flex items-center gap-2">
            <div className="relative overflow-hidden">
              <input
                type="date"
                value={customDate}
                onChange={(e) => { setCustomDate(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/10 shadow-sm transition-all"
              />
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {customDate && (
              <button 
                onClick={() => { setCustomDate(''); setCurrentPage(1); }}
                className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
              >
                Tout voir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">RÉFÉRENCE</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">CITOYEN</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">DOCUMENT</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-center">STATUT</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="py-24 text-center text-gray-300 font-black italic tracking-widest">CONSULTATION...</td></tr>
              ) : paginatedRequests.length === 0 ? (
                <tr><td colSpan="5" className="py-24 text-center text-gray-400 font-bold uppercase tracking-widest">Aucun dossier trouvé</td></tr>
              ) : (
                paginatedRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-all bg-white group">
                    <td className="px-8 py-5 align-middle">
                      <span className="text-sm font-black text-slate-700 font-mono tracking-tighter">{req.id}</span>
                    </td>
                    <td className="px-8 py-5 align-middle font-black text-slate-800 text-sm">
                      {req.citizen}
                    </td>
                    <td className="px-8 py-5 align-middle">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                        {req.document}
                      </span>
                    </td>
                    <td className="px-8 py-5 align-middle text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-8 py-5 align-middle text-right">
                      <button 
                        onClick={() => handleOpenDetails(req)}
                        className="text-[11px] font-black text-[#1A237E] hover:text-[#0D145A] uppercase tracking-widest transition-all"
                      >
                        Voir Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredRequests.length > 0 && (
          <div className="px-8 py-6 bg-white border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} SUR {totalItems} DOSSIERS
            </p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 rounded-xl border border-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 rounded-xl border border-gray-100 flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── INTEGRATED MODAL (Same as Admin) ── */}
      {activeRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`px-8 py-5 flex items-center justify-between shrink-0 ${activeRequest.step === 'SUCCESS' ? 'bg-[#10B981]' : activeRequest.step === 'REJECT_FORM' ? 'bg-[#DC2626]' : 'bg-[#1A237E]'} text-white transition-colors`}>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                  {activeRequest.step === 'SUCCESS' ? 'Traitement terminé' : activeRequest.step === 'REJECT_FORM' ? 'Motif de rejet' : 'Détails du dossier'}
                </h3>
                <p className="text-[10px] font-mono opacity-80 mt-1 uppercase tracking-widest">RÉF: {activeRequest.id}</p>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <XCircle size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
              
              {activeRequest.step === 'DETAILS' && (
                <div className="p-8">
                  {loadingDetail ? (
                    <div className="py-24 text-center text-gray-400 font-black italic uppercase tracking-widest">Chargement sécurisé...</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Requérant */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Requérant</h4>
                          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1A237E]">
                               <User size={24} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900">{detailData?.citizen?.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{detailData?.citizen?.phone}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                             <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Naissance</p>
                               <p className="text-xs font-bold text-gray-700">{detailData?.citizen?.dob}</p>
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Adresse</p>
                               <p className="text-xs font-bold text-gray-700 leading-relaxed">{detailData?.citizen?.address}</p>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Documents & Pieces */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                              <span>Pièces justificatives</span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[9px]">EN ATTENTE</span>
                           </h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(detailData?.pieces || []).map((file, idx) => (
                                <button key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50/50 transition-colors group">
                                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#1A237E]">
                                      <FileText size={18} />
                                   </div>
                                   <div className="text-left">
                                      <p className="text-xs font-black text-gray-800 truncate max-w-[120px]">{file.name}</p>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase">{file.type === 'pdf' ? 'PDF' : 'IMAGE'}</p>
                                   </div>
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Informations supplémentaires</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date de dépôt</p>
                                 <p className="text-xs font-bold text-gray-700">{detailData?.submittedAt}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Document demandé</p>
                                 <p className="text-xs font-bold text-gray-700">{detailData?.document}</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeRequest.step === 'REJECT_FORM' && (
                <div className="p-12 flex items-center justify-center min-h-[40vh]">
                  <div className="w-full max-w-lg space-y-6">
                    <div className="text-center space-y-2">
                       <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                          <XCircle size={28} />
                       </div>
                       <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Rejeter le dossier</h3>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed">Veuillez indiquer le motif officiel pour lequel ce dossier est refusé. Le citoyen sera immédiatement notifié.</p>
                    </div>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Indiquez par exemple : 'Photo non conforme', 'Dernière pièce manquante'..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-sm min-h-[140px] font-medium shadow-sm"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })} className="flex-1 py-3 border border-gray-200 text-gray-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-colors">Annuler</button>
                      <button onClick={() => handleAction('REJECT')} disabled={submitting || !comment.trim()} className="flex-1 py-3 bg-red-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/10 disabled:opacity-50">Confirmer le rejet</button>
                    </div>
                  </div>
                </div>
              )}

              {activeRequest.step === 'SUCCESS' && (
                <div className="p-12 flex items-center justify-center min-h-[40vh]">
                   <div className="text-center space-y-6">
                      <div className={`w-16 h-16 rounded-3xl ${activeRequest.type === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center mx-auto shadow-sm`}>
                         <CheckCircle size={32} />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-xl font-black text-gray-900 uppercase tracking-[0.15em]">Traitement réussi</h3>
                         <p className="text-xs text-gray-500 font-medium">Le dossier a été clôturé et l'historique a été mis à jour.</p>
                      </div>
                      <button onClick={() => setActiveRequest(null)} className="px-10 py-3 bg-[#1A237E] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#0D145A] transition-all shadow-lg shadow-blue-900/20">Fermer la fenêtre</button>
                   </div>
                </div>
              )}

            </div>

            {/* Modal Actions (Bottom) */}
            {activeRequest.step === 'DETAILS' && !loadingDetail && (
              <div className="px-8 py-5 bg-white border-t border-gray-50 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setActiveRequest({ ...activeRequest, step: 'REJECT_FORM' })}
                  className="px-6 py-2.5 bg-white border border-red-100 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 transition-colors shadow-sm"
                >
                  Rejeter
                </button>
                <button 
                  onClick={() => handleAction('APPROVE')}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#10B981] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#059669] shadow-lg shadow-green-900/20 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Valider le dossier
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
