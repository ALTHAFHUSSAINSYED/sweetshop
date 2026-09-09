import db from '@/lib/db';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialAuth = () => {
    try {
      return (
        localStorage.getItem("palnadu_admin_auth") === "true" &&
        localStorage.getItem("palnadu_admin_mfa") === "true"
      );
    } catch {
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const [user, setUser] = useState(() => {
    return getInitialAuth()
      ? { id: "admin_1", email: "abbus2155@gmail.com", role: "admin" }
      : null;
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: "palnadu-sweets",
    public_settings: { shop_name: "Palnadu Sweets" },
  });

  const checkAppState = async () => {
    try {
      const isAuth = await db.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const u = await db.auth.me();
        setUser(u);
      } else {
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAppState();
  }, []);

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const res = await db.auth.loginViaEmailPassword(email, password);
      // Password passed; Step 1 complete. MFA is now required before setting isAuthenticated to true.
      return res;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const verifyMfa = async (pin) => {
    setIsLoadingAuth(true);
    try {
      const res = await db.auth.verifyMfaPin(pin);
      setIsAuthenticated(true);
      const currentUser = { id: "admin_1", email: localStorage.getItem("palnadu_admin_email") || "abbus2155@gmail.com", role: "admin" };
      setUser(currentUser);
      setAuthChecked(true);
      return res;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    db.auth.logout(shouldRedirect ? "/" : undefined);
  };

  const navigateToLogin = () => {
    db.auth.redirectToLogin("/admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        login,
        verifyMfa,
        logout,
        navigateToLogin,
        checkUserAuth: checkAppState,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
