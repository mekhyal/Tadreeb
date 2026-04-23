import React from "react";
import { FaUserCircle } from "react-icons/fa";

function PortalTopbar({ title, companyName = "Creative Tech" }) {
  return (
    <div className="portal-topbar">
      <div className="portal-topbar__left">
        <h1>{title}</h1>
      </div>

      <div className="portal-topbar-user">
        <div className="portal-topbar-avatar">
          <FaUserCircle />
        </div>
        <span>{companyName}</span>
      </div>
    </div>
  );
}

export default PortalTopbar;