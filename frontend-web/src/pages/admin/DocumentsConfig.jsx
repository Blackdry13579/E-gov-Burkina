import React, { useState, useEffect } from 'react';
import { useAdminDocuments, useAdminServices } from '../../hooks/useAdmin';
import { FileText, Plus, Trash2, Edit3, X, Save, Clock, CreditCard, ShieldCheck, Building2 } from 'lucide-react';

const emptyDoc = { name: '', desc: '', price: '', duration: '', serviceId: '', active: true };

const DocumentsConfig = () => {
  const { documents, loading, addDoc, updateDoc, deleteDoc } = useAdminDocuments();
  const { services } = useAdminServices();
  
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null); 
  const [form, setForm] = useState(emptyDoc);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setEditingDoc(null);
    setForm(emptyDoc);
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setForm({ ...doc });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Le nom est requis');
    if (!form.serviceId) return alert('Veuillez rattacher ce document à un service');
    
    setSubmitting(true);
    try {
      if (editingDoc) {
        await updateDoc(editingDoc.id, form);
      } else {
        await addDoc(form);
      }
      setShowModal(false);
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(id);
    setDeleteConfirm(null);
  };

  const labelClass = "text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5";
  const inputClass = "w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 outline-none text-sm font-bold text-gray-800 transition-all";

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Catalogue des Documents</h1>
          <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">Configuration des actes et tarifs par service</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#1A237E] text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-blue-900/20 font-black uppercase text-xs tracking-widest"
        >
          <Plus size={18} />
          <span>Nouveau Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-2 py-24 text-center text-gray-300 font-black italic tracking-widest uppercase">CHARGEMENT DU CATALOGUE...</div>
        ) : documents.map(doc => {
          const srv = services.find(s => s.id === doc.serviceId);
          return (
            <div key={doc.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden flex flex-col">
              <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12 transition-colors ${doc.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${doc.active ? 'bg-green-50 text-[#00875A]' : 'bg-gray-50 text-gray-400'}`}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{doc.id}</span>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight leading-tight uppercase">{doc.name}</h3>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  doc.active ? 'border-green-100 text-[#00875A] bg-green-50' : 'border-gray-100 text-gray-400 bg-gray-50'
                }`}>
                  {doc.active ? 'ACTIF' : 'SUSPENDU'}
                </span>
              </div>

              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-1">{doc.desc}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={13} className="text-[#1A237E]" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Coût d'acte</span>
                  </div>
                  <p className="text-base font-black text-gray-800">{doc.price}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={13} className="text-[#1A237E]" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Délai estimé</span>
                  </div>
                  <p className="text-base font-black text-gray-800">{doc.duration}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-xl text-[#1A237E]">
                  <Building2 size={13} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{srv?.name || 'ADMINISTRATION'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(doc)} className="p-2.5 bg-gray-50 hover:bg-[#1A237E] hover:text-white rounded-xl transition-all text-gray-400"><Edit3 size={15} /></button>
                  <button onClick={() => setDeleteConfirm(doc.id)} className="p-2.5 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-gray-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Action Card */}
        <div onClick={openAdd} className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center group hover:border-[#1A237E] transition-all cursor-pointer min-h-[350px]">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#1A237E] transition-all mb-4">
            <Plus size={32} />
          </div>
          <h4 className="text-lg font-black text-gray-400 group-hover:text-gray-900 uppercase tracking-widest">Ajouter un Document</h4>
        </div>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1A237E] px-8 py-5 flex items-center justify-between text-white">
              <h3 className="text-sm font-black uppercase tracking-widest">{editingDoc ? 'Modifier le Document' : 'Nouveau Document'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className={labelClass}>Service responsable *</label>
                <select 
                  value={form.serviceId} 
                  onChange={e => setForm({...form, serviceId: e.target.value})}
                  className={inputClass}
                  required
                >
                  <option value="">Sélectionner un service...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Nom du document *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} className={inputClass} placeholder="EX: EXTRAIT DE NAISSANCE" required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Description détaillée</label>
                <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className={inputClass + " min-h-[80px]"} placeholder="Type de dossier, documents fournis..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelClass}>Prix (FCFA)</label>
                  <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} placeholder="EX: 1500 FCFA" />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Délai estimé</label>
                  <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className={inputClass} placeholder="EX: 48H" />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors">Annuler</button>
                <button type="submit" disabled={submitting} className="px-8 py-3 bg-[#1A237E] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#0D145A] shadow-lg shadow-blue-900/20 transition-all">
                  {submitting ? 'CHARGEMENT...' : (editingDoc ? 'ENREGISTRER' : 'AJOUTER')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Trash2 size={28} /></div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-2">Confirmer la suppression</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">Cette action retirera définitivement ce type de document du catalogue citoyen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsConfig;
