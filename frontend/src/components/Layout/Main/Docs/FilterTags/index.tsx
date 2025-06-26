import React, { useState } from "react";
import type { DocumentFilters } from "../../../../../types/document";

interface FilterTagsProps {
  onFilterChange: (filters: Partial<DocumentFilters>) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ onFilterChange }) => {
  const [tags, setTags] = useState("");

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTags(value);
    onFilterChange({
      tags: value || undefined,
    });
  };

  const handleClearTags = () => {
    setTags("");
    onFilterChange({
      tags: undefined,
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="filter-tags" className="text-sm font-medium text-gray-700">
          タグで絞り込み:
        </label>
        <div className="flex-1 relative">
          <input
            type="text"
            id="filter-tags"
            value={tags}
            onChange={handleTagsChange}
            placeholder="例: プログラミング,React,JavaScript"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {tags && (
            <button
              onClick={handleClearTags}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {tags && (
        <div className="mt-2 text-xs text-gray-500">
          フィルター中: {tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(', ')}
        </div>
      )}
    </div>
  );
};

export default FilterTags;
