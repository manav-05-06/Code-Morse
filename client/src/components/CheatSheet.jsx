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

  // ========= Fade-in Animation on scroll =========
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

  // ========= Play Morse Sound =========
  const playMorseSound = useCallback((letter, code) => {
    setPlayingLetter(letter);

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
      t += (dur + 120) / 1000;
    };

    for (const s of code) {
      beep(s === "." ? dot : dot * 3);
    }

    const duration = code.length * (dot * 3 + 120);
    setTimeout(() => setPlayingLetter(null), duration);
  }, []);

  // ========= Ripple Effect =============
  const handleClick = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = {
      x,
      y,
      id: Date.now(),
      color: item.color,
      letter: item.letter,
    };

    setRipples((r) => [...r, ripple]);
    playMorseSound(item.letter, item.code);

    setTimeout(() => {
      setRipples((r) => r.filter((p) => p.id !== ripple.id));
    }, 700);
  };

  return (
    <section
      ref={ref}
      id="reference"
      className="py-20 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center text-center opacity-0 translate-y-10 transition-all duration-700"
    >
      <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-black dark:text-white">
        Movie Morse Guide 🎬
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        Tap any letter to hear the Morse tone.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-10">
        Dots, dashes & movie magic ✨
      </p>

      {/* ======= Responsive Grid (mobile → ultra-wide) ======= */}
      <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        gap-5 sm:gap-6 md:gap-8 
        max-w-7xl w-full
      ">
        {morseGuide.map((item) => (
          <button
            key={item.letter}
            onClick={(e) => handleClick(e, item)}
            className={`
              relative overflow-hidden flex flex-col items-center justify-center 
              rounded-xl border border-black/10 dark:border-white/10 
              backdrop-blur-md py-6 sm:py-7 md:py-8 px-4
              transition-all duration-300 touch-manipulation
              ${
                playingLetter === item.letter
                  ? "scale-[1.06] shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  : "hover:scale-[1.03]"
              }
            `}
            style={{
              background:
                playingLetter === item.letter ? `${item.color}25` : "rgba(255,255,255,0.07)",
              boxShadow:
                playingLetter === item.letter
                  ? `0 0 12px ${item.color}, inset 0 0 5px ${item.color}55`
                  : "none",
            }}
          >
            {/* Ripple Effects */}
            {ripples
              .filter((r) => r.letter === item.letter)
              .map((r) => (
                <span
                  key={r.id}
                  className="absolute rounded-full opacity-60 animate-[ripple_0.6s_ease-out]"
                  style={{
                    top: r.y,
                    left: r.x,
                    width: 40,
                    height: 40,
                    background: item.color,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}

            <h3 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white z-10">
              {item.letter}
            </h3>

            <p className="mt-1 text-lg sm:text-xl text-gray-700 dark:text-gray-300 z-10">
              {item.code}
            </p>

            <p className="mt-1 text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 z-10">
              {item.word}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
