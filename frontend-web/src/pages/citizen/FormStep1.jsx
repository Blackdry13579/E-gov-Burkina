import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { Bell, ArrowLeft, Info, User, Calendar, MapPin, ChevronRight } from 'lucide-react';

const FormStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, serviceName } = location.state || {};

  const [donnees, setDonnees] = useState({
    nomNaissance: '',
    prenoms: '',
    dateNaissance: '',
    lieuNaissance: '',
    nomPere: '',
    nomMere: ''
  });

  const handleNext = (e) => {
    e.preventDefault();
    navigate('/citoyen/demande/etape2', { 
      state: { serviceId, serviceName, donnees } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="p-4 flex-1 mt-0">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Mobile Back Header */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-extrabold text-[#1A237E]">Nouvelle Demande</h1>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
            {/* Stepper Content */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-[#1A237E] text-white flex items-center justify-center font-black text-lg mb-2 shadow-lg shadow-blue-900/10 z-10">1</div>
                <span className="text-[10px] font-black text-[#1A237E] uppercase tracking-widest">Identité</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-100 -mt-6 mx-2"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center font-black text-lg mb-2 z-10">2</div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Pièces</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-100 -mt-6 mx-2"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center font-black text-lg mb-2 z-10">3</div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Récap</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 leading-tight">Civilité & Identité</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Étape 1 sur 3</p>
              </div>
              <div className="px-4 py-1.5 bg-blue-50 text-[#1A237E] text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                {serviceName || 'Service Administratif'}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleNext} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Nom de naissance</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: OUEDRAOGO" 
                      required 
                      value={donnees.nomNaissance}
                      onChange={e => setDonnees({...donnees, nomNaissance: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 focus:border-[#1A237E] transition-all font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Prénom(s)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: Moussa Abdoulaye" 
                      required 
                      value={donnees.prenoms}
                      onChange={e => setDonnees({...donnees, prenoms: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 focus:border-[#1A237E] transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="date" 
                      required 
                      value={donnees.dateNaissance}
                      onChange={e => setDonnees({...donnees, dateNaissance: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 focus:border-[#1A237E] transition-all font-bold text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Lieu de naissance</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: Ouagadougou" 
                      required 
                      value={donnees.lieuNaissance}
                      onChange={e => setDonnees({...donnees, lieuNaissance: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 focus:border-[#1A237E] transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <Info className="text-[#1A237E] shrink-0" size={20} />
                <p className="text-[11px] text-[#1A237E] font-bold leading-relaxed">
                  Veuillez vous assurer que les informations saisies correspondent exactement à votre acte de naissance ou document officiel précédent. Toute erreur prolongera le délai de traitement.
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-[#1A3A5C] text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-3 mt-4"
              >
                Passer à l'étape suivante
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1;
