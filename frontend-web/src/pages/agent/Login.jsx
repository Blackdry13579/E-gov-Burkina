import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { simulateAgentLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';

const AgentLogin = () => {
  const [matricule, setMatricule] = useState(import.meta.env.VITE_TEST_AGENT_MATRICULE || '');
  const [password, setPassword] = useState(import.meta.env.VITE_TEST_AGENT_PASSWORD || '');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await simulateAgentLogin(matricule, password);
      // loginWithToken(token, user)
      loginWithToken(response.token, response.user);
      navigate('/agent/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#1A237E] to-[#0e3d5e] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize:'60px 60px'}}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl">E-Gov</h1>
              <p className="text-blue-200 text-sm">Burkina Faso</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <ShieldCheck size={16} /> Espace Sécurisé Agent
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">Mairie de<br/>Ouagadougou</h2>
          <p className="text-blue-200 text-base max-w-xs">Connectez-vous avec votre matricule officiel pour accéder à l'espace de traitement des demandes citoyennes.</p>
        </div>
        <div className="relative z-10 flex gap-4 text-sm text-blue-200">
          <span>Cité Administrative</span>
          <span>•</span>
          <span>État Civil</span>
          <span>•</span>
          <span>Services Publics</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1A237E] flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#1A237E]">E-Gov — Espace Agent</h1>
              <p className="text-gray-500 text-xs">Mairie de Ouagadougou</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Connexion Agent</h2>
            <p className="text-gray-500 text-sm mt-1">Entrez votre matricule et mot de passe officiel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Matricule Agent</label>
              <input
                type="text"
                placeholder="Ex: MAI-OUAGA-2024-089"
                value={matricule}
                onChange={e => setMatricule(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A237E]/30 focus:border-[#1A237E] bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A237E]/30 focus:border-[#1A237E] bg-white transition pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1A237E] hover:bg-[#0e3d5e] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              ) : (
                <LogIn size={18} />
              )}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm font-medium text-gray-500 hover:text-[#1A237E] transition-colors"
            >
              Aller vers le Portail Administratif (Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
