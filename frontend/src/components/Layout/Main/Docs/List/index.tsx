import React from "react";
import type { DocumentSummary } from "../../../../../types/document";
import { useNavigate } from "react-router-dom";

interface ListProps {
  documents: DocumentSummary[];
  loading: boolean;
  error: string | null;
}

const List: React.FC<ListProps> = ({ documents, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">エラーが発生しました</div>
        <div className="text-gray-600 text-sm">{error}</div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">ドキュメントが見つかりません</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDocumentClick = (docId: string) => {
    navigate(`/doc/${docId}`);
  };

  return (
    <section className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => handleDocumentClick(doc.id)}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {doc.title}
            </h3>
            <div className="text-sm text-gray-500 flex flex-col items-end">
              <span>作成: {formatDate(doc.created_at)}</span>
              <span>更新: {formatDate(doc.updated_at)}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {doc.preview}
          </p>

          {doc.tags && (
            <div className="flex flex-wrap gap-1">
              {doc.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default List;
