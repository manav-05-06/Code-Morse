import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("converter");
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Sections available on homepage
  const navItems = [
    { id: "converter", label: "Converter" },
    { id: "reference", label: "Reference" },
    { id: "practice", label: "Practice" },
    { id: "quiz", label: "Sound Quiz" },
  ];

  // Smooth scroll handler
  const handleScroll = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 350);
    } else scrollToSection(id);

    setActiveSection(id);
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  // Highlight current section on scroll
  useEffect(() => {
    const trackSection = () => {
      const sections = ["converter", "reference", "practice", "quiz"];
      let current = "converter";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", trackSection);
    return () => window.removeEventListener("scroll", trackSection);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-xl bg-white/50 dark:bg-black/40
        border-b border-black/10 dark:border-white/10
        transition-all duration-300
      "
    >
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => handleScroll("converter")}
          className="
            text-2xl font-semibold tracking-wide cursor-pointer select-none
            text-black dark:text-white hover:opacity-80 transition
          "
        >
          Morse<span className="text-gray-500 dark:text-gray-300">Code</span>
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className={`
                cursor-pointer relative pb-1 transition-all
                ${
                  activeSection === item.id
                    ? "text-black dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black dark:after:bg-white after:rounded-full"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }
              `}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden md:inline px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-semibold hover:opacity-85 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden md:inline px-4 py-2 border border-black dark:border-white rounded-md text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                Hello<b>{user.username}</b>
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="
              md:hidden text-black dark:text-white p-1
              transition-transform active:scale-90
            "
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        className={`
          md:hidden overflow-hidden border-t border-black/10 dark:border-white/10
          backdrop-blur-md bg-white/70 dark:bg-black/70
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul
          className={`
            flex flex-col items-center py-4 space-y-4 text-sm font-medium
            transition-all duration-500
            ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}
          `}
        >
          {navItems.map((item, i) => (
            <li
              key={item.id}
              onClick={() => {
                handleScroll(item.id);
                setMenuOpen(false);
              }}
              style={{ transitionDelay: `${i * 70}ms` }}
              className={`
                cursor-pointer transition-all
                ${
                  activeSection === item.id
                    ? "text-black dark:text-white font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }
              `}
            >
              {item.label}
            </li>
          ))}

          {/* Auth (Mobile) */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-black dark:text-white font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-black dark:text-white font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-gray-400 font-semibold"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </header>
  );
}
