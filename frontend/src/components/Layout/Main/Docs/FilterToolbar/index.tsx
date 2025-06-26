import React, { useState, useRef, useEffect } from "react";
import type { DocumentFilters } from "../../../../../types/document";

interface FilterToolbarProps {
  onFilterChange: (filters: Partial<DocumentFilters>) => void;
  currentFilters: DocumentFilters;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({ onFilterChange, currentFilters }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(currentFilters.sort_by || 'created_at');
  const [sortOrder, setSortOrder] = useState(currentFilters.sort_order || 'desc');
  const [tags, setTags] = useState(currentFilters.tags || '');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openDropdown) return;

      const activeDropdownRef = dropdownRefs.current[openDropdown];
      if (activeDropdownRef && !activeDropdownRef.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const formatDateToRFC3339 = (dateString: string): string => {
    if (!dateString) return "";
    return `${dateString}T00:00:00Z`;
  };

  const handleApplyFilters = () => {
    onFilterChange({
      sort_by: sortBy,
      sort_order: sortOrder,
      tags: tags || undefined,
      created_from: createdFrom ? formatDateToRFC3339(createdFrom) : undefined,
      created_to: createdTo ? formatDateToRFC3339(createdTo) : undefined,
    });
    setOpenDropdown(null);
  };

  const handleClearFilters = () => {
    setSortBy('created_at');
    setSortOrder('desc');
    setTags('');
    setCreatedFrom('');
    setCreatedTo('');
    onFilterChange({
      sort_by: 'created_at',
      sort_order: 'desc',
      tags: undefined,
      created_from: undefined,
      created_to: undefined,
    });
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const getSortLabel = () => {
    const sortLabels = {
      'created_at': 'Created',
      'updated_at': 'Updated',
      'title': 'Title'
    };
    const orderLabels = {
      'desc': 'newest first',
      'asc': 'oldest first'
    };
    return `${sortLabels[sortBy as keyof typeof sortLabels] || 'Created'} (${orderLabels[sortOrder as keyof typeof orderLabels] || 'newest first'})`;
  };

  const getDateLabel = () => {
    if (createdFrom && createdTo) {
      return `${createdFrom} to ${createdTo}`;
    } else if (createdFrom) {
      return `From ${createdFrom}`;
    } else if (createdTo) {
      return `Until ${createdTo}`;
    }
    return 'Any time';
  };

  const getTagsLabel = () => {
    return tags ? tags.split(',').map(t => t.trim()).filter(t => t).join(', ') : 'All tags';
  };

  const hasActiveFilters = tags || createdFrom || createdTo || sortBy !== 'created_at' || sortOrder !== 'desc';

  const DropdownButton: React.FC<{
    name: string;
    label: string;
    activeLabel: string;
    hasActive: boolean;
  }> = ({ name, label, activeLabel, hasActive }) => (
    <button
      onClick={() => toggleDropdown(name)}
      className={`flex items-center space-x-1 px-3 py-1.5 border rounded-full text-sm transition-colors ${
        hasActive
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-gray-300 text-gray-700 hover:border-gray-400'
      }`}
    >
      <span>{label}</span>
      <span className="text-xs text-gray-500">:</span>
      <span className="font-medium">{activeLabel}</span>
      <svg className={`w-3 h-3 transition-transform ${openDropdown === name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="flex items-center space-x-3">
      {/* Sort Dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['sort'] = el}>
        <DropdownButton
          name="sort"
          label="Sort"
          activeLabel={getSortLabel()}
          hasActive={sortBy !== 'created_at' || sortOrder !== 'desc'}
        />

        {openDropdown === 'sort' && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="created_at">Created date</option>
                  <option value="updated_at">Updated date</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['date'] = el}>
        <DropdownButton
          name="date"
          label="Date"
          activeLabel={getDateLabel()}
          hasActive={!!createdFrom || !!createdTo}
        />

        {openDropdown === 'date' && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created date range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={createdFrom}
                    onChange={(e) => setCreatedFrom(e.target.value)}
                    placeholder="From"
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={createdTo}
                    onChange={(e) => setCreatedTo(e.target.value)}
                    placeholder="To"
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags Dropdown */}
      <div className="relative" ref={el => dropdownRefs.current['tags'] = el}>
        <DropdownButton
          name="tags"
          label="Tags"
          activeLabel={getTagsLabel()}
          hasActive={!!tags}
        />

        {openDropdown === 'tags' && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. React, JavaScript, Programming"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:border-gray-400 transition-colors"
        >
          Clear
        </button>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApplyFilters}
        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterToolbar;
