import { request } from './apiClient';

/**
 * Agent Service
 * Processing and validating requests.
 */

export const getStats = async () => {
  const data = await request('/agent/stats');
  const s = data.data || {};
  return {
    pending: s.enAttente || 0,
    pendingGrowth: '',
    validatedThisMonth: s.valideesMois || 0,
    totalProcessed: s.totalTraitees || 0,
    validationRate: s.tauxValidation ? `${s.tauxValidation}%` : '—',
    avgProcessTime: s.delaiMoyen || '—',
  };
};

export const getRequests = async () => {
  const data = await request('/agent/demandes');
  return (data.data || []).map((d) => {
    let status = d.statut;
    if (status === 'EN_ATTENTE') status = 'EN ATTENTE';
    if (status === 'EN_COURS') status = 'EN COURS';
    if (status === 'VALIDEE') status = 'VALIDÉ';
    if (status === 'REJETEE') status = 'REJETÉ';

    return {
      id: d.reference,
      citizen: `${d.citoyenId?.prenom || ''} ${d.citoyenId?.nom || ''}`.trim(),
      document: d.documentTypeId?.nom || 'Document',
      status: status,
      date: d.dateSoumission
        ? new Date(d.dateSoumission).toLocaleDateString('fr-FR')
        : '',
      priority: d.priorite || 'NORMAL',
      _raw: d,
    };
  });
};

export const getRequestDetail = async (id) => {
  const data = await request(`/demandes/${id}`);
  const d = data.data;

  let status = d.statut;
  if (status === 'EN_ATTENTE') status = 'EN ATTENTE';
  if (status === 'EN_COURS') status = 'EN COURS';
  if (status === 'VALIDEE') status = 'VALIDÉ';
  if (status === 'REJETEE') status = 'REJETÉ';

  return {
    id: d.reference,
    citizen: {
      name: `${d.citoyenId?.prenom || ''} ${d.citoyenId?.nom || ''}`.trim(),
      dob: d.citoyenId?.dateNaissance || '',
      phone: d.citoyenId?.telephone || '',
      address: d.citoyenId?.adresse || '',
      nationalId: '',
    },
    document: d.documentTypeId?.nom || '',
    status: status,
    submittedAt: d.dateSoumission
      ? new Date(d.dateSoumission).toLocaleString('fr-FR')
      : '',
    pieces: (d.fichiers || []).map((f) => ({
      name: f.nom || f.code,
      type: f.mimeType?.includes('pdf') ? 'pdf' : 'image',
      url: f.url || null,
    })),
    _raw: d,
  };
};

export const approveRequest = async (id, comment = '') => {
  return request(`/agent/demandes/${id}/valider`, {
    method: 'PUT',
    body: JSON.stringify({ commentaire: comment }),
  });
};

export const rejectRequest = async (id, reason) => {
  if (!reason) throw new Error('Le motif de rejet est obligatoire.');
  return request(`/agent/demandes/${id}/rejeter`, {
    method: 'PUT',
    body: JSON.stringify({ motifRejet: reason }),
  });
};

export const updateRequestStatus = async (id, status, motif = '') => {
  if (status === 'VALIDÉ' || status === 'VALIDEE') return approveRequest(id, motif);
  if (status === 'REJETÉ' || status === 'REJETEE') return rejectRequest(id, motif);
  return request(`/agent/demandes/${id}/update-status`, {
    method: 'PUT',
    body: JSON.stringify({ status, motif }),
  });
};

export const takeCharge = async (id) => {
  return request(`/agent/demandes/${id}/prendre-en-charge`, { method: 'PUT' });
};

export const requestComplement = async (id, message) => {
  return request(`/agent/demandes/${id}/demander-complement`, {
    method: 'PUT',
    body: JSON.stringify({ message }),
  });
};

export const getSessions = async () => {
  const data = await request('/agent/sessions');
  return data.data || [
    { id: 1, device: 'Chrome on MacOS (Actuel)', location: 'Ouagadougou, BF', ip: '192.168.1.45', time: 'Il y a 2 minutes', current: true },
    { id: 2, device: 'Safari on iPhone 15', location: 'Bobo-Dioulasso, BF', ip: '10.0.0.8', time: 'Il y a 3 heures', current: false },
  ];
};

export const getProfile = async () => {
  const data = await request('/agent/profile');
  return data.data || { name: 'Sawadogo Moussa', matricule: 'MAI-OUAGA-2024-089', signatureExpiry: '2027-01-15' };
};
