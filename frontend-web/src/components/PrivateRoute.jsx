import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — protects routes by required role.
 *
 * Logic (simplified, works with the new AuthContext design):
 * 1. No token → user not logged in → redirect to login.
 * 2. No user (token exists but user data missing) → redirect.   
 * 3. Role matches requiredRole → render the page.
 * 4. Role doesn't match → redirect to the appropriate login.
 *
 * NOTE: role is now always derived from the user object synchronously,
 * so it can NEVER be null when token + user are present.
 */
const PrivateRoute = ({ requiredRole, redirectTo }) => {
  const { token, user, role } = useAuth();

  // Not authenticated at all
  if (!token || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Wrong role (e.g. agent trying to access citizen area)
  if (role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
