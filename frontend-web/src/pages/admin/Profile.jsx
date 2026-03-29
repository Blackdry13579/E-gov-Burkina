import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Mail, Phone, ShieldCheck, Save, X } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const initial = user?.nom ? user.nom.charAt(0).toUpperCase() : (user?.prenom ? user.prenom.charAt(0) : 'A');

  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 800));
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

  if (!user) return <div className="p-8 text-center text-gray-500 uppercase font-black tracking-widest">Session expirée.</div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Mon Profil Administrateur</h1>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black shadow-inner border border-white/20">
              {initial}
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-green-500/20">
              <ShieldCheck size={14} />
              {user.role}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{user.prenom} {user.nom}</h2>
            <p className="text-blue-200 mt-1 font-medium opacity-90">{user.email}</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-sm shrink-0 uppercase tracking-widest"
            >
              Modifier
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

      {/* Profile Info Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <UserCircle size={16} className="text-[#1A237E]" /> Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { label: 'Prénom', key: 'prenom', icon: UserCircle, value: user.prenom },
              { label: 'Nom', key: 'nom', icon: UserCircle, value: user.nom },
              { label: 'Email Professionnel', key: 'email', icon: Mail, type: 'email', value: user.email },
              { label: 'Numéro de Téléphone', key: 'telephone', icon: Phone, type: 'tel', value: user.telephone },
            ].map(({ label, key, icon: Icon, type = 'text', value }) => (
              <div key={key}>
                <p className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest flex items-center gap-1.5">
                  <Icon size={12} /> {label}
                </p>
                {editing ? (
                  <input
                    type={type}
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 focus:outline-none text-sm font-bold text-gray-800 transition-all"
                  />
                ) : (
                  <p className="text-sm font-black text-gray-800 tracking-tight">{value || 'Non renseigné'}</p>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-50">
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-2.5 bg-[#1A237E] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#151b63] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/20"
              >
                <Save size={14} />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
