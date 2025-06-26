import React, { useState } from "react";
import { useDocuments } from "../../../../hooks/useDocuments";
import type { DocumentFilters } from "../../../../types/document";
import FilterToolbar from "./FilterToolbar";
import List from "./List";
import Pagination from "./Pagination";

const Docs: React.FC = () => {
  const [filters, setFilters] = useState<DocumentFilters>({
    page: 1,
    limit: 4,
  });

  const { documents, loading, error, pagination } = useDocuments(filters);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // phase2
  // const handleSearch = (searchTerm: string) => {
  //   // Note: Backend doesn't have search implementation yet
  //   console.log("Search term:", searchTerm);
  // };

  const handleFilterChange = (newFilters: Partial<DocumentFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters, page: 1 };
      return updated;
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* <SearchBar onSearch={handleSearch} /> */}

        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <FilterToolbar 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </div>
          <div className="text-sm text-gray-500">
            {pagination.total} documents
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
