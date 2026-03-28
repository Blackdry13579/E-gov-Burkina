import { useState, useEffect } from 'react';
import { request } from '../services/apiClient';

/**
 * Hook to manage a single request detail (for tracking)
 */
export const useRequestDetail = (id) => {
  const [requestDetail, setRequestDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await request(`/demandes/${id}`);
        setRequestDetail(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return { request: requestDetail, loading, error };
};
