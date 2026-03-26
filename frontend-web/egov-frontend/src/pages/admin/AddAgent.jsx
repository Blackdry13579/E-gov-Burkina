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
    <div className="font-sans max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-[#E2E8F0] text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Ajouter un Agent</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input 
                type="text" 
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="ex: Jean-Baptiste"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input 
                type="text" 
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="ex: Ouédraogo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
              <input 
                type="text" 
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] font-mono text-sm"
                placeholder="ex: BF-84920-X"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="ex: j.ouedraogo@egov.bf"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input 
                type="text" 
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="ex: 70112233"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service d'affectation</label>
              <select 
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                required
              >
                <option value="" disabled>Sélectionner un service</option>
                <option value="mairie">Mairie (Etat-Civil)</option>
                <option value="justice">Justice (Casier/Nat)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle Système</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                required
              >
                <option value="" disabled>Sélectionner un rôle</option>
                <option value="AGENT_MAIRIE">Agent Mairie</option>
                <option value="AGENT_JUSTICE">Agent Justice</option>
                <option value="SUPERVISEUR">Superviseur Service</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe provisoire</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E]"
                placeholder="********"
              />
            </div>
          </div>
          
          <div className="pt-4 mt-6 border-t border-[#E2E8F0] flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-[#E2E8F0] text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className={`px-6 py-2 ${submitting ? 'bg-gray-400' : 'bg-[#00875A] hover:bg-green-700'} text-white rounded-lg transition-colors font-medium flex items-center gap-2`}
            >
              <Save size={18} />
              <span>{submitting ? 'Enregistrement...' : "Enregistrer l'agent"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;
