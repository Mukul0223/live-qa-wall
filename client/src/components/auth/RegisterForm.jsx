/**
 * RegisterForm Component
 * Manages local registration state, client-side input validation,
 * and triggers host registration via AuthContext.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path to your useAuth hook

export const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Local state for form inputs (kept local per Blueprint Section 10)
  const [formData, setFormData] = useState({
    name: "",
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
    // Clear validation error when user starts editing
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation check
    if (!formData.name.trim()) {
      setValidationError("Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setValidationError("Email is required.");
      return;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");

      // Register host (saves token & user into AuthContext)
      await register(formData.name, formData.email, formData.password);

      // On success, redirect host directly to dashboard
      navigate("/dashboard");
    } catch (err) {
      // On failure, global Toast handles network/backend error message.
      // Form fields are preserved so the user doesn't lose entered data.
      console.error("Registration failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full mx-auto">
      {/* Client-side validation message */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {validationError}
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Alex Morgan"
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
          required
        />
      </div>

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
          placeholder="Minimum 6 characters"
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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Page Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:underline"
        >
          Log in here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
