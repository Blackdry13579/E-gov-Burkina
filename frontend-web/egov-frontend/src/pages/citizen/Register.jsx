import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { simulateCitizenRegister } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Lock, Loader2, ArrowRight, ChevronLeft, CreditCard, Calendar, Shield } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cnib: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    acceptedRules: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!formData.acceptedRules) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);
    try {
      const response = await simulateCitizenRegister({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password
      });

      if (response.success) {
        loginWithToken(response.token, response.user);
        navigate('/accueil');
      } else {
        setError(response.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#EAEEF3] flex items-center justify-center p-2 md:p-4 lg:p-6 font-sans overflow-hidden">
      
      {/* ── Standardized Auth Card ── */}
      <div className="w-full max-w-[1300px] h-full max-h-[96vh] bg-white rounded-2xl shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* ── Left Side: Hero Section (40%) ── */}
        <div className="hidden md:flex md:w-[40%] relative overflow-hidden bg-[#1A237E]">
          <img 
            src="/building.png" 
            alt="Monument des Martyrs" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 shrink-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121858] via-transparent to-transparent"></div>
          
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
              Portail Officiel <br/>
              des <span className="text-blue-300">Documents</span>
            </h1>
            
            <p className="text-[11px] text-blue-100/60 font-medium max-w-[240px] leading-relaxed mb-8">
              Services administratifs sécurisés et transparents pour tous.
            </p>

            <div className="flex gap-1.5">
              <div className="h-1 w-8 bg-yellow-500 rounded-full"></div>
              <div className="h-1 w-2 bg-white/20 rounded-full"></div>
              <div className="h-1 w-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Balanced Form (60%) ── */}
        <div className="flex-1 flex flex-col items-center p-8 md:p-10 lg:p-12 relative bg-white overflow-y-auto scrollbar-hide pt-24 md:pt-32 lg:pt-40">
          <div className="max-w-md w-full mx-auto space-y-8 lg:space-y-10">
            
            <div className="text-center space-y-1.5">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Créer un compte</h2>
              <p className="text-[10px] font-black text-gray-400 tracking-[0.05em] uppercase opacity-70">Informations administratives requises</p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] font-bold text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Compact Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              
              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Identité Complète</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                  <input type="text" placeholder="Ex: Jean-Baptiste Sawadogo" required
                    value={formData.nom}
                    onChange={e => setFormData({...formData, nom: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1 truncate">N° CNIB</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input type="text" placeholder="BXXXXXXXX" required
                      value={formData.cnib}
                      onChange={e => setFormData({...formData, cnib: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1 truncate">Date Naiss.</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input type="date" required
                      value={formData.dateNaissance}
                      onChange={e => setFormData({...formData, dateNaissance: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Téléphone cellulaire</label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                  <input type="tel" placeholder="+226 XX XX XX XX" required
                    value={formData.telephone}
                    onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1 truncate">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input type="password" placeholder="••••••••" required minLength={6}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1 truncate">Confirmer</label>
                  <div className="relative group">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#1A237E] transition-colors" size={12} />
                    <input type="password" placeholder="••••••••" required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFF] border border-gray-100 rounded-xl text-[11px] font-bold focus:outline-none focus:border-[#1A237E] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start pt-1 px-1">
                <input 
                  type="checkbox" 
                  id="rules" 
                  checked={formData.acceptedRules}
                  onChange={e => setFormData({...formData, acceptedRules: e.target.checked})}
                  className="mt-0.5 w-3.5 h-3.5 text-[#1A237E] border-gray-100 rounded cursor-pointer"
                />
                <label htmlFor="rules" className="ml-2.5 text-[9px] text-gray-400 leading-tight font-medium cursor-pointer">
                  J'accepte les <a href="#" className="underline decoration-1 underline-offset-2 hover:text-[#1A237E]">Conditions Générales</a>.
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-[#1A237E] text-white font-black rounded-xl shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 mt-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <span className="text-[10px] uppercase tracking-wider">Créer mon espace <ArrowRight className="inline ml-1" size={16} /></span>}
              </button>
            </form>

            <div className="text-center pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-[9px] font-black text-gray-300 hover:text-[#1A237E] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <ChevronLeft size={12} /> Me connecter
              </button>
            </div>

            {/* Footer Compact */}
            <div className="pt-6 flex flex-col items-center gap-2 border-t border-gray-50 scale-[0.8] opacity-60">
               <div className="flex items-center gap-2 px-6 py-1 bg-gray-50/50 rounded-full border border-gray-100">
                  <span className="text-[7.5px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
                     Unité - Progrès - Justice
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                  </span>
               </div>
               <p className="text-[7px] font-bold uppercase tracking-[0.2em]">© 2024 Burkina Faso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
