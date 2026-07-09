import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// Maps the current route pathname to a display title shown in the
// global topbar. Falls back to "Soynikon Desk" for unknown routes.
const PAGE_TITLES = {
  "/": "Home",
  "/clients": "Clients",
  "/orders": "Orders",
  "/new": "New Client",
  "/labels": "Labels",
};

function Topbar({ onToggleNav }) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "Soynikon Desk";

  return (
    <div className="global-topbar">
      <button
        className="topbar-hamburger"
        onClick={onToggleNav}
        aria-label="Toggle navigation"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="topbar-brand">Soynikon Desk</div>
      <div className="topbar-title">{pageTitle}</div>
    </div>
  );
}

export default Topbar;