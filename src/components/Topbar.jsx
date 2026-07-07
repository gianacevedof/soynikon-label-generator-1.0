import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "./Sidebar";

export default function Topbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="mobile-hamburger"
      type="button"
      aria-label="Open navigation menu"
      aria-expanded="false"
      aria-controls="sidebar"
      onClick={toggleSidebar}
    >
      <FontAwesomeIcon icon={faBars} size="lg" />
    </button>
  );
}