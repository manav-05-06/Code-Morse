import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function SoundQuiz() {
  const [difficulty, setDifficulty] = useState("Letters");
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [quizTargetText, setQuizTargetText] = useState("");
  const [quizTargetMorse, setQuizTargetMorse] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [hint, setHint] = useState("");
  const [history, setHistory] = useState([]);

  const totalRounds = useRef(0);
  const correctAnswers = useRef(0);
  const audioCtx = useRef(null);
  const visualizerRef = useRef(null);
  const visualizerInterval = useRef(null);

  // ======================
  // MORSE MAP
  // ======================
  const morseMap = useMemo(
    () => ({
      A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
      G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
      M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
      S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
      Y: "-.--", Z: "--..",
      0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
      5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----."
    }),
    []
  );

  const letterKeys = Object.keys(morseMap);
  const wordList = ["HELLO", "WORLD", "MORSE", "QUIZ", "SIGNAL", "RADIO"];
  const sentenceList = ["HELLO WORLD", "MORSE CODE QUIZ", "I LOVE RADIO", "LEARN MORSE FAST"];

  const textToMorse = useCallback(
    (text) =>
      text
        .toUpperCase()
        .split("")
        .map((c) => (c === " " ? "/" : morseMap[c] || "?"))
        .join(" "),
    [morseMap]
  );

  const generateNewQuizItem = useCallback(() => {
    let text = "";

    if (difficulty === "Letters") {
      text = letterKeys[Math.floor(Math.random() * letterKeys.length)];
    } else if (difficulty === "Words") {
      text = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
      text = sentenceList[Math.floor(Math.random() * sentenceList.length)];
    }

    setQuizTargetText(text);
    setQuizTargetMorse(textToMorse(text));
    setHint("");
    setHintLevel(0);
  }, [difficulty, textToMorse]);

  useEffect(() => {
    generateNewQuizItem();
  }, [generateNewQuizItem]);

  const generateNewRound = () => {
    setRound((r) => r + 1);
    generateNewQuizItem();
  };

  // ======================
  // PLAY SOUND
  // ======================
  const playMorseSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 600;
    gain.gain.value = 0;

    osc.connect(gain).connect(ctx.destination);

    const dot = 0.12 / speed;
    const dash = 0.36 / speed;
    const gap = 0.12 / speed;

    let t = ctx.currentTime;

    quizTargetMorse.split("").forEach((ch) => {
      if (ch === ".") {
        gain.gain.setValueAtTime(volume, t);
        t += dot;
        gain.gain.setValueAtTime(0, t);
      } else if (ch === "-") {
        gain.gain.setValueAtTime(volume, t);
        t += dash;
        gain.gain.setValueAtTime(0, t);
      }
      t += gap;
    });

    osc.start();
    osc.stop(t);

    startVisualizer();
    setTimeout(stopVisualizer, (t - ctx.currentTime) * 1000);
  };

  const replaySound = () => playMorseSound();

  // ======================
  // VISUALIZER
  // ======================
  const startVisualizer = () => {
    const bars = visualizerRef.current?.querySelectorAll(".bar");
    if (!bars) return;

    visualizerInterval.current = setInterval(() => {
      bars.forEach((bar) => {
        bar.style.height = `${10 + Math.random() * 35}px`;
      });
    }, 90);
  };

  const stopVisualizer = () => {
    clearInterval(visualizerInterval.current);
    const bars = visualizerRef.current?.querySelectorAll(".bar");
    bars?.forEach((bar) => (bar.style.height = "10px"));
  };

  // ======================
  // HINT
  // ======================
  const handleHint = () => {
    if (hintLevel === 0) {
      setHint("_ ".repeat(quizTargetText.length).trim());
    } else if (hintLevel === 1) {
      setHint(quizTargetText[0] + " _ ".repeat(quizTargetText.length - 1));
    } else {
      setHint(quizTargetText);
    }

    setHintLevel((h) => Math.min(h + 1, 2));
  };

  // ======================
  // CONFETTI
  // ======================
  const launchConfetti = () => {
    for (let i = 0; i < 25; i++) {
      const c = document.createElement("div");
      c.style.position = "fixed";
      c.style.top = "-10px";
      c.style.left = Math.random() * 100 + "%";
      c.style.width = "6px";
      c.style.height = "10px";
      c.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      c.style.opacity = "0.9";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      c.style.transition = "top 1.7s ease, opacity 1.7s ease";

      document.body.appendChild(c);

      requestAnimationFrame(() => {
        c.style.top = "100vh";
        c.style.opacity = "0";
      });

      setTimeout(() => c.remove(), 1800);
    }
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = () => {
    totalRounds.current++;
    const isCorrect = input.trim().toUpperCase() === quizTargetText;

    if (isCorrect) {
      correctAnswers.current++;
      setStreak((s) => s + 1);
      if (streak + 1 === 10) launchConfetti();
    } else {
      setStreak(0);
    }

    setHistory((h) => [
      { text: quizTargetText, correct: isCorrect },
      ...h.slice(0, 4),
    ]);

    setAccuracy(Math.round((correctAnswers.current / totalRounds.current) * 100));
    setInput("");
    generateNewRound();
  };

  const handleReset = () => {
    setAccuracy(0);
    setStreak(0);
    setRound(0);
    totalRounds.current = 0;
    correctAnswers.current = 0;
    setHistory([]);
    setHint("");
    setInput("");
    generateNewQuizItem();
  };

  // ======================
  // RENDER UI
  // ======================
  return (
    <div className="flex flex-col items-center py-12 text-center">

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-6">
        Sound Quiz
      </h2>

      {/* Controls */}
      <div className="
        flex flex-col md:flex-row gap-8 mt-2 items-center
        bg-white/60 dark:bg-black/30 backdrop-blur-xl
        px-6 py-5 rounded-xl border border-black/10 dark:border-white/10
      ">

        <div>
          <label className="block text-xs uppercase opacity-70">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="
              border px-3 py-2 rounded-md mt-1
              bg-white/80 dark:bg-black/40 dark:text-white
              border-black/20 dark:border-white/20
            "
          >
            <option>Letters</option>
            <option>Words</option>
            <option>Sentences</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase opacity-70">Speed</label>
          <input type="range" min="0.5" max="2" step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-xs uppercase opacity-70">Volume</label>
          <input type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="mt-2"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        <button className="quiz-btn" onClick={playMorseSound}>▶️</button>
        <button className="quiz-btn" onClick={replaySound}>🔁</button>
        <button className="quiz-btn" onClick={generateNewRound}>⏭</button>
      </div>

      
      {/* Visualizer */}
      <div
        ref={visualizerRef}
        className="
          flex justify-center gap-1 mt-6 h-10 w-52
          bg-white/50 dark:bg-black/40 rounded-lg p-2 backdrop-blur-xl
        "
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="bar w-1 rounded-md bg-black dark:bg-white transition-all duration-75" style={{ height: "10px" }} />
        ))}
      </div>

      {/* Hint */}
      <button 
        onClick={handleHint}
        className="
          mt-6 px-6 py-2 border rounded-md
          bg-white/50 dark:bg-black/40
          border-black/20 dark:border-white/20
          hover:scale-105 transition
        "
      >
        💡 Hint
      </button>

      {hint && (
        <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
          Hint: {hint}
        </p>
      )}

      {/* Input */}
      <div className="mt-8 w-full max-w-xl flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Decode the Morse sound..."
          className="
            flex-1 border px-4 py-3 rounded-l-md bg-white/70 dark:bg-black/40
            border-black/20 dark:border-white/20 outline-none
          "
        />
        <button
          onClick={handleSubmit}
          className="
            bg-black text-white dark:bg-white dark:text-black 
            px-6 py-3 rounded-r-md hover:scale-105 transition
          "
        >
          ✓
        </button>
      </div>

      {/* Stats */}
      <div className="
        mt-10 grid grid-cols-2 md:grid-cols-4 gap-4
        w-full max-w-3xl 
        bg-white/70 dark:bg-black/30 backdrop-blur-xl 
        rounded-xl border border-black/10 dark:border-white/10
        py-6
      ">

        <div>
          <p className="text-xs opacity-60">Accuracy</p>
          <p className="text-xl font-semibold">{accuracy}%</p>
        </div>

        <div>
          <p className="text-xs opacity-60">Round</p>
          <p className="text-xl font-semibold">{round}</p>
        </div>

        <div>
          <p className="text-xs opacity-60">Streak</p>
          <p className={`text-xl font-semibold transition ${streak >= 3 ? "text-green-600 scale-110" : ""}`}>
            {streak}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="
              bg-black text-white dark:bg-white dark:text-black 
              rounded-md px-4 py-2 text-sm hover:scale-105 transition
            "
          >
            🔁 Reset
          </button>
        </div>
      </div>

      {/* History */}
      <div className="
        mt-10 w-full max-w-3xl
        bg-white/70 dark:bg-black/30 backdrop-blur-xl
        p-6 rounded-xl border border-black/10 dark:border-white/10
      ">
        <h3 className="text-lg font-semibold mb-3">Last 5 Attempts</h3>

        {history.length === 0 && (
          <p className="text-sm opacity-60">No attempts yet.</p>
        )}

        {history.map((entry, i) => (
          <p key={i} className="text-sm my-1">
            {entry.text} →
            <span className={entry.correct ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
              {entry.correct ? "Correct" : "Wrong"}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
