import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — protects routes by required role.
 * Usage: <Route element={<PrivateRoute requiredRole="admin" redirectTo="/admin/login" />}>
 *          ... child routes ...
 *        </Route>
 */
const PrivateRoute = ({ requiredRole, redirectTo }) => {
  const { role } = useAuth();

  if (role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
