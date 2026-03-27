import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

const TOKEN_KEY = 'egov_token';
const USER_KEY = 'egov_user';
const ROLE_KEY = 'egov_role';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
  });

  const [role, setRoleState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ROLE_KEY)) || null; }
    catch { return null; }
  });

  /**
   * Appelé après un login réussi (citoyen, admin ou agent).
   * @param {string} jwtToken - Le token JWT retourné par le backend
   * @param {object} userData  - L'objet utilisateur retourné par le backend
   */
  const loginWithToken = useCallback((jwtToken, userData) => {
    // Déduire le rôle frontend à partir du rôle backend
    let frontendRole = 'citizen';
    const backendRole = userData?.role || '';
    if (backendRole === 'ADMIN') frontendRole = 'admin';
    else if (backendRole.startsWith('AGENT') || backendRole === 'SUPERVISEUR') frontendRole = 'agent';

    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(ROLE_KEY, JSON.stringify(frontendRole));

    setToken(jwtToken);
    setUser(userData);
    setRoleState(frontendRole);
  }, []);

  /**
   * Compatibilité avec l'ancien système mock (login par rôle string).
   * Garde la même signature pour ne pas casser l'admin login.
   */
  const login = useCallback((roleType, userData) => {
    const mockUser = userData || {
      name: roleType === 'admin' ? 'Admin' : 'Agent',
      email: roleType === 'admin' ? 'admin@egov.bf' : 'agent@egov.bf',
    };
    localStorage.setItem(ROLE_KEY, JSON.stringify(roleType));
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    setRoleState(roleType);
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setUser(null);
    setRoleState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, token, login, loginWithToken, logout, setRole: setRoleState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
