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
      <section className="relative bg-gray-900 text-white">
        {/* Fallback pattern if image is missing */}
        <div className="absolute inset-0 bg-institutional opacity-60 mix-blend-multiply"></div>
        <div className="relative px-6 py-12 flex flex-col items-center text-center">
          <span className="inline-flex items-center px-3 py-1 mb-6 text-xs font-semibold text-yellow-400 bg-black/50 rounded-full backdrop-blur-sm border border-yellow-400/20">
            <span className="w-2 h-2 mr-2 bg-yellow-400 rounded-full animate-pulse"></span>
            SERVICES PUBLICS NUMÉRIQUES
          </span>
          <h1 className="text-3xl font-extrabold mb-4 leading-tight">Simplifiez vos démarches administratives</h1>
          <p className="text-gray-200 mb-8 text-base font-light">Accédez aux services de l'État burkinabè en quelques clics, où que vous soyez.</p>
          <div className="w-full flex flex-row space-x-3 items-center justify-center">
            <Link to="/login" className="px-6 py-3 flex-1 bg-white text-institutional font-bold rounded-xl shadow-lg border border-white/10 flex justify-center items-center transition-all hover:bg-gray-100 active:scale-95">
              Se Connecter
            </Link>
            <Link to="/register" className="px-6 py-3 flex-1 bg-institutional text-white font-bold rounded-xl shadow-lg border border-white/20 flex justify-center items-center transition-all hover:bg-blue-800 active:scale-95">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories de services */}
      <section className="px-4 py-8 bg-gray-50 overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-extrabold text-[#1A237E]">Catégories de services</h2>
          <Link to="/services" className="text-sm font-bold text-institutional hover:underline">Voir tout →</Link>
        </div>
        <div className="flex flex-row space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:space-x-0 lg:gap-4 lg:overflow-x-visible">
          <Link to="/services" className="min-w-[160px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
            <span className="text-4xl mb-3">🪪</span>
            <span className="text-sm font-bold text-gray-800">Identité & Documents</span>
          </Link>
          <Link to="/services" className="min-w-[160px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
            <span className="text-4xl mb-3">👨‍👩‍👧</span>
            <span className="text-sm font-bold text-gray-800">État Civil</span>
          </Link>
          <Link to="/services" className="min-w-[160px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
            <span className="text-4xl mb-3">💼</span>
            <span className="text-sm font-bold text-gray-800">Entreprises & Commerce</span>
          </Link>
          <Link to="/services" className="min-w-[160px] flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
            <span className="text-4xl mb-3">🎓</span>
            <span className="text-sm font-bold text-gray-800">Éducation & Examens</span>
          </Link>
        </div>
      </section>

      {/* Pourquoi utiliser E-Gov */}
      <section className="px-4 py-8 bg-white border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Pourquoi utiliser E-Gov ?</h2>
        <div className="flex flex-col space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl text-institutional">🕐</div>
            <div className="ml-4">
              <h3 className="text-base font-bold text-gray-900">Gain de temps</h3>
              <p className="text-sm text-gray-600 mt-1">Plus besoin de vous déplacer pour vos formalités administratives.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl text-institutional">🛡️</div>
            <div className="ml-4">
              <h3 className="text-base font-bold text-gray-900">Sécurité</h3>
              <p className="text-sm text-gray-600 mt-1">Vos données personnelles et vos documents officiels sont hautement protégés.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl text-institutional">👁️</div>
            <div className="ml-4">
              <h3 className="text-base font-bold text-gray-900">Suivi en temps réel</h3>
              <p className="text-sm text-gray-600 mt-1">Consultez l'état d'avancement de vos demandes à tout moment depuis votre espace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="bg-institutional text-white px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Pour tous les Burkinabè</h2>
        <p className="text-sm text-blue-100 mb-6 font-light">
          Une administration de proximité, accessible à tous les citoyens, résidents ou de la diaspora.
        </p>
        <Link to="/register" className="inline-block px-8 py-3 bg-[#FFD700] text-institutional font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
          Créer mon compte
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A237E] text-white pt-10 pb-6 px-4">
        <div className="flex items-center space-x-2 mb-6">
          <Emblem className="w-8 h-8 opacity-90" />
          <span className="text-lg font-bold tracking-tight">E-Gov Burkina</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h4 className="text-xs font-bold text-institutional bg-white/10 inline-block px-2 py-1 rounded mb-3">LIENS UTILES</h4>
            <ul className="text-sm text-blue-200 flex flex-col space-y-2">
              <li><Link to="/" className="hover:text-white">Aide & FAQ</Link></li>
              <li><Link to="/" className="hover:text-white">Annuaire Public</Link></li>
              <li><Link to="/" className="hover:text-white">Open Data</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-institutional bg-white/10 inline-block px-2 py-1 rounded mb-3 text-blue-300 uppercase tracking-widest">Portail Administratif</h4>
            <ul className="text-sm text-blue-200 flex flex-col space-y-2">
              <li><Link to="/agent/login" className="hover:text-white font-medium">Espace Agent (Mairie)</Link></li>
              <li><Link to="/admin/login" className="hover:text-white font-medium">Espace Administrateur</Link></li>
              <li><Link to="/" className="hover:text-white">Assistance Technique</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col items-center text-center">
          <div className="flex space-x-4 mb-4 text-blue-300">
            <span className="text-xl">📘</span>
            <span className="text-xl">🌐</span>
            <span className="text-xl">📧</span>
          </div>
          <p className="text-xs text-blue-400">© 2024 GOUVERNEMENT DU BURKINA FASO</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
