import { useState, useEffect, useCallback } from 'react';
import { 
  getStats, getRequests, getRequestDetail, 
  updateRequestStatus, getProfile 
} from '../services/agentService';

/**
 * Hook to manage agent dashboard stats
 */
export const useAgentStats = () => {
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
 * Hook to manage agent requests list
 */
export const useAgentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refresh: fetchRequests };
};

/**
 * Hook to manage a single request for an agent
 */
export const useAgentRequestDetail = (id) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getRequestDetail(id);
      setRequest(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleUpdateStatus = async (status, motif) => {
    try {
      await updateRequestStatus(id, status, motif);
      await fetchDetail();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { request, loading, error, refresh: fetchDetail, updateStatus: handleUpdateStatus };
};

/**
 * Hook to manage agent profile
 */
export const useAgentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, loading, error };
};

/**
 * Hook to manage agent action history
 */
export const useAgentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use getRequests as a base or an empty array for now to avoid build errors
    getRequests().then(data => {
      setHistory(data.slice(0, 10)); // Just a stub
      setLoading(false);
    }).catch(() => {
      setHistory([]);
      setLoading(false);
    });
  }, []);

  return { history, loading };
};
