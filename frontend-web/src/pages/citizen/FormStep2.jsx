import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Emblem from '../../components/common/Emblem';
import { uploadFile } from '../../services/apiClient';
import { Bell, ArrowLeft, UploadCloud, FileText, CheckCircle2, Trash2, Loader2, ChevronRight } from 'lucide-react';

const FormStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, serviceName, donnees } = location.state || {};

  const [fichiers, setFichiers] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, code) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file, code);
      setFichiers([...fichiers, { 
        code: result.data.code, 
        url: result.data.url, 
        nom: result.data.nom,
        mimeType: file.type
      }]);
    } catch (err) {
      alert("Erreur lors de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (fichiers.length === 0) {
      alert("Veuillez charger au moins un document.");
      return;
    }
    navigate('/citoyen/demande/etape3', { 
      state: { serviceId, serviceName, donnees, fichiers } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="p-4 flex-1 mt-0">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Mobile Back Header */}
          <div className="flex items-center justify-between lg:hidden mb-2 px-2">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 bg-white shadow-sm rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-extrabold text-[#1A237E]">Documents</h1>
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
                <div className="w-12 h-12 rounded-2xl bg-[#1A237E] text-white flex items-center justify-center font-black text-lg mb-2 shadow-lg shadow-blue-900/10 z-10">2</div>
                <span className="text-[10px] font-black text-[#1A237E] uppercase tracking-widest">Pièces</span>
              </div>
              <div className="h-0.5 flex-1 bg-gray-100 -mt-6 mx-2"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center font-black text-lg mb-2 z-10">3</div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Récap</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 leading-tight">Pièces Justificatives</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Étape 2 sur 3</p>
              </div>
              <div className="px-4 py-1.5 bg-blue-50 text-[#1A237E] text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                {serviceName || 'Service Administratif'}
              </div>
            </div>

            <div className="space-y-6">
              {/* Uploaded List */}
              <div className="space-y-4">
                {fichiers.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#1A237E]">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 line-clamp-1 max-w-[150px] md:max-w-xs">{f.nom}</span>
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Chargement réussi
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFichiers(fichiers.filter((_, i) => i !== idx))}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Target */}
              <div>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'DOC_' + Date.now())}
                  disabled={uploading}
                />
                <label 
                  htmlFor="file-upload"
                  className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    uploading 
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                      : 'bg-blue-50/20 border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-400/50'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                      <span className="text-sm font-black text-gray-500 animate-pulse">Traitement sécurisé en cours...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 mb-6">
                        <UploadCloud size={40} />
                      </div>
                      <h3 className="text-sm font-black text-[#1A237E] mb-2 uppercase tracking-wide">Scanner un nouveau document</h3>
                      <p className="text-xs text-gray-400 font-bold mb-4">PNG, JPG ou PDF (Max. 5Mo)</p>
                      <span className="px-6 py-2 bg-[#1A237E] text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-900/10">
                        Parcourir mes fichiers
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className="w-1/3 py-5 bg-white text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  Précédent
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-1 py-5 bg-[#1A3A5C] text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                  disabled={fichiers.length === 0 || uploading}
                >
                  Continuer vers le paiement
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep2;
