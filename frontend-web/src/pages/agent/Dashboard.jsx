import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthUser } from '../../hooks/useAuth';
import { useAgentStats, useAgentRequests } from '../../hooks/useAgent';
import { Clock, CheckCircle, TrendingUp, FileText, Building2, ArrowRight, Eye, User } from 'lucide-react';

const AgentDashboard = () => {
  const { stats, loading: statsLoading } = useAgentStats();
  const { requests, loading: reqLoading } = useAgentRequests();
  const { user } = useAuthUser();

  if (statsLoading || reqLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  const pendingRequests = requests?.filter(req => req.status === 'EN_ATTENTE').slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-[#1A237E] to-[#0e3960] rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 right-10 w-24 h-24 bg-white/5 rounded-full translate-y-8"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={14} className="text-blue-300" />
            <span className="text-xs text-blue-300 font-medium uppercase tracking-wide">Cité Administrative — Mairie de Ouagadougou</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Bienvenue, Agent {user?.name?.split(' ').pop() || 'Sawadogo'} 👋</h1>
          <p className="text-blue-200 text-sm mt-1">Aujourd'hui, vous avez <span className="font-bold text-white">{stats.pending} dossiers</span> en attente de traitement.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock size={20} className="text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> {stats.pendingGrowth}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{stats.pending}</p>
          <p className="text-sm text-gray-500 mt-0.5">Demandes en attente</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle size={20} className="text-[#00875A]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{stats.validatedThisMonth}</p>
          <p className="text-sm text-gray-500 mt-0.5">Dossiers validés ce mois</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText size={20} className="text-[#1A237E]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{stats.validationRate}</p>
          <p className="text-sm text-gray-500 mt-0.5">Taux de validation</p>
        </div>
      </div>

      {/* Layout split for Quick Actions and Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dossiers récents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800">Dossiers Récents</h3>
            <NavLink to="/agent/requests" className="text-xs font-bold text-[#1A237E] hover:underline uppercase tracking-widest">
              Voir tout
            </NavLink>
          </div>
          <div className="flex-1 space-y-3">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(req => (
                <div key={req.id || req._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1A237E]">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{req.citizenName || req.utilisateur?.nom || 'Citoyen'}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{req.type || req.documentType?.nom || 'Document'}</p>
                    </div>
                  </div>
                  <NavLink to={`/agent/requests/${req.id || req._id}/detail`} className="p-2 text-gray-400 hover:text-[#1A237E] hover:bg-white rounded-lg transition-colors">
                    <Eye size={18} />
                  </NavLink>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 text-gray-400">
                <CheckCircle size={32} className="mb-2 text-green-400/50" />
                <p className="text-xs font-medium">Aucun nouveau dossier en attente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-bold text-gray-800 mb-4">Actions Rapides</h3>
          <div className="space-y-2">
            <NavLink to="/agent/requests" className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Dossiers en attente</p>
                  <p className="text-xs text-gray-500">{stats.pending} requêtes à traiter</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#1A237E] transition-colors" />
            </NavLink>
            <NavLink to="/agent/history" className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText size={16} className="text-[#1A237E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Mon historique</p>
                  <p className="text-xs text-gray-500">{stats.totalProcessed} dossiers traités au total</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-[#1A237E] transition-colors" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
