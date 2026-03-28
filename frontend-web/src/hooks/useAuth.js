import { useAuth } from '../context/AuthContext';

/**
 * Convenience hook for authentication.
 * Wraps the raw context and can provide additional helpers.
 */

export const useAuthUser = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    isAdmin: auth.role === 'admin',
    isAgent: auth.role === 'agent',
    isCitizen: auth.role === 'citizen',
    userName: `${auth.user?.prenom || ''} ${auth.user?.nom || ''}`.trim(),
    initials: `${auth.user?.prenom?.charAt(0) || ''}${auth.user?.nom?.charAt(0) || ''}`.toUpperCase()
  };
};
