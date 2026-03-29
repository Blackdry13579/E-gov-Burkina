import React, { useState } from 'react';
import { useAgentRequests } from '../../hooks/useAgent';
import { approveRequest, rejectRequest, getRequestDetail } from '../../services/agentService';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar, FileText, Download } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const RequestsList = () => {
  const { requests, loading, refresh } = useAgentRequests();
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [periodeFilter, setPeriodeFilter] = useState('ALL');
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
      const detail = await getRequestDetail(reqSummary.id).catch(() => ({
        ...reqSummary,
        citizen: { name: reqSummary.citizen, dob: '—', phone: '—', address: '—' },
        pieces: []
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
        await approveRequest(activeRequest.id, 'Dossier conforme et validé.');
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'APPROVE' });
      } else if (action === 'REJECT') {
        if (!comment.trim()) { alert('Motif obligatoire'); setSubmitting(false); return; }
        await rejectRequest(activeRequest.id, comment);
        setActiveRequest({ id: activeRequest.id, step: 'SUCCESS', type: 'REJECT' });
      }
      refresh();
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
    if (periodeFilter !== 'ALL' && r.date) {
      const today = new Date();
      const parts = r.date.split('/');
      const reqDate = new Date(parts[2], parts[1]-1, parts[0]);
      if (periodeFilter === 'TODAY') {
        matchesPeriode = reqDate.toDateString() === today.toDateString();
      } else if (periodeFilter === 'WEEK') {
        const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
        matchesPeriode = reqDate >= weekAgo;
      } else if (periodeFilter === 'MONTH') {
        matchesPeriode = reqDate.getMonth() === today.getMonth() && reqDate.getFullYear() === today.getFullYear();
      } else if (periodeFilter === 'CUSTOM' && customDate) {
        matchesPeriode = reqDate.toDateString() === new Date(customDate).toDateString();
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPeriode;
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
        <h1 className="text-3xl font-black text-[#1A237E] tracking-tight">Gestion des Demandes</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Interface de traitement des dossiers citoyens.</p>
      </div>

      {/* ── UNIFIED FILTERS ── */}
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

          <select 
            value={periodeFilter}
            onChange={(e) => { setPeriodeFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/10 shadow-sm cursor-pointer"
          >
            <option value="ALL">Toute période</option>
            <option value="TODAY">Aujourd'hui</option>
            <option value="WEEK">Cette semaine</option>
            <option value="MONTH">Ce mois</option>
            <option value="CUSTOM">Choisir une date</option>
          </select>

          {/* Date picker si CUSTOM */}
          {periodeFilter === 'CUSTOM' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => { setCustomDate(e.target.value); setCurrentPage(1); }}
              className="py-3 px-4 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A237E]/10 shadow-sm"
            />
          )}
        </div>
      </div>

      {/* ── UNIFIED TABLE ── */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">RÉFÉRENCE</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">CITOYEN</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider">DOCUMENT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">STATUT</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-300 font-bold italic">Consultation de la base...</td></tr>
              ) : paginatedRequests.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold">Aucun dossier trouvé</td></tr>
              ) : (
                paginatedRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-all bg-white group">
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm font-black text-slate-700 font-mono tracking-tighter">{req.id}</span>
                    </td>
                    <td className="px-6 py-4 align-middle font-bold text-slate-800 text-sm">
                      {req.citizen}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold uppercase tracking-tight border border-slate-200">
                        {req.document}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <NavLink 
                        to={`/agent/requests/${req.id}/detail`}
                        className="text-sm font-bold text-[#0F5F9E] hover:text-[#1A237E] transition-colors whitespace-nowrap"
                      >
                        Voir Détails
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredRequests.length > 0 && (
          <div className="px-6 py-5 bg-white border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} SUR {totalItems}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border border-gray-100 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border border-gray-100 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsList;
