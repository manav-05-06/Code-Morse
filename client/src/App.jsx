import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import TextToMorse from "./components/TextToMorse";
import MorseToText from "./components/MorseToText";
import Practice from "./components/Practice";
import SoundQuiz from "./components/SoundQuiz";
import CheatSheet from "./components/CheatSheet";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🧊 Reusable overlay with glass effect and theme-adaptive color
  const LockedOverlay = ({ message, section }) => {
    const handleLoginRedirect = () => {
      navigate(`/login?redirect=${section}`); // store section in query param
    };

    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center 
                   backdrop-blur-md bg-white/30 dark:bg-black/50 border border-gray-200/20 dark:border-white/20 
                   rounded-xl animate-fadeIn transition-all duration-700"
      >
        <p className="text-lg md:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 drop-shadow-md">
          {message}
        </p>
        <button
          onClick={handleLoginRedirect}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg 
                     shadow-md hover:scale-105 hover:opacity-90 transition-all duration-300"
        >
          Login to Unlock
        </button>
      </div>
    );
  };

  return (
    <>
    <div>
      <section id="converter">
        <TextToMorse />
      </section>

      <section id="morsetotext">
        <MorseToText />
      </section>
      <section id="reference">
        <CheatSheet />
      </section>
      </div>

      {/* 🔒 Practice Section */}
      <section id="practice" className="relative transition-all duration-700">
        <div
          className={`transition-all duration-700 ${
            !user ? "blur-md backdrop-brightness-0 brightness-200 select-none pointer-events-none" : ""
          }`}
        >
          <Practice />
          
        </div>
        {!user && <LockedOverlay message="Login to access Practice Mode" section="practice" />}
      </section>


      {/* 🔒 Sound Quiz Section */}
      <section id="quiz" className="relative transition-all duration-700">
        <div
          className={`transition-all duration-700 ${
            !user ? "blur-md brightness-75 select-none pointer-events-none" : ""
          }`}
        >
          <SoundQuiz />
        </div>
        {!user && <LockedOverlay message="Login to play Sound Quiz" section="quiz" />}
      </section>


    </>
  );
}

// 🧭 Enhanced Login Wrapper for redirect logic
import { useEffect } from "react";
function LoginWithRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // extract redirect section
  const params = new URLSearchParams(location.search);
  const redirectSection = params.get("redirect");

  useEffect(() => {
    if (user && redirectSection) {
      const section = document.getElementById(redirectSection);
      if (section) {
        const offset = 80;
        const top = section.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      navigate("/", { replace: true });
    }
  }, [user, redirectSection, navigate]);

  return <Login />;
}

function App() {
  return (
    <Router>
      <div className="font-mono min-h-screen relative transition-colors duration-500">
        <Navbar />

        <main className="pt-2">
          <Routes>
            {/* 🏠 Single-page layout */}
            <Route path="/" element={<HomePage />} />

            {/* 🔐 Auth Routes */}
            <Route path="/login" element={<LoginWithRedirect />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <CursorGlow />
      <Analytics />
    </Router>
  );
}

export default App;
