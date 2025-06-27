import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../../../hooks/useDocuments";
import { useCreateDocument } from "../../../../hooks/useCreateDocument";
import type { DocumentFilters } from "../../../../types/document";
import FilterDropdown from "./FilterDropdown";
import List from "./List";
import Pagination from "./Pagination";

const FILTERS_STORAGE_KEY = "searchFilters";

const getInitialFilters = (): DocumentFilters => {
  const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
  if (saved) {
    try {
      return { page: 1, limit: 10, ...JSON.parse(saved) };
    } catch {
      return { page: 1, limit: 10 };
    }
  }
  return { page: 1, limit: 10 };
};

const Docs: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DocumentFilters>(getInitialFilters());

  const { documents, loading, error, pagination, refetch } = useDocuments(filters);
  const { createDocument, loading: creating } = useCreateDocument();

  const handlePageChange = (page: number) => {
    setFilters((prev: DocumentFilters) => ({ ...prev, page }));
  };

  // phase2
  // const handleSearch = (searchTerm: string) => {
  //   // Note: Backend doesn't have search implementation yet
  //   console.log("Search term:", searchTerm);
  // };

  const handleFilterChange = (newFilters: Partial<DocumentFilters>) => {
    setFilters((prev: DocumentFilters) => {
      const updated = { ...prev, ...newFilters, page: 1 };
      return updated;
    });
  };

  const generateUniqueTitle = () => {
    const existingTitles = documents.map(doc => doc.title);
    let counter = 1;
    let title = `No Title ${counter}`;

    while (existingTitles.includes(title)) {
      counter++;
      title = `No Title ${counter}`;
    }

    return title;
  };

  const handleCreateDocument = async () => {
    const title = generateUniqueTitle();

    const result = await createDocument({
      title,
      content: '',
      tags: '',
    });

    if (result) {
      navigate(`/doc/${result.id}/edit`);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* <SearchBar onSearch={handleSearch} /> */}

        <div className="mb-6 flex items-center justify-between">
          <FilterDropdown
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateDocument}
              disabled={creating}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : '+ Add'}
            </button>
            <div className="text-sm text-gray-500">
              {pagination.total} documents
            </div>
          </div>
        </div>

        <div className="overflow-y-auto">
          <List
            documents={documents}
            loading={loading}
            error={error}
          />
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Docs;
