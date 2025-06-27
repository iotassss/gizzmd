import React from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import Icon from "./Icon";

const User: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <Icon />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name || user?.email || 'User'}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-2 p-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
      >
        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default User;
