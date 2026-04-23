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
    setLoadingText("Logging out...");

    setTimeout(() => {
      logout();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "auto" });
      setLoadingText("");
    }, 450);
  };

  return (
    <div className="portal-shell">
      {loadingText && <PortalLoader text={loadingText} />}

      <PortalSidebar
        activeKey={activeKey}
        items={navItems}
        profilePath={profilePath}
        onNavigate={delayedNavigate}
        onLogout={handleLogout}
      />

      <div className="portal-main">{children}</div>
    </div>
  );
}

export default PortalLayout;