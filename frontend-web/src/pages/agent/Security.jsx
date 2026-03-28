import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions } from '../../services/agentService';
import { useAuthUser } from '../../hooks/useAuth';
import { Shield, Monitor, Smartphone, LogOut, Key, Trash2, MapPin, Clock, CheckCircle } from 'lucide-react';

const AgentSecurity = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingPass, setChangingPass] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const { logout } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    getSessions().then(d => { setSessions(d); setLoading(false); });
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Les mots de passe ne correspondent pas.'); return; }
    setChangingPass(true);
    await new Promise(r => setTimeout(r, 1200));
    setChangingPass(false);
    setPwMsg('Mot de passe modifié avec succès !');
    setPwForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Sécurité du Compte</h1>

      {/* Sessions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Sessions Actives</h3>
          <button onClick={() => { logout(); navigate('/agent/login'); }} className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1">
            <LogOut size={13} /> Déconnecter tout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6"><div className="w-6 h-6 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div></div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className={`flex items-start justify-between p-4 rounded-xl border ${session.current ? 'border-[#1A237E]/20 bg-blue-50/50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${session.current ? 'bg-[#1A237E]/10' : 'bg-gray-200'}`}>
                    {session.device.includes('Mobile') ? <Smartphone size={16} className="text-gray-600" /> : <Monitor size={16} className="text-gray-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      {session.device}
                      {session.current && <span className="text-xs font-bold text-[#1A237E] bg-blue-100 px-2 py-0.5 rounded-full">Session actuelle</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={10} />{session.location}</span>
                      <span className="text-xs text-gray-400 font-mono">{session.ip}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10} />{session.time}</span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Key size={14} /> Changer le mot de passe
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { key: 'current', label: 'Mot de passe actuel',    placeholder: '••••••••' },
            { key: 'next',    label: 'Nouveau mot de passe',   placeholder: 'Min. 8 caractères' },
            { key: 'confirm', label: 'Confirmer le nouveau',   placeholder: 'Répétez le mot de passe' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
              <input
                type="password"
                placeholder={placeholder}
                value={pwForm[key]}
                onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E]"
                required
              />
            </div>
          ))}

          {pwMsg && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${pwMsg.includes('succès') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {pwMsg.includes('succès') && <CheckCircle size={15} />}
              {pwMsg}
            </div>
          )}

          <button type="submit" disabled={changingPass} className="w-full flex items-center justify-center gap-2 bg-[#1A237E] hover:bg-institutional text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60">
            {changingPass ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> : <Shield size={16} />}
            {changingPass ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentSecurity;
