import React from "react";
import Footer from "./Footer";
import Menu from "./Menu";
import Header from "./Header";

// Sidebarの雛形
const Sidebar: React.FC = () => {
  return (
    <aside className="flex flex-col h-full w-64 bg-lavender">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Menu />
      </div>
      <Footer />
    </aside>
  );
};

export default Sidebar;
