import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { getRole, getUsername } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faUserGroup,
  faUserPlus,
  faCartShopping,
  faArrowRightFromBracket,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const SidebarContext = createContext(null);

export function useSidebar() {
  return useContext(SidebarContext);
}

function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((p) => !p);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sidebar-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const role = getRole();
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const name = getUsername();
    if (name) setUsername(name);
  }, []);

  const initials = username
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join("");

  const navClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  const { closeSidebar, isOpen } = useSidebar();

  return (
    <SidebarProvider>
      <div className="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
        {isOpen && <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />}
        {/* Logo + app name */}
        <div className="d-flex gap-3 p-4">
          <div className="m-0 p-0">
            <img src="/logo.jpg" alt="Soynikon Desk logo" />
          </div>
          <div className="flex-column my-auto">
            <p className="fw-bold text-white h5 m-0">Soynikon</p>
            <p>Photo Store</p>
          </div>
        </div>

        <hr />

        {/* Navigation links — "New Client" is admin-only */}
        <div className="sidebar-menu d-flex flex-column p-4">
          <p className="pb-4"><b>MAIN</b></p>
          <NavLink to="/" className={navClass} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faBoxOpen} /> Home
          </NavLink>
          <NavLink to="/clients" className={navClass} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faUserGroup} /> Clients
          </NavLink>
          <NavLink to="/orders" className={navClass} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faCartShopping} /> Orders
          </NavLink>
          {role === "admin" && (
            <NavLink to="/new" className={navClass} onClick={closeSidebar}>
              <FontAwesomeIcon icon={faUserPlus} /> New Client
            </NavLink>
          )}
          <NavLink to="/labels" className={navClass} onClick={closeSidebar}>
            <FontAwesomeIcon icon={faTag} /> Labels
          </NavLink>
        </div>

        <hr />

        {/* Signed-in user + sign-out button */}
        <div className="d-flex justify-content-between p-4">
          <div className="d-flex align-items-center gap-3 capitalize">
            <div className="user-profile-pic"><p>{initials}</p></div>
            <div>
              <p className="text-white h5 m-0">{username}</p>
              <p>{role}</p>
            </div>
          </div>
          <div>
            <button className="nav-item" onClick={handleSignOut}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Sidebar;