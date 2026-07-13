import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRole, getUsername } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faUserGroup,
  faUserPlus,
  faCartShopping,
  faArrowRightFromBracket,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// Sidebar also receives `open` and `onClose` props from Layout for the
// off-canvas mobile drawer behavior. On desktop (>=769px) `open` has no
// visual effect — the sidebar sits statically in the flex layout.
function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const role = getRole();
  const [username, setUsername] = useState("Guest");

  // Pull the username from the JWT once on mount. Falls back to
  // "Guest" (initial state) if there's no token or no username claim.
  useEffect(() => {
    const name = getUsername();
    if (name) {
      setUsername(name);
    }
  }, []);

  // "John Doe" -> "JD"
  const initials = username
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join("");

  // Adds the "active" class to whichever nav link matches the current route
  const navClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      {/* Logo + app name */}
      <div className="d-flex gap-3 p-4">
        <div className="m-0 p-0">
          <img src="/logo.jpg" alt="Soynikon Desk logo" />
        </div>
        <div className="flex-column my-auto">
          <p className="fw-bold text-white h5 m-0">
            <span className="sidebar-brand-text">Soynikon</span>
          </p>
          <p>
            <span className="sidebar-brand-text">Photo Store</span>
          </p>
        </div>
      </div>

      <hr />

      {/* Navigation links — "New Client" is admin-only */}
      <div className="sidebar-menu d-flex flex-column p-4">
        <p className="pb-4">
          <b><span className="nav-label">MAIN</span></b>
        </p>
        <NavLink to="/" className={navClass} onClick={onClose}>
          <FontAwesomeIcon icon={faBoxOpen} /> <span className="nav-label">Home</span>
        </NavLink>
        <NavLink to="/clients" className={navClass} onClick={onClose}>
          <FontAwesomeIcon icon={faUserGroup} /> <span className="nav-label">Clients</span>
        </NavLink>
        <NavLink to="/orders" className={navClass} onClick={onClose}>
          <FontAwesomeIcon icon={faCartShopping} /> <span className="nav-label">Orders</span>
        </NavLink>
        {role === "admin" && (
          <NavLink to="/new" className={navClass} onClick={onClose}>
            <FontAwesomeIcon icon={faUserPlus} /> <span className="nav-label">New Client</span>
          </NavLink>
        )}
        <NavLink to="/labels" className={navClass} onClick={onClose}>
          <FontAwesomeIcon icon={faTag} /> <span className="nav-label">Labels</span>
        </NavLink>
      </div>

      <hr />

      {/* Signed-in user + sign-out button */}
      <div className="d-flex justify-content-between p-4">
        <div className="d-flex align-items-center gap-3 capitalize">
          <div className="user-profile-pic">
            <p>{initials}</p>
          </div>
          <div>
            <p className="text-white h5 m-0"><span className="sidebar-user-text">{username}</span></p>
            <p><span className="sidebar-user-text">{role}</span></p>
          </div>
        </div>
        <div>
          <button className="nav-item" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;