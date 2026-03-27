import React, { useState } from 'react';
import { FileText, Settings2, Plus, ArrowRight, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const DocumentsConfig = () => {
  const [documents, setDocuments] = useState([
    { id: 'DOC-01', name: 'Acte de Naissance', desc: 'Extrait intégral ou copie certifiée', price: '500 FCFA', duration: '48h', active: true },
    { id: 'DOC-02', name: 'Certificat de Résidence', desc: 'Justificatif de domicile', price: '200 FCFA', duration: '24h', active: true },
    { id: 'DOC-03', name: 'Certificat de Nationalité', desc: 'Preuve de la nationalité burkinabè', price: '1500 FCFA', duration: '7 jours', active: true },
    { id: 'DOC-04', name: 'Passeport Ordinaire', desc: 'Titre de voyage international', price: '50 000 FCFA', duration: '14 jours', active: false },
  ]);

  const toggleDoc = (id) => {
    setDocuments(docs => docs.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Services & Actes</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Catalogue des documents officiels disponibles</p>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} 
          className="bg-[#1A237E] text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-blue-900/20 font-bold"
        >
          <Plus size={20} />
          <span>Ajouter un Acte</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12 transition-colors ${doc.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${doc.active ? 'bg-green-50 text-[#00875A]' : 'bg-gray-50 text-gray-400'}`}>
                  <FileText size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{doc.id}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">{doc.name}</h3>
                </div>
              </div>
              
              <button 
                onClick={() => toggleDoc(doc.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all border ${
                  doc.active ? 'border-[#00875A]/20 text-[#00875A] bg-green-50' : 'border-gray-200 text-gray-400 bg-gray-50'
                }`}
              >
                {doc.active ? 'ACTIF' : 'SUSPENDU'}
              </button>
            </div>

            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
              {doc.desc}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1 mb-2">
                  <CreditCard size={14} className="text-[#1A237E]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coût Acte</span>
                </div>
                <p className="text-lg font-black text-gray-800 tracking-tighter">{doc.price}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center gap-2 mb-1 mb-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai Max</span>
                </div>
                <p className="text-lg font-black text-gray-800 tracking-tighter">{doc.duration}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className={doc.active ? "text-green-500" : "text-gray-300"} />
                <span className="text-xs font-bold text-gray-400">Workflow Standard</span>
              </div>
              <button className="p-3 bg-gray-50 hover:bg-[#1A237E] hover:text-white rounded-xl transition-all text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1A237E]">
                <Settings2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* Action Card */}
        <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center group hover:border-[#1A237E] transition-all cursor-pointer">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#1A237E] transition-all mb-4">
            <Plus size={32} />
          </div>
          <h4 className="text-lg font-black text-gray-400 group-hover:text-gray-900">Nouveau Type de Document</h4>
          <p className="text-sm text-gray-400 font-medium px-10 mt-2">Définissez les tarifs et délais pour un nouvel acte administratif</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsConfig;
