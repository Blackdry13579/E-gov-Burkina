import React, { useEffect, useState } from 'react';
import { FileText, Clock, Users, UserCheck, TrendingUp } from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivities } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivities()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Chargement...</div>;
  }

  const statCards = [
    { title: 'Total Demandes', value: stats.totalRequests, change: stats.requestsGrowth, icon: <FileText size={24} />, color: 'text-institutional', bg: 'bg-blue-100' },
    { title: 'En attente', value: stats.pendingRequests, icon: <Clock size={24} />, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Citoyens', value: stats.citizens, icon: <Users size={24} />, color: 'text-[#00875A]', bg: 'bg-green-100' },
    { title: 'Agents Actifs', value: stats.activeAgents, icon: <UserCheck size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord</h1>
        <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} shadow-inner`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* BLOCK 1: Connected Admin Info (Small - 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black mb-6 border border-white/20">
                {stats.totalAgents > 0 ? 'A' : 'A'}
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Administrateur</p>
              <h2 className="text-2xl font-black mb-4">Portail Central</h2>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-200">Session</span>
                  <span className="text-sm font-bold">Sécurisée</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-200">Statut</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold">En ligne</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Résumé Global</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{stats.pendingRequests}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Demandes à traiter</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                   <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{stats.activeAgents}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Équipe RH active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 2: Latest Activity / Requests (Large - 8/12) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Dernières Activités</h3>
              <p className="text-sm text-gray-400 font-medium">Flux en direct des demandes citoyens</p>
            </div>
            <button className="px-5 py-2 bg-gray-50 hover:bg-gray-100 text-[#1A237E] font-bold text-sm rounded-xl transition-colors">
              Historique complet
            </button>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto max-h-[500px]">
            {activities.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 shadow-sm ${
                      activity.type === 'creation' ? 'bg-[#00875A]' : 
                      activity.type === 'modification' ? 'bg-[#1A237E]' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-base font-bold text-gray-800">{activity.text}</p>
                        <span className="text-xs font-medium text-gray-400">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-500">Action enregistrée par le système central</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <FileText size={64} className="mb-4" />
                <p className="text-lg font-bold">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
