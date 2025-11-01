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

  // Smooth scroll (for home sections)
  const handleScroll = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 400);
    } else {
      scrollToSection(id);
    }
    setActiveSection(id);
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80;
      const top = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Highlight active link on scroll
  useEffect(() => {
    const handleScrollHighlight = () => {
      const sections = ["converter", "practice", "quiz", "reference"];
      let current = "converter";
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollHighlight);
    return () => window.removeEventListener("scroll", handleScrollHighlight);
  }, []);

  // ✅ Conditionally render nav links based on login status
  const navItems = [
  { id: "converter", label: "Converter" },
  { id: "reference", label: "Reference" },
  { id: "practice", label: "Practice" },
  { id: "quiz", label: "Sound Quiz" },
];


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/50 dark:bg-black/40 border-b border-black/10 dark:border-white/10 transition-all duration-300">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <h1
          onClick={() => handleScroll("converter")}
          className="text-2xl font-semibold tracking-wide text-black dark:text-white select-none cursor-pointer"
        >
          Morse<span className="text-gray-400 dark:text-gray-300">Code</span>
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() =>
                handleScroll(item.id)
              }
              className={`cursor-pointer transition-colors relative pb-1 ${
                activeSection === item.id
                  ? "text-black dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-black dark:after:bg-white after:rounded-full"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

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
                👋 Hello, <b>{user.username}</b>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-black dark:text-white focus:outline-none transition-transform duration-200 active:scale-90"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-[60px] left-0 w-full backdrop-blur-md bg-white/70 dark:bg-black/70 border-t border-black/10 dark:border-white/10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
          menuOpen
            ? "max-h-64 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        <ul
          className={`flex flex-col items-center space-y-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 transform transition-all duration-500 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          {navItems.map((item, index) => (
            <li
              key={item.id}
              onClick={() => {
                item.path ? navigate(item.path) : handleScroll(item.id);
                setMenuOpen(false);
              }}
              style={{ transitionDelay: menuOpen ? `${index * 80}ms` : "0ms" }}
              className={`cursor-pointer transition-all duration-200 ${
                activeSection === item.id
                  ? "text-black dark:text-white font-semibold"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {item.label}
            </li>
          ))}

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-black dark:text-white font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
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
