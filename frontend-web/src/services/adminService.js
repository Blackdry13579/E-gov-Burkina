import { request } from './apiClient';

/**
 * Admin Service — Unified Catalog & Monitoring
 * Manages Services (Mairie, Justice) and Document Types.
 */

// Mock internal state to simulate a database for the unified catalog
let _catalog_services = [
  { 
    id: 'SRV-MAIRIE', 
    name: 'Mairie', 
    description: 'Gestion de l\'état civil (naissances, mariages, décès) et documents municipaux.',
    region: 'National',
    type: 'Administration Territoriale',
    active: true 
  },
  { 
    id: 'SRV-JUSTICE', 
    name: 'Justice', 
    description: 'Délivrance de casiers judiciaires, certificats de nationalité et actes juridiques.',
    region: 'National',
    type: 'Pouvoir Judiciaire',
    active: true 
  }
];

let _catalog_documents = [
  { id: 'DOC-01', name: 'Acte de Naissance', desc: 'Copie intégrale ou extrait d\'acte de naissance officiel.', price: '500 FCFA', duration: '48H', serviceId: 'SRV-MAIRIE', active: true },
  { id: 'DOC-02', name: 'Certificat de Mariage', desc: 'Preuve légale d\'union civile enregistrée.', price: '1000 FCFA', duration: '72H', serviceId: 'SRV-MAIRIE', active: true },
  { id: 'DOC-03', name: 'Casier Judiciaire', desc: 'Bulletin n°3 attestant de l\'absence de condamnations.', price: '1500 FCFA', duration: '5 JOURS', serviceId: 'SRV-JUSTICE', active: true },
  { id: 'DOC-04', name: 'Certificat de Nationalité', desc: 'Attestation officielle de la nationalité burkinabè.', price: '2000 FCFA', duration: '1 SEMAINE', serviceId: 'SRV-JUSTICE', active: true },
];

export const getStats = async () => {
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

export const getRequests = async () => {
  const data = await request('/admin/demandes');
  return (data.data || []).map((d) => {
    let status = d.statut;
    if (status === 'EN_ATTENTE') status = 'EN ATTENTE';
    if (status === 'VALIDEE') status = 'VALIDÉ';
    if (status === 'REJETEE') status = 'REJETÉ';

    return {
      id: d.reference,
      citizen: `${d.citoyenId?.prenom || ''} ${d.citoyenId?.nom || ''}`.trim() || 'Inconnu',
      document: d.documentTypeId?.nom || 'Document',
      service: d.documentTypeId?.centreTraitement || 'National',
      status: status,
      date: d.dateSoumission ? new Date(d.dateSoumission).toLocaleDateString('fr-FR') : '',
      _raw: d
    };
  });
};

export const getUsers = async () => {
  const data = await request('/admin/users');
  return (data.data || [])
    .filter((u) => u.role !== 'SUPER_ADMIN' && u.role !== 'ADMIN')
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

// --- SERVICES MGMT ---
export const getServices = async () => {
  return [..._catalog_services];
};

export const addService = async (service) => {
  const newSrv = { ...service, id: `SRV-${Date.now()}` };
  _catalog_services.push(newSrv);
  return newSrv;
};

export const updateService = async (id, data) => {
  _catalog_services = _catalog_services.map(s => s.id === id ? { ...s, ...data } : s);
  return true;
};

export const deleteService = async (id) => {
  _catalog_services = _catalog_services.filter(s => s.id !== id);
  return true;
};

// --- DOCUMENTS MGMT ---
export const getDocuments = async () => {
  return [..._catalog_documents];
};

export const addDocument = async (doc) => {
  const newDoc = { ...doc, id: `DOC-${Date.now()}` };
  _catalog_documents.push(newDoc);
  return newDoc;
};

export const updateDocument = async (id, data) => {
  _catalog_documents = _catalog_documents.map(d => d.id === id ? { ...d, ...data } : d);
  return true;
};

export const deleteDocument = async (id) => {
  _catalog_documents = _catalog_documents.filter(d => d.id !== id);
  return true;
};

export const getLogs = async () => {
  const data = await request('/admin/logs?limit=10');
  return (data.data || []).map((log, i) => ({
    id: log._id || i,
    text: log.description || log.action,
    time: log.createdAt ? new Date(log.createdAt).toLocaleString('fr-FR') : '',
    type: log.action?.toLowerCase() || 'info',
  }));
};

export const createAgent = async (userData) => {
  return request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const toggleUserActive = async (userId) => {
  return request(`/admin/users/${userId}/toggle`, { method: 'PUT' });
};

export const updatePermissions = async (roleId, permissions) => {
  return request(`/admin/roles/${roleId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  });
};

export const getRecentActivities = getLogs;
