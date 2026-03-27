import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgentRequestDetail } from '../../services/api';
import { ArrowLeft, User, Calendar, Phone, MapPin, FileText, Eye, CheckCircle, XCircle } from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgentRequestDetail(id).then(d => { setRequest(d); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#1A237E]/30 border-t-[#1A237E] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{request.document}</h1>
          <p className="text-sm text-gray-500 font-mono">Réf: {request.id}</p>
        </div>
        <span className="ml-auto px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">{request.status}</span>
      </div>

      {/* Citizen Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Informations du Citoyen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User,     label: 'Nom complet',         value: request.citizen.name },
            { icon: Calendar, label: 'Date de naissance',   value: request.citizen.dob },
            { icon: Phone,    label: 'Téléphone',           value: request.citizen.phone },
            { icon: MapPin,   label: 'Adresse',             value: request.citizen.address },
            { icon: FileText, label: 'N° Pièce d\'identité', value: request.citizen.nationalId },
            { icon: Calendar, label: 'Soumis le',           value: request.submittedAt },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-[#1A237E]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Pièces Justificatives</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {request.pieces.map((piece, i) => (
            <button
              key={i}
              onClick={() => navigate(`/agent/requests/${id}/document/${i}`)}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1A237E] hover:bg-blue-50 flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-[#1A237E]/10 flex items-center justify-center">
                <Eye size={18} className="text-gray-400 group-hover:text-[#1A237E]" />
              </div>
              <span className="text-xs text-gray-500 font-medium text-center px-1 leading-tight">{piece.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Decision buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/agent/requests/${id}/decision`)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#00875A] hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-900/10 active:scale-95"
        >
          <CheckCircle size={18} /> Approuver
        </button>
        <button
          onClick={() => navigate(`/agent/requests/${id}/decision`)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#E52E2E] hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-red-900/10 active:scale-95"
        >
          <XCircle size={18} /> Rejeter
        </button>
      </div>
    </div>
  );
};

export default RequestDetail;
