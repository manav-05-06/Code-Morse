import { useEffect, useState, useRef } from "react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  const liquidRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Liquid wobble effect on toggle
    if (liquidRef.current) {
      liquidRef.current.classList.remove("liquid-wobble");
      void liquidRef.current.offsetWidth;
      liquidRef.current.classList.add("liquid-wobble");
    }
  }, [darkMode]);

  if (!mounted) return null;

  // Magnetic 3D effect
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;

    e.currentTarget.style.transform = `perspective(250px) rotateX(${y}deg) rotateY(${x}deg) scale(1.08)`;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform =
      "perspective(250px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      className={`
        relative w-14 h-7 flex items-center rounded-full overflow-hidden
        backdrop-blur-xl transition-all duration-500 select-none cursor-pointer
        ${
          darkMode
            ? "bg-white/20 border border-white/30 shadow-[0_0_18px_rgba(255,255,255,0.45)]"
            : "bg-black/10 border border-black/30 shadow-[0_0_14px_rgba(0,0,0,0.25)]"
        }
      `}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.28s ease-out",
      }}
    >
      {/* LIQUID BALL */}
      <span
        ref={liquidRef}
        className={`
          absolute w-6 h-6 rounded-full liquid transition-all duration-[600ms]
          ${
            darkMode
              ? "translate-x-7 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              : "translate-x-1 bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          }
        `}
        style={{
          transitionTimingFunction: "cubic-bezier(.25,1.7,.35,1)",
        }}
      ></span>
    </button>
  );
}
