/**
 * Core API Client — E-Gov Frontend
 * Handles base configuration, JWT headers, and error processing.
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('egov_token');

/**
 * Standard request helper
 * @param {string} endpoint - API endpoint (e.g., '/auth/me')
 * @param {object} options - Fetch options (method, body, headers)
 */
export const request = async (endpoint, options = {}) => {
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
    const error = new Error(data.message || `Erreur ${response.status}`);
    if (data.errors) error.errors = data.errors;
    // Log out if unauthorized (optional logic based on UX)
    // if (response.status === 401) { localStorage.removeItem('egov_token'); window.location.href = '/login'; }
    throw error;
  }

  return data;
};

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

export default { request, getToken, uploadFile, BASE_URL };
