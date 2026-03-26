import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { useAuth } from '../../context/AuthContext';
import { simulateCitizenLogin } from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await simulateCitizenLogin(email, password);
      // loginWithToken(token, userData)
      loginWithToken(response.token, response.user); 
      navigate('/accueil');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm z-10 relative">
        <div className="w-8"></div> {/* Spacer for centering */}
        <div className="flex items-center space-x-2">
          <Emblem className="w-7 h-7" />
          <span className="text-lg font-bold text-institutional tracking-tight">E-Gov</span>
        </div>
        <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-institutional p-1">
          <span className="text-xl">🌐</span>
        </button>
      </header>

      {/* Hero */}
      <section className="relative bg-gray-900 text-white pt-10 pb-16 px-6 text-center">
        <div className="absolute inset-0 bg-institutional opacity-60 mix-blend-multiply"></div>
        <div className="relative">
          <h1 className="text-3xl font-extrabold mb-2">Bienvenue</h1>
          <p className="text-gray-300 text-sm">Accédez à vos services administratifs en un clic.</p>
        </div>
      </section>

      {/* Auth Box */}
      <div className="px-4 -mt-8 relative z-20 flex-1 flex flex-col">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 text-center py-4 border-b-2 border-institutional text-institutional font-bold text-sm bg-gray-50/50">
              Se Connecter
            </div>
            <Link to="/register" className="flex-1 text-center py-4 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors">
              Créer un compte
            </Link>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email ou Identifiant Unique</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: mon.email@domaine.bf" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-institutional/20 focus:border-institutional transition-all text-sm outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-institutional/20 focus:border-institutional transition-all text-sm outline-none pr-10"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-institutional"
                  >
                    👁️
                  </button>
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-xs text-institutional font-medium hover:underline">Mot de passe oublié ?</a>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-institutional text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex justify-center items-center mt-2 disabled:opacity-70"
              >
                {loading ? 'Connexion...' : <>Se connecter <span className="ml-2">→</span></>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="py-8 text-center flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/agent/login" className="text-xs text-gray-400 hover:text-institutional transition-colors font-medium">Portail Agent</Link>
          <span className="text-gray-300">|</span>
          <Link to="/admin/login" className="text-xs text-gray-400 hover:text-institutional transition-colors font-medium">Administration</Link>
          <span className="text-gray-300">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-xs text-gray-400 hover:text-institutional transition-colors font-medium">Aide</a>
        </div>
        <p className="text-[10px] text-gray-400 font-medium tracking-wider">
          RÉPUBLIQUE DU BURKINA FASO • PORTAIL OFFICIEL
        </p>
      </footer>
    </div>
  );
};

export default Login;
