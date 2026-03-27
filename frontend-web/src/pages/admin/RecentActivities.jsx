import React, { useEffect, useState } from 'react';
import { fetchRecentActivities } from '../../services/api';
import { Activity, CheckCircle, LogIn, FilePlus } from 'lucide-react';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchRecentActivities();
        setActivities(data);
      } catch (error) {
        console.error('Erreur', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'new': return <FilePlus className="text-institutional" size={20} />;
      case 'validated': return <CheckCircle className="text-[#00875A]" size={20} />;
      case 'login': return <LogIn className="text-gray-500" size={20} />;
      default: return <Activity className="text-gray-500" size={20} />;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Activités Récentes</h1>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-semibold text-gray-800">Journal des actions système</h2>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 flex items-start gap-4 transition-colors">
              <div className="p-2 bg-gray-100 rounded-full mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.text}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="p-8 text-center text-gray-500">Aucune activité récente.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
