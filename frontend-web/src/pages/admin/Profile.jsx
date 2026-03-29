import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Mail, Phone, ShieldCheck, Camera, Save, X, Lock, Shield, Server, Globe, AlertTriangle } from 'lucide-react';

const AdminProfile = () => {
  const { user, loginWithToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profil'); // 'profil' | 'securite'
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [sessionTimeout] = useState(30);

  const logs = [
    { time: "Aujourd'hui, 14:32", user: 'Admin', action: 'Connexion réussie', ip: '192.168.1.120', status: 'success' },
    { time: "Aujourd'hui, 10:15", user: 'Inconnu', action: 'Tentative échouée (Mot de passe)', ip: '41.203.xxx.xx', status: 'danger' },
    { time: "Aujourd'hui, 08:00", user: 'Agent002', action: 'Connexion réussie', ip: '192.168.1.45', status: 'success' },
    { time: 'Hier, 23:45', user: 'Système', action: 'Sauvegarde automatique BDD', ip: 'localhost', status: 'info' }
  ];

  useEffect(() => {
    // Fake loading for UX
    const loadProfile = async () => {
      try {
        const u = user || { nom: 'Admin', prenom: 'Système', email: 'admin@egov.bf', role: 'ADMIN' };
        setProfile(u);
        setForm({
          nom: u.nom || '',
          prenom: u.prenom || '',
          email: u.email || '',
          telephone: u.telephone || '',
        });
      } catch (error) {
        console.error('Failed to load admin profile', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 800));
      const newProfile = { ...profile, ...form };
      setProfile(newProfile);
      // Optional: Update context if needed
      // loginWithToken(localStorage.getItem('egov_token'), newProfile);
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return <div className="p-8 text-center text-gray-500">Impossible de charger le profil.</div>;

  const initial = profile.nom ? profile.nom.charAt(0).toUpperCase() : (profile.prenom ? profile.prenom.charAt(0) : 'A');

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">Mon Profil Administrateur</h1>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Photo de profil */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black shadow-inner border border-white/20">
              {initial}
            </div>
            {editing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors">
                <Camera size={14} className="text-gray-900" />
              </button>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-green-500/20">
              <ShieldCheck size={14} />
              {profile.role}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{profile.prenom} {profile.nom}</h2>
            <p className="text-blue-200 mt-1 font-medium opacity-90">{profile.email}</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-sm shrink-0"
            >
              Modifier le profil
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="p-3 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'profil' ? 'border-[#1A237E] text-[#1A237E]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Profil Administrateur
        </button>
        <button
          onClick={() => setActiveTab('securite')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'securite' ? 'border-[#1A237E] text-[#1A237E]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Sécurité & Logs
        </button>
      </div>

      {/* Tab: Profil */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserCircle size={16} className="text-[#1A237E]" /> Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Prénom', key: 'prenom', icon: UserCircle },
                { label: 'Nom', key: 'nom', icon: UserCircle },
                { label: 'Email Professionnel', key: 'email', icon: Mail, type: 'email' },
                { label: 'Numéro de Téléphone', key: 'telephone', icon: Phone, type: 'tel' },
              ].map(({ label, key, icon: Icon, type = 'text' }) => (
                <div key={key}>
                  <p className="text-xs text-gray-400 font-bold mb-2 uppercase flex items-center gap-1.5">
                    <Icon size={12} /> {label}
                  </p>
                  {editing ? (
                    <input
                      type={type}
                      value={form[key] || ''}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:outline-none text-sm font-semibold text-gray-800 transition-all"
                    />
                  ) : (
                    <p className="text-base font-bold text-gray-800">{profile[key] || 'Non renseigné'}</p>
                  )}
                </div>
              ))}

              {editing && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 font-bold mb-2 uppercase flex items-center gap-1.5">
                    <Lock size={12} /> Nouveau Mot de Passe
                  </p>
                  <input
                    type="password"
                    placeholder="Laisser vide pour ne pas changer"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:outline-none text-sm font-semibold text-gray-800 transition-all"
                  />
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#1A237E] text-white rounded-2xl font-bold text-sm hover:bg-[#151b63] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab: Sécurité & Logs */}
      {activeTab === 'securite' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-[#1A237E]" size={24} />
                <h2 className="text-lg font-bold text-gray-800">Paramètres de Session</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai d'expiration de session (minutes)
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    defaultValue={sessionTimeout}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                  />
                  <button className="bg-[#1A237E] text-white px-6 rounded-lg font-medium hover:bg-[#151b63] transition-colors whitespace-nowrap">
                    Appliquer
                  </button>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-[#1A237E] mt-4">
                  <Shield size={20} className="shrink-0" />
                  <p>La session sera automatiquement fermée après {sessionTimeout} minutes d'inactivité.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Globe className="text-[#1A237E]" size={24} />
                  <h2 className="text-lg font-bold text-gray-800">IPs Autorisées</h2>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { ip: '192.168.1.1/24', desc: 'Réseau Local - Bureau Principal' },
                  { ip: '10.0.0.5', desc: "Serveur d'application B" }
                ].map((ip, i) => (
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

          {/* Logs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Server className="text-[#1A237E]" size={24} />
                <h2 className="text-lg font-bold text-gray-800">Journal des Connexions</h2>
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Horodatage</th>
                  <th className="px-6 py-3 font-semibold">Utilisateur</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">{log.time}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{log.user}</td>
                    <td className="px-6 py-3">
                      <span className={`flex items-center gap-2 ${log.status === 'success' ? 'text-green-600' : log.status === 'danger' ? 'text-red-600' : 'text-blue-600'}`}>
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
      )}
    </div>
  );
};

export default AdminProfile;
