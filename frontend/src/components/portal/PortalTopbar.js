import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function sessionAccountLabel(user) {
  if (!user) return "Account";
  if (user.role === "company") {
    return user.companyName || user.email || "Company";
  }
  if (user.role === "admin") {
    const n =
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email;
    return n || "Admin";
  }
  return user.email || "Account";
}

/** When `accountLabel` is omitted, the signed-in portal user’s name/email is shown. */
function PortalTopbar({ title, accountLabel }) {
  const { user } = useAuth();
  const label = accountLabel ?? sessionAccountLabel(user);

  return (
    <div className="portal-topbar">
      <div className="portal-topbar__left">
        <h1>{title}</h1>
      </div>

      <div className="portal-topbar-user">
        <div className="portal-topbar-avatar">
          <FaUserCircle />
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default PortalTopbar;
