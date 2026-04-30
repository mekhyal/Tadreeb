import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearStoredAuth, isTokenExpired } from "../utils/authToken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("tadreeb_user");
    const savedToken = localStorage.getItem("tadreeb_token");

    if (savedUser && savedToken && !isTokenExpired(savedToken)) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        clearStoredAuth();
      }
    } else {
      clearStoredAuth();
    }
  }, []);

  const login = (userData, token) => {
    if (!token || isTokenExpired(token)) {
      clearStoredAuth();
      setUser(null);
      return;
    }

    setUser(userData);
    localStorage.setItem("tadreeb_user", JSON.stringify(userData));
    localStorage.setItem("tadreeb_token", token);
  };

  const logout = () => {
    setUser(null);
    clearStoredAuth();
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem("tadreeb_user", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
