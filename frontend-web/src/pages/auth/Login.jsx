import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { useAuthUser } from '../../hooks/useAuth';
import { login as apiLogin, requestAdminPin, loginAdmin } from '../../services/authService';
import {
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,
  Key, ShieldCheck, User, Users, Shield
} from 'lucide-react';

/**
 * UnifiedLogin — Single login page for Citizens, Agents & Admins.
 *
 * Flow:
 * 1. User submits email + password.
 * 2. We attempt regular login (/auth/login).
 *    - citizen → /citoyen/accueil
 *    - agent   → /agent/dashboard
 *    - admin   → request PIN, then show PIN step
 * 3. If regular login fails, we try admin PIN request (silent fallback).
 * 4. If PIN request succeeds → show PIN step.
 * 5. User submits PIN → /auth/admin/login → /admin/dashboard.
 */
const UnifiedLogin = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin]               = useState('');
  const [step, setStep]             = useState('credentials'); // 'credentials' | 'pin'
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const { loginWithToken } = useAuthUser();
  const navigate = useNavigate();

  /* ── Step 1 handler ── */
  const handleCredentials = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Try regular login (citizens + agents)
      const response = await apiLogin(email, password);

      if (response.token && response.user) {
        loginWithToken(response.token, response.user);
        const role = (response.user.role || '').toUpperCase();

        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          // Admin via regular login — still request PIN for security
          await requestAdminPin(email, password);
          setStep('pin');
        } else if (role.startsWith('AGENT') || role === 'SUPERVISEUR') {
          navigate('/agent/dashboard');
        } else {
          navigate('/citoyen/accueil');
        }
        return;
      }
    } catch (regularErr) {
      // Regular login failed — try admin PIN route (silent)
      try {
        const pinRes = await requestAdminPin(email, password);
        if (pinRes.success) {
          setStep('pin');
          return;
        }
      } catch {
        // Both failed — show original error
      }
      setError(regularErr.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2 handler (PIN) ── */
  const handlePin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAdmin(email, password, pin);
      if (response.success) {
        loginWithToken(response.token, response.user);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Code PIN incorrect.');
      }
    } catch (err) {
      setError(err.message || 'Erreur de vérification du PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#EAEEF3] flex items-center justify-center p-2 md:p-4 lg:p-6 font-sans overflow-hidden">

      <div className="w-full max-w-[1200px] h-full max-h-[96vh] bg-white rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row overflow-hidden border border-gray-100">

        {/* ── Left: Illustrated Hero ── */}
        <div className="hidden md:flex md:w-[45%] relative overflow-hidden bg-[#1A237E] flex-shrink-0">
          <img
            src="/building.png"
            alt="Portail officiel - Burkina Faso"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2244]/80 via-[#1A237E]/60 to-[#2952A3]/40" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 w-full h-full overflow-y-auto custom-scrollbar">

            {/* Top: Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-2.5 rounded-xl border border-white/10 shadow-xl">
                <Emblem className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.35em] leading-none mb-0.5">République du</p>
                <p className="text-sm font-black text-white uppercase tracking-tight leading-none">Burkina Faso</p>
              </div>
            </div>

            {/* Middle: Title */}
            <div>
              <div className="flex gap-1.5 mb-4">
                <div className="h-1 w-10 bg-yellow-400 rounded-full" />
                <div className="h-1 w-3 bg-white/20 rounded-full" />
                <div className="h-1 w-3 bg-white/20 rounded-full" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-white leading-[0.9] tracking-tighter mb-4 uppercase">
                E-GOV<br />
                <span className="text-blue-300">Document</span><br />
                Request
              </h1>

              <p className="text-[11px] text-blue-100/70 font-medium max-w-[240px] leading-relaxed mb-6">
                Portail numérique unifié pour les services administratifs de l'État burkinabè.
              </p>

              {/* Role badges */}
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: User,   label: 'Citoyen',         desc: 'Demandez vos documents officiels',   color: 'text-blue-300' },
                  { icon: Users,  label: 'Agent de l\'État', desc: 'Traitez les dossiers en attente',    color: 'text-green-300' },
                  { icon: Shield, label: 'Administrateur',   desc: 'Gérez le système et les utilisateurs', color: 'text-yellow-300' },
                ].map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                    <Icon size={16} className={color} />
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</p>
                      <p className="text-[10px] text-white/50 font-medium">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Legal */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 w-fit">
              <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                Unité · Progrès · Justice
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-14 bg-white overflow-y-auto">
          <div className="w-full max-w-sm mx-auto space-y-8">

            {/* Mobile brand */}
            <div className="flex items-center gap-3 md:hidden">
              <Emblem className="w-10 h-10" />
              <div>
                <p className="text-xs font-black text-[#1A237E] uppercase tracking-tighter leading-none">E-GOV</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Document Request</p>
              </div>
            </div>

            {/* Header */}
            <div className="space-y-1">
              {step === 'credentials' ? (
              <>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                  Connexion
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">
                  Citoyen · Agent · Administrateur
                </p>
              </>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                    Vérification
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">
                    Code PIN envoyé à votre adresse email
                  </p>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* ── STEP 1: Credentials ── */}
            {step === 'credentials' && (
              <form onSubmit={handleCredentials} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 px-1">
                    Adresse Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A237E] transition-colors"
                      size={16}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.bf"
                      required
                      className="w-full pl-11 pr-5 py-3.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1A237E] focus:ring-4 focus:ring-[#1A237E]/5 transition-all placeholder:font-normal text-gray-800"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Mot de passe
                    </label>
                    <a href="#" className="text-[9px] font-black text-[#1A237E] hover:underline uppercase tracking-widest">
                      Oublié ?
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A237E] transition-colors"
                      size={16}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-[#1A237E] focus:ring-4 focus:ring-[#1A237E]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A237E] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1A237E] text-white font-black rounded-xl shadow-xl shadow-blue-900/20 hover:bg-[#151b63] hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span className="text-[11px] uppercase tracking-wider">Se connecter</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Register link */}
                <p className="text-center text-[10px] font-bold text-gray-400">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="text-[#1A237E] underline decoration-2 underline-offset-4 hover:opacity-80">
                    Créer un espace citoyen
                  </Link>
                </p>
              </form>
            )}

            {/* ── STEP 2: PIN (Admin only) ── */}
            {step === 'pin' && (
              <form onSubmit={handlePin} className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3 text-blue-800">
                  <Key size={16} className="mt-0.5 shrink-0 text-[#1A237E]" />
                  <p className="text-[11px] font-bold leading-relaxed">
                    Un code PIN à 4 chiffres a été envoyé à <strong>{email}</strong>. Saisissez-le ci-dessous pour confirmer votre identité.
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 text-center">
                    Code PIN de Sécurité
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-5 border-2 border-gray-100 rounded-xl focus:border-[#1A237E] outline-none transition-all text-center text-3xl font-black tracking-[0.6em] bg-[#F8FAFF] text-[#1A237E]"
                    placeholder="0000"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || pin.length !== 4}
                    className="w-full py-3.5 bg-[#1A237E] text-white font-black rounded-xl shadow-xl shadow-blue-900/20 hover:bg-[#151b63] hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span className="text-[11px] uppercase tracking-wider">Confirmer l'accès</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setPin(''); setError(''); }}
                    className="w-full text-[10px] font-black text-gray-300 hover:text-[#1A237E] uppercase tracking-widest transition-colors text-center py-1"
                  >
                    ← Retour aux identifiants
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-gray-50 text-center space-y-1 opacity-50">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} Gouvernement du Burkina Faso
              </p>
              <p className="text-[8px] text-gray-300 font-medium">
                Ministère de la Transition Digitale
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
