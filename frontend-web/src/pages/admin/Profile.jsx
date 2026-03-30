import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Mail, Phone, ShieldCheck, Save, X, Eye } from 'lucide-react';
import { updateAdminProfile } from '../../services/adminService';

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
      await updateAdminProfile(form);
      alert('Profil mis à jour avec succès !');
      setEditing(false);
      // Reload page to refresh context
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState('PROFIL');

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <div className="p-8 text-center text-gray-500 uppercase font-black tracking-widest">Session expirée.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Mon Compte</h1>
          <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">Gestion des informations et de la sécurité admin</p>
        </div>
      </div>

      {/* TABS Navigation */}
      <div className="flex gap-4 border-b border-gray-100 pb-px">
        {[
          { id: 'PROFIL', label: 'Mon Profil', icon: UserCircle },
          { id: 'SECURITY', label: 'Sécurité & Logs', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all relative
              ${activeTab === tab.id ? 'text-[#1A237E]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A237E] rounded-t-full shadow-[0_-2px_10px_rgba(26,35,126,0.3)]"></span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'PROFIL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Block (Left - 2cols) */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-10 h-10 bg-[#EFF3FA] rounded-2xl flex items-center justify-center">
                  <UserCircle size={20} className="text-[#1A237E]" />
                </span>
                Identité de l'Administrateur
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 bg-gray-50 border border-gray-100 text-[#1A237E] font-black rounded-xl hover:bg-white hover:shadow-sm transition-all text-[10px] uppercase tracking-widest"
                >
                  Modifier
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                >
                  <X size={16} /> Annuler
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { label: 'Prénom', key: 'prenom', icon: UserCircle, placeholder: 'Prénom' },
                { label: 'Nom', key: 'nom', icon: UserCircle, placeholder: 'Nom' },
                { label: 'Email Professionnel', key: 'email', icon: Mail, type: 'email' },
                { label: 'Numéro de Téléphone', key: 'telephone', icon: Phone, type: 'tel' },
              ].map(({ label, key, icon: Icon, type = 'text', placeholder }) => (
                <div key={key} className="space-y-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <Icon size={12} /> {label}
                  </p>
                  {editing ? (
                    <input
                      type={type}
                      value={form[key] || ''}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 focus:outline-none text-sm font-bold text-gray-800 transition-all border-dashed focus:border-solid"
                    />
                  ) : (
                    <p className="text-sm font-black text-gray-800 tracking-tight pl-1 border-l-4 border-blue-50 py-1">{form[key] || 'Non renseigné'}</p>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div className="mt-12 flex justify-end pt-8 border-t border-gray-50">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-10 py-4 bg-[#1A237E] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#151b63] transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-900/20 active:scale-95"
                >
                  <Save size={18} />
                  {saving ? 'Enregistrement...' : 'Confirmer les changements'}
                </button>
              </div>
            )}
          </div>

          {/* Hero Profile Card (Right - 1col) */}
          <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-5xl font-black shadow-inner mb-8 mx-auto lg:mx-0">
                {initial}
              </div>
              <div className="space-y-4 text-center lg:text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/10">
                    <ShieldCheck size={14} className="text-blue-300" />
                    {user.role}
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter leading-tight">{form.prenom} <br/> {form.nom}</h2>
                </div>
                <div className="space-y-2 opacity-80">
                  <p className="text-blue-100 font-bold flex items-center gap-3 text-sm justify-center lg:justify-start">
                    <Mail size={16} /> {form.email}
                  </p>
                  <p className="text-blue-100 font-bold flex items-center gap-3 text-sm justify-center lg:justify-start">
                    <Phone size={16} /> {form.telephone}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 pt-10 border-t border-white/10">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-2">Statut Authentification</p>
              <div className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                Vérifié
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SECURITY' && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} className="text-red-600" />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Sécurité & Journaux</h3>
                <p className="text-sm text-gray-400 font-medium">Historique des connexions et actions critiques.</p>
             </div>
          </div>
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Chargement des données de sécurité...</p>
             <p className="text-[10px] text-gray-300 mt-2 font-bold uppercase">Accès restreint à l'administrateur principal</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
