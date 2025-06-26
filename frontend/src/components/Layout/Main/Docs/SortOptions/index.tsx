import React from "react";
import type { DocumentFilters } from "../../../../../types/document";

interface SortOptionsProps {
  onSortChange: (filters: Partial<DocumentFilters>) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ onSortChange }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort_by, sort_order] = e.target.value.split(':');
    onSortChange({ sort_by, sort_order });
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">
        並び順:
      </label>
      <select
        id="sort"
        onChange={handleSortChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="created_at:desc">作成日時 (新しい順)</option>
        <option value="created_at:asc">作成日時 (古い順)</option>
        <option value="updated_at:desc">更新日時 (新しい順)</option>
        <option value="updated_at:asc">更新日時 (古い順)</option>
        <option value="title:asc">タイトル (A-Z)</option>
        <option value="title:desc">タイトル (Z-A)</option>
      </select>
    </div>
  );
};

export default SortOptions;
