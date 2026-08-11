// AuthContext: owns the logged-in host's profile and JWT for the lifetime
// of the app. Responsible for (1) persisting the token across page
// refreshes and (2) restoring the session on initial load by validating
// that persisted token against the backend.
//
// The token is persisted to localStorage (rather than kept only in memory)
// so a page refresh doesn't silently log the host out — session continuity
// across refresh was an explicit design decision (see Milestone 8 blueprint,
// Section 11). axiosClient.js (Step 8.1) reads this same localStorage key
// directly on every outgoing request, so it always sees the current token
// without needing a separate in-memory bridge.
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  // Starts true: on first mount we don't yet know whether a persisted
  // token is valid, so consumers (e.g. ProtectedRoute) must wait for this
  // to resolve before deciding whether to redirect to /login.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guards against calling setState after this component has unmounted
    // (e.g. React Strict Mode's mount/unmount/remount in dev, or a real
    // unmount racing a slow request) once Milestone 9 replaces the stub
    // below with a real awaited API call.
    let ignore = false;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        // TODO (Milestone 9): replace this stub with a real call, e.g.
        //   const { data } = await axiosClient.get("/auth/me");
        //   setUser(data.user);
        // to confirm storedToken is still valid and fetch fresh profile
        // data. Stubbed for now with placeholder data so downstream work
        // (ProtectedRoute, Navbar) can be built and tested before the
        // auth API exists.
        const placeholderUser = {
          id: "placeholder-id",
          name: "Placeholder Host",
        };
        if (!ignore) {
          setUser(placeholderUser);
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

  const login = (userData, newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
