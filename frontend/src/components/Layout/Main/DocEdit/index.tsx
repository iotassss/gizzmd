import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDocument } from "../../../../hooks/useDocument";
import { useUpdateDocument } from "../../../../hooks/useUpdateDocument";
import { MarkdownRenderer } from "../../../../utils/markdownRenderer";

const DocEdit: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { document, loading, error } = useDocument(uuid);
  const { updateDocument, loading: updating, error: updateError } = useUpdateDocument();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchUuid, setSearchUuid] = useState(uuid || '');

  useEffect(() => {
    if (document) {
      // Check if we have editing content from location state (coming from preview)
      const editingContent = location.state?.editingContent;
      if (editingContent) {
        setTitle(editingContent.title);
        setContent(editingContent.content);
        setTags(editingContent.tags);
      } else {
        setTitle(document.title);
        setContent(document.content);
        setTags(document.tags);
      }
    }
  }, [document, location.state]);

  useEffect(() => {
    setSearchUuid(uuid || '');
  }, [uuid]);

  useEffect(() => {
    if (document) {
      const changed =
        title !== document.title ||
        content !== document.content ||
        tags !== document.tags;
      setHasChanges(changed);
    }
  }, [title, content, tags, document]);

  const saveOnly = async () => {
    if (!uuid || !hasChanges) return;
    await updateDocument(uuid, {
      title: title.trim(),
      content,
      tags: tags.trim(),
    });
  };

  const handleSave = async () => {
    await saveOnly();
    navigate(`/doc/${uuid}`);
  };

  // TODO: 保存時にタブのcautionが消えるようにする。セーブボタンも無効化する
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 's') {
        e.preventDefault();
        saveOnly();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uuid, hasChanges, title, content, tags]);

  const handleCancel = () => {
    navigate(`/doc/${uuid}`);
  };

  const handlePreview = () => {
    navigate(`/doc/${uuid}/preview`, {
      state: {
        editingContent: {
          title,
          content,
          tags,
          created_at: document?.created_at,
          edited_at: document?.edited_at
        }
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUuid.trim()) {
      navigate(`/doc/${searchUuid.trim()}/edit`);
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
              className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center"
            >
              Edit
              {hasChanges && (
                <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
              )}
            </button>
            <button
              onClick={handlePreview}
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm flex items-center"
            >
              Preview
              {hasChanges && (
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

  if (!document) {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderSearchBar()}
      {renderTabs()}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Edit Document</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            disabled={updating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updating || !hasChanges || !title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {updateError}
        </div>
      )}

      {/* Edit Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. React, JavaScript, Programming"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter document content (Markdown supported)"
              />
            </div>

            {showPreview && (
              <div className="border border-gray-300 rounded p-3 bg-gray-50 overflow-y-auto" style={{ height: '500px' }}>
                <div className="text-xs text-gray-500 mb-2">Preview:</div>
                <MarkdownRenderer content={content} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="mt-4 text-sm text-amber-600">
          * You have unsaved changes
        </div>
      )}
    </div>
  );
};

export default DocEdit;
