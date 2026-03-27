import React, { useEffect, useState } from 'react';
import { getMe } from '../../services/api';
import { UserCircle, Mail, Phone, ShieldCheck, Calendar, Star, CheckCircle, Database, Award } from 'lucide-react';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getMe();
        setProfile(user);
      } catch (error) {
        console.error('Failed to load admin profile', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return <div className="p-8 text-center text-gray-500">Impossible de charger le profil.</div>;

  const initial = profile.nom ? profile.nom.charAt(0).toUpperCase() : (profile.prenom ? profile.prenom.charAt(0) : 'A');

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Mon Profil Administrateur</h1>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black shadow-inner border border-white/20">
            {initial}
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-green-500/20">
              <ShieldCheck size={14} />
              {profile.role}
            </div>
            <h2 className="text-3xl font-black tracking-tight">{profile.prenom} {profile.nom}</h2>
            <p className="text-blue-200 mt-1 font-medium opacity-90">Gestionnaire Principal du Système E-Gov</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact info column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={16} className="text-[#1A237E]" />
              Coordonnées Officielles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Email Professionnel</p>
                <p className="text-base font-bold text-gray-800 break-all">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Numéro de Téléphone</p>
                <p className="text-base font-bold text-gray-800">{profile.telephone || 'Non renseigné'}</p>
              </div>
              <div className="sm:col-span-2 border-t border-gray-50 pt-4 mt-2">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Dernière Connexion</p>
                <p className="text-sm font-medium text-gray-600">Depuis une adresse IP autorisée • 26 Mars 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Database size={16} className="text-orange-500" />
              Niveaux d'Accès & Sécurité
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Accès Root</p>
                    <p className="text-xs text-gray-500">Contrôle total sur les agents et services</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-[#00875A] text-xs font-black rounded-full">ACTIF</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Database size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Audit des Logs</p>
                    <p className="text-xs text-gray-500">Consultation des actions systèmes</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-black rounded-full">INCLUS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar stats column */}
        <div className="space-y-6">
          <div className="bg-[#1A237E] rounded-3xl p-6 text-white text-center shadow-lg transform hover:scale-[1.02] transition-transform">
            <Award size={48} className="mx-auto text-yellow-500 mb-3" />
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Session en cours</p>
            <h4 className="text-3xl font-black mt-1">NIVEAU 4</h4>
            <p className="text-xs mt-3 text-blue-200">Autorisation maximale de signature</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Actions Système</p>
            <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors mb-3">
              Modifier mes infos
            </button>
            <button className="w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
