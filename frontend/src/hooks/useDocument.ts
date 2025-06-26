import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Document } from '../types/document';

export const useDocument = (documentId: string | undefined) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = async () => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/docs/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocument(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      setError(err.response?.data?.error || 'Failed to fetch document');
      setDocument(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  return {
    document,
    loading,
    error,
    refetch: fetchDocument,
  };
};