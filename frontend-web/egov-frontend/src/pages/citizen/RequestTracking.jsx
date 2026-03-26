import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCitizenRequestTracking } from '../../services/api';
import { 
  FileText, CheckCircle2, Clock, MapPin, 
  Download, Eye, ShieldCheck, HelpCircle, 
  Archive, ArrowLeft, MoreVertical
} from 'lucide-react';

const RequestTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCitizenRequestTracking(id)
      .then(data => {
        setTracking(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-institutional"></div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Demande non trouvée ou erreur de chargement.</p>
        <button onClick={() => navigate('/demandes')} className="text-institutional font-bold underline">
          Retour à mes demandes
        </button>
      </div>
    );
  }

  const demande = tracking._raw;
  const isValidee = demande.statut === 'VALIDEE';
  const documentUrl = demande.documentPDF?.url;

  // Formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' à');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F8]">
      {/* TOP BAR (Desktop Style) */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm lg:relative lg:shadow-none lg:border-none lg:bg-transparent lg:px-0 lg:mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/demandes')}
            className="p-2 hover:bg-white rounded-full transition-colors lg:bg-white lg:shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-[#1A3A5C]">Suivi de ma demande</h1>
            <p className="text-xs text-gray-400 font-medium">Consultez l'état d'avancement de votre dossier en temps réel</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800 leading-none">
              {demande.userId?.nom} {demande.userId?.prenom}
            </p>
            <p className="text-[10px] font-bold text-institutional tracking-widest uppercase mt-1">CITOYEN</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">
            {demande.userId?.nom?.charAt(0) || 'C'}{demande.userId?.prenom?.charAt(0)}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-0">
        {/* CARD 1 : DOCUMENT HEADER */}
        <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type de document</p>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {demande.documentTypeId?.nom || "Extrait d'acte de naissance"}
              </h2>
              <p className="text-xs font-mono font-bold text-gray-400 mt-1">REF: {demande.reference}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${
              isValidee 
                ? 'bg-green-100 text-green-600' 
                : demande.statut === 'REJETEE'
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600'
            }`}>
              {isValidee ? <CheckCircle2 size={14} /> : demande.statut === 'REJETEE' ? <Eye size={14} /> : <Clock size={14} />}
              {isValidee ? '✔ Validée' : demande.statut === 'REJETEE' ? '✘ Rejetée' : 'En cours'}
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <Archive size={18} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Dossier complet</span>
            </div>
            <button className="text-gray-300 hover:text-gray-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: TIMELINE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 h-full">
              <h3 className="text-sm font-bold text-[#1A3A5C] uppercase tracking-wider mb-8 border-b border-gray-50 pb-4">
                État d'avancement
              </h3>

              <div className="relative pl-8 space-y-12 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
                {/* ÉTAPE 1: SOUMISSION */}
                <div className="relative">
                  <div className="absolute -left-8 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white z-10 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Demande soumise</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(demande.dateSoumission)}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Votre dossier a été reçu par le système.</p>
                  </div>
                </div>

                {/* ÉTAPE 2: PAIEMENT */}
                <div className="relative">
                  <div className={`absolute -left-8 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white z-10 font-bold text-[10px] ${
                    demande.paiement?.statut === 'PAYE' ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {demande.paiement?.statut === 'PAYE' ? '✓' : ''}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Paiement confirmé</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(demande.paiement?.datePaiement)}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Frais de timbre et service réglés.</p>
                  </div>
                </div>

                {/* ÉTAPE 3: TRAITEMENT */}
                <div className="relative">
                  <div className={`absolute -left-8 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white z-10 font-bold text-[10px] ${
                    ['EN_COURS', 'VALIDEE'].includes(demande.statut) ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {['EN_COURS', 'VALIDEE'].includes(demande.statut) ? '✓' : ''}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">En cours de traitement</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Agent: {demande.documentTypeId?.service || 'Service Technique'}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Votre dossier est en cours d'examen par un agent.</p>
                  </div>
                </div>

                {/* ÉTAPE 4: VALIDATION / REJET */}
                <div className="relative">
                  <div className={`absolute -left-8 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white z-10 font-bold text-[10px] ${
                    isValidee ? 'bg-green-500' : demande.statut === 'REJETEE' ? 'bg-red-500' : 'bg-gray-200'
                  }`}>
                    {isValidee ? '✓' : demande.statut === 'REJETEE' ? '✘' : ''}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold uppercase ${
                      isValidee ? 'text-green-600' : demande.statut === 'REJETEE' ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {isValidee ? 'DEMANDE VALIDÉE' : demande.statut === 'REJETEE' ? 'DEMANDE REJETÉE' : 'VALIDATION'}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(demande.dateTraitement)}</p>
                    
                    {isValidee && (
                      <p className="text-xs text-gray-600 font-medium mt-2 bg-green-50 p-2 rounded-lg border border-green-100">
                        "{demande.notesAgent || 'Dossier conforme, document généré.'}"
                      </p>
                    )}

                    {demande.statut === 'REJETEE' && (
                      <div className="mt-2 bg-red-50 p-3 rounded-xl border border-red-100">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Motif du rejet</p>
                        <p className="text-xs text-red-700 font-bold">
                           {demande.motif_rejet || 'Dossier incomplet ou informations non valides.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: RÉSUMÉ DES INFORMATIONS */}
            <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-[#1A3A5C] uppercase tracking-wider mb-6 border-b border-gray-50 pb-4">
                Informations fournies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {demande.data && Object.keys(demande.data).map((key) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-bold text-gray-800">{demande.data[key] || '—'}</span>
                  </div>
                ))}
                {/* Fallback si par hasard data est vide mais on a userId */}
                {!demande.data && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nom</span>
                      <span className="text-sm font-bold text-gray-800">{demande.userId?.nom}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prénom</span>
                      <span className="text-sm font-bold text-gray-800">{demande.userId?.prenom}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIONS & QR */}
          <div className="space-y-6">
            {/* DOWNLOAD CARD */}
            <div className={`rounded-[12px] p-6 shadow-lg border transition-all ${
              isValidee 
                ? 'bg-[#1A3A5C] border-blue-900 text-white' 
                : 'bg-white border-gray-100 text-gray-800'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isValidee ? 'bg-white/10' : 'bg-blue-50'}`}>
                  <FileText className={isValidee ? 'text-white' : 'text-blue-600'} size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Votre document est prêt</h4>
                  <p className={`text-[10px] ${isValidee ? 'text-blue-200' : 'text-gray-400'}`}>Taille du fichier: 245 KB</p>
                </div>
              </div>

              {/* Progress bar (simulated) */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div className={`h-full rounded-full ${isValidee ? 'bg-green-500 w-full' : 'bg-gray-200 w-[75%]'}`}></div>
              </div>

              <div className="space-y-3">
                <button 
                  disabled={!isValidee || !documentUrl}
                  onClick={() => window.open(documentUrl, '_blank')}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isValidee 
                    ? 'bg-white text-[#1A3A5C] hover:bg-gray-100' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download size={18} />
                  Télécharger
                </button>
                <button 
                  disabled={!isValidee || !documentUrl}
                  onClick={() => window.open(documentUrl, '_blank')}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isValidee 
                    ? 'bg-transparent border border-white/30 text-white hover:bg-white/5' 
                    : 'bg-transparent border border-gray-200 text-gray-300'
                  }`}
                >
                  <Eye size={18} />
                  Aperçu
                </button>
              </div>
            </div>

            {/* QR CODE CARD */}
            <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100">
              <h4 className="text-[10px] font-extrabold text-[#1A3A5C] tracking-widest uppercase mb-4 text-center">
                VÉRIFICATION PUBLIQUE
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center">
                {/* QR Placeholder */}
                <div className="w-32 h-32 bg-white p-2 border border-gray-200 rounded-lg shadow-inner mb-4 flex items-center justify-center">
                  <div className="text-gray-200">
                    <ShieldCheck size={48} strokeWidth={1} />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center leading-relaxed px-2">
                  Scannez ce QR code pour vérifier l'authenticité du document sur le portail officiel **e-Vérification**.
                </p>
              </div>
            </div>

            {/* HELP CARD */}
            <div className="bg-[#f0f4f8] rounded-[12px] p-5 border border-blue-100/50 flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm text-institutional">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Besoin d'aide avec cette demande ?</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Contactez le support technique au 3434 (appel gratuit)</p>
                <button className="text-xs font-bold text-institutional underline underline-offset-2 mt-3 block">
                  Support en ligne
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 text-center pb-8 border-t border-gray-100 pt-8">
          <p className="text-[9px] font-extrabold text-gray-300 tracking-[0.2em] uppercase">
            PORTAIL OFFICIEL DES SERVICES DÉMATÉRIALISÉS
          </p>
          <p className="text-[9px] text-gray-400 mt-1">© 2026 Ministère de la Transition Digitale · Burkina Faso</p>
        </footer>
      </div>
    </div>
  );
};

export default RequestTracking;
