import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // Redirect logged-in users away from register page
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isValid = () => {
    if (!form.username.trim()) return "Username is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
    if (!/^(?=.*\d).{8,}$/.test(form.password))
      return "Password must be 8+ chars with a number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localError = isValid();
    if (localError) return setMessage("❌ " + localError);

    setSubmitting(true);
    setMessage("");

    try {
      // Register user
      await axios.post("http://localhost:5000/api/auth/register", form, {
        headers: { "Content-Type": "application/json" },
      });

      // Immediately log them in
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      login(loginRes.data.username);
      setMessage("✅ Account created successfully! Redirecting...");

      // Handle redirect to locked section (like ?redirect=practice)
      const params = new URLSearchParams(location.search);
      const redirectSection = params.get("redirect");

      setTimeout(() => {
        navigate("/", { replace: true });
        if (redirectSection) {
          const section = document.getElementById(redirectSection);
          if (section) {
            const offset = 80;
            const top = section.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }, 1000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";
      setMessage("❌ " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 transition-all duration-700">
      <div className="backdrop-blur-md bg-white/40 dark:bg-black/30 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200/20 dark:border-white/20">
        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className="w-full px-4 py-3 rounded-md bg-white/70 dark:bg-black/40 text-black dark:text-white border border-gray-300/30 dark:border-gray-600/50 focus:ring-2 focus:ring-gray-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-md bg-white/70 dark:bg-black/40 text-black dark:text-white border border-gray-300/30 dark:border-gray-600/50 focus:ring-2 focus:ring-gray-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-md bg-white/70 dark:bg-black/40 text-black dark:text-white border border-gray-300/30 dark:border-gray-600/50 focus:ring-2 focus:ring-gray-400 outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-white bg-black dark:bg-white dark:text-black rounded-md hover:opacity-90 transition-all font-semibold disabled:opacity-60"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
