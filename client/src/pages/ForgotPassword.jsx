import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("✅ Password reset link sent! Check your inbox.");
    } catch (err) {
      setError("❌ Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div
        className="
          bg-white/20 dark:bg-black/30
          border border-gray-300 dark:border-white/20
          rounded-2xl p-8 w-full max-w-md
          backdrop-blur-xl
          shadow-xl
          hover:shadow-2xl hover:scale-[1.01]
          transition-all duration-300
        "
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Reset Password 🔑</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Enter your email to receive a reset link.
        </p>

        {/* Success Message */}
        {message && (
          <p
            className="
              text-green-600 dark:text-green-400
              bg-green-100/30 dark:bg-green-900/40
              rounded-md px-3 py-2 mb-4 text-sm text-center
              animate-fadeIn
            "
          >
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            className="
              text-red-600 dark:text-red-400
              bg-red-100/30 dark:bg-red-900/40
              rounded-md px-3 py-2 mb-4 text-sm text-center
              animate-fadeIn
            "
          >
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-4 py-2 rounded-md outline-none
              bg-white/60 dark:bg-black/40
              border border-gray-300 dark:border-white/30
              focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30
              transition-all
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              bg-black dark:bg-white
              text-white dark:text-black
              font-semibold py-2 rounded-md
              hover:scale-105 active:scale-95
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-600 dark:text-gray-400">
          Back to{" "}
          <Link
            to="/login"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
