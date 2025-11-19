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

  // ===========================
  // Generate a New Letter
  // ===========================
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

  // ===========================
  // Play Morse Sound
  // ===========================
  const playMorseSound = useCallback(() => {
    if (!soundOn || !currentLetter) return;

    const code = morseMap[currentLetter];
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;

    let time = ctx.currentTime;
    const dot = 120;

    const beep = (duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = 600;
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration / 1000);

      time += (duration + 100) / 1000;
    };

    for (const s of code) {
      beep(s === "." ? dot : dot * 3);
    }
  }, [soundOn, currentLetter]);

  const replaySound = () => playMorseSound();

  // ===========================
  // Hint System (3 Levels)
  // ===========================
  const getHint = () => {
    if (hintLevel === 0) {
      setHintText("_");
    } else if (hintLevel === 1) {
      setHintText(currentLetter[0]);
    } else {
      setHintText(currentLetter);
    }

    setHintLevel((h) => Math.min(2, h + 1));
  };

  // ===========================
  // Confetti Animation (NO LIB)
  // ===========================
  const launchConfetti = () => {
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "-10px";
      div.style.left = Math.random() * 100 + "%";
      div.style.width = "6px";
      div.style.height = "10px";
      div.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
      div.style.opacity = "0.9";
      div.style.transform = `rotate(${Math.random() * 360}deg)`;
      div.style.transition = "top 1.7s ease, opacity 1.7s ease";
      document.body.appendChild(div);

      requestAnimationFrame(() => {
        div.style.top = "100vh";
        div.style.opacity = "0";
      });

      setTimeout(() => div.remove(), 1800);
    }
  };

  useEffect(() => {
    if (streak !== 0 && streak % 10 === 0) {
      launchConfetti();
    }
  }, [streak]);

  // ===========================
  // CHECK Answer
  // ===========================
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

  // ===========================
  // JSX CONTENT
  // ===========================
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold mb-1 text-black dark:text-white">
        Practice
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
        (single letter practice)
      </p>

      {/* Morse Code Display */}
      <div
        className={`text-4xl font-mono mb-6 tracking-widest ${
          streak >= 3 ? "animate-pulse" : ""
        } text-black dark:text-white`}
      >
        {morseMap[currentLetter]}
      </div>

      {/* PLAY + REPLAY */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={playMorseSound}
          className="border border-black dark:border-white px-8 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          PLAY
        </button>

        <button
          onClick={replaySound}
          className="border border-black dark:border-white px-8 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          REPLAY
        </button>
      </div>

      {/* HINT */}
      <button
        onClick={getHint}
        className="mb-4 border px-6 py-2 text-black dark:text-white border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
      >
        HINT 💡
      </button>

      {hintText && (
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Hint: {hintText}
        </p>
      )}

      {/* Input + Check */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <input
          type="text"
          maxLength="1"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-16 h-16 text-center border border-black dark:border-white text-3xl bg-transparent text-black dark:text-white"
        />

        <button
          onClick={checkAnswer}
          className="px-8 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition"
        >
          CHECK
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`mb-8 text-lg ${
            feedback.includes("Correct!") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* HISTORY */}
      <div className="w-full max-w-xs text-left mb-10">
        <h3 className="text-lg font-semibold mb-2">History</h3>

        {history.length === 0 && (
          <p className="text-gray-500 text-sm">No attempts yet.</p>
        )}

        {history.map((h, i) => (
          <p key={i} className="text-sm">
            {h.letter} →
            <span
              className={`ml-1 ${
                h.correct ? "text-green-500" : "text-red-500"
              }`}
            >
              {h.correct ? "Correct" : "Wrong"}
            </span>
          </p>
        ))}
      </div>

      <hr className="w-4/5 border-gray-300 dark:border-gray-700 mb-8" />

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-4/5">
        <p className="text-gray-600 dark:text-gray-400 text-sm tracking-widest">
          SCORE: {score}
        </p>

        <button
          onClick={() => setSoundOn((s) => !s)}
          className="border border-black dark:border-white px-6 py-2 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          SOUND: {soundOn ? "ON" : "OFF"}
        </button>

        <button
          onClick={nextRound}
          className="px-8 py-2 bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition"
        >
          NEXT
        </button>
      </div>
    </section>
  );
}
