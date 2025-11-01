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
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) navigate("/"); // Already logged in

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setMessage("✅ Welcome back!");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("⚠️ No account found. Please register first.");
      } else {
        setMessage("❌ " + error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("✅ Logged in successfully!");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setMessage("⚠️ No Google account found. Please sign up first.");
      } else {
        setMessage("❌ Google login failed. Try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="backdrop-blur-0 border border-gray-300 dark:bg-black/30 p-10 rounded-2xl w-full max-w-md hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>
        {message && <p className="text-center text-sm mb-3">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md"
          />
          <div className="flex items-center gap-2 text-sm">
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
          <button
            type="submit"
            className="w-full border bg-black text-white py-2 rounded-md"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border py-2 rounded-md flex items-center justify-center gap-2"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5"
            />
            Login with Google
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
