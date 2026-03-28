import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { submitRequest } from '../../services/citizenService';
import { Bell, ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, Info, ChevronRight, Loader2, Smartphone } from 'lucide-react';

const FormStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, serviceName, donnees, fichiers } = location.state || {};

  const [method, setMethod] = useState('ORANGE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState('+226 70 00 00 00');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await submitRequest({
        documentTypeId: serviceId,
        donnees,
        fichiers,
        modeLivraison: 'NUMERIQUE',
        paiement: {
          methode: method,
          telephone: phoneNumber
        }
      });
      navigate('/citoyen/demande/confirmation', { 
        state: { 
          reference: response.data?.reference,
          serviceName: serviceName
        } 
      });
    } catch (err) {
      alert(err.message || 'Erreur lors de la soumission de la demande.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="p-4 flex-1 mt-0">
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
          
          {/* Mobile Back Header */}
          <div className="flex items-center justify-between lg:hidden mb-2 px-2">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-extrabold text-[#1A237E]">Paiement</h1>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
            {/* Stepper Content */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center font-black text-lg mb-2 shadow-lg shadow-green-500/10 z-10">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Identité</span>
              </div>
              <div className="h-0.5 flex-1 bg-green-500/30 -mt-6 mx-2"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center font-black text-lg mb-2 shadow-lg shadow-green-500/10 z-10">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Pièces</span>
              </div>
              <div className="h-0.5 flex-1 bg-green-500/30 -mt-6 mx-2"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-[#1A237E] text-white flex items-center justify-center font-black text-lg mb-2 shadow-lg shadow-blue-900/10 z-10">3</div>
                <span className="text-[10px] font-black text-[#1A237E] uppercase tracking-widest">Récap</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 leading-tight">Confirmation & Frais</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Dernière Étape</p>
              </div>
              <div className="px-4 py-1.5 bg-blue-50 text-[#1A237E] text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                {serviceName || 'Service Administratif'}
              </div>
            </div>

            <div className="space-y-8">
              {/* Summary Card */}
              <div className="bg-[#F8FAFF] rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center gap-2 mb-6 text-[#1A237E]">
                  <CreditCard size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Détails de facturation</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                    <span>Document demandé</span>
                    <span className="text-gray-900">{serviceName || 'Extrait de naissance'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                    <span>Frais de dossier</span>
                    <span className="text-gray-900 text-lg">500 <small className="text-[10px] opacity-70">FCFA</small></span>
                  </div>
                  <div className="pt-4 border-t border-blue-100 flex justify-between items-center">
                    <span className="text-sm font-black text-[#1A237E] uppercase tracking-widest">Total Net</span>
                    <span className="text-2xl font-black text-[#1A237E]">500 <small className="text-xs opacity-70">FCFA</small></span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Mode de Paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setMethod('ORANGE_MONEY')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                      method === 'ORANGE_MONEY'
                        ? 'border-[#FF6600] bg-orange-50 shadow-lg shadow-orange-900/5'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg mb-3 shadow-inner ${method === 'ORANGE_MONEY' ? 'bg-[#FF6600] text-white' : 'bg-gray-50 text-gray-400'}`}>
                      OM
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'ORANGE_MONEY' ? 'text-[#FF6600]' : 'text-gray-400'}`}>
                      Orange Money
                    </span>
                  </div>

                  <div 
                    onClick={() => setMethod('MOOV_MONEY')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${
                      method === 'MOOV_MONEY'
                        ? 'border-[#00529C] bg-blue-50 shadow-lg shadow-blue-900/5'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg mb-3 shadow-inner ${method === 'MOOV_MONEY' ? 'bg-[#00529C] text-white' : 'bg-gray-50 text-gray-400'}`}>
                      MOOV
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'MOOV_MONEY' ? 'text-[#00529C]' : 'text-gray-400'}`}>
                      Moov Money
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Coordonnées de paiement</label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-[#F8FAFF] border border-gray-100 rounded-2xl text-lg font-black text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1A237E] transition-all tracking-wider"
                      placeholder="+226 XX XX XX XX"
                    />
                  </div>
                  
                  <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                      type="text"
                      placeholder="Code OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-[#F8FAFF] border border-gray-100 rounded-2xl text-lg font-black text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1A237E] transition-all tracking-[0.3em]"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                  <Info className="text-amber-600 shrink-0" size={20} />
                  <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                    Une fois le paiement validé, votre demande sera transmise instantanément aux services compétents. Le Trésor Public garantit la sécurité de cette transaction de bout en bout.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => navigate(-1)} 
                    className="w-1/3 py-5 bg-white text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Précédent
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-5 bg-[#1A3A5C] text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Traitement sécurisé...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={24} />
                        Confirmer le Paiement
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-gray-300 font-black tracking-[0.3em] uppercase">
            🛡️ Transaction Protégée par le Trésor Public
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormStep3;
