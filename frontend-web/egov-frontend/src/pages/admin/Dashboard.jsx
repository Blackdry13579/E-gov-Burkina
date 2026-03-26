import React, { useEffect, useState } from 'react';
import { FileText, Clock, Users, UserCheck, TrendingUp, TrendingDown, Activity, Minus } from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivities } from '../../services/api';

/* ─── Composant graphique : Graphique à barres ─── */
const BarChart = () => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const data  = [42, 68, 36, 80, 95, 62, 88];
  const max   = Math.max(...data);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900">Volume des demandes (7 derniers jours)</h3>
        <span className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 uppercase tracking-widest">
          Hebdomadaire
        </span>
      </div>

      <div className="flex items-end justify-between gap-3 h-48">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            {/* bar wrapper */}
            <div className="w-full flex flex-col justify-end h-40 relative">
              {/* ghost bar */}
              <div className="absolute inset-0 bg-slate-100 rounded-t-xl" />
              {/* filled bar */}
              <div
                className="relative w-full bg-[#1A237E] rounded-t-xl transition-all duration-500 group-hover:bg-[#3949AB] shadow-md shadow-blue-900/10"
                style={{ height: `${(val / max) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 leading-tight text-center">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Composant graphique : Graphique donut ─── */
const DonutChart = () => {
  const segments = [
    { label: 'En cours',   pct: 65, color: '#1A237E', strokeColor: '#1A237E' },
    { label: 'Approuvées', pct: 20, color: '#00875A', strokeColor: '#00875A' },
    { label: 'Rejetées',   pct: 15, color: '#FF9800', strokeColor: '#FF9800' },
  ];

  const r           = 70;
  const cx          = 96;
  const cy          = 96;
  const circumf     = 2 * Math.PI * r;

  let cumulativeOffset = 0;

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-full">
      <h3 className="text-xl font-black text-gray-900 mb-8 text-center">Distribution des Demandes</h3>

      {/* SVG Donut */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 192 192" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="transparent" stroke="#F1F5F9" strokeWidth="22" />
            {/* Segments */}
            {segments.map((seg, i) => {
              const dash    = (seg.pct / 100) * circumf;
              const offset  = circumf - cumulativeOffset;
              cumulativeOffset += dash;
              return (
                <circle
                  key={i}
                  cx={cx} cy={cy} r={r}
                  fill="transparent"
                  stroke={seg.strokeColor}
                  strokeWidth="22"
                  strokeDasharray={`${dash} ${circumf}`}
                  strokeDashoffset={-( circumf - offset)}
                  strokeLinecap="butt"
                />
              );
            })}
          </svg>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900 leading-none">100%</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Total</span>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="space-y-5 mt-auto">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-sm font-bold text-gray-700">{seg.label}</span>
            </div>
            <span className="text-lg font-black text-gray-900">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Dashboard principal ─── */
const Dashboard = () => {
  const [stats,      setStats]      = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivities(),
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

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-[#1A237E] border-blue-50 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Demandes',
      value: stats.totalRequests?.toLocaleString('fr-FR') ?? '—',
      icon: <FileText size={24} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Demandes en attente',
      value: stats.pendingRequests?.toLocaleString('fr-FR') ?? '—',
      icon: <Clock size={24} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: '0%',
      trend: 'neutral',
    },
    {
      title: 'Citoyens inscrits',
      value: stats.citizens?.toLocaleString('fr-FR') ?? stats.totalCitizens?.toLocaleString('fr-FR') ?? '—',
      icon: <Users size={24} />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      change: '+18%',
      trend: 'up',
    },
    {
      title: 'Agents actifs',
      value: stats.activeAgents?.toLocaleString('fr-FR') ?? '—',
      icon: <UserCheck size={24} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: '+2%',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-8 pb-20">

      {/* ── Bannière de bienvenue ── */}
      <div className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/10">
        <img
          src="/building.png"
          alt="E-Gov Burkina"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dégradé directionnel pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/90 via-[#1A237E]/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-2">
            Tableau de bord
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Bienvenue, Admin</h1>
          <p className="text-blue-100 font-medium max-w-lg leading-relaxed opacity-90">
            Voici l'état actuel de la plateforme e-Government. Gérez les flux de documents et
            supervisez les activités nationales.
          </p>
        </div>
      </div>

      {/* ── Cartes de statistiques ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <TrendBadge trend={card.trend} change={card.change} />
            </div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">
              {card.title}
            </p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* ── Graphiques ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique barres — 2 colonnes */}
        <div className="lg:col-span-2">
          <BarChart />
        </div>

        {/* Graphique donut — 1 colonne */}
        <div className="lg:col-span-1">
          <DonutChart />
        </div>
      </div>

      {/* ── Flux d'activités ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">Dernières Activités</h3>
            <p className="text-sm text-gray-400 font-medium">Flux en direct des demandes citoyens</p>
          </div>
          <button className="px-5 py-2 bg-gray-50 hover:bg-gray-100 text-[#1A237E] font-bold text-sm rounded-xl transition-colors">
            Voir tout l'historique
          </button>
        </div>

        <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="px-8 py-5 flex items-start gap-5 hover:bg-gray-50/60 transition-colors"
              >
                {/* Indicateur coloré */}
                <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${
                  activity.type === 'creation'     ? 'bg-[#00875A]' :
                  activity.type === 'modification' ? 'bg-[#1A237E]'  : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-base font-bold text-gray-800">{activity.text}</p>
                    <span className="text-xs font-medium text-gray-400 ml-4 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">Action enregistrée par le système central</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <Activity size={64} className="mb-4" />
              <p className="text-lg font-bold">Aucune activité récente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Badge de tendance ─── */
const TrendBadge = ({ trend, change }) => {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-1 text-green-600 text-xs font-black bg-green-50 px-2.5 py-1 rounded-xl">
        <TrendingUp size={12} />{change}
      </div>
    );
  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-1 text-red-500 text-xs font-black bg-red-50 px-2.5 py-1 rounded-xl">
        <TrendingDown size={12} />{change}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-gray-400 text-xs font-black bg-gray-50 px-2.5 py-1 rounded-xl">
      <Minus size={12} />{change}
    </div>
  );
};

export default Dashboard;
