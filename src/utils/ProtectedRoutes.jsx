import { Outlet, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <>
      <Layout />
    </>
  ) : (
    <Navigate to="/signin" />
  );
};

export default ProtectedRoutes;
