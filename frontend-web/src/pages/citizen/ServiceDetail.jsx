import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCitizenServiceDetail } from '../../services/api';
import { ArrowLeft, Bell, Star, ShieldCheck, Clock, CreditCard, Truck, CheckCircle2, Info, FileText } from 'lucide-react';
import Emblem from '../../components/common/Emblem';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    getCitizenServiceDetail(id).then(data => setService(data));
  }, [id]);

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
      <div className="w-8 h-8 border-4 border-institutional/20 border-t-institutional rounded-full animate-spin mr-3"></div>
      Chargement...
    </div>
  );

  const faqs = [
    { q: "Le document PDF est-il officiel ?", a: "Oui, tous les documents PDF générés par E-Gov intègrent une signature électronique certifiée par l'ANSSI, leur conférant la même valeur juridique que le format papier." },
    { q: "Puis-je payer en espèces ?", a: "Les paiements se font exclusivement par voie électronique (Mobile Money ou Carte Bancaire) pour garantir la traçabilité." },
    { q: "Quels sont les délais en cas d'urgence ?", a: "Un mode 'Urgence 24H' est disponible pour certains documents moyennant un supplément de 2000 FCFA." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-6 sticky top-0 z-10 shadow-sm lg:px-8">
        <div className="flex items-center space-x-3 lg:hidden">
          <Emblem className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-[#1A237E] leading-tight tracking-tight uppercase">Burkina Faso</span>
            <span className="text-[10px] tracking-[0.15em] text-gray-400 font-bold uppercase">E-Services Officiels</span>
          </div>
        </div>
        <div className="hidden lg:block text-center flex-1">
          <h1 className="text-2xl font-extrabold text-[#1A237E] mr-10">Détails du Service</h1>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-institutional hover:bg-blue-100 transition-colors"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Flag Line */}
      <div className="h-1 flex w-full lg:hidden">
        <div className="h-full bg-[#EF3340] w-1/2"></div>
        <div className="h-full bg-[#009739] w-1/2"></div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 lg:mt-10 px-4 lg:px-0">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          
          {/* Mobile Back Header */}
          <div className="flex items-center gap-3 mb-6 lg:hidden px-2">
            <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm rounded-full transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-extrabold text-[#1A237E]">Détails du Service</h1>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
            </div>
            
            <div className="w-20 h-20 bg-blue-50 rounded-3xl shadow-inner flex items-center justify-center text-4xl mb-6 relative">
              <span className="relative z-10">{service.icon}</span>
            </div>
            
            <div className="bg-green-50 text-green-700 text-[10px] font-black px-4 py-1.5 rounded-full tracking-[0.2em] mb-4 border border-green-100 uppercase">
              Certifié 100% en ligne
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight max-w-2xl">
              {service.name}
            </h1>
            
            <p className="text-sm text-gray-500 max-w-xl font-medium leading-relaxed mb-8">
              Service officiel de délivrance des documents sécurisés de la République du Burkina Faso. Procédure dématérialisée et sécurisée.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-institutional shadow-sm mb-1">
                  <CreditCard size={20} />
                </div>
                <span className="text-lg font-black text-gray-900">{service.prix_fcfa.toLocaleString()} <small className="text-[10px] opacity-60">FCFA</small></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Frais d'acte</span>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-institutional shadow-sm mb-1">
                  <Clock size={20} />
                </div>
                <span className="text-lg font-black text-gray-900">{service.delai}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Délai estimé</span>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-institutional shadow-sm mb-1">
                  <Truck size={20} />
                </div>
                <span className="text-lg font-black text-gray-900">{service.livraison.includes('PDF') ? 'Format PDF' : 'Guichet'}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mode de remise</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <FileText size={14} /> Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Le {service.name.toLowerCase()} est délivré après vérification de vos informations par les agents assermentés. La version dématérialisée fournie possède une signature électronique officielle.
                </p>
              </section>

              <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Info size={14} /> Documents à fournir
                </h3>
                <ul className="space-y-4">
                  {service.documents_requis?.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      {doc}
                    </li>
                  )) || <li className="text-sm text-gray-500 italic">Aucune pièce complémentaire requise</li>}
                </ul>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Star size={14} /> Étapes de la procédure
                </h3>
                <div className="space-y-8 relative before:absolute before:left-7 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                  {[
                    { t: "Constitution du dossier", d: "Remplissez le formulaire et téléchargez vos justificatifs." },
                    { t: "Paiement en ligne", d: "Réglez vos frais via Mobile Money ou Carte Bancaire." },
                    { t: "Traitement Étatique", d: "Les services administratifs valident votre identité." },
                    { t: "Délivrance Finale", d: "Votre acte est disponible dans votre coffre-fort numérique." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-6 relative group">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 text-[#1A237E] flex items-center justify-center font-black text-lg z-10 group-hover:bg-[#1A237E] group-hover:text-white transition-colors">
                        {i+1}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-extrabold text-[#1A3A5C] text-sm">{s.t}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Foire aux questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className={`w-full text-left px-6 py-4 flex justify-between items-center text-sm font-bold transition-colors ${openFaq === index ? 'bg-blue-50 text-[#1A237E]' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {faq.q}
                    <span className={`text-xl transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 pt-2 bg-blue-50/30 text-sm text-gray-500 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Action Principale - Fin de page */}
          <div className="mt-12 flex justify-center pb-8">
            <button 
              onClick={() => navigate('/demande/etape1', { state: { serviceId: id, serviceName: service.name } })}
              className="w-full md:w-auto px-12 py-4 bg-[#1A3A5C] text-white font-black rounded-2xl shadow-2xl shadow-blue-900/20 hover:scale-[1.02] hover:bg-[#0f2440] active:scale-[0.98] transition-all flex justify-center items-center gap-3 text-[11px] md:text-xs uppercase tracking-[0.15em]"
            >
              <CheckCircle2 size={20} />
              Démarrer la demande officielle
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
