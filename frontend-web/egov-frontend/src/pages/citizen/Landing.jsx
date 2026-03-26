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
      <section className="px-4 py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A237E]">Nos services en ligne</h2>
              <p className="text-xs text-gray-400 font-bold mt-1 tracking-wide uppercase">Accès rapide par catégorie</p>
            </div>
            <Link to="/services" className="text-sm font-bold text-institutional hover:underline">Voir tout le catalogue →</Link>
          </div>
          <div className="flex flex-row space-x-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:space-x-0 lg:gap-6 lg:overflow-x-visible">
            <Link to="/services" className="min-w-[170px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95 group">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🪪</span>
              <span className="text-sm font-bold text-gray-800">Identité & Documents</span>
            </Link>
            <Link to="/services" className="min-w-[170px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95 group">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">👨‍👩‍👧</span>
              <span className="text-sm font-bold text-gray-800">État Civil</span>
            </Link>
            <Link to="/services" className="min-w-[170px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95 group">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">💼</span>
              <span className="text-sm font-bold text-gray-800">Entreprises & Commerce</span>
            </Link>
            <Link to="/services" className="min-w-[170px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95 group">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</span>
              <span className="text-sm font-bold text-gray-800">Éducation & Examens</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi utiliser E-Gov */}
      <section className="px-4 py-16 bg-white border-t border-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1A237E]">Pourquoi choisir E-Gov ?</h2>
            <div className="w-16 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">🕐</div>
              <h3 className="text-lg font-bold text-gray-900">Gain de temps</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Plus besoin de vous déplacer ou de faire la queue pour vos formalités administratives.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">🛡️</div>
              <h3 className="text-lg font-bold text-gray-900">Sécurité maximale</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Vos données personnelles et vos documents officiels sont protégés par les standards de l'État.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">👁️</div>
              <h3 className="text-lg font-bold text-gray-900">Suivi transparent</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">Consultez l'état d'avancement de vos demandes à tout moment depuis votre espace citoyen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Plus compact) */}
      <footer className="bg-[#121858] text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-white/10 pb-10">
            <div className="flex items-center space-x-3">
              <Emblem className="w-12 h-12 opacity-90" />
              <div>
                <span className="text-2xl font-bold tracking-tight block">E-Gov Burkina</span>
                <span className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Portail Officiel des Services Publics</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-8 text-sm font-bold text-blue-200">
              <Link to="/services" className="hover:text-white transition-colors">Catalogue</Link>
              <Link to="/demandes" className="hover:text-white transition-colors">Suivi Dossier</Link>
              <Link to="/agent/login" className="hover:text-white transition-colors text-blue-400">Accès Agent</Link>
              <Link to="/admin/login" className="hover:text-white transition-colors text-blue-400 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Admin
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <p className="text-[11px] text-blue-400/80 font-medium tracking-wide">
              © 2026 GOUVERNEMENT DU BURKINA FASO · MINISTÈRE DE LA TRANSITION DIGITALE, DES POSTES ET DES COMMUNICATIONS ÉLECTRONIQUES
            </p>
            <div className="flex space-x-8 text-blue-300 opacity-60">
              <span className="text-xl hover:opacity-100 cursor-pointer transition-opacity">📘</span>
              <span className="text-xl hover:opacity-100 cursor-pointer transition-opacity">🌐</span>
              <span className="text-xl hover:opacity-100 cursor-pointer transition-opacity">📧</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
