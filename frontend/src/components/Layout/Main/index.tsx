import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

// Mainの雛形
const Main: React.FC = () => {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </>
  );
};

export default Main;
