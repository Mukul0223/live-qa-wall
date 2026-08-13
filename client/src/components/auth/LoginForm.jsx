/**
 * LoginForm Component
 * Manages local login state, submits credentials via AuthContext,
 * and handles redirection to the host dashboard.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path to match your useAuth hook location

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Local form state (kept local per Blueprint Section 10)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client validation
    if (!formData.email.trim()) {
      setValidationError("Please enter your email address.");
      return;
    }
    if (!formData.password) {
      setValidationError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");

      // Call AuthContext login (saves token to localStorage & sets user state)
      await login(formData.email, formData.password);

      // Redirect host to Dashboard
      navigate("/dashboard");
    } catch (err) {
      // Failure is caught here; global Toast displays the backend's
      // generic "invalid credentials" error message automatically.
      // Form fields are kept intact so the user can re-try.
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full mx-auto">
      {/* Local validation warning */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {validationError}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="alex@example.com"
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex justify-center items-center cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      {/* Register Page Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account yet?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-medium hover:underline"
        >
          Register here
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
