import { useState, useEffect } from 'react';
import axios from 'axios';
import type { DocumentSummary, ListDocsResponse, DocumentFilters } from '../types/document';

export const useDocuments = (filters: DocumentFilters = {}) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.created_from) params.append('created_from', filters.created_from);
      if (filters.created_to) params.append('created_to', filters.created_to);
      if (filters.updated_from) params.append('updated_from', filters.updated_from);
      if (filters.updated_to) params.append('updated_to', filters.updated_to);

      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/docs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ListDocsResponse = response.data;
      setDocuments(data.documents || []);
      setPagination(data.pagination);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      setError(err.response?.data?.error || 'Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters.page, filters.limit, filters.sort_by, filters.sort_order, filters.tags, filters.created_from, filters.created_to, filters.updated_from, filters.updated_to]);

  return {
    documents,
    loading,
    error,
    pagination,
    refetch: fetchDocuments,
  };
};
