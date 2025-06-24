import React from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";

// Layoutコンポーネント: ルーティングの共通レイアウト
const Layout: React.FC = () => {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-64 min-h-0 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0">
        <Main />
      </div>
    </div>
  );
};

export default Layout;
