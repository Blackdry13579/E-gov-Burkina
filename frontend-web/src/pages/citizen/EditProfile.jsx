import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { getCitizenProfile, updateCitizenProfile } from '../../services/api';
import { 
  User, CreditCard, Phone, Mail, 
  MapPin, Save, X, ArrowLeft,
  ShieldCheck, Info, Bell
} from 'lucide-react';



const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_complet: '',
    cnib: '',
    telephone: '',
    email: '',
    adresse: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCitizenProfile().then(data => {
      setFormData({
        nom_complet: data.nom_complet,
        cnib: data.cnib,
        telephone: data.telephone.replace('+226 ', ''),
        email: data.email,
        adresse: data.adresse
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Séparer le nom complet pour le backend
      const names = formData.nom_complet.trim().split(' ');
      const prenom = names[0] || '';
      const nom = names.slice(1).join(' ') || '';

      const payload = {
        nom,
        prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse
      };

      await updateCitizenProfile(payload);
      navigate('/citoyen/profil');
    } catch (err) {
      alert(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-6 pt-4 lg:pt-8">




      <div className="p-4 flex-1 mt-0">
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button onClick={() => navigate('/citoyen/profil')} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-[#1A3A5C]">Modifier mon profil</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Données citoyennes sécurisées</p>
          </div>
        </div>



        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Nom complet</label>
              <input 
                type="text" 
                value={formData.nom_complet}
                onChange={e => setFormData({...formData, nom_complet: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-institutional focus:ring-1 focus:ring-institutional/30"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Numéro CNIB (Identifiant Unique)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <CreditCard size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.cnib}
                  readOnly 
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-400 outline-none cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2" title="Donnée certifiée">
                  <ShieldCheck size={18} className="text-green-500" fill="currentColor" fillOpacity={0.1} />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-gray-400 italic px-1 flex items-center gap-1.5">
                <Info size={12} />
                Le numéro CNIB ne peut pas être modifié.
              </p>
            </div>


            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Téléphone</label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-institutional focus-within:ring-1 focus-within:ring-institutional/30">
                <span className="bg-gray-100 px-3 py-3 text-sm font-bold text-gray-500 border-r border-gray-200">
                  +226
                </span>
                <input 
                  type="tel" 
                  value={formData.telephone}
                  onChange={e => setFormData({...formData, telephone: e.target.value})}
                  className="w-full p-3 bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none tracking-wide"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">E-mail</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-institutional focus:ring-1 focus:ring-institutional/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Adresse</label>
              <textarea 
                rows="2"
                value={formData.adresse}
                onChange={e => setFormData({...formData, adresse: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-institutional focus:ring-1 focus:ring-institutional/30 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-institutional text-white font-extrabold rounded-2xl shadow-lg shadow-institutional/20 hover:bg-[#151B60] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Enregistrer les modifications
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/citoyen/profil')}
              className="w-full py-4 bg-white text-gray-500 font-bold rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all flex justify-center items-center gap-2"
            >
              <X size={20} />
              Annuler les changements
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
