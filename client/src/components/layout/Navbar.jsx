/**
 * Navbar Component
 * Navigation header that updates UI dynamically based on host authentication state.
 */
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // adjust import path to your useAuth hook location

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Brand / Logo */}
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Live Q&A Wall
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
            >
              Dashboard
            </Link>
            <span className="text-sm font-semibold text-gray-800">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 rounded px-3 py-1 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/join"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium"
            >
              Join Event
            </Link>
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Host Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-indigo-600 text-white rounded px-3 py-1.5 hover:bg-indigo-700 font-medium transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
