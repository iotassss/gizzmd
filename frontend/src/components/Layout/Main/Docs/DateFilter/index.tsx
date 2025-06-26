import React, { useState } from "react";
import type { DocumentFilters } from "../../../../../types/document";

interface DateFilterProps {
  onFilterChange: (filters: Partial<DocumentFilters>) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const formatDateToRFC3339 = (dateString: string): string => {
    if (!dateString) return "";
    // Convert YYYY-MM-DD to YYYY-MM-DDTHH:mm:ssZ
    return `${dateString}T00:00:00Z`;
  };

  const handleCreatedFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreatedFrom(value);
    onFilterChange({
      created_from: value ? formatDateToRFC3339(value) : undefined,
    });
  };

  const handleCreatedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreatedTo(value);
    onFilterChange({
      created_to: value ? formatDateToRFC3339(value) : undefined,
    });
  };

  const handleClearFilters = () => {
    setCreatedFrom("");
    setCreatedTo("");
    onFilterChange({
      created_from: undefined,
      created_to: undefined,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">作成日で絞り込み:</h3>
        {(createdFrom || createdTo) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            クリア
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="created-from" className="block text-xs text-gray-600 mb-1">
            開始日
          </label>
          <input
            type="date"
            id="created-from"
            value={createdFrom}
            onChange={handleCreatedFromChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="created-to" className="block text-xs text-gray-600 mb-1">
            終了日
          </label>
          <input
            type="date"
            id="created-to"
            value={createdTo}
            onChange={handleCreatedToChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default DateFilter;
