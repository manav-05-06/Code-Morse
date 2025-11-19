import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setTime(new Date());
        setFade(true);
      }, 150); // fade-out duration
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="mt-20 w-full backdrop-blur-md bg-white/30 dark:bg-black/30 border-t border-black/10 dark:border-white/10 text-center py-6">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700 dark:text-gray-300 space-y-3 md:space-y-0">
        
        {/* Left Text */}
        <p className="font-medium tracking-wide">
          Made by{" "}
          <a
            href="https://github.com/manav-05-06"
            target="_blank"
            className="text-black dark:text-white font-semibold hover:underline"
          >
            Manav
          </a>
        </p>

        {/* Center Navigation */}
        <nav className="flex gap-6">
          {["Converter", "Practice", "Quiz", "Reference"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Time */}
        <p
          className={`text-xs text-gray-500 dark:text-gray-400 font-medium transition-all duration-500 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          © {new Date().getFullYear()} MorseCode | {formattedTime}
        </p>
      </div>
    </footer>
  );
}
