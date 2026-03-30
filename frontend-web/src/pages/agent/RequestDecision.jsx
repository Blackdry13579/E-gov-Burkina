import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAgentRequestDetail } from '../../hooks/useAgent';
import { CheckCircle, XCircle, ArrowLeft, MessageSquare, AlertTriangle } from 'lucide-react';

const RequestDecision = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateStatus, request } = useAgentRequestDetail(id);
  
  const intent = location.state?.intent || null;
  const dbId = location.state?.dbId || id;

  const [comment, setComment] = useState('');
  const [step, setStep] = useState('idle'); // idle | loading | success | error
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState('');

  const handleApprove = async () => {
    setAction('approve');
    setStep('loading');
    const res = await updateStatus('VALIDÉ', comment, dbId);
    if (res.success) {
      setMessage('Le dossier a été approuvé avec succès.');
      setStep('success');
    } else {
      setMessage(res.error);
      setStep('error');
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setMessage('Le motif de rejet est obligatoire.');
      setStep('error');
      return;
    }
    setAction('reject');
    setStep('loading');
    const res = await updateStatus('REJETÉ', comment, dbId);
    if (res.success) {
      setMessage('Le dossier a été rejeté.');
      setStep('success');
    } else {
      setMessage(res.error);
      setStep('error');
    }
  };

  if (step === 'success') return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${action === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
        {action === 'approve' ? <CheckCircle size={40} className="text-[#00875A]" /> : <XCircle size={40} className="text-[#E52E2E]" />}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{action === 'approve' ? 'Dossier approuvé !' : 'Dossier rejeté'}</h2>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      <button onClick={() => navigate('/agent/requests')} className="bg-[#1A237E] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-institutional transition-colors">
        Retour aux requêtes
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {intent === 'approve' ? 'Validation du dossier' : intent === 'reject' ? 'Rejet du dossier' : 'Décision de traitement'}
          </h1>
          <p className="text-sm text-gray-500 font-mono">Réf: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Zone traitement (Gauche) */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className={`flex items-center gap-2 text-sm font-semibold ${intent === 'reject' ? 'text-red-700' : 'text-gray-700'}`}>
            <MessageSquare size={16} className={intent === 'reject' ? 'text-red-600' : 'text-[#1A237E]'} />
            {intent === 'reject' ? 'Motif du rejet (Obligatoire)' : 'Commentaire de validation (Optionnel)'}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={intent === 'reject' ? 'Saisissez le motif explicite du rejet pour le citoyen...' : 'Ajoutez une note interne ou un message (optionnel)...'}
            rows={6}
            className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 resize-none ${intent === 'reject' ? 'border-red-200 focus:ring-red-500/20 focus:border-red-500 bg-red-50/30' : 'border-gray-200 focus:ring-[#1A237E]/20 focus:border-[#1A237E] bg-white'}`}
          />

          {step === 'error' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertTriangle size={16} />
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {(!intent || intent === 'approve') && (
              <button
                onClick={handleApprove}
                disabled={step === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00875A] hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/10 active:scale-95 disabled:opacity-60"
              >
                {step === 'loading' && action === 'approve' ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : <CheckCircle size={18} />}
                Confirmer la validation
              </button>
            )}
            {(!intent || intent === 'reject') && (
              <button
                onClick={handleReject}
                disabled={step === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 bg-[#E52E2E] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/10 active:scale-95 disabled:opacity-60"
              >
                {step === 'loading' && action === 'reject' ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                ) : <XCircle size={18} />}
                Confirmer le rejet
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">Cette décision sera enregistrée et notifiée au citoyen via le portail.</p>
        </div>

        {/* Récapitulatif (Droite) */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Récapitulatif</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Citoyen</p>
              <p className="text-sm font-semibold text-gray-800">{request?.citizen?.name || 'Chargement...'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Document demandé</p>
              <div className="inline-block bg-blue-50 text-[#1A237E] px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">
                {request?.document || '...'}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date de soumission</p>
              <p className="text-xs font-medium text-gray-600">{request?.submittedAt || '...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDecision;
