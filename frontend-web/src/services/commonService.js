import { request, getToken } from './apiClient';

/**
 * Common Service
 * Notifications, File Uploads.
 */

export const getNotifications = async () => {
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

export const markRead = async (id) => {
  return request(`/notifications/${id}/read`, { method: 'PUT' });
};

export const markAllRead = async () => {
  return request('/notifications/read-all', { method: 'PUT' });
};

export const upload = async (file, code = 'doc') => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('code', code);

  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erreur upload');
  return data;
};
