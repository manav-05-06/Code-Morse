import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // new
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const username = userCredential.user.email.split("@")[0];
      login(username, userCredential.user.accessToken);

      setMessage("✅ Account created successfully!");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const username = userCredential.user.displayName || "User";
      login(username, userCredential.user.accessToken);

      setMessage("✅ Google signup successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage("❌ Google signup failed.");
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
          transition-all duration-300 
          hover:shadow-2xl hover:scale-[1.01]
        "
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          Create Account
        </h2>

        {message && (
          <p
            className={`text-center text-sm mb-4 transition-all duration-300 ${
              message.startsWith("❌") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

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

          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirm}
            onChange={handleChange}
            className="
              w-full px-3 py-2 rounded-md outline-none
              bg-white/60 dark:bg-black/40
              border border-gray-300 dark:border-white/30
              focus:ring-2 focus:ring-black/40 dark:focus:ring-white/30
              transition-all
            "
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-md font-medium
              bg-black text-white dark:bg-white dark:text-black
              transition-all duration-300
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignup}
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
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5"
            />
            Continue with Google
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
