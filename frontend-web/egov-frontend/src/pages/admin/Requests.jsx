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

      {/* ── Multi-step Validation Modal (Mobile-like PRO flow) ── */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#0F2244]/80 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Main Modal Container */}
          <div className="bg-[#F4F6F9] w-full max-w-4xl h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative">
            
            {/* Header (Appbar equivalent) */}
            <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 z-10 sticky top-0">
              <div className="flex items-center gap-3">
                {activeRequest.step === 'DETAILS' ? (
                  <h3 className="text-lg font-black text-[#1A237E]">Détails de la demande</h3>
                ) : (
                  <button 
                    onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#1A237E] font-bold transition-colors"
                  >
                    <ChevronLeft size={20} />
                    <span>Retour</span>
                  </button>
                )}
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto relative">
              
              {/* === STEP 1: DETAILS === */}
              {activeRequest.step === 'DETAILS' && (
                <div className="pb-28">
                  {loadingDetail ? (
                    <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Chargement des données...</div>
                  ) : (
                    <div className="max-w-3xl mx-auto py-6 space-y-6 px-4">
                      
                      {/* Header Block with Building Icon & Status */}
                      <div className="bg-white p-6 rounded-[1.25rem] border border-[#E8ECF0]">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-[#EEF2F5] rounded-2xl flex items-center justify-center text-[#1A237E] shrink-0 border border-gray-100">
                            <FileText size={28} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-[#1A237E]">{detailData?.document || 'Document'}</h2>
                            <p className="text-sm font-semibold text-gray-500 mt-1">Réf: {detailData?.id || activeRequest.id}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100/50">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-bold text-amber-600">En attente d'examen</span>
                        </div>
                      </div>

                      {/* Section: Informations Citoyen */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 ml-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1A237E] flex items-center justify-center"><AlertCircle size={16} /></div>
                          <h3 className="text-[15px] font-bold text-[#1C1C1E]">Informations Citoyen</h3>
                        </div>
                        <div className="bg-white rounded-[1.25rem] border border-[#E8ECF0] overflow-hidden">
                          <div className="px-5 py-4 flex justify-between items-center bg-[#F8F9FB]">
                            <span className="text-sm text-gray-400 font-semibold">Nom Complet</span>
                            <span className="text-sm text-[#1C1C1E] font-bold">{detailData?.citizen?.name}</span>
                          </div>
                          <div className="h-px bg-[#E8ECF0] mx-5"></div>
                          <div className="px-5 py-4 flex justify-between items-center">
                            <span className="text-sm text-gray-400 font-semibold">Téléphone</span>
                            <span className="text-sm text-[#1C1C1E] font-bold">{detailData?.citizen?.phone}</span>
                          </div>
                          <div className="h-px bg-[#E8ECF0] mx-5"></div>
                          <div className="px-5 py-4 flex justify-between items-center bg-[#F8F9FB]">
                            <span className="text-sm text-gray-400 font-semibold">Date de Naissance</span>
                            <span className="text-sm text-[#1C1C1E] font-bold">{detailData?.citizen?.dob || 'Non spécifié'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section: Détails de la demande */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 ml-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1A237E] flex items-center justify-center"><FileText size={16} /></div>
                          <h3 className="text-[15px] font-bold text-[#1C1C1E]">Détails de la demande</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[1.25rem] border border-[#E8ECF0]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Père</p>
                              <p className="text-sm font-semibold text-[#1C1C1E]">{detailData?.donnees?.pere || 'Non spécifié'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Mère</p>
                              <p className="text-sm font-semibold text-[#1C1C1E]">{detailData?.donnees?.mere || 'Non spécifié'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Lieu de Naissance</p>
                              <p className="text-sm font-semibold text-[#1C1C1E]">{detailData?.donnees?.lieuNaissance || 'Non spécifié'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Date de Naissance (Document)</p>
                              <p className="text-sm font-semibold text-[#1C1C1E]">{detailData?.donnees?.dateNaissance || 'Non spécifié'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section: Pièces Justificatives */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 ml-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1A237E] flex items-center justify-center"><Download size={16} /></div>
                          <h3 className="text-[15px] font-bold text-[#1C1C1E]">Pièces Justificatives</h3>
                        </div>
                        <div className="space-y-3">
                          {(detailData?.pieces || []).length === 0 ? (
                            <p className="text-sm text-gray-500 ml-2">Aucun fichier joint.</p>
                          ) : (
                            detailData.pieces.map((file, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-[1.25rem] border border-[#E8ECF0] flex items-center justify-between group cursor-pointer hover:border-[#1A237E]/30 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-[#EEF2F5] rounded-[10px] flex items-center justify-center text-[#1A237E]">
                                    {file.type === 'pdf' ? <FileText size={20} /> : <AlertCircle size={20} />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-[#1C1C1E]">{file.name}</p>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Document {file.type}</p>
                                  </div>
                                </div>
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#1A237E] hover:bg-blue-50 transition-colors flex items-center gap-2">
                                  <Download size={14} /> Voir
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Section: Historique */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 ml-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1A237E] flex items-center justify-center"><Calendar size={16} /></div>
                          <h3 className="text-[15px] font-bold text-[#1C1C1E]">Historique des actions</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[1.25rem] border border-[#E8ECF0]">
                          {/* Timeline Item (Static mock for example) */}
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-[#1A237E] rounded-full"></div>
                              <div className="w-[2px] h-10 bg-[#1A237E]/20 my-1"></div>
                            </div>
                            <div className="pb-4">
                              <p className="text-sm font-bold text-[#1C1C1E] leading-loose">Demande soumise</p>
                              <p className="text-xs font-semibold text-gray-400">{detailData?.date || 'Date inconnue'}</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                              <div className="w-[2px] h-8 bg-transparent my-1"></div>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-500 leading-loose">En attente de traitement</p>
                              <p className="text-xs font-semibold text-gray-400">Maintenant</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* === STEP 2: VALIDATION CONFIRMATION === */}
              {activeRequest.step === 'CONFIRM_AUTHORIZE' && (
                <div className="min-h-full flex items-center justify-center p-6 animate-in slide-in-from-right-8 duration-300">
                  <div className="bg-white max-w-lg w-full rounded-[2rem] p-10 text-center shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1e293b] mb-4">Confirmer la validation ?</h3>
                    <p className="text-sm font-medium text-[#64748b] leading-relaxed mb-8">
                      Cette action confirmera que tous les documents de <strong className="text-[#1e293b]">{detailData?.citizen?.name}</strong> sont conformes aux exigences réglementaires.
                    </p>
                    <button 
                      onClick={() => handleAction('APPROVE')}
                      disabled={submitting}
                      className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-base transition-colors shadow-lg shadow-green-900/20 mb-3"
                    >
                      {submitting ? 'Validation...' : 'Confirmer'}
                    </button>
                    <button 
                      onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })}
                      className="w-full py-4 bg-transparent text-[#64748b] hover:text-[#1e293b] rounded-xl font-bold text-base transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* === STEP 3: REJECT FORM === */}
              {activeRequest.step === 'REJECT_FORM' && (
                <div className="min-h-full flex items-center justify-center p-6 animate-in slide-in-from-right-8 duration-300">
                  <div className="bg-white max-w-lg w-full rounded-[2rem] p-10 text-center shadow-xl border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1e293b] mb-2">Rejeter le dossier</h3>
                    <p className="text-sm font-medium text-[#64748b] leading-relaxed mb-6">
                      Veuillez indiquer précisément pourquoi ce dossier est rejeté. Le citoyen sera notifié avec ce message.
                    </p>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Motif du rejet (ex: Pièce d'identité illisible...)"
                      className="w-full p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-[#1e293b] min-h-[140px] outline-none text-left mb-6 resize-none"
                    />
                    <button 
                      onClick={() => handleAction('REJECT')}
                      disabled={submitting || !comment.trim()}
                      className="w-full py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl font-bold text-base transition-colors shadow-lg shadow-red-900/20 mb-3 disabled:opacity-50"
                    >
                      {submitting ? 'Traitement...' : 'Confirmer le rejet'}
                    </button>
                    <button 
                      onClick={() => setActiveRequest({ ...activeRequest, step: 'DETAILS' })}
                      className="w-full py-4 bg-transparent text-[#64748b] hover:text-[#1e293b] rounded-xl font-bold text-base transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* === STEP 4: SUCCESS PAGES === */}
              {activeRequest.step === 'SUCCESS' && (
                <div className="min-h-full flex items-center justify-center p-6 bg-white animate-in zoom-in-95 duration-300">
                  <div className="max-w-md w-full text-center py-10">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
                      activeRequest.type === 'APPROVE' ? 'bg-[#16a34a] shadow-green-900/30' : 'bg-[#dc2626] shadow-red-900/30'
                    }`}>
                      <CheckCircle size={64} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1e293b] mb-4">Terminé !</h2>
                    <p className="text-base font-medium text-[#64748b] leading-relaxed mb-10">
                      Le dossier de <strong className="text-[#1e293b]">{detailData?.citizen?.name}</strong> a été {activeRequest.type === 'APPROVE' ? 'validé avec succès' : 'rejeté'}.
                      Une notification a été automatiquement envoyée au citoyen.
                    </p>
                    <button 
                      onClick={() => setActiveRequest(null)}
                      className="w-full py-4 bg-[#1e293b] hover:bg-black text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-gray-900/20"
                    >
                      Retour aux demandes
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar (only for DETAILS step) */}
            {activeRequest.step === 'DETAILS' && !loadingDetail && (
              <div className="bg-white p-5 border-t border-gray-100 flex gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] absolute bottom-0 left-0 right-0 z-10 w-full">
                <button 
                  onClick={() => setActiveRequest({ ...activeRequest, step: 'CONFIRM_AUTHORIZE' })}
                  className="flex-1 h-14 bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all shadow-lg shadow-green-900/20"
                >
                  <CheckCircle size={20} /> Valider le dossier
                </button>
                <button 
                  onClick={() => setActiveRequest({ ...activeRequest, step: 'REJECT_FORM' })}
                  className="flex-1 h-14 bg-white border-2 border-[#dc2626] text-[#dc2626] hover:bg-red-50 flex items-center justify-center gap-2 rounded-xl font-bold text-base transition-all"
                >
                  <XCircle size={20} /> Rejeter
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
