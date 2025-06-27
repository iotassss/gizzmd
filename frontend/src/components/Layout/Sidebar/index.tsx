import React from "react";
import Footer from "./Footer";
import Menu from "./Menu";
import Header from "./Header";

// Sidebarの雛形
const Sidebar: React.FC = () => {
  return (
    <aside className="flex flex-col h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      <Header />
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <Menu />
      </div>
      <Footer />
    </aside>
  );
};

export default Sidebar;
