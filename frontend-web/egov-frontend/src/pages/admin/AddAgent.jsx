import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Nettoyage des données pour correspondre à l'API backend
      const payload = {
        ...formData,
        // Si le nom complet a été saisi dans un seul champ (anciens restes), on le splite ou on l'adapte
      };
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('egov_token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Erreur lors de la création');
      
      alert('Agent créé avec succès !');
      navigate('/admin/agents');
    } catch (error) {
      console.error("Save error:", error);
      alert('Erreur: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A237E] hover:shadow-md transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouvel Agent</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Enregistrement d'un nouveau collaborateur RH</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 p-10">
            <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-50 text-[#1A237E] rounded-lg flex items-center justify-center text-sm">01</span>
              Informations Personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800"
                  placeholder="ex: Jean-Baptiste"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                <input 
                  type="text" 
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800"
                  placeholder="ex: Ouédraogo"
                  required
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800"
                  placeholder="ex: j.ouedraogo@egov.bf"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                <input 
                  type="text" 
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800"
                  placeholder="70 00 00 00"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800"
                  placeholder="********"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 p-10">
            <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-sm">02</span>
              Affectation Officielle
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Service</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800 appearance-none"
                  required
                >
                  <option value="" disabled>Choisir un service</option>
                  <option value="mairie">Mairie (Etat-Civil)</option>
                  <option value="justice">Justice (Casier/Nat)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Rôle Système</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E] transition-all font-bold text-gray-800 appearance-none"
                  required
                >
                  <option value="" disabled>Choisir un rôle</option>
                  <option value="AGENT_MAIRIE">Agent Mairie</option>
                  <option value="AGENT_JUSTICE">Agent Justice</option>
                  <option value="SUPERVISEUR">Superviseur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info / Summary */}
        <div className="space-y-8">
          <div className="bg-[#1A237E] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-16 -mt-16"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-4 opacity-70">Aperçu du Matricule</p>
             <h4 className="text-2xl font-black font-mono tracking-tighter mb-6">{formData.matricule}</h4>
             <div className="p-4 bg-white/10 rounded-2xl border border-white/10 italic text-xs text-blue-100 leading-relaxed">
               Ce matricule sera l'identifiant unique de l'agent pour toutes ses actions sur le portail E-Gov.
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
            <button 
              type="submit" 
              disabled={submitting}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
                submitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#00875A] hover:bg-green-700 hover:scale-[1.02] shadow-green-900/20'
              }`}
            >
              <Save size={20} />
              <span>{submitting ? 'Création...' : "Confirmer l'ajout"}</span>
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="w-full py-5 rounded-[1.5rem] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAgent;
```
