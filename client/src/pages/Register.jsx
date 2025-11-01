import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setMessage("❌ Passwords do not match.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const username = userCredential.user.email.split("@")[0];
      login(username, userCredential.user.accessToken); // Save locally
      setMessage("✅ Account created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const username = userCredential.user.displayName || "User";
      login(username, userCredential.user.accessToken);
      setMessage("✅ Google signup successful!");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setMessage("❌ Google signup failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="backdrop-blur-0 border border-gray-300 bg-white/20 dark:bg-black/30 p-10 rounded-2xl w-full max-w-md hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center mb-4">Create Account</h2>
        {message && <p className="text-center text-sm mb-3">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full px-3 py-2 rounded-md" />
          <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full px-3 py-2 rounded-md" />
          <input name="confirm" type="password" placeholder="Confirm Password" required value={form.confirm} onChange={handleChange} className="w-full px-3 py-2 rounded-md" />
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md">Sign Up</button>
          <button type="button" onClick={handleGoogleSignup} className="w-full border py-2 rounded-md flex items-center justify-center gap-2">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5" />
            Sign up with Google
          </button>
        </form>
        <p className="text-sm text-center mt-4">Already have an account? <Link to="/login" className="text-blue-400">Login</Link></p>
      </div>
    </div>
  );
}
