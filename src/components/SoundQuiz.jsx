import { useState, useEffect, useRef } from "react";

export default function SoundQuiz() {
  const [difficulty, setDifficulty] = useState("Letters");
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizTargetText, setQuizTargetText] = useState("");
  const [quizTargetMorse, setQuizTargetMorse] = useState("");

  const totalRounds = useRef(0);
  const correctAnswers = useRef(0);
  const audioCtx = useRef(null);
  const visualizerRef = useRef(null);
  const visualizerInterval = useRef(null);

  // Morse Dictionary
  const morseMap = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
    5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  };

  const letterKeys = Object.keys(morseMap);

  const wordList = ["HELLO", "WORLD", "MORSE", "QUIZ", "SIGNAL", "RADIO"];
  const sentenceList = [
    "HELLO WORLD",
    "MORSE CODE QUIZ",
    "I LOVE RADIO",
    "LEARN MORSE FAST",
  ];

  useEffect(() => {
    generateNewQuizItemWithoutAutoPlay();
  }, []);

  // --- QUIZ GENERATION ---
  const generateNewQuizItemWithoutAutoPlay = () => {
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
  };

  const generateNewRound = () => {
    setRound((r) => r + 1);
    generateNewQuizItemWithoutAutoPlay();
  };

  const textToMorse = (text) => {
    return text
      .toUpperCase()
      .split("")
      .map((ch) => (ch === " " ? "/" : morseMap[ch] || "?"))
      .join(" ");
  };

  // --- PLAY MORSE SOUND ---
  const playMorseSound = () => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx.current;
    const dot = 0.1 / speed;
    const dash = 0.3 / speed;
    const pause = 0.1 / speed;

    let time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, time);

    quizTargetMorse.split("").forEach((symbol) => {
      if (symbol === ".") {
        gain.gain.setValueAtTime(volume, time);
        time += dot;
        gain.gain.setValueAtTime(0, time);
      } else if (symbol === "-") {
        gain.gain.setValueAtTime(volume, time);
        time += dash;
        gain.gain.setValueAtTime(0, time);
      }
      time += pause;
    });
    osc.start();
    osc.stop(time);

    // Animate bars
    startVisualizer();
    setTimeout(stopVisualizer, (time - ctx.currentTime) * 1000);
  };

  // --- VISUALIZER ---
  const startVisualizer = () => {
    if (!visualizerRef.current) return;
    const bars = visualizerRef.current.querySelectorAll(".bar");
    visualizerInterval.current = setInterval(() => {
      bars.forEach((bar) => {
        bar.style.height = `${Math.random() * 30 + 10}px`;
      });
    }, 120);
  };

  const stopVisualizer = () => {
    if (visualizerInterval.current) {
      clearInterval(visualizerInterval.current);
      visualizerInterval.current = null;
    }
    if (visualizerRef.current) {
      const bars = visualizerRef.current.querySelectorAll(".bar");
      bars.forEach((bar) => (bar.style.height = "10px"));
    }
  };

  // --- CHECK ANSWER ---
  const handleSubmit = () => {
    totalRounds.current += 1;
    const correct = input.trim().toUpperCase() === quizTargetText;
    if (correct) {
      correctAnswers.current += 1;
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
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
    setInput("");
    generateNewQuizItemWithoutAutoPlay();
  };

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-black dark:text-white">
        Sound Quiz
      </h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-8 mt-6 items-center">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white dark:bg-black/40 dark:text-white"
          >
            <option>Letters</option>
            <option>Words</option>
            <option>Sentences</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            Speed
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-10">
        <button onClick={playMorseSound} className="border rounded-full p-4 text-xl">
          ▶️
        </button>
        <button onClick={generateNewRound} className="border rounded-full p-4 text-xl">
          ⏭
        </button>
      </div>

      {/* Visualizer */}
      <div
        ref={visualizerRef}
        className="visualizer-bars flex justify-center gap-1 mt-6 h-8 w-40"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="bar bg-black dark:bg-white w-1 rounded-md transition-all duration-100 ease-in-out"
            style={{ height: "10px" }}
          />
        ))}
      </div>

      {/* Input */}
      <div className="mt-8 w-full max-w-xl flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Decode the Morse sound..."
          className="flex-1 border px-4 py-3 rounded-l-md text-gray-800"
        />
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-3 rounded-r-md"
        >
          ✓
        </button>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl bg-gray-100 dark:bg-black/30 rounded-lg py-6">
        <div>
          <p className="text-xs text-gray-500">Accuracy</p>
          <p className="text-xl font-bold">{accuracy}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Round</p>
          <p className="text-xl font-bold">{round}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Streak</p>
          <p className="text-xl font-bold">{streak}</p>
        </div>
        <div>
          <button
            onClick={handleReset}
            className="bg-black text-white rounded-md px-4 py-2 text-sm"
          >
            🔁 Reset
          </button>
        </div>
      </div>
    </div>
  );
}
