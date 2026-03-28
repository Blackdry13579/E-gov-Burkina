import React, { useState } from 'react';
import { Shield, Lock, Globe, Server, AlertTriangle } from 'lucide-react';

const AdminLogs = () => {
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ips] = useState([
    { ip: '192.168.1.1/24', desc: 'Réseau Local - Bureau Principal' },
    { ip: '10.0.0.5', desc: "Serveur d'application B" }
  ]);
  const [logs] = useState([
    { time: "Aujourd'hui, 14:32", user: 'Admin', action: 'Connexion réussie', ip: '192.168.1.120', status: 'success' },
    { time: "Aujourd'hui, 10:15", user: 'Inconnu', action: 'Tentative échouée (Mot de passe)', ip: '41.203.xxx.xx', status: 'danger' },
    { time: "Aujourd'hui, 08:00", user: 'Agent002', action: 'Connexion réussie', ip: '192.168.1.45', status: 'success' },
    { time: 'Hier, 23:45', user: 'Système', action: 'Sauvegarde automatique BDD', ip: 'localhost', status: 'info' }
  ]);

  return (
    <div className="font-sans max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tight">Sécurité & Logs</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">Gérer les politiques d'accès et surveiller l'activité du système.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-[#1A237E]" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Paramètres de Session</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai d'expiration de session (minutes)
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                />
                <button className="bg-[#1A237E] text-white px-6 rounded-lg font-medium hover:bg-[#151b63] transition-colors whitespace-nowrap">
                  Appliquer
                </button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-[#1A237E]">
              <Shield size={20} className="shrink-0" />
              <p>La session sera automatiquement fermée après {sessionTimeout} minutes d'inactivité.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="text-[#1A237E]" size={24} />
              <h2 className="text-lg font-bold text-gray-800">IPs Autorisées (Whitelist)</h2>
            </div>
          </div>
          <div className="space-y-3">
            {ips.map((ip, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-800">{ip.ip}</p>
                  <p className="text-xs text-gray-500">{ip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Server className="text-[#1A237E]" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Journal des Connexions</h2>
          </div>
          <button className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
            Exporter
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-semibold">Horodatage</th>
              <th className="px-6 py-3 font-semibold">Utilisateur</th>
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-6 py-3 font-semibold">Adresse IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{log.time}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{log.user}</td>
                <td className="px-6 py-3">
                  <span className={`flex items-center gap-2 ${
                    log.status === 'success' ? 'text-green-600' :
                    log.status === 'danger' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {log.status === 'danger' && <AlertTriangle size={14} />}
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-3 font-mono text-gray-500">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;
