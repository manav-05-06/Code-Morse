import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ If already logged in → go home
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.username); // Save user globally

      setMessage("✅ Welcome back, " + res.data.username + "!");
      
      // ✅ Redirect to previous section (like /?redirect=practice)
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
      setMessage("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 transition-all duration-700">
      <div className="backdrop-blur-md bg-white/40 dark:bg-black/30 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200/20 dark:border-white/20">
        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/70 dark:bg-black/40 text-black dark:text-white border border-gray-300/30 dark:border-gray-600/50 focus:ring-2 focus:ring-gray-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/70 dark:bg-black/40 text-black dark:text-white border border-gray-300/30 dark:border-gray-600/50 focus:ring-2 focus:ring-gray-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 text-white bg-black dark:bg-white dark:text-black rounded-md hover:opacity-90 transition-all font-semibold"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
