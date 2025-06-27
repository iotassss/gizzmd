import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <div className="p-6 border-b border-slate-700/50">
    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer group">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          GizzMD
        </h1>
        <p className="text-xs text-slate-400">Documentation Hub</p>
      </div>
    </Link>
  </div>
);

export default Header;
