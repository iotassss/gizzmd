import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  initialUuid?: string;
  onSearch?: (uuid: string) => void;
  navigateTo?: 'view' | 'edit' | 'preview';
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialUuid = '',
  onSearch,
  navigateTo = 'view'
}) => {
  const navigate = useNavigate();
  const [searchUuid, setSearchUuid] = useState(initialUuid);

  useEffect(() => {
    setSearchUuid(initialUuid);
  }, [initialUuid]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUuid.trim()) {
      const trimmedUuid = searchUuid.trim();

      if (onSearch) {
        onSearch(trimmedUuid);
      } else {
        // Default navigation behavior
        let path = `/doc/${trimmedUuid}`;
        if (navigateTo === 'edit') path += '/edit';
        if (navigateTo === 'preview') path += '/preview';
        navigate(path);
      }
    }
  };

  return (
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
};

export default SearchBar;
