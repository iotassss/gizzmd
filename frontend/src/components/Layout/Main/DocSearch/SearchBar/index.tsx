import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/doc/${searchTerm}`);
    }
  };

  return (
    <div className="w-full mb-4">
      ドキュメントのIDを入力してください
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="11111111-1111-1111-1111-111111111111"
          className="w-full px-4 py-3 pl-10 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
        <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          検索
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
