import { useState } from "react";

export default function TextToMorse() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");

  const morseCodeMap = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.",
    g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..",
    m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
    s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
    y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---",
    "3": "...--", "4": "....-", "5": ".....", "6": "-....",
    "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "/": "-..-.",
    "@": ".--.-.", " ": "/"
  };

  const convertToMorse = () => {
    const result = text
      .toLowerCase()
      .split("")
      .map((char) => morseCodeMap[char] || "")
      .join(" ");
    setMorse(result);
  };

  const playMorse = () => {
    let unit = 150;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;

    morse.split("").forEach((symbol) => {
      if (symbol === ".") {
        const o = ctx.createOscillator();
        o.connect(ctx.destination);
        o.start(t);
        o.stop((t += unit / 1000));
        t += unit / 1000;
      } else if (symbol === "-") {
        const o = ctx.createOscillator();
        o.connect(ctx.destination);
        o.start(t);
        o.stop((t += (unit * 3) / 1000));
        t += unit / 1000;
      } else {
        t += (unit * 2) / 1000;
      }
    });
  };

  const clearAll = () => {
    setText("");
    setMorse("");
  };

  const copyMorse = () => {
    navigator.clipboard.writeText(morse);
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-black dark:text-white">
        Text to Morse
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-5xl">
        {/* Input Box */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="w-full md:w-1/2 h-32 p-4 border border-black/40 dark:border-white/40 bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-md text-black dark:text-white outline-none resize-none placeholder-gray-500 dark:placeholder-gray-400"
        ></textarea>

        {/* Output Box */}
        <div className="relative w-full md:w-1/2 h-32 border border-black/40 dark:border-white/40 bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-md p-4 text-left overflow-y-auto text-black dark:text-white">
          {morse || " "}
          {morse && (
            <button
              onClick={copyMorse}
              className="absolute top-2 right-2 text-xs px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-sm transition-all duration-300 hover:opacity-80"
            >
              COPY
            </button>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={convertToMorse}
          className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-sm font-semibold hover:scale-105 transition-all duration-300"
        >
          CONVERT
        </button>
        <button
          onClick={playMorse}
          className="px-6 py-2 border border-black dark:border-white text-black dark:text-white rounded-sm font-semibold hover:scale-105 transition-all duration-300"
        >
          PLAY
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 border border-black dark:border-white text-black dark:text-white rounded-sm font-semibold hover:scale-105 transition-all duration-300"
        >
          DELETE
        </button>
      </div>

      <div className="w-full max-w-5xl border-t border-black/20 dark:border-white/20 mt-10"></div>
    </section>
  );
}
