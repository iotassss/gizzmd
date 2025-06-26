import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

// Mainの雛形
const Main: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
