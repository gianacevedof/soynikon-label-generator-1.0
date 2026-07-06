import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import NewClients from "./pages/NewClients";
import Orders from "./pages/Orders";
import Labels from "./pages/Labels";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — reachable without a token */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Everything below requires a valid token.
            ProtectedRoutes renders the Sidebar + page shell (Layout)
            and redirects to /signin if there's no token. */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/new" element={<NewClients />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/labels" element={<Labels />} />
        </Route>
      </Routes>

      {/* Global toast host — every toast.success/toast.error call
          anywhere in the app renders here. */}
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;
