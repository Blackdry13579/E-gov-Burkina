import { useState, useEffect, useCallback } from 'react';
import { 
  getStats, getRecentActivities, getUsers, 
  getRequests, getServices, getDocuments 
} from '../services/adminService';

/**
 * Hook for admin dashboard statistics
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
};

/**
 * Hook for admin recent activities
 */
export const useAdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentActivities().then(data => {
      setActivities(data);
      setLoading(false);
    });
  }, []);

  return { activities, loading };
};

/**
 * Hook for admin users management
 */
export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refresh: fetchUsers };
};

/**
 * Hook for admin requests management
 */
export const useAdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests().then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  return { requests, loading };
};

/**
 * Hook for admin services management
 */
export const useAdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  return { services, loading };
};

/**
 * Hook for admin documents management
 */
export const useAdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments().then(data => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  return { documents, loading };
};

/**
 * Hook for admin roles and permissions
 */
export const useAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRoles([
      { id: 'ROLE-01', name: 'Administrateur', permissions: ['ALL'], active: true },
      { id: 'ROLE-02', name: 'Agent Mairie', permissions: ['READ_REQ', 'WRITE_DECISION'], active: true },
    ]);
    setLoading(false);
  }, []);

  return { roles, loading };
};
