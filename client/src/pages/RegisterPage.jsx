/**
 * RegisterPage Component
 * Page layout containing the host registration form.
 */
import RegisterForm from "../components/auth/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Host Registration
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sign up to create and host live Q&A events
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
