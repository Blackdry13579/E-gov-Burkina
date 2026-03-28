import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { CheckCircle2, LayoutDashboard, Search, Bell, Calendar, Hash, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reference, serviceName } = location.state || { 
    reference: 'REF-INCONNUE', 
    serviceName: 'Service Administratif' 
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }) + ' à ' + today.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className="p-4 flex-1 flex flex-col items-center justify-center mt-0">
        <div className="max-w-xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          
          {/* Animated Success Icon */}
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center shadow-inner scale-110">
              <CheckCircle2 className="text-green-500" size={48} strokeWidth={3} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
              <span className="text-[10px] font-black">OK</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Demande enregistrée</h1>
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm mx-auto">
              Votre dossier a été transmis avec succès aux services compétents pour instruction.
            </p>
          </div>

          {/* Recap Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1A237E]">
                  <Hash size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Référence de suivi</span>
                  <p className="text-lg font-black text-[#1A237E] font-mono tracking-wider">{reference}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-300" size={18} />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date de dépôt</span>
                    <p className="text-xs font-bold text-gray-700">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-300" size={18} />
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service sollicité</span>
                    <p className="text-xs font-bold text-gray-700 truncate">{serviceName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/citoyen/demandes')}
              className="w-full py-5 bg-white border-2 border-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all flex justify-center items-center gap-3 shadow-sm"
            >
              <LayoutDashboard size={18} />
              Mes demandes
            </button>
            <button 
              onClick={() => navigate(`/citoyen/suivi/${reference}`)}
              className="w-full py-5 bg-[#1A3A5C] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-3"
            >
              <Search size={18} />
              Suivre le dossier
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="pt-6">
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} />
              Certification ANPTIC 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
