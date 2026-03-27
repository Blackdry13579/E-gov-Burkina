/**
 * API Service — E-Gov Frontend
 * Connexion réelle au backend Node.js/Express (port 5000)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helper: requête HTTP avec JWT ───────────────────────────────────────────

const getToken = () => localStorage.getItem('egov_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Erreur ${response.status}`);
  }

  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

/** Inscription citoyen */
export const simulateCitizenRegister = async (formData) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
    }),
  });
  return data; // { success, token, user }
};

/** Connexion citoyen */
export const simulateCitizenLogin = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data; // { success, token, user }
};

/** Étape 1 — Admin demande un code PIN */
export const requestAdminPin = async (email, password) => {
  return request('/auth/admin/request-pin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/** Étape 2 — Admin se connecte avec le PIN */
export const simulateLogin = async (email, password, pin) => {
  return request('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, pin }),
  });
};

/** Connexion agent (email + password — role AGENT_*) */
export const simulateAgentLogin = async (email, password) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/** Profil de l'utilisateur connecté */
export const getMe = async () => {
  const data = await request('/auth/me');
  return data.data;
};

/** Mise à jour du profil */
export const updateCitizenProfile = async (formData) => {
  return request('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(formData),
  });
};

/** Mise à jour du mot de passe */
export const updatePassword = async (currentPassword, newPassword) => {
  return request('/auth/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

// ─── DOCUMENTS (types de services disponibles) ───────────────────────────────

export const getCitizenServices = async () => {
  const data = await request('/documents');
  // Le backend retourne { success, data: [...] }
  return (data.data || []).map((doc) => ({
    id: doc._id,
    name: doc.nom,
    categorie: doc.service || doc.code,
    prix_fcfa: doc.frais || 0,
    delai: doc.delaiTraitement ? `${doc.delaiTraitement}H` : '48H',
    livraison: doc.modeLivraison || 'PDF',
    statut_badge: doc.actif ? 'DISPONIBLE' : 'INDISPONIBLE',
    documents_requis: (doc.justificatifs || []).map((j) => j.nom || j.code),
    icon: '📄',
    _raw: doc,
  }));
};

export const getCitizenServiceDetail = async (id) => {
  const services = await getCitizenServices();
  return services.find((s) => s.id === id) || services[0];
};

// ─── DEMANDES ─────────────────────────────────────────────────────────────────

export const getCitizenRequests = async () => {
  const data = await request('/demandes');
  return (data.data || []).map((d) => {
    // Normalisation des statuts pour le frontend
    let mappedStatut = d.statut;
    if (d.statut === 'VALIDEE') mappedStatut = 'VALIDE';
    if (d.statut === 'REJETEE') mappedStatut = 'REJETE';

    return {
      id: d.reference,
      reference: d.reference,
      service_name: d.documentTypeId?.nom || 'Service',
      statut: mappedStatut,
      date_depot: d.dateSoumission
        ? new Date(d.dateSoumission).toLocaleDateString('fr-FR')
        : '',
      icon: '📄',
      _raw: d,
    };
  });
};

export const getCitizenRequestTracking = async (reference) => {
  const data = await request(`/demandes/${reference}`);
  const d = data.data;
  const steps = (d.historique || []).map((h) => ({
    name: h.action,
    time: new Date(h.date).toLocaleDateString('fr-FR'),
    status: 'COMPLETED',
  }));
  if (steps.length === 0) {
    steps.push({ name: 'Demande soumise', time: '', status: 'COMPLETED' });
  }
  return {
    reference: d.reference,
    statut: d.statut,
    steps,
    _raw: d,
  };
};

export const submitCitizenRequest = async (payload) => {
  // payload = { documentTypeId, donnees, fichiers, modeLivraison, paiement }
  const data = await request('/demandes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data; // { success, message, data: { reference, statut, frais } }
};

export const payerDemande = async (reference, methodePaiement, telephone) => {
  return request(`/demandes/${reference}/payer`, {
    method: 'POST',
    body: JSON.stringify({ methode: methodePaiement, telephone }),
  });
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export const getCitizenNotifications = async () => {
  const data = await request('/notifications');
  return (data.data || []).map((n) => ({
    id: n._id,
    type: n.type,
    titre: n.titre,
    message: n.message,
    lu: n.lu,
    created_at: new Date(n.createdAt).toLocaleDateString('fr-FR'),
    badge_statut: n.donnees?.statut || '',
    _raw: n,
  }));
};

export const getAgentNotifications = getCitizenNotifications;

export const markNotificationRead = async (id) => {
  return request(`/notifications/${id}/read`, { method: 'PUT' });
};

export const markAllNotificationsRead = async () => {
  return request('/notifications/read-all', { method: 'PUT' });
};

// ─── UPLOAD ───────────────────────────────────────────────────────────────────

export const uploadFile = async (file, code = 'doc') => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('code', code);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erreur upload');
  return data;
};

// ─── AGENT ────────────────────────────────────────────────────────────────────

export const getAgentStats = async () => {
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

export const getAgentRequests = async () => {
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

export const getAgentRequestDetail = async (id) => {
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

export const prendreEnCharge = async (id) => {
  return request(`/agent/demandes/${id}/prendre-en-charge`, { method: 'PUT' });
};

export const demanderComplement = async (id, message) => {
  return request(`/agent/demandes/${id}/demander-complement`, {
    method: 'PUT',
    body: JSON.stringify({ message }),
  });
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
  const data = await request('/admin/stats');
  const s = data.data || {};
  return {
    totalRequests: s.totalDemandes || 0,
    requestsGrowth: '',
    pendingRequests: s.enAttente || 0,
    citizens: s.totalCitoyens || 0,
    activeAgents: s.totalAgents || 0,
  };
};

export const fetchRequests = async () => {
  const data = await request('/admin/demandes');
  return (data.data || []).map((d) => {
    let status = d.statut;
    if (status === 'EN_ATTENTE') status = 'EN ATTENTE';
    if (status === 'EN_COURS') status = 'EN COURS';
    if (status === 'VALIDEE') status = 'VALIDÉ';
    if (status === 'REJETEE') status = 'REJETÉ';

    return {
      id: d.reference,
      citizen: `${d.citoyenId?.prenom || ''} ${d.citoyenId?.nom || ''}`.trim(),
      document: d.documentTypeId?.nom || '',
      status: status,
      date: d.dateSoumission
        ? new Date(d.dateSoumission).toLocaleDateString('fr-FR')
        : '',
    };
  });
};

export const fetchUsers = async () => {
  const data = await request('/admin/users');
  return (data.data || [])
    .filter((u) => u.role !== 'SUPER_ADMIN' && u.role !== 'ADMIN') // Exclude admins
    .map((u) => ({
      id: u._id,
      matricule: u.matricule || u._id.substring(0, 8).toUpperCase(),
      name: `${u.prenom || ''} ${u.nom || ''}`.trim() || 'Citoyen Sans Nom',
      phone: u.telephone || 'Non renseigné',
      service: u.service || '--',
      role: u.role || 'CITOYEN',
      status: u.isActive ? 'ACTIF' : 'INACTIF',
      date: u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '--',
    }));
};

export const fetchRecentActivities = async () => {
  const data = await request('/admin/logs?limit=10');
  return (data.data || []).map((log, i) => ({
    id: log._id || i,
    text: log.description || log.action,
    time: log.createdAt
      ? new Date(log.createdAt).toLocaleString('fr-FR')
      : '',
    type: log.action?.toLowerCase() || 'info',
  }));
};

export const createAdminUser = async (userData) => {
  return request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const toggleUserStatus = async (userId) => {
  return request(`/admin/users/${userId}/toggle`, { method: 'PUT' });
};

// ─── MOCK FALLBACKS (données statiques pour écrans sans API dédiée) ───────────

export const fetchRoles = async () => [
  { id: 'ROLE-001', name: 'Administrateur Système', permissions: { viewRequests: true, validateFiles: true, manageUsers: true, config: true } },
  { id: 'ROLE-002', name: 'Superviseur Mairie', permissions: { viewRequests: true, validateFiles: true, manageUsers: false, config: false } },
];

export const updatePermissions = async () => ({ success: true });

export const getCitizenProfile = async () => {
  const user = await getMe();
  return {
    id: user._id,
    nom_complet: `${user.prenom || ''} ${user.nom || ''}`.trim(),
    cnib: user.cnib || '',
    date_naissance: user.dateNaissance || '',
    telephone: user.telephone || '',
    email: user.email || '',
    adresse: user.adresse || '',
    compte_verifie: user.isActive || false,
    avatar_url: '',
  };
};

export const getAgentProfile = async () => {
  const user = await getMe();
  return {
    name: `${user.prenom || ''} ${user.nom || ''}`.trim(),
    matricule: user.matricule || '',
    role: user.role,
    department: user.service || '',
    email: user.email,
    phone: user.telephone || '',
    since: '',
    stats: { processed: 0, validated: 0, rejected: 0, validationRate: '—' },
    signatureCertified: false,
    signatureExpiry: '',
  };
};

export const getAgentMessages = async () => [];
export const getAgentHistory = async () => [];
export const getAgentSessions = async () => [];
