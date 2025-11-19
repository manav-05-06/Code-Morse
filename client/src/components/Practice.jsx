import { useState, useEffect, useCallback, useRef } from "react";

const morseMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
};

export default function Practice() {
  const [currentLetter, setCurrentLetter] = useState("");
  const [userInput, setUserInput] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintText, setHintText] = useState("");

  const audioRef = useRef(null);

  // ============================
  // Generate New Letter
  // ============================
  const getRandomLetter = useCallback(() => {
    const letters = Object.keys(morseMap);
    const letter = letters[Math.floor(Math.random() * letters.length)];

    setCurrentLetter(letter);
    setUserInput("");
    setFeedback("");
    setHintText("");
    setHintLevel(0);
  }, []);

  useEffect(() => {
    getRandomLetter();
  }, [getRandomLetter]);

  // ============================
  // Play Morse
  // ============================
  const playMorseSound = useCallback(() => {
    if (!soundOn || !currentLetter) return;

    const code = morseMap[currentLetter];
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;

    let t = ctx.currentTime;
    const dot = 120;

    const beep = (dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 600;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur / 1000);
      t += (dur + 100) / 1000;
    };

    for (const s of code) {
      beep(s === "." ? dot : dot * 3);
    }
  }, [soundOn, currentLetter]);

  const replaySound = () => playMorseSound();

  // ============================
  // Hints
  // ============================
  const getHint = () => {
    if (hintLevel === 0) setHintText("_");
    else if (hintLevel === 1) setHintText(currentLetter[0]);
    else setHintText(currentLetter);

    setHintLevel((h) => Math.min(h + 1, 2));
  };

  // ============================
  // Confetti
  // ============================
  const launchConfetti = () => {
    for (let i = 0; i < 20; i++) {
      const d = document.createElement("div");
      d.style.position = "fixed";
      d.style.top = "-10px";
      d.style.left = Math.random() * 100 + "%";
      d.style.width = "6px";
      d.style.height = "10px";
      d.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
      d.style.opacity = "0.9";
      d.style.transform = `rotate(${Math.random() * 360}deg)`;
      d.style.transition = "top 1.7s ease, opacity 1.7s ease";

      document.body.appendChild(d);

      requestAnimationFrame(() => {
        d.style.top = "100vh";
        d.style.opacity = "0";
      });

      setTimeout(() => d.remove(), 1800);
    }
  };

  useEffect(() => {
    if (streak !== 0 && streak % 10 === 0) launchConfetti();
  }, [streak]);

  // ============================
  // Check Answer
  // ============================
  const checkAnswer = () => {
    const correct = userInput.toUpperCase() === currentLetter;

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`It was "${currentLetter}"`);
      setStreak(0);
    }

    setHistory((prev) => [
      { letter: currentLetter, correct },
      ...prev.slice(0, 4),
    ]);
  };

  const nextRound = () => getRandomLetter();

  // ============================
  // UI JSX
  // ============================
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-2">
        Practice
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
        (single letter practice)
      </p>

      {/* Morse Code */}
      <div
        className={`
          text-5xl font-mono tracking-widest mb-6
          text-black dark:text-white
          ${streak >= 3 ? "animate-pulse" : ""}
        `}
      >
        {morseMap[currentLetter]}
      </div>

      {/* PLAY / REPLAY */}
      <div className="flex gap-4 mb-10">
        <button className="btn-light" onClick={playMorseSound}>PLAY</button>
        <button className="btn-light" onClick={replaySound}>REPLAY</button>
      </div>

      {/* Hint */}
      <button className="btn-light mb-3" onClick={getHint}>
        HINT 💡
      </button>

      {hintText && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Hint: {hintText}
        </p>
      )}

      {/* Input */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <input
          type="text"
          maxLength="1"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="
            w-20 h-20 text-center text-4xl rounded-md
            bg-white/40 dark:bg-black/40 backdrop-blur-md
            border border-black/30 dark:border-white/20
            text-black dark:text-white outline-none
          "
        />

        <button className="btn-dark" onClick={checkAnswer}>CHECK</button>
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`
            text-lg mb-8 font-semibold
            ${feedback.includes("Correct") ? "text-green-500" : "text-red-500"}
          `}
        >
          {feedback}
        </p>
      )}

      {/* History */}
      <div
        className="
          bg-white/40 dark:bg-black/30 backdrop-blur-xl
          border border-black/20 dark:border-white/10
          p-5 rounded-xl w-full max-w-xs text-left mb-10
        "
      >
        <h3 className="text-lg font-semibold mb-2">History</h3>

        {history.length === 0 && (
          <p className="text-gray-500 text-sm">No attempts yet.</p>
        )}

        {history.map((h, i) => (
          <p key={i} className="text-sm">
            {h.letter} →
            <span className={h.correct ? "text-green-500 ml-1" : "text-red-500 ml-1"}>
              {h.correct ? "Correct" : "Wrong"}
            </span>
          </p>
        ))}
      </div>

      <hr className="w-4/5 border-gray-300 dark:border-gray-700 mb-8" />

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between w-4/5">

        <p className="tracking-widest text-sm text-gray-700 dark:text-gray-300">
          SCORE: {score}
        </p>

        <button className="btn-light" onClick={() => setSoundOn((s) => !s)}>
          SOUND: {soundOn ? "ON" : "OFF"}
        </button>

        <button className="btn-dark" onClick={nextRound}>
          NEXT
        </button>
      </div>
    </section>
  );
}
