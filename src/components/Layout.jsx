import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="app-shell d-flex height-100">
      <Sidebar />
      <div className="page-content container d-flex flex-column flex-grow-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
