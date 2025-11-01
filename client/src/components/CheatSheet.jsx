import { useState, useCallback, useRef, useEffect } from "react";

const morseGuide = [
  { letter: "A", code: ".-", word: "Avenger", color: "#FF1E1E" },
  { letter: "B", code: "-...", word: "Batman", color: "#2B2B2B" },
  { letter: "C", code: "-.-.", word: "Cinephile", color: "#FF9F1C" },
  { letter: "D", code: "-..", word: "Deadpool", color: "#E50914" },
  { letter: "E", code: ".", word: "E.T.", color: "#4CC9F0" },
  { letter: "F", code: "..-.", word: "Forrest", color: "#00A676" },
  { letter: "G", code: "--.", word: "Gandalf", color: "#A7C7E7" },
  { letter: "H", code: "....", word: "Hobbit", color: "#C19A6B" },
  { letter: "I", code: "..", word: "Inception", color: "#006D77" },
  { letter: "J", code: ".---", word: "Joker", color: "#6A0DAD" },
  { letter: "K", code: "-.-", word: "Katniss", color: "#FF7F11" },
  { letter: "L", code: ".-..", word: "Loki", color: "#1DB954" },
  { letter: "M", code: "--", word: "Matrix", color: "#00FF41" },
  { letter: "N", code: "-.", word: "Neo", color: "#04A777" },
  { letter: "O", code: "---", word: "Oppenheimer", color: "#F97316" },
  { letter: "P", code: ".--.", word: "Potter", color: "#C77DFF" },
  { letter: "Q", code: "--.-", word: "Quill", color: "#FF4D6D" },
  { letter: "R", code: ".-.", word: "Rambo", color: "#991B1B" },
  { letter: "S", code: "...", word: "Skywalker", color: "#60A5FA" },
  { letter: "T", code: "-", word: "Terminator", color: "#9CA3AF" },
  { letter: "U", code: "..-", word: "Ultron", color: "#9B111E" },
  { letter: "V", code: "...-", word: "Vader", color: "#111827" },
  { letter: "W", code: ".--", word: "Wolverine", color: "#FACC15" },
  { letter: "X", code: "-..-", word: "X-Men", color: "#2563EB" },
  { letter: "Y", code: "-.--", word: "Yoda", color: "#84CC16" },
  { letter: "Z", code: "--..", word: "Zoolander", color: "#DB2777" },
];

export default function CheatSheet() {
  const [playingLetter, setPlayingLetter] = useState(null);
  const [ripples, setRipples] = useState([]);
  const ref = useRef(null);

  // ✨ Fade in when visible
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("opacity-100", "translate-y-0");
      },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, []);

  const playMorseSound = useCallback((letter, code) => {
    setPlayingLetter(letter);
    document.body.classList.add("active-pulse");
    setTimeout(() => document.body.classList.remove("active-pulse"), 1200);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const dot = 120;
    let t = audioCtx.currentTime;

    const beep = (dur) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = 600;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur / 1000);
      t += (dur + 100) / 1000;
    };

    for (const s of code) {
      if (s === ".") beep(dot);
      else if (s === "-") beep(dot * 3);
      t += 0.1;
    }

    const duration = code.length * (dot * 3 + 100);
    setTimeout(() => setPlayingLetter(null), duration);
  }, []);

  // 🌊 Ripple animation
  const handleClick = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = { x, y, id: Date.now(), color: item.color, letter: item.letter };
    setRipples((r) => [...r, ripple]);
    playMorseSound(item.letter, item.code, item.color);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== ripple.id)), 700);
  };

  return (
    <section
      ref={ref}
      id="reference"
      className="py-20 px-6 flex flex-col items-center text-center opacity-0 translate-y-10 transition-all duration-700"
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-black dark:text-white">
        Movie Morse Guide 🎬
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        Click any letter to play its Morse tone and see its cinematic ripple.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-10">
        Dots, dashes & movie magic ✨
      </p>

      <div className="backdrop-blur-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {morseGuide.map((item) => (
          <button
            key={item.letter}
            onClick={(e) => handleClick(e, item)}
            className={`relative overflow-hidden flex flex-col justify-center items-center border border-black/20 dark:border-white/20 rounded-md backdrop-blur-md py-6 px-4 transition-all duration-300 
              ${
                playingLetter === item.letter
                  ? "scale-[1.05] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "hover:scale-[1.03]"
              }`}
            style={{
              background:
                playingLetter === item.letter
                  ? `${item.color}22`
                  : "rgba(255,255,255,0.08)",
              boxShadow:
                playingLetter === item.letter
                  ? `0 0 15px ${item.color}, inset 0 0 8px ${item.color}55`
                  : "none",
            }}
          >
            {/* Ripple */}
            {ripples
              .filter((r) => r.letter === item.letter)
              .map((r) => (
                <span
                  key={r.id}
                  className="absolute rounded-full opacity-70 animate-ripple"
                  style={{
                    top: r.y,
                    left: r.x,
                    width: 30,
                    height: 30,
                    background: item.color,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}

            <h3 className="text-2xl font-semibold text-black dark:text-white z-10">
              {item.letter}
            </h3>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 z-10">{item.code}</p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-gray-200 z-10">
              {item.word}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
