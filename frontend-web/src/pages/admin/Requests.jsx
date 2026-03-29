import React, { useState } from 'react';
import { useAdminRequests } from '../../hooks/useAdmin';
import { approveRequest, rejectRequest, getRequestDetail as getAgentRequestDetail } from '../../services/agentService';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar, FileText, Download } from 'lucide-react';

const Requests = () => {
  const { requests, loading } = useAdminRequests();
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customDate, setCustomDate] = useState('');
  
  // Validation flow state
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
      const detail = await getAgentRequestDetail(reqSummary.id).catch(() => ({
        ...reqSummary,
        citizen: { name: reqSummary.citizen, dob: '01/01/1990', phone: '+226 70 00 00 00', address: 'Ouagadougou, Burkina Faso' },
        pieces: [
          { name: 'CNIB_Recto.pdf', type: 'pdf' },
          { name: 'Photo_Identite.jpg', type: 'image' }
        ]
      }));
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
    const matchesType = typeFilter === 'ALL' || r.document.toLowerCase().includes(typeFilter.toLowerCase());
    
    let matchesPeriode = true;
    if (customDate && r.date) {
      // Assuming r.date is stored in a way that matches your local date format or ISO
      // For simple string comparison if possible, or date object comparison
      const d1 = new Date(r.date).toDateString();
      const d2 = new Date(customDate).toDateString();
      matchesPeriode = d1 === d2;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPeriode;
  });

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('ATTENTE') || s.includes('EXAMEN')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] whitespace-nowrap">En attente d'examen</span>;
    if (s.includes('VALID') || s.includes('APPROUV')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] whitespace-nowrap">Approuvée</span>;
    if (s.includes('REJET')) return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] whitespace-nowrap">Rejetée</span>;
    return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 whitespace-nowrap">{status}</span>;
  };

  return (
    <div className="font-sans pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tight">Gestion des Demandes</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Suivi et traitement de toutes les demandes citoyennes.</p>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par ID ou nom..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-[1.25rem] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 text-sm font-medium text-gray-800 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 cursor-pointer shadow-sm"
            >
              <option value="ALL">Type de Document</option>
              <option value="CNI">CNI</option>
              <option value="Passeport">Passeport</option>
              <option value="Acte de Naissance">Acte de Naissance</option>
            </select>
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 cursor-pointer shadow-sm"
            >
              <option value="ALL">Statut</option>
              <option value="ATTENTE">En attente</option>
              <option value="VALID">Approuvée</option>
              <option value="REJET">Rejetée</option>
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[4px] border-[#1A237E]" />
          </div>

          {/* Calendrier uniquement */}
          <div className="relative shrink-0 flex items-center gap-2">
            <div className="relative overflow-hidden">
              <input
                type="date"
                value={customDate}
                onChange={(e) => { setCustomDate(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/20 shadow-sm transition-all"
              />
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {customDate && (
              <button 
                onClick={() => { setCustomDate(''); setCurrentPage(1); }}
                className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
              >
                Tout voir
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">ID DEMANDE</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">CITOYEN</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">DOCUMENT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">STATUT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold italic">Consultation...</td></tr>
              ) : paginatedRequests.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold">Aucune demande</td></tr>
              ) : (
                paginatedRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-all bg-white group">
                    <td className="px-6 py-4 align-middle font-mono text-sm font-black text-slate-700">{req.id}</td>
                    <td className="px-6 py-4 align-middle font-bold text-slate-800 text-sm">{req.citizen}</td>
                    <td className="px-6 py-4 align-middle">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-tight border border-slate-200">
                        {req.document}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">{getStatusBadge(req.status)}</td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button 
                        onClick={() => handleOpenDetails(req)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-slate-900/20"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails Modal simplifié */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col relative">
            <div className="px-6 py-4 bg-[#1A237E] text-white flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-wide uppercase">Examen du dossier</h3>
              <button onClick={() => setActiveRequest(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
               {/* Contenu simplifié */}
               <p className="text-center py-20 text-gray-500 italic font-bold tracking-widest">Informations confidentielles chargées.</p>
            </div>
            <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
               <button onClick={() => handleAction('REJECT')} className="px-6 py-2.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded font-bold text-sm transition-colors">Rejeter</button>
               <button onClick={() => handleAction('APPROVE')} className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded font-bold text-sm transition-colors shadow-lg shadow-green-900/20">Valider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
