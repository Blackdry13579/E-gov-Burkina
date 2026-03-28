import React, { useEffect, useState } from 'react';
import { getProfile as getAgentProfile } from '../../services/agentService';
import { PenTool, ShieldCheck, Calendar, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const DigitalSignature = () => {
  const [profile, setProfile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    getAgentProfile().then(setProfile);
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    await new Promise(r => setTimeout(r, 1500));
    setUpdating(false);
    setUpdated(true);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Signature Numérique</h1>

      {/* Certificate card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1A237E] to-[#1a6fa8] px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <PenTool size={26} className="text-white" />
          </div>
          <div className="text-white">
            <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Certificat de Signature</p>
            <h2 className="text-lg font-extrabold mt-0.5">{profile?.name || 'Sawadogo Moussa'}</h2>
            <p className="text-sm text-blue-200">{profile?.matricule || 'MAI-OUAGA-2024-089'}</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-2 rounded-xl">
            <ShieldCheck size={16} />
            Certifiée et valide
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium">Émis par</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">ANSSI Burkina Faso</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium">Expire le</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar size={14} className="text-gray-600" />
                <p className="text-sm font-bold text-gray-800">{profile?.signatureExpiry || '2027-01-15'}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium">Algorithme</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">RSA-2048 / SHA-256</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium">Niveau de confiance</p>
              <p className="text-sm font-bold text-[#00875A] mt-0.5">Élevé (eIDAS)</p>
            </div>
          </div>

          {updated && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              <CheckCircle size={16} /> Certificat mis à jour avec succès.
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#1A237E] text-[#1A237E] hover:bg-blue-50 font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60"
          >
            {updating ? (
              <span className="w-5 h-5 border-2 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></span>
            ) : (
              <RefreshCw size={17} />
            )}
            {updating ? 'Mise à jour...' : 'Mettre à jour le certificat'}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">Pour des raisons de sécurité, la mise à jour du certificat peut nécessiter une validation de la part du superviseur.</p>
      </div>
    </div>
  );
};

export default DigitalSignature;
