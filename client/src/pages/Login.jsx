import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) navigate("/");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, form.email, form.password);

      setMessage("✅ Welcome back!");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("⚠️ No account found. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        setMessage("❌ Incorrect password. Try again.");
      } else {
        setMessage("❌ " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      setMessage("✅ Logged in successfully!");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      setMessage("❌ Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div
        className="
          border border-gray-300 dark:border-white/20
          bg-white/20 dark:bg-black/30
          p-10 rounded-2xl w-full max-w-md
          backdrop-blur-xl
          hover:shadow-2xl hover:scale-[1.01]
          transition-all duration-300
        "
      >
        <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>

        {message && (
          <p
            className={`text-center text-sm mb-3 transition-all duration-300 ${
              message.startsWith("❌") || message.startsWith("⚠️")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="
              w-full px-3 py-2 rounded-md outline-none
              bg-white/60 dark:bg-black/40
              border border-gray-300 dark:border-white/30
              focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30
              transition-all
            "
          />

          {/* Password */}
          <div className="flex flex-col gap-1">
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="
                w-full px-3 py-2 rounded-md outline-none
                bg-white/60 dark:bg-black/40
                border border-gray-300 dark:border-white/30
                focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30
                transition-all
              "
            />

            {/* 👉 Forgot Password Link */}
            <Link
              to="/forgot-password"
              className="
                text-xs text-blue-500 dark:text-blue-300 
                mt-1 ml-1 self-end
                hover:underline hover:opacity-90 
                transition
              "
            >
              Forgot password?
            </Link>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 text-sm mt-1">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={(e) =>
                setForm({ ...form, remember: e.target.checked })
              }
            />
            <label>Remember me</label>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-black text-white dark:bg-white dark:text-black 
              py-2 rounded-md font-medium
              transition-all duration-300
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="
              w-full border py-2 rounded-md flex items-center justify-center gap-2
              bg-white/50 dark:bg-black/40
              border-gray-300 dark:border-white/30
              hover:scale-105 active:scale-95 
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              className='h-5'
              alt='Google icon'
            />
            Login with Google
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
