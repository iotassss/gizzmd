import React from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "../../../../hooks/useDocument";
import { MarkdownRenderer } from "../../../../utils/markdownRenderer";
import SearchBar from "./SearchBar";
import Tabs from "./Tabs";

// 共通レイアウトコンポーネント（Tabsは含めない）
const PageLayout: React.FC<{ children: React.ReactNode; uuid?: string }> = ({ children, uuid }) => (
  <div className="max-w-4xl mx-auto p-6">
    <SearchBar initialUuid={uuid} />
    {children}
  </div>
);

const Doc: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { document, loading, error } = useDocument(uuid);

  if (loading) {
    return (
      <PageLayout uuid={uuid}>
        <Tabs uuid={uuid} />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout uuid={uuid}>
        <Tabs uuid={uuid} />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </PageLayout>
    );
  }

  // Show search interface when no UUID is provided
  if (!uuid) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">
            Enter a document UUID to search
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show document not found when UUID is provided but document doesn't exist
  if (!document) {
    return (
      <PageLayout uuid={uuid}>
        <Tabs uuid={uuid} />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Document not found</div>
        </div>
      </PageLayout>
    );
  }

  // Show document content when document exists
  return (
    <PageLayout uuid={uuid}>
      <Tabs uuid={uuid} />
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{document.title}</h3>
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <MarkdownRenderer content={document.content} />
      </div>
    </PageLayout>
  );
};

export default Doc;
