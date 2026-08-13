// AuthContext: owns the logged-in host's profile and JWT for the lifetime
// of the app. Responsible for (1) persisting the token across page
// refreshes and (2) restoring the session on initial load by validating
// that persisted token against the backend.
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextObject";
import {
  register as apiRegister,
  login as apiLogin,
  getCurrentUser as apiGetCurrentUser,
} from "../api/auth.api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  // Starts true: on first mount we don't yet know whether a persisted
  // token is valid, so consumers (e.g. ProtectedRoute) must wait for this
  // to resolve before deciding whether to redirect to /login.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guards against calling setState after this component has unmounted
    let ignore = false;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        // Fetch fresh profile data using stored token
        const response = await apiGetCurrentUser();
        const userData = response.data?.user || response.data || response;

        if (!ignore) {
          setUser(userData);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn("Failed to restore session from token:", err);
        // Persisted token is invalid/expired: clear it rather than leaving
        // the app in a half-authenticated state.
        if (!ignore) {
          localStorage.removeItem("accessToken");
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  // Authenticate an existing host
  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  // Register a new host account
  const register = async (name, email, password) => {
    const response = await apiRegister(name, email, password);
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    setUser(userData);
    return response;
  };

  // Clear host session
  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
