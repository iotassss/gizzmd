import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../../../hooks/useDocument";

const Doc: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [searchUuid, setSearchUuid] = useState(uuid || '');
  const { document, loading, error } = useDocument(uuid);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUuid.trim()) {
      navigate(`/doc/${searchUuid.trim()}`);
    }
  };

  const renderSearchBar = () => (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchUuid}
            onChange={(e) => setSearchUuid(e.target.value)}
            placeholder="Enter document UUID..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderSearchBar()}
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderSearchBar()}
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderSearchBar()}
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">
            {uuid ? 'Document not found' : 'Enter a document UUID to search'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderSearchBar()}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{document.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <span>Created: {new Date(document.created_at).toLocaleDateString()}</span>
          <span>Updated: {new Date(document.edited_at).toLocaleDateString()}</span>
          {document.tags && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {document.tags}
            </span>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border">
          {document.content}
        </div>
      </div>
    </div>
  );
};

export default Doc;
