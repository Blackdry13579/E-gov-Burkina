import { request } from './apiClient';

/**
 * Authentication Service
 * Manages login, registration, and user profile.
 */

/** Inscription citoyen */
export const registerCitizen = async (formData) => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
    }),
  });
};

/** Connexion universelle (Citoyen / Agent) */
export const login = async (email, password) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/** Étape 1 Admin — Demande un code PIN */
export const requestAdminPin = async (email, password) => {
  return request('/auth/admin/request-pin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/** Étape 2 Admin — Connexion avec le PIN */
export const loginAdmin = async (email, password, pin) => {
  return request('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, pin }),
  });
};

/** Profil de l'utilisateur connecté */
export const getMe = async () => {
  const data = await request('/auth/me');
  return data.data;
};

/** Mise à jour du profil citoyen */
export const updateProfile = async (formData) => {
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

/** Raccourci pour obtenir le profil citoyen formatté */
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

/** Raccourci pour obtenir le profil agent formatté */
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
