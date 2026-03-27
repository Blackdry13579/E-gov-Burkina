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

      {/* ── Multi-step Validation Modal (Sober & Institutional) ── */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
          
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Officiel */}
            <div className={`px-6 py-4 flex items-center justify-between shrink-0 ${activeRequest.step === 'SUCCESS' ? 'bg-[#10B981]' : activeRequest.step === 'REJECT_FORM' ? 'bg-[#DC2626]' : 'bg-[#1A237E]'} text-white transition-colors`}>
              <div>
                <h3 className="text-lg font-bold tracking-wide uppercase">
                  {activeRequest.step === 'SUCCESS' ? 'Opération réussie' : activeRequest.step === 'REJECT_FORM' ? 'Rejet du dossier' : 'Examen du dossier'}
                </h3>
                <p className="text-sm opacity-80 font-mono">Dossier Réf: {detailData?.id || activeRequest.id}</p>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
              
              {/* === STEP 1: DETAILS === */}
              {activeRequest.step === 'DETAILS' && (
                <div className="p-6">
                  {loadingDetail ? (
                    <div className="py-20 text-center text-gray-500 font-semibold">Chargement des registres...</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left Column (Citizen + History) */}
                      <div className="lg:col-span-1 border border-gray-200 bg-white rounded-lg overflow-hidden h-max">
                        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                          <AlertCircle size={16} className="text-gray-500" />
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Requérant</h4>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(detailData?.citizen?.name || 'C')}&background=E2E8F0&color=1A237E&bold=true`} 
                              alt="Requérant" 
                              className="w-12 h-12 rounded-sm border border-gray-200"
                            />
                            <div>
                              <p className="font-bold text-[#1e293b]">{detailData?.citizen?.name}</p>
                              <p className="text-xs text-gray-500 uppercase">{detailData?.citizen?.phone}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date de Naissance :</p>
                            <p className="text-sm font-semibold text-gray-800">{detailData?.citizen?.dob || 'Non spécifié'}</p>
                          </div>
                        </div>

                        <div className="bg-gray-100 border-t border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 mt-2">
                          <Calendar size={16} className="text-gray-500" />
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Historique</h4>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-1.5 bg-[#1A237E] rounded-full shrink-0"></div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">Dépôt du dossier</p>
                              <p className="text-[10px] text-gray-500">{detailData?.date || 'Date inconnue'}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full shrink-0"></div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500">Examen en cours</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column (Details + Files) */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* Dossier Info */}
                        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
                          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-500" />
                              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Informations du document</h4>
                            </div>
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded border border-amber-200">En attente d'examen</span>
                          </div>
                          <div className="p-5">
                            <p className="text-xl font-bold text-[#1A237E] mb-6">{detailData?.document}</p>
                            
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-1">Père</p>
                                <p className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-1">{detailData?.donnees?.pere || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-1">Mère</p>
                                <p className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-1">{detailData?.donnees?.mere || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-1">Lieu de Naissance</p>
                                <p className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-1">{detailData?.donnees?.lieuNaissance || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-1">Date de Naissance</p>
                                <p className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-1">{detailData?.donnees?.dateNaissance || 'Non spécifié'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Files */}
                        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
                          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                            <Download size={16} className="text-gray-500" />
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Pièces jointes</h4>
                          </div>
                          <div className="p-0">
                            <table className="w-full text-left">
                              <tbody className="divide-y divide-gray-100">
                                {(detailData?.pieces || []).length === 0 ? (
                                  <tr><td className="p-4 text-sm text-gray-500">Aucun fichier.</td></tr>
                                ) : (
                                  detailData.pieces.map((file, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 w-10 text-gray-400">
                                        {file.type === 'pdf' ? <FileText size={18} /> : <AlertCircle size={18} />}
                                      </td>
                                      <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Document {file.type}</p>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <button className="text-xs font-bold text-[#1A237E] hover:underline flex items-center gap-1 justify-end w-full">
                                          <Download size={14} /> Consulter
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === STEP 2: REJECT FORM === */}
              {activeRequest.step === 'REJECT_FORM' && (
                <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
                  <div className="w-full max-w-lg border border-red-200 bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
                       Avis défavorable
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Ce dossier sera marqué comme rejeté. Le citoyen sera informé par notification. Veuillez justifier cette décision administrative.
                    </p>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Motif du rejet (Obligatoire) *</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Indiquez la ou les pièces manquantes, illisibles ou non conformes."
                      className="w-full p-3 border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm min-h-[120px]"
                    />
                    <div className="mt-6 flex justify-end gap-3">
                      <button 
                        onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-bold text-sm"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={() => handleAction('REJECT')}
                        disabled={submitting || !comment.trim()}
                        className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold text-sm disabled:opacity-50"
                      >
                        {submitting ? 'Enregistrement...' : 'Confirmer le rejet'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === STEP 3: SUCCESS PAGES === */}
              {activeRequest.step === 'SUCCESS' && (
                <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
                  <div className="w-full max-w-sm border border-gray-200 bg-white p-8 rounded-lg shadow-sm text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${activeRequest.type === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Traitement enregistré</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Le dossier a été officiellement {activeRequest.type === 'APPROVE' ? 'approuvé' : 'rejeté'} et clôturé dans le registre.
                    </p>
                    <button 
                      onClick={() => setActiveRequest(null)}
                      className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded font-bold text-sm transition-colors"
                    >
                      Retour à la liste
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Institutional Bottom Actions Bar (only for DETAILS step) */}
            {activeRequest.step === 'DETAILS' && !loadingDetail && (
              <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setActiveRequest({ ...activeRequest, step: 'REJECT_FORM' })}
                  className="px-6 py-2.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded shadow-sm font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <XCircle size={16} /> Rejeter le dossier
                </button>
                <button 
                  onClick={() => handleAction('APPROVE')}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded shadow-sm font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <CheckCircle size={16} /> Valider le dossier
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
