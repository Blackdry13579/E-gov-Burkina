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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de Bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                {card.change && (
                  <span className="text-xs font-medium text-[#00875A] flex items-center bg-green-50 px-1 py-0.5 rounded">
                    <TrendingUp size={12} className="mr-1" />
                    {card.change}
                  </span>
                )}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Flux d'activités récentes</h3>
          <button className="text-sm font-medium text-[#1A237E] hover:underline">Voir tout</button>
        </div>
        
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                  activity.type === 'creation' ? 'bg-green-500' : 
                  activity.type === 'modification' ? 'bg-blue-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucune activité récente enregistrée.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
