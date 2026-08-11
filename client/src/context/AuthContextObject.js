// The raw React Context object, kept in its own file (separate from the
// provider component) so Vite's Fast Refresh can reliably hot-reload
// AuthContext.jsx without losing state. Import this directly only if you
// need the Context object itself (e.g. a class component); everywhere else,
// prefer the `useAuth` hook.
import { createContext } from "react";

export const AuthContext = createContext(null);
