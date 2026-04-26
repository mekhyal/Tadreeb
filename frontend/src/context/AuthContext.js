import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("tadreeb_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("tadreeb_user");
        localStorage.removeItem("tadreeb_token");
      }
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("tadreeb_user", JSON.stringify(userData));
    localStorage.setItem("tadreeb_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tadreeb_user");
    localStorage.removeItem("tadreeb_token");
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