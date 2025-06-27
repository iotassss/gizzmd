import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDocument } from "../../../../hooks/useDocument";
import { MarkdownRenderer } from "../../../../utils/markdownRenderer";

const DocPreview: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { document, loading, error } = useDocument(uuid);
  const [searchUuid, setSearchUuid] = useState(uuid || '');

  // Get editing content from location state (passed from edit page)
  const editingContent = location.state?.editingContent;

  useEffect(() => {
    setSearchUuid(uuid || '');
  }, [uuid]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = editingContent && document && (
    editingContent.title !== document.title ||
    editingContent.content !== document.content ||
    editingContent.tags !== document.tags
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUuid.trim()) {
      navigate(`/doc/${searchUuid.trim()}/preview`);
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

  const renderTabs = () => {
    if (!uuid) return null;

    return (
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => navigate(`/doc/${uuid}`)}
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              View
            </button>
            <button
              onClick={() => navigate(`/doc/${uuid}/edit`, {
                state: { editingContent }
              })}
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center"
            >
              Edit
              {hasUnsavedChanges && (
                <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
              )}
            </button>
            <button
              className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center"
            >
              Preview
              {hasUnsavedChanges && (
                <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
              )}
            </button>
          </nav>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderSearchBar()}
        {renderTabs()}
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
        {renderTabs()}
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!document && !editingContent) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderSearchBar()}
        {renderTabs()}
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Document not found</div>
        </div>
      </div>
    );
  }

  // Use editing content if available, otherwise use saved document
  const displayContent = editingContent || {
    title: document?.title || '',
    content: document?.content || '',
    tags: document?.tags || '',
    created_at: document?.created_at || '',
    edited_at: document?.edited_at || ''
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderSearchBar()}
      {renderTabs()}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{displayContent.title}</h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          {displayContent.created_at && (
            <span>Created: {new Date(displayContent.created_at).toLocaleDateString()}</span>
          )}
          {displayContent.edited_at && (
            <span>Updated: {new Date(displayContent.edited_at).toLocaleDateString()}</span>
          )}
          {displayContent.tags && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {displayContent.tags}
            </span>
          )}
        </div>
        {hasUnsavedChanges && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            This is a preview of your current edits. Changes are not saved yet.
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <MarkdownRenderer content={displayContent.content} />
      </div>
    </div>
  );
};

export default DocPreview;
