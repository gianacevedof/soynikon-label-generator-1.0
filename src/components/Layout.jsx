import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

// Persistent page shell used by every protected route: Sidebar on the
// left, the current page's content on the right via <Outlet />.
function Layout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-content container d-flex flex-column flex-grow-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
