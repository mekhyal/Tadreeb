import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return children;

  if (user?.role === "student") {
    return <Navigate to="/student" replace />;
  }

  if (user?.role === "company") {
    return <Navigate to="/company/dashboard" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

export default PublicOnlyRoute;