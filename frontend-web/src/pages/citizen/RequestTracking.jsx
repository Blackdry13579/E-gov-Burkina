import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequestDetail } from '../../hooks/useRequests';
import Emblem from '../../components/common/Emblem';
import { 
  FileText, Clock, CheckCircle2, 
  ArrowLeft, Download, Eye, 
  Archive, FileDown, Bell,
  User, Calendar, MapPin, 
  Fingerprint, CreditCard, ShieldCheck,
  Info
} from 'lucide-react';

const RequestTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request: demande, loading } = useRequestDetail(id);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-institutional/20 border-t-institutional rounded-full animate-spin"></div>
        Chargement de votre dossier...
      </div>
    </div>
  );

  if (!demande) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-bold">
      Erreur: Demande introuvable
    </div>
  );

  const isValidee = demande.statut === 'VALIDEE' || demande.statut === 'DISPONIBLE' || demande.statut === 'TERMINEE';

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' à');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      <div className="flex-1 overflow-y-auto pt-2 pb-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          
          {/* TOP BAR MOBILE */}
          <div className="flex items-center gap-4 mb-8 lg:hidden">
            <button 
              onClick={() => navigate('/citoyen/demandes')}
              className="p-2 bg-white rounded-full shadow-sm text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-[#1A3A5C]">Suivi de ma demande</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">REF: {demande.reference}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* CARD 1 : DOCUMENT HEADER */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5">Type de document</p>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                    {demande.documentTypeId?.nom || "Extrait d'acte de naissance"}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">REF: {demande.reference}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm ${
                  isValidee 
                    ? 'bg-green-100 text-green-700' 
                    : demande.statut === 'REJETEE'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700 border border-amber-200/50'
                }`}>
                  {isValidee ? <CheckCircle2 size={16} /> : demande.statut === 'REJETEE' ? <Eye size={16} /> : <Clock size={16} />}
                  {isValidee ? 'Validée' : demande.statut === 'REJETEE' ? 'Rejetée' : 'En traitement'}
                </div>
                <p className="text-[9px] text-gray-400 font-bold tracking-tight">Mise à jour le {formatDate(demande.updatedAt)}</p>
              </div>
            </div>

            {/* CARD 2 : PROGRESS TIMELINE */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <Calendar size={14} />
                Historique de traitement
              </h3>
              
              <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                {/* Etape 1: Dépôt */}
                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shadow-lg shadow-blue-600/20 shrink-0">
                    <Fingerprint size={20} />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-extrabold text-gray-900 text-sm">Dépôt du dossier</h4>
                    <p className="text-xs text-gray-500 mt-1">Dossier reçu par le service de l'État Civil pour vérification.</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">{formatDate(demande.createdAt)}</p>
                  </div>
                </div>

                {/* Etape 2: Statut actuel */}
                <div className="flex gap-6 relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg shrink-0 ${
                    demande.statut === 'REJETEE' 
                      ? 'bg-red-600 text-white shadow-red-600/20' 
                      : isValidee 
                      ? 'bg-blue-600 text-white shadow-blue-600/20' 
                      : 'bg-amber-500 text-white shadow-amber-500/20 animated-pulse'
                  }`}>
                    {demande.statut === 'REJETEE' ? <Eye size={20} /> : isValidee ? <ShieldCheck size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="pt-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-extrabold text-sm ${demande.statut === 'REJETEE' ? 'text-red-600' : 'text-gray-900'}`}>
                        {demande.statut === 'REJETEE' ? 'Dossier rejeté' : isValidee ? 'Vérification terminée' : 'Vérification en cours'}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {demande.statut === 'REJETEE' 
                        ? demande.motifRejet || "Votre dossier nécessite des corrections. Veuillez consulter le motif du rejet."
                        : isValidee 
                        ? "Toutes les informations fournies ont été certifiées conformes."
                        : "Un service instructeur analyse actuellement les documents numériques fournis."}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">{formatDate(demande.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            {isValidee ? (
              <div className="bg-[#1A3A5C] rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Download size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <div className="bg-green-500/20 text-green-300 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      ✓ Document Disponible
                    </div>
                    <h3 className="text-xl font-extrabold mb-2">Votre document est prêt !</h3>
                    <p className="text-blue-200/80 text-sm leading-relaxed">
                      L'administration a signé numériquement votre document. Il est maintenant certifié et prêt à l'emploi.
                    </p>
                  </div>
                  <button className="bg-white text-[#1A3A5C] px-8 py-5 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-lg group">
                    <FileDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
                    TÉLÉCHARGER LE PDF (SIGNÉ)
                  </button>
                </div>
              </div>
            ) : demande.statut === 'REJETEE' && (
              <div className="bg-white rounded-[2rem] p-10 border-2 border-dashed border-red-100 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto shadow-inner">
                  <Eye size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-gray-900">Demande à rectifier</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                    Votre dossier a été rejeté par l'administration. Pour continuer, vous devez soumettre une nouvelle demande en suivant les instructions fournies dans le motif de rejet.
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/citoyen/services')}
                  className="bg-[#1A3A5C] text-white px-10 py-5 rounded-2xl font-extrabold text-sm hover:opacity-90 transition-all shadow-xl shadow-blue-900/10 flex items-center gap-3 mx-auto"
                >
                  Suggérer une nouvelle demande
                  <ArrowLeft size={20} className="rotate-180" />
                </button>
              </div>
            )}
          </div>
          
          <footer className="mt-16 text-center border-t border-gray-100 pt-10">
            <p className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">
              REPUBLIQUE DU BURKINA FASO
            </p>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">Portail National des Services Dématérialisés · ANPTIC 2026</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RequestTracking;
