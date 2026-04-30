import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortalSidebar from "./PortalSidebar";
import PortalLoader from "./PortalLoader";
import { useAuth } from "../../context/AuthContext";

function PortalLayout({
  children,
  activeKey,
  navItems = [],
  profilePath = "/profile",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [loadingText, setLoadingText] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const delayedNavigate = (path, text = "Loading page...") => {
    if (location.pathname === path) return;

    setLoadingText(text);

    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "auto" });
      setLoadingText("");
    }, 450);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setLoadingText("Logging out...");

    setTimeout(() => {
      logout();
      navigate("/", { replace: true });
      window.scrollTo({ top: 0, behavior: "auto" });
      setLoadingText("");
    }, 450);
  };

  return (
    <div className="portal-shell">
      {loadingText && <PortalLoader text={loadingText} />}

      {showLogoutConfirm && (
        <div
          className="company-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="portal-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Logout</h3>
            <p>Are you sure you want to logout and return to the public home page?</p>

            <div className="portal-confirm-actions">
              <button
                type="button"
                className="portal-confirm-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="portal-confirm-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <PortalSidebar
        activeKey={activeKey}
        items={navItems}
        profilePath={profilePath}
        onNavigate={delayedNavigate}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <div className="portal-main">{children}</div>
    </div>
  );
}

export default PortalLayout;
