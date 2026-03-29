import React, { useState } from 'react';
import { useAdminServices } from '../../hooks/useAdmin';
import { Building2, MapPin, Plus, Edit2, Trash2, ShieldCheck, Globe, X, Save } from 'lucide-react';

const emptyService = { name: '', description: '', region: 'National', type: 'Administration', active: true };

const ServicesConfig = () => {
  const { services, loading, addService, updateService, deleteService } = useAdminServices();
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null); // null = add, else = service object
  const [form, setForm] = useState(emptyService);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setEditingService(null);
    setForm(emptyService);
    setShowModal(true);
  };

  const openEdit = (srv) => {
    setEditingService(srv);
    setForm({ ...srv });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Le nom est requis');
    setSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService.id, form);
      } else {
        await addService(form);
      }
      setShowModal(false);
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce service et toutes ses dépendances ?')) {
      await deleteService(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Gestion des Services</h1>
          <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">Entités rattachées au portail national</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-[#1A237E] text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-blue-900/20 font-black uppercase text-xs tracking-widest"
        >
          <Plus size={18} />
          <span>Ajouter un Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-24 text-center text-gray-300 font-black italic tracking-widest uppercase">CONSULTATION...</div>
        ) : services.map(service => (
          <div key={service.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12 transition-colors ${service.active ? 'bg-[#1A237E]' : 'bg-gray-400'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-[#1A237E] rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#1A237E] group-hover:text-white">
                <Building2 size={24} />
              </div>
              <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg ${
                service.active ? 'bg-green-100 text-[#00875A]' : 'bg-gray-100 text-gray-400'
              }`}>
                {service.active ? 'ACTIF' : 'SUSPENDU'}
              </span>
            </div>

            <div className="mb-4 flex-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block opacity-70">{service.id}</span>
              <h3 className="font-black text-gray-900 text-lg tracking-tight mb-2 leading-tight uppercase line-clamp-1">{service.name}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex flex-wrap gap-2 text-[9px] uppercase tracking-widest opacity-80">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-[#1A237E] rounded-lg font-black">
                  <MapPin size={10} /> {service.region}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg font-black">
                  <Globe size={10} /> {service.type}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className={service.active ? "text-[#1A237E]" : "text-gray-300"} />
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Auth API</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEdit(service)}
                  className="p-2.5 bg-gray-50 hover:bg-[#1A237E] hover:text-white rounded-xl transition-all text-gray-400"
                  title="Modifier"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2.5 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-gray-400"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Action Card */}
        <div 
          onClick={openAdd}
          className="bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center group hover:border-[#1A237E] transition-all cursor-pointer min-h-[250px]"
        >
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#1A237E] transition-all mb-3">
            <Plus size={24} />
          </div>
          <h4 className="text-sm font-black text-gray-400 group-hover:text-gray-900 uppercase tracking-widest text-[10px]">Ajouter une Entité</h4>
        </div>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1A237E] px-8 py-5 flex items-center justify-between text-white">
              <h3 className="text-sm font-black uppercase tracking-widest">{editingService ? 'Modifier le Service' : 'Nouveau Service'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de l'entité *</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 outline-none text-sm font-bold text-gray-800 transition-all uppercase"
                  placeholder="EX: MAIRIE DE BOBO-DIOULASSO"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 outline-none text-sm font-bold text-gray-800 transition-all min-h-[100px]"
                  placeholder="Responsabilités et missions..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Région</label>
                  <input 
                    type="text" 
                    value={form.region} 
                    onChange={e => setForm({...form, region: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 outline-none text-sm font-bold text-gray-800 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                  <input 
                    type="text" 
                    value={form.type} 
                    onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#1A237E]/5 outline-none text-sm font-bold text-gray-800 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setForm({...form, active: !form.active})}
                  className={`w-14 h-7 rounded-full transition-all relative ${form.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.active ? 'translate-x-8' : 'translate-x-1'}`}></span>
                </button>
                <label className="text-xs font-black text-gray-600 uppercase tracking-widest">Service {form.active ? 'Actif' : 'Suspendu'}</label>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors">Annuler</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-8 py-3 bg-[#1A237E] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#0D145A] shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                >
                  <Save size={14} />
                  {submitting ? 'TRAITEMENT...' : (editingService ? 'ENREGISTRER' : 'AJOUTER')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesConfig;
