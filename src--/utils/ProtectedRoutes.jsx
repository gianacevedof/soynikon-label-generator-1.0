import { Outlet, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

// Gatekeeper for every route nested under it in App.jsx.
// No token in localStorage -> bounce to /signin.
// Token present -> render the page shell (Sidebar + <Outlet />).
const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? <Layout /> : <Navigate to="/signin" />;
};

export default ProtectedRoutes;
