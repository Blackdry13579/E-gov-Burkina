import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, RotateCcw, Download, FileText, Image, Loader2 } from 'lucide-react';
import { getAgentRequestDetail } from '../../services/api';

const DocumentViewer = () => {
  const { id, docIndex } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getAgentRequestDetail(id);
        setPieces(data.pieces || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const currentDoc = pieces[parseInt(docIndex, 10)] || pieces[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-[#1A237E]" size={32} />
        <p className="text-gray-500 font-medium">Chargement du document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
        <p className="font-bold">Erreur de chargement</p>
        <p className="text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm font-semibold underline">Réessayer</button>
      </div>
    );
  }

  if (!currentDoc) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">Aucun document trouvé pour ce dossier.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm font-semibold text-[#1A237E]">Retour</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentDoc.name}</h1>
            <p className="text-sm text-gray-500 font-mono">Dossier: {id}</p>
          </div>
        </div>
        <button onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en cours de développement'); }} className="flex items-center gap-2 text-sm font-semibold text-[#1A237E] border border-[#1A237E]/30 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors">
          <Download size={15} /> Télécharger
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" title="Zoom arrière">
          <ZoomOut size={16} className="text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-700 min-w-[48px] text-center">{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" title="Zoom avant">
          <ZoomIn size={16} className="text-gray-600" />
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <button onClick={() => setRotation(r => r - 90)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" title="Rotation gauche">
          <RotateCcw size={16} className="text-gray-600" />
        </button>
        <button onClick={() => setRotation(r => r + 90)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" title="Rotation droite">
          <RotateCw size={16} className="text-gray-600" />
        </button>
        <div className="ml-auto text-xs text-gray-400 font-mono">Rotation: {rotation}°</div>
      </div>

      {/* Document preview area */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-96 relative">
        <div
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.2s ease' }}
          className="flex flex-col items-center justify-center"
        >
          {currentDoc.type === 'image' ? (
            <div className="w-72 h-96 bg-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 shadow-2xl">
              <Image size={48} className="text-gray-400" />
              <div className="text-center">
                <p className="text-gray-600 font-semibold">{currentDoc.name}</p>
                <p className="text-gray-400 text-xs mt-1">Aperçu du scan</p>
              </div>
            </div>
          ) : (
            <div className="w-72 h-96 bg-white rounded-xl flex flex-col items-center justify-center gap-4 shadow-2xl">
              <FileText size={48} className="text-red-400" />
              <div className="text-center">
                <p className="text-gray-700 font-semibold">{currentDoc.name}</p>
                <p className="text-gray-400 text-xs mt-1">Document PDF</p>
              </div>
              <div className="w-40 space-y-2 px-4">
                {[90, 70, 85, 60].map((w, i) => <div key={i} className="h-2 bg-gray-200 rounded" style={{width:`${w}%`}}></div>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Autres pièces ({pieces.length})</p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {pieces.map((p, i) => (
            <button
              key={i}
              onClick={() => navigate(`/agent/requests/${id}/document/${i}`)}
              className={`flex-shrink-0 w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                i === parseInt(docIndex, 10) ? 'border-[#1A237E] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.type === 'image' ? <Image size={18} className="text-gray-400" /> : <FileText size={18} className="text-red-400" />}
              <span className="text-xs text-gray-500 text-center px-1 leading-tight">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
