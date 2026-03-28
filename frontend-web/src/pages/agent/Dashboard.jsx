import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthUser } from '../../hooks/useAuth';
import { useAgentStats } from '../../hooks/useAgent';
import { Clock, CheckCircle, TrendingUp, FileText, Building2, ArrowRight } from 'lucide-react';

const AgentDashboard = () => {
  const { stats, loading } = useAgentStats();
  const { user } = useAuthUser();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

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

      {/* Performance chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-4">Performance Hebdomadaire</h3>
        <div className="h-40 flex items-end justify-between gap-3">
          {[55, 80, 45, 90, 70, 65, 40].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-1.5 group">
              <div className="relative w-full rounded-t-lg bg-blue-100 group-hover:bg-[#1A237E] transition-colors" style={{ height: `${h}%` }}>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  {Math.round(h * 0.3)} dossiers
                </div>
              </div>
              <span className="text-xs text-gray-400">{['L','M','M','J','V','S','D'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
