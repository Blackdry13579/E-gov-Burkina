import React, { createContext, useState, useCallback, useContext } from 'react';

/**
 * AuthContext — E-Gov Unified Auth Layer
 * Manages user session, tokens, and role-based access.
 *
 * KEY DESIGN:
 * - Role is ALWAYS derived from the user object, never stored separately.
 * - This prevents desync between egov_user and egov_role keys.
 * - If token + user exist in localStorage, role will ALWAYS be resolved.
 */

export const AuthContext = createContext();

const TOKEN_KEY = 'egov_token';
const USER_KEY  = 'egov_user';

/**
 * Maps backend role strings to frontend route prefixes.
 */
export const getFrontendRole = (backendRole) => {
  if (!backendRole) return 'citizen';
  const r = String(backendRole).toUpperCase();
  if (r === 'ADMIN' || r === 'SUPER_ADMIN') return 'admin';
  if (r.startsWith('AGENT') || r === 'SUPERVISEUR') return 'agent';
  return 'citizen';
};

const readUser = () => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user,  setUser]  = useState(readUser);

  // Role is ALWAYS derived live from the user object.
  // No separate localStorage key → no desync, no null-role bugs.
  const role = user ? getFrontendRole(user.role) : null;

  const loginWithToken = useCallback((jwtToken, userData) => {
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY,  JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clean up the old role key if it exists
    localStorage.removeItem('egov_role');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    role,
    user,
    token,
    isAuthenticated: !!token,
    loginWithToken,
    logout,
    refreshUser: (updatedUser) => {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
