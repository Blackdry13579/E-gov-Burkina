import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { simulateAgentLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

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
      loginWithToken(response.token, response.user);
      navigate('/agent/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#EAEEF3] flex items-center justify-center p-2 md:p-4 lg:p-6 font-sans overflow-hidden">
      
      {/* ── Auth Card ── */}
      <div className="w-full max-w-[1300px] h-full max-h-[96vh] bg-white rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* ── Left: Hero (40%) ── */}
        <div className="hidden md:flex md:w-[40%] relative overflow-hidden bg-[#1A237E]">
          <img
            src="/building.png"
            alt="Bâtiment officiel"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d184a] via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col justify-end p-10 lg:p-12 w-full h-full pb-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10 w-fit mb-6 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="bg-white p-1.5 rounded-lg shadow-lg">
                  <Emblem className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[7px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-0.5 leading-none">République du</span>
                  <span className="text-sm font-black text-white tracking-tighter leading-none uppercase">Burkina Faso</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white leading-[0.9] tracking-tighter mb-4 uppercase">
              Espace<br />
              <span className="text-blue-300">Agent Officiel</span>
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck size={14} className="text-yellow-400" />
              <p className="text-[11px] text-blue-100/80 font-medium leading-relaxed">
                Connectez-vous avec votre matricule pour traiter les demandes citoyennes.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap mb-2">
              {['État Civil', 'Mairie', 'Services Publics'].map(tag => (
                <span key={tag} className="text-[9px] px-3 py-1 bg-white/10 border border-white/10 rounded-full text-blue-200 font-bold">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-1.5">
              <div className="h-1 w-8 bg-yellow-500 rounded-full" />
              <div className="h-1 w-2 bg-white/20 rounded-full" />
              <div className="h-1 w-2 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── Right: Form (60%) ── */}
        <div className="flex-1 flex flex-col items-center p-8 md:p-10 lg:p-12 relative bg-white overflow-y-auto scrollbar-hide pt-24 md:pt-32 lg:pt-40">
          <div className="max-w-xs w-full mx-auto space-y-10 lg:space-y-12">

            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">
                Connexion 🪪
              </h2>
              <p className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase opacity-70">
                Espace sécurisé pour les agents habilités
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">
                    Matricule Agent
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input
                      type="text"
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                      placeholder="Ex: BF-AG-000001"
                      className="w-full pl-9 pr-6 py-3 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-12 py-3 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A237E]"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1A237E] text-white font-black rounded-xl shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                  <span className="text-[10px] uppercase tracking-wider">
                    Se Connecter <ArrowRight className="inline ml-1" size={14} />
                  </span>
                )}
              </button>
            </form>

            <div className="text-center pt-4 space-y-3">
              <Link
                to="/login"
                className="text-[9px] font-black text-gray-300 hover:text-[#1A237E] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                ← Retour à l'espace <span className="text-[#1A237E] underline decoration-2 underline-offset-4">Citoyen</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-col items-center gap-2 border-t border-gray-50 scale-[0.8] opacity-60">
              <div className="flex items-center gap-2 px-6 py-1 bg-gray-50/50 rounded-full border border-gray-100">
                <span className="text-[7.5px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  Unité - Progrès - Justice
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </span>
              </div>
              <p className="text-[7px] font-bold uppercase tracking-[0.2em]">© 2026 Burkina Faso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;
