import React from 'react';
import { Link } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Emblem className="w-8 h-8" />
          <span className="text-xl font-bold text-institutional tracking-tight">E-Gov</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="text-institutional p-2 opacity-10 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section 
        className="relative bg-gray-900 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/building.png')" }}
      >
        <div className="absolute inset-0 bg-[#1A237E]/80 mix-blend-multiply"></div>
        <div className="relative px-6 py-16 lg:py-24 flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 mb-6 text-xs font-bold text-yellow-400 bg-black/40 rounded-full backdrop-blur-md border border-yellow-400/20">
            <span className="w-2 h-2 mr-2 bg-yellow-400 rounded-full animate-pulse"></span>
            SERVICES PUBLICS NUMÉRIQUES
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">Simplifiez vos démarches administratives</h1>
          <p className="text-blue-100 mb-10 text-lg font-medium max-w-2xl">Accédez aux services de l'État burkinabè en quelques clics, où que vous soyez.</p>
          <div className="w-full flex flex-row space-x-4 items-center justify-center max-w-md">
            <Link to="/login" className="px-8 py-4 flex-1 bg-white text-institutional font-bold rounded-xl shadow-xl transition-all hover:bg-gray-100 active:scale-95 text-base">
              Se Connecter
            </Link>
            <Link to="/register" className="px-8 py-4 flex-1 bg-institutional text-white font-bold rounded-xl shadow-xl border border-white/20 transition-all hover:bg-[#151b63] active:scale-95 text-base">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories de services */}
      {/* ... (déjà mis à jour dans l'étape précédente) ... */}

      {/* ... (Pourquoi utiliser E-Gov reste inchangé) ... */}

      {/* Footer (Plus compact) */}
      <footer className="bg-[#121858] text-white py-10 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 border-b border-white/10 pb-8">
            <div className="flex items-center space-x-3">
              <Emblem className="w-10 h-10 opacity-90" />
              <div>
                <span className="text-xl font-bold tracking-tight block">E-Gov Burkina</span>
                <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Portail Officiel</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold text-blue-200">
              <Link to="/services" className="hover:text-white transition-colors">Catalogue</Link>
              <Link to="/demandes" className="hover:text-white transition-colors">Suivi</Link>
              <Link to="/agent/login" className="hover:text-white transition-colors text-blue-400">Espace Agent</Link>
              <Link to="/admin/login" className="hover:text-white transition-colors text-blue-400">Admin</Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <p className="text-[11px] text-blue-400 font-medium">© 2026 GOUVERNEMENT DU BURKINA FASO · MINISTÈRE DE LA TRANSITION DIGITALE</p>
            <div className="flex space-x-6 text-blue-300 opacity-60">
              <span className="text-lg hover:opacity-100 cursor-pointer transition-opacity">📘</span>
              <span className="text-lg hover:opacity-100 cursor-pointer transition-opacity">🌐</span>
              <span className="text-lg hover:opacity-100 cursor-pointer transition-opacity">📧</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
    </div>
  );
};

export default Landing;
