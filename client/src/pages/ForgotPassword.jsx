import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("❌ Error sending reset email. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white px-6">
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg shadow-xl p-8 rounded-2xl w-full max-w-md border border-gray-300/50 dark:border-white/10">
        <h1 className="text-3xl font-bold mb-2 text-center">Reset Password 🔑</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          Enter your registered email to receive a reset link.
        </p>

        {message && (
          <p className="text-green-600 bg-green-100/30 dark:bg-green-900/30 rounded-md px-3 py-2 text-sm mb-4 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 bg-red-100/30 dark:bg-red-900/40 rounded-md px-3 py-2 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
          />
          <button
            type="submit"
            className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-5">
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
