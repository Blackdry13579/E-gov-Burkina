import React, { useEffect, useState } from 'react';
import { fetchRequests, fetchUsers } from '../../services/api';
import { CheckCircle, XCircle, Clock, Users, BarChart2, TrendingUp, Calendar } from 'lucide-react';

const AdminStats = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [reqs, usrs] = await Promise.all([fetchRequests(), fetchUsers()]);
        setRequests(reqs);
        setUsers(usrs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const approved = requests.filter(r => r.status?.toUpperCase().includes('VALID') || r.status?.toUpperCase().includes('APPROUV')).length;
  const rejected = requests.filter(r => r.status?.toUpperCase().includes('REJET')).length;
  const pending  = requests.filter(r => r.status?.toUpperCase().includes('ATTENTE') || r.status?.toUpperCase().includes('COURS')).length;
  const total    = requests.length;

  const agents = users.filter(u => u.role?.startsWith('AGENT'));

  // Calcul charge agents (mock basé sur les demandes)
  const agentStats = agents.map(agent => ({
    ...agent,
    treated: Math.floor(Math.random() * 20) + 1,
    approved: Math.floor(Math.random() * 15),
    rejected: Math.floor(Math.random() * 5),
  }));

  const statCards = [
    { label: 'Total Demandes',   value: loading ? '...' : total,    icon: BarChart2,    color: '#1A237E', bg: '#EFF3FA' },
    { label: 'Approuvées',       value: loading ? '...' : approved,  icon: CheckCircle,  color: '#00875A', bg: '#DCFCE7' },
    { label: 'En attente',       value: loading ? '...' : pending,   icon: Clock,        color: '#D97706', bg: '#FEF3C7' },
    { label: 'Rejetées',         value: loading ? '...' : rejected,  icon: XCircle,      color: '#DC2626', bg: '#FEE2E2' },
  ];

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('VALID') || s.includes('APPROUV')) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">Approuvée</span>;
    if (s.includes('REJET')) return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626]">Rejetée</span>;
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706]">En attente</span>;
  };

  return (
    <div className="font-sans pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tight">Statistiques & Rapports</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Tableau de bord analytique des demandes et de l'activité des agents.</p>
      </div>

      {/* --- Cards Stats Demandes --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={22} style={{ color }} />
              </div>
              <TrendingUp size={14} className="text-gray-300" />
            </div>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* --- Taux de traitement --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
          <BarChart2 size={16} className="text-[#1A237E]" /> Répartition des Statuts
        </h2>
        {total > 0 && (
          <div className="space-y-4">
            {[
              { label: 'Approuvées', count: approved, color: '#00875A', bg: '#DCFCE7' },
              { label: 'En attente', count: pending,  color: '#D97706', bg: '#FEF3C7' },
              { label: 'Rejetées',   count: rejected, color: '#DC2626', bg: '#FEE2E2' },
            ].map(({ label, count, color, bg }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  <span className="text-sm font-black" style={{ color }}>{count} ({total > 0 ? Math.round((count/total)*100) : 0}%)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${total > 0 ? (count/total)*100 : 0}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {total === 0 && !loading && <p className="text-center text-gray-400 py-6">Aucune demande pour le moment.</p>}
      </div>

      {/* --- Activité des agents --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
          <Users size={16} className="text-[#1A237E]" /> Activité des Agents
        </h2>
        {agentStats.length === 0 && !loading ? (
          <p className="text-center text-gray-400 py-6">Aucun agent enregistré.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-[10px] font-black uppercase text-gray-400 tracking-wider">Agent</th>
                  <th className="pb-3 text-[10px] font-black uppercase text-gray-400 tracking-wider">Service</th>
                  <th className="pb-3 text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">Traitées</th>
                  <th className="pb-3 text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">Approuvées</th>
                  <th className="pb-3 text-[10px] font-black uppercase text-gray-400 tracking-wider text-center">Rejetées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agentStats.map(agent => (
                  <tr key={agent.id} className="hover:bg-gray-50/50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A237E]/10 flex items-center justify-center text-[#1A237E] font-black text-sm">
                          {agent.name?.charAt(0) || 'A'}
                        </div>
                        <span className="font-bold text-gray-800">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-500 font-medium">{agent.service || '--'}</td>
                    <td className="py-3 text-center font-black text-gray-800">{agent.treated}</td>
                    <td className="py-3 text-center font-black text-[#00875A]">{agent.approved}</td>
                    <td className="py-3 text-center font-black text-red-600">{agent.rejected}</td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={5} className="py-10 text-center text-gray-400 animate-pulse">Chargement...</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Historique des demandes --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <Calendar size={18} className="text-[#1A237E]" />
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Historique des Demandes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Citoyen</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Document</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 animate-pulse">Chargement de l'historique...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">Aucune demande trouvée.</td></tr>
              ) : (
                requests.slice(0, 15).map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{req.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{req.citizen}</td>
                    <td className="px-6 py-4 text-gray-500">{req.document}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{req.date}</td>
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
