import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'ドキュメント一覧';
      case '/docs':
        return 'ドキュメント一覧';
      case '/doc':
        return 'ドキュメント詳細';
      case '/doc/:uuid':
        return 'ドキュメント詳細';
      case '/mypage':
        return 'ユーザー設定';
      default:
        if (/^\/doc\/[^/]+(\/(edit|preview))?$/.test(pathname)) {
          return 'ドキュメント詳細';
        }
        return pathname.split('/').pop() || 'Page';
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-lavender">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{getPageName(location.pathname)}</h2>
      </div>
    </header>
  );
};

export default Header;
