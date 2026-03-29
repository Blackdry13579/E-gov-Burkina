import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { createAgent } from '../../services/adminService';
import { useAdminServices } from '../../hooks/useAdmin';

const AddAgent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matricule: `BF-AG-${Date.now().toString().slice(-6)}`,
    email: '',
    telephone: '',
    service: '',
    role: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { services, loading: servicesLoading } = useAdminServices();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.email || !formData.role || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await createAgent(formData);
      alert('Agent créé avec succès !');
      navigate('/admin/users');
    } catch (error) {
      console.error('Save error:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:outline-none transition-all font-semibold text-gray-800 text-sm";
  const labelClass = "text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5";

  return (
    <div className="font-sans max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A237E] hover:shadow-md transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouvel Agent</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Enregistrement d'un nouveau collaborateur</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1: Infos Personnelles + Affectation côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Bloc 01 Informations Personnelles */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <h3 className="text-base font-black text-gray-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-50 text-[#1A237E] rounded-xl flex items-center justify-center text-sm font-black">01</span>
              Informations Personnelles
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className={inputClass} placeholder="Jean-Baptiste" required />
                </div>
                <div>
                  <label className={labelClass}>Nom *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={inputClass} placeholder="Ouédraogo" required />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Professionnel *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="j.ouedraogo@egov.bf" required />
              </div>
              <div>
                <label className={labelClass}>Téléphone</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className={inputClass} placeholder="70 00 00 00" />
              </div>
              <div>
                <label className={labelClass}>Mot de passe *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
              </div>
            </div>
          </div>

          {/* Bloc 02 Affectation */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-base font-black text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-sm font-black">02</span>
                Affectation Officielle
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Service *</label>
                  <select name="service" value={formData.service} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer uppercase"} required>
                    <option value="" disabled>Choisir un service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Rôle Système *</label>
                  <select name="role" value={formData.role} onChange={handleChange} className={inputClass + " appearance-none cursor-pointer uppercase"} required>
                    <option value="" disabled>Choisir un rôle</option>
                    <option value="AGENT">Agent de Service</option>
                    <option value="SUPERVISEUR">Superviseur</option>
                    <option value="ADMIN">Administrateur Système</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Matricule sous bloc Affectation */}
            <div className="bg-[#1A237E] rounded-[2rem] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-16 -mt-16"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-3 opacity-80">Matricule Unique</p>
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-xl font-black font-mono tracking-tighter">{formData.matricule}</h4>
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-1.5">Modifier le matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-3 ${
              submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#00875A] hover:bg-green-700 hover:scale-[1.02] shadow-green-900/20'
            }`}
          >
            <Save size={20} />
            {submitting ? 'Création...' : "Confirmer l'ajout"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgent;
