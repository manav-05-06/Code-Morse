import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTime(new Date());
        setFade(true);
      }, 150); // small delay before fade in again
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="mt-20 w-full backdrop-blur-md bg-white/30 dark:bg-black/30 border-t border-black/10 dark:border-white/10 text-center py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700 dark:text-gray-300 space-y-3 md:space-y-0">
        
        {/* Left text */}
        <p className="font-medium tracking-wide">
          Made by{" "}
          <span className="font-semibold"> Manav</span>
        </p>

        {/* Center navigation */}
        <nav className="flex gap-6 text-gray-700 dark:text-gray-300">
          <a href="#converter" className="hover:text-black dark:hover:text-white transition-colors">
            Converter
          </a>
          <a href="#practice" className="hover:text-black dark:hover:text-white transition-colors">
            Practice
          </a>
          <a href="#quiz" className="hover:text-black dark:hover:text-white transition-colors">
            Quiz
          </a>
          <a href="#reference" className="hover:text-black dark:hover:text-white transition-colors">
            Reference
          </a>
        </nav>

        {/* Right copyright + animated time */}
        <p
          className={`text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-500 ease-in-out ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          © {new Date().getFullYear()} MorseCode | {formattedTime}
        </p>
      </div>
    </footer>
  );
}
