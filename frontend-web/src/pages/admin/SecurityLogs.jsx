import React, { useState } from 'react';
import { Shield, Lock, Globe, Server, AlertTriangle } from 'lucide-react';

const SecurityLogs = () => {
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ips] = useState([
    { ip: '192.168.1.1/24', desc: 'Réseau Local - Bureau Principal' },
    { ip: '10.0.0.5', desc: 'Serveur d\'application B' }
  ]);
  const [logs] = useState([
    { time: 'Aujourd\'hui, 14:32', user: 'Admin', action: 'Connexion réussie', ip: '192.168.1.120', status: 'success' },
    { time: 'Aujourd\'hui, 10:15', user: 'Inconnu', action: 'Tentative échouée (Mot de passe)', ip: '41.203.xxx.xx', status: 'danger' },
    { time: 'Aujourd\'hui, 08:00', user: 'Agent002', action: 'Connexion réussie', ip: '192.168.1.45', status: 'success' },
    { time: 'Hier, 23:45', user: 'Système', action: 'Sauvegarde automatique BDD', ip: 'localhost', status: 'info' }
  ]);

  return (
    <div className="font-sans max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sécurité & Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Gérer les politiques d'accès et surveiller l'activité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
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
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                />
                <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="bg-[#1A237E] text-white px-6 rounded-lg font-medium hover:bg-[#093d60] transition-colors whitespace-nowrap">
                  Appliquer
                </button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-[#1A237E]">
              <Shield size={20} className="shrink-0" />
              <p>La session des agents Sera automatiquement fermée après {sessionTimeout} minutes d'inactivité pour des raisons de sécurité.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="text-[#1A237E]" size={24} />
              <h2 className="text-lg font-bold text-gray-800">IPs Autorisées (Whitelist)</h2>
            </div>
            <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-sm text-[#1A237E] font-medium hover:underline">Ajouter IP</button>
          </div>
          <div className="space-y-3">
            {ips.map((ip, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-[#E2E8F0] rounded-lg">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-800">{ip.ip}</p>
                  <p className="text-xs text-gray-500">{ip.desc}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-xs text-[#E52E2E] hover:underline font-medium">Retirer</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Server className="text-[#1A237E]" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Journal des Connexions</h2>
          </div>
          <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-sm border border-[#E2E8F0] px-4 py-1.5 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
            Exporter
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-[#E2E8F0] text-gray-600">
            <tr>
              <th className="px-6 py-3 font-semibold">Horodatage</th>
              <th className="px-6 py-3 font-semibold">Utilisateur</th>
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-6 py-3 font-semibold">Adresse IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{log.time}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{log.user}</td>
                <td className="px-6 py-3">
                  <span className={`flex items-center gap-2 ${
                    log.status === 'success' ? 'text-[#00875A]' : 
                    log.status === 'danger' ? 'text-[#E52E2E]' : 'text-institutional'
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

export default SecurityLogs;
