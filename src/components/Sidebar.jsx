import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

function Sidebar() {
  const navigate = useNavigate();
  const role = getRole();
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const name = getUsername();
    if (name) {
      setUsername(name);
    }
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

  return (
    <div className="sidebar">
      {/* top */}
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

      {/* middle / menu */}
      <div className="sidebar-menu d-flex flex-column p-4">
        <p className="pb-4">
          <b>MAIN</b>
        </p>
        <NavLink to="/" className={navClass}>
          <FontAwesomeIcon icon={faBoxOpen} /> Home
        </NavLink>
        <NavLink to="/clients" className={navClass}>
          <FontAwesomeIcon icon={faUserGroup} /> Clients
        </NavLink>
        <NavLink to="/orders" className={navClass}>
          <FontAwesomeIcon icon={faCartShopping} /> Orders
        </NavLink>
        {role === "admin" && (
          <NavLink to="/new" className={navClass}>
            <FontAwesomeIcon icon={faUserPlus} /> New Client
          </NavLink>
        )}
        <NavLink to="/labels" className={navClass}>
          <FontAwesomeIcon icon={faTag} /> Labels
        </NavLink>
      </div>

      <hr />

      {/* bottom */}
      <div className="d-flex justify-content-between p-4">
        <div
          className="d-flex align-items-center gap-3"
          style={{ textTransform: "capitalize" }}
        >
          <div className="user-profile-pic">
            <p className="">{initials}</p>
          </div>
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
  );
}

export default Sidebar;
