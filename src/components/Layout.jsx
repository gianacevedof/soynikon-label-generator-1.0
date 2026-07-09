import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Persistent page shell used by every protected route:
//   Global Topbar across the top, Sidebar on the left, page content via
//   <Outlet />. On mobile (<=768px) the sidebar becomes an off-canvas
//   drawer controlled by the hamburger button in the Topbar.
function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Close the sidebar drawer on every route change.
  useEffect(() => {
    setNavOpen(false);
  }, [location]);

  // Close the sidebar drawer on Escape.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Body scroll-lock while the off-canvas sidebar is open.
  // Uses a ref to avoid the Strict Mode double-mount resetting the
  // saved scroll position — the effect body only runs on actual
  // transitions between open/closed.
  const scrollPos = useRef(0);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (navOpen && !wasOpen.current) {
      // Opening — lock scroll and capture position
      scrollPos.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPos.current}px`;
      document.body.style.width = "100%";
    } else if (!navOpen && wasOpen.current) {
      // Closing — restore scroll position
      const y = scrollPos.current;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }
    wasOpen.current = navOpen;
  }, [navOpen]);

  const toggleNav = () => setNavOpen((v) => !v);
  const closeNav = () => setNavOpen(false);

  return (
    <>
      <Topbar onToggleNav={toggleNav} />
      <div className="d-flex">
        <Sidebar open={navOpen} onClose={closeNav} />
        {navOpen && (
          <div className="sidebar-backdrop" onClick={closeNav} />
        )}
        <div className="page-content container d-flex flex-column flex-grow-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;