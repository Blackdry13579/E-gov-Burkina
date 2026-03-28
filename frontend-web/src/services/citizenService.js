import { request } from './apiClient';

/**
 * Citizen Service
 * Catalog, document requests, and tracking.
 */

export const getServices = async () => {
  const data = await request('/documents');
  return (data.data || []).map((doc) => ({
    id: doc._id,
    code: doc.code,
    name: doc.nom,
    categorie: doc.categorie || 'ETAT_CIVIL',
    prix_fcfa: doc.frais || 0,
    delai: doc.delaiJours ? `${doc.delaiJours} JOURS` : '48H',
    livraison: doc.service === 'mairie' ? 'MAIRIE' : 'JUSTICE',
    statut_badge: doc.actif ? 'DISPONIBLE' : 'INDISPONIBLE',
    documents_requis: (doc.justificatifs || []).map((j) => j.nom || j.code),
    icon: '📄',
    description: doc.description || '',
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
