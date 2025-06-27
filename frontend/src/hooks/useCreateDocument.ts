import { useState } from 'react';
import axios from 'axios';
import type { Document } from '../types/document';

interface CreateDocumentRequest {
  title: string;
  content: string;
  tags: string;
}

export const useCreateDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDocument = async (documentData: CreateDocumentRequest): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/docs', documentData, {
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
      setError(err.response?.data?.error || 'Failed to create document');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDocument,
    loading,
    error,
  };
};
