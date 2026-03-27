import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestAdminPin, simulateLogin } from '../../services/api';
import { Shield, Key, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(1); // 1: Email/Pass, 2: PIN
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleRequestPin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await requestAdminPin(email, password);
      if (response.success) {
        setStep(2);
      } else {
        setError(response.message || 'Erreur lors de la demande du PIN');
      }
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await simulateLogin(email, password, pin);
      if (response.success) {
        loginWithToken(response.token, response.user);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Code PIN incorrect');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#E2E8F0] w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#1A237E] text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-50">
            <Shield size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-[#1A237E] mb-1">E-GOV Burkina Faso</h1>
        <p className="text-center text-gray-500 mb-8 font-medium">Portail Administratif Sécurisé</p>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center font-medium animate-shake">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestPin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">E-mail Administrateur</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] outline-none transition-all text-sm"
                  placeholder="admin@egov.bf"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A237E] text-white py-3.5 rounded-xl font-bold hover:bg-[#0e2a80] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <span>Demander un code PIN</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalLogin} className="space-y-5">
            <div className="p-4 bg-blue-50 rounded-xl mb-4 border border-blue-100 flex items-start space-x-3 text-blue-800">
              <Key size={20} className="mt-0.5" />
              <p className="text-xs leading-relaxed font-medium">
                Un code PIN à 4 chiffres a été envoyé à votre adresse e-mail. Veuillez le saisir ci-dessous pour valider votre identité.
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 text-center">Code PIN de Sécurité</label>
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-4 border-2 border-[#E2E8F0] rounded-xl focus:border-[#1A237E] outline-none transition-all text-center text-3xl font-black tracking-[0.5em] focus:ring-4 focus:ring-blue-50"
                placeholder="0000"
                required
                autoFocus
              />
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A237E] text-white py-3.5 rounded-xl font-bold hover:bg-[#0e2a80] transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></span>
                ) : (
                  'Confirmer et Connecter'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 font-bold hover:text-[#1A237E] transition-colors uppercase tracking-widest text-center"
              >
                ← Retour aux identifiants
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate('/agent/login')}
            className="text-xs font-extrabold text-[#1A237E]/60 hover:text-[#1A237E] transition-colors uppercase tracking-widest"
          >
            Portail Agent de Terrain
          </button>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            Système Sécurisé Gouvernemental
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
