/**
 * Navbar Component
 * Navigation header that updates UI dynamically based on host authentication state.
 */
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Radio, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth"; // adjust import path to your useAuth hook location

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get user initial for avatar badge
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "H";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs transition-all">
      {/* Brand / Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 group text-lg font-bold text-gray-900 tracking-tight hover:text-indigo-600 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <span>
          Live Q&A <span className="text-indigo-600">Wall</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-2 sm:gap-3">
        {isAuthenticated ? (
          <>
            {/* Dashboard Button */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70 px-3 py-1.5 rounded-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
              <span>Dashboard</span>
            </Link>

            {/* Separator Line */}
            <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* User Profile Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-gray-200/80 rounded-full text-xs font-semibold text-gray-700">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                {userInitial}
              </span>
              <span className="max-w-25 sm:max-w-35 truncate">
                {user?.name || "Host"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Log out"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/join"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              Join Event
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition-all"
            >
              Host Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
