import { useState } from 'react';
import axios from 'axios';
import type { Document } from '../types/document';

interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  tags?: string;
}

export const useUpdateDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDocument = async (documentId: string, documentData: UpdateDocumentRequest): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await axios.patch(`http://localhost:8080/api/docs/${documentId}`, documentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err: any) {

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      setError(err.response?.data?.error || 'Failed to update document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateDocument,
    loading,
    error,
  };
};
