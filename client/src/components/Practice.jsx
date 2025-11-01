import { useState, useEffect, useCallback } from "react";

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
  const [score, setScore] = useState(0);
  const [, setRound] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [feedback, setFeedback] = useState("");

  // Pick random letter
  const getRandomLetter = useCallback(() => {
    const letters = Object.keys(morseMap);
    const random = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(random);
    setUserInput("");
    setFeedback("");
  }, []);

  useEffect(() => {
    getRandomLetter();
  }, [getRandomLetter]);

  // Play Morse Sound
  const playMorseSound = useCallback(() => {
    if (!soundOn || !currentLetter) return;
    const code = morseMap[currentLetter];
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 120;
    let currentTime = audioCtx.currentTime;

    const playBeep = (duration) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.frequency.value = 600;
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration / 1000);
      currentTime += (duration + 100) / 1000;
    };

    for (const symbol of code) {
      if (symbol === ".") playBeep(dotDuration);
      else if (symbol === "-") playBeep(dotDuration * 3);
      currentTime += 0.1;
    }
  }, [soundOn, currentLetter]);

  const checkAnswer = () => {
    if (userInput.toUpperCase() === currentLetter) {
      setScore((s) => s + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`It was "${currentLetter}"`);
    }
    setRound((r) => r + 1);
  };

  const nextRound = () => getRandomLetter();

  return (
    
    <section className="min-h-screen flex flex-col items-center justify-center pt- px-4 py-10 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold mb-1 text-black dark:text-white">
        Practice
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
        (single letter/no symbol for now)
      </p>

      {/* Morse Display */}
      <div className="text-4xl font-mono text-black dark:text-white mb-6 tracking-widest">
        {morseMap[currentLetter]}
      </div>

      {/* Play Button */}
      <button
        onClick={playMorseSound}
        className="border border-black dark:border-white text-black dark:text-white px-8 py-2 mb-10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
      >
        PLAY
      </button>

      {/* Input + Check */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <input
          type="text"
          maxLength="1"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-16 h-16 text-center border border-black dark:border-white text-3xl rounded-none bg-transparent text-black dark:text-white"
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

      <hr className="w-4/5 border-gray-300 dark:border-gray-700 mb-8" />

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-4/5">
        <p className="text-gray-600 dark:text-gray-400 text-sm tracking-widest">
          SCORE: {score}/10
        </p>

        <button
          onClick={() => setSoundOn(!soundOn)}
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
