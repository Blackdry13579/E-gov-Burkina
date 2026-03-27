import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Star, CheckCircle, Clock } from 'lucide-react';
import { fetchUsers, toggleUserStatus } from '../../services/api';

const AgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      try {
        const agents = await fetchUsers();
        const found = agents.find(a => a.id === id);
        setAgent(found);
      } catch (error) {
        console.error('Erreur', error);
      } finally {
        setLoading(false);
      }
    };
    loadAgent();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!agent) return <div className="p-8 text-center bg-white rounded-xl border border-red-100 text-red-600">Agent introuvable.</div>;

  return (
    <div className="font-sans">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-[#E2E8F0] text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Profil Agent</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col items-center">
            <UserCircle size={80} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{agent.role}</p>
            <span className={`px-4 py-1.5 text-xs font-bold rounded-full mb-6 ${
              agent.status === 'EN SERVICE' ? 'bg-[#00875A]/10 text-[#00875A]' : 'bg-gray-100 text-gray-600'
            }`}>
              {agent.status}
            </span>
            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-[#E2E8F0]">
                <span className="text-gray-500">Matricule</span>
                <span className="font-medium font-mono">{agent.matricule}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-[#E2E8F0]">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-right">{agent.service}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">contact@egov.bf</span>
              </div>
            </div>
            <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="w-full mt-6 px-4 py-2 border border-[#E52E2E] text-[#E52E2E] rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Suspendre l'accès
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Statistiques de Traitement</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <CheckCircle size={18} className="text-[#00875A]" />
                  <span className="text-sm font-medium">Dossiers Validés</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Clock size={18} className="text-orange-500" />
                  <span className="text-sm font-medium">Temps Moyen</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">4.2 jours</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Star size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium">Évaluation</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Historique Récent</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]">
                <div>
                  <p className="font-medium text-sm text-gray-800">Validation Dossier #23049</p>
                  <p className="text-xs text-gray-500">Acte de naissance - Ahmed Zongo</p>
                </div>
                <span className="text-xs text-gray-400">Aujourd'hui, 10:45</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]">
                <div>
                  <p className="font-medium text-sm text-gray-800">Validation Dossier #23048</p>
                  <p className="text-xs text-gray-500">Passeport - Marie Compaoré</p>
                </div>
                <span className="text-xs text-gray-400">Aujourd'hui, 09:15</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]">
                <div>
                  <p className="font-medium text-sm text-gray-800">Connexion Système</p>
                  <p className="text-xs text-gray-500">IP: 192.168.1.5</p>
                </div>
                <span className="text-xs text-gray-400">Aujourd'hui, 08:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
