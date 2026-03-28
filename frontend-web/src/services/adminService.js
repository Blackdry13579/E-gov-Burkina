import { request } from './apiClient';

/**
 * Admin Service
 * Global control, users, and logs.
 */

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

export const getLogs = async () => {
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

export const createAgent = async (userData) => {
  return request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const toggleUserActive = async (userId) => {
  return request(`/admin/users/${userId}/toggle`, { method: 'PUT' });
};

export const fetchRoles = async () => {
  const data = await request('/admin/roles');
  return data.data || [];
};

export const updatePermissions = async (roleId, permissions) => {
  return request(`/admin/roles/${roleId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  });
};
