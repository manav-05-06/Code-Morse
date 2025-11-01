import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`relative w-12 h-6 rounded-full flex items-center transition-all duration-500 ease-in-out backdrop-blur-md 
        ${darkMode 
          ? "bg-white/10 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.25)]" 
          : "bg-gray-100/70 border border-black/40 shadow-[0_0_8px_rgba(0,0,0,0.15)]"
        }`}
      title="Toggle theme"
    >
      <span
        className={`absolute w-5 h-5 rounded-full transition-all duration-500 ease-in-out
          ${darkMode 
            ? "translate-x-6 bg-white border border-white/40" 
            : "translate-x-1 bg-black border border-black/40"
          }`}
      ></span>
    </button>
  );
}
