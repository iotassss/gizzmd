import React from "react";
import { Link } from "react-router-dom";

const Menu: React.FC = () => (
  <nav className="p-4">
    <ul className="space-y-2">
      <li>
        <Link
          to="/docs"
          className="flex items-center space-x-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
        >
          <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="font-medium">Documents</span>
        </Link>
      </li>
      <li>
        <Link
          to="/doc"
          className="flex items-center space-x-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
        >
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-medium">Document View</span>
        </Link>
      </li>
      <li>
        <Link
          to="/mypage"
          className="flex items-center space-x-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
        >
          <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium">User Settings</span>
        </Link>
      </li>
    </ul>
  </nav>
);

export default Menu;
