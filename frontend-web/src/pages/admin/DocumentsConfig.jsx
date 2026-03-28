import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit3, X, Save, Clock, CreditCard, ShieldCheck } from 'lucide-react';

const initialDocs = [
  { id: 'DOC-01', name: 'Acte de Naissance', desc: 'Extrait intégral ou copie certifiée conforme', price: '500 FCFA', duration: '48h', active: true },
  { id: 'DOC-02', name: 'CNI (Carte Nationale d\'Identité)', desc: 'Document d\'identité officiel burkinabè', price: '1 000 FCFA', duration: '7 jours', active: true },
  { id: 'DOC-03', name: 'Passeport Ordinaire', desc: 'Titre de voyage international', price: '50 000 FCFA', duration: '14 jours', active: true },
];

const emptyDoc = { name: '', desc: '', price: '', duration: '', active: true };

const DocumentsConfig = () => {
  const [documents, setDocuments] = useState(initialDocs);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null); // null = nouveau, sinon l'objet doc
  const [form, setForm] = useState(emptyDoc);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openAdd = () => {
    setEditingDoc(null);
    setForm(emptyDoc);
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setForm({ name: doc.name, desc: doc.desc, price: doc.price, duration: doc.duration, active: doc.active });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('Le nom du document est obligatoire.'); return; }
    if (editingDoc) {
      setDocuments(docs => docs.map(d => d.id === editingDoc.id ? { ...d, ...form } : d));
    } else {
      const newId = `DOC-${String(documents.length + 1).padStart(2, '0')}`;
      setDocuments(docs => [...docs, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id) => {
    setDocuments(docs => docs.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:outline-none text-sm font-semibold text-gray-800 transition-all";
  const labelClass = "text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5";

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Documents et Services</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Catalogue des documents officiels pris en charge par la plateforme</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#1A237E] text-white px-7 py-4 rounded-2xl flex items-center gap-3 hover:bg-[#151b63] transition-all shadow-lg shadow-blue-900/20 font-bold shrink-0"
        >
          <Plus size={20} />
          <span>Ajouter un Document</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12 ${doc.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>

            {/* Top row */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${doc.active ? 'bg-green-50 text-[#00875A]' : 'bg-gray-50 text-gray-400'}`}>
                  <FileText size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{doc.id}</span>
                  <h3 className="font-black text-gray-900 text-lg tracking-tight leading-tight">{doc.name}</h3>
                </div>
              </div>
              <button
                onClick={() => toggleActive(doc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-widest transition-all border ${
                  doc.active ? 'border-[#00875A]/20 text-[#00875A] bg-green-50' : 'border-gray-200 text-gray-400 bg-gray-50'
                }`}
              >
                {doc.active ? 'ACTIF' : 'SUSPENDU'}
              </button>
            </div>

            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{doc.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={13} className="text-[#1A237E]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coût</span>
                </div>
                <p className="text-base font-black text-gray-800">{doc.price}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={13} className="text-blue-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai</span>
                </div>
                <p className="text-base font-black text-gray-800">{doc.duration}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className={doc.active ? 'text-green-500' : 'text-gray-300'} />
                <span className="text-xs font-bold text-gray-400">Workflow Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(doc)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-[#1A237E] rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={13} /> Éditer
                </button>
                <button
                  onClick={() => setDeleteConfirm(doc.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Card vide pour ajouter */}
        <div
          onClick={openAdd}
          className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center group hover:border-[#1A237E] transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#1A237E] transition-all mb-4">
            <Plus size={32} />
          </div>
          <h4 className="text-lg font-black text-gray-400 group-hover:text-gray-900">Nouveau Type de Document</h4>
          <p className="text-sm text-gray-400 font-medium px-10 mt-2">Définissez les tarifs et délais pour un nouvel acte administratif</p>
        </div>
      </div>

      {/* Modal Ajout/Édition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1A237E] px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-lg">{editingDoc ? 'Modifier le Document' : 'Nouveau Document'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nom du Document *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="ex: Acte de Naissance" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className={inputClass} placeholder="ex: Extrait intégral ou copie certifiée" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Coût</label>
                  <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} placeholder="ex: 500 FCFA" />
                </div>
                <div>
                  <label className={labelClass}>Délai Max</label>
                  <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className={inputClass} placeholder="ex: 48h" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setForm({...form, active: !form.active})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-7' : 'translate-x-1'}`}></span>
                </button>
                <label className="text-sm font-semibold text-gray-700">Document {form.active ? 'Actif' : 'Suspendu'}</label>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-[#1A237E] text-white rounded-xl font-bold text-sm hover:bg-[#151b63] transition-colors flex items-center gap-2">
                <Save size={15} /> {editingDoc ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer ce document ?</h3>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. Le document sera retiré du catalogue.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsConfig;
