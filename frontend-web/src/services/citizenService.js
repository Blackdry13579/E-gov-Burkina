import { request } from './apiClient';
import { getDocuments as getAdminDocuments } from './adminService';

/**
 * Citizen Service
 * Catalog, document requests, and tracking.
 */

export const getServices = async () => {
  // We use the unified admin catalog as the source of truth
  const documents = await getAdminDocuments();
  
  // Group documents by their category or service for the catalog view
  return documents.filter(doc => doc.active).map((doc) => ({
    id: doc.id,
    code: doc.id,
    name: doc.name,
    categorie: doc.serviceId === 'SRV-JUSTICE' ? 'Justice' : 'État Civil',
    prix_fcfa: parseInt(doc.price) || 0,
    delai: doc.duration,
    livraison: doc.serviceId === 'SRV-MAIRIE' ? 'MAIRIE' : 'JUSTICE',
    statut_badge: 'DISPONIBLE',
    documents_requis: [],
    icon: doc.serviceId === 'SRV-JUSTICE' ? '⚖️' : '📄',
    description: doc.desc || '',
    _raw: doc,
  }));
};

export const getServiceDetail = async (id) => {
  const services = await getServices();
  return services.find((s) => s.id === id) || services[0];
};

export const getRequests = async () => {
  const data = await request('/demandes');
  return (data.data || []).map((d) => {
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

export const getRequestTracking = async (reference) => {
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

export const submitRequest = async (payload) => {
  return request('/demandes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const payRequest = async (reference, methodePaiement, telephone) => {
  return request(`/demandes/${reference}/payer`, {
    method: 'POST',
    body: JSON.stringify({ methode: methodePaiement, telephone }),
  });
};
