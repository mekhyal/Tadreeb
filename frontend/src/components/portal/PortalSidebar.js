import React from "react";
import {
  FaThLarge,
  FaRegClipboard,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaBuilding,
  FaUserFriends,
} from "react-icons/fa";

function PortalSidebar({
  items = [],
  activeKey,
  onNavigate,
  onLogout,
  profilePath = "/profile",
}) {
  const iconMap = {
    dashboard: <FaThLarge />,
    programs: <FaRegClipboard />,
    participants: <FaUsers />,
    companies: <FaBuilding />,
    users: <FaUserFriends />,
    profile: <FaUserCircle />,
  };

  return (
    <aside className="portal-sidebar">
      <div>
        <div className="portal-sidebar-brand">
          <span className="logo-dark">Tad</span>
          <span className="logo-blue">reeb</span>
        </div>

        <nav className="portal-sidebar-nav">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`portal-sidebar-link ${
                activeKey === item.key ? "active" : ""
              }`}
              onClick={() => onNavigate(item.path)}
            >
              <span className="portal-sidebar-icon">{iconMap[item.key]}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="portal-sidebar-bottom">
        <button
          type="button"
          className={`portal-sidebar-link ${activeKey === "profile" ? "active" : ""}`}
          onClick={() => onNavigate(profilePath)}
        >
          <span className="portal-sidebar-icon">
            <FaUserCircle />
          </span>
          <span>Profile</span>
        </button>

        <button
          type="button"
          className="portal-sidebar-link logout"
          onClick={onLogout}
        >
          <span className="portal-sidebar-icon">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default PortalSidebar;