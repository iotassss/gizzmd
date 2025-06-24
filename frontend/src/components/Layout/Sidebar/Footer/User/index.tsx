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
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <Icon />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.name || user?.email || 'ユーザー'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-2 w-full text-left text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ログアウト
      </button>
    </div>
  );
};

export default User;
