/**
 * Landing Page
 * Public entry point providing clear call-to-actions for hosts and audience members.
 */
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="max-w-3xl py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Real-Time Q&A for Live Events
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Engage your audience seamlessly. Collect, upvote, and address
          questions live without app downloads or login friction for
          participants.
        </p>

        {/* Dual Call to Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
          {/* Audience Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Joining an Event?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                No account needed. Enter a six-digit join code to ask and upvote
                questions live.
              </p>
            </div>
            <Link
              to="/join"
              className="w-full text-center bg-gray-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Enter Code
            </Link>
          </div>

          {/* Host Card */}
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-indigo-950 mb-2">
                Hosting an Event?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Create Q&A rooms, manage live questions, pin highlights, and
                archive answered posts.
              </p>
            </div>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full text-center bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/register"
                  className="flex-1 text-center bg-indigo-600 text-white font-medium py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="flex-1 text-center border border-indigo-200 text-indigo-600 font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
