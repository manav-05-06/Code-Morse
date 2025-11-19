import { useState, useRef } from "react";

export default function TextToMorse() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPlaying] = useState(false); // no visualizer
  const outputRef = useRef(null);

  const morseCodeMap = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.",
    g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..",
    m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
    s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
    y: "-.--", z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..",
    "/": "-..-.", "@": ".--.-.",
    " ": "/",
  };

  // Convert text → Morse
  const convertToMorse = () => {
    const result = text
      .toLowerCase()
      .split("")
      .map((c) => morseCodeMap[c] || "")
      .join(" ")
      .trim();

    setMorse(result);

    // FIXED: No optional chaining in assignment
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 50);
  };

  // Play Morse audio
  const playMorse = () => {
    if (!morse) return;

    const unit = 120;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;

    const beep = (dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 650;

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + dur / 1000);

      osc.start(t);
      osc.stop((t += dur / 1000));
      t += unit / 1500;
    };

    morse.split("").forEach((symbol) => {
      if (symbol === ".") beep(unit);
      else if (symbol === "-") beep(unit * 3);
      else t += (unit * 2) / 1000;
    });

    ctx.close();
  };

  // WAV generator
  const generateSamples = (str, sampleRate = 44100, unitMs = 120) => {
    const freq = 650;
    const unitSamples = Math.floor((unitMs / 1000) * sampleRate);
    const gapSamples = unitSamples;

    let total = 0;
    for (const s of str) {
      if (s === ".") total += unitSamples + gapSamples;
      else if (s === "-") total += unitSamples * 3 + gapSamples;
      else total += unitSamples * 2;
    }

    const samples = new Float32Array(total);
    let idx = 0;

    for (const s of str) {
      const toneLen = s === "." ? unitSamples : s === "-" ? unitSamples * 3 : 0;

      if (toneLen > 0) {
        for (let i = 0; i < toneLen; i++, idx++) {
          samples[idx] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.6;
        }
        for (let i = 0; i < gapSamples; i++, idx++) samples[idx] = 0;
      } else {
        for (let i = 0; i < unitSamples * 2; i++, idx++) samples[idx] = 0;
      }
    }

    return samples;
  };

  const encodeWav = (samples, sampleRate = 44100) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    writeStr(36, "data");
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s * 0x7fff, true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  const downloadWav = () => {
    if (!morse.trim()) return;
    const samples = generateSamples(morse);
    const wav = encodeWav(samples);
    const url = URL.createObjectURL(wav);

    const a = document.createElement("a");
    a.href = url;
    a.download = "text-to-morse.wav";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setText("");
    setMorse("");
    setCopied(false);
  };

  const copyMorse = () => {
    navigator.clipboard.writeText(morse).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-black dark:text-white">
        Text to Morse
      </h2>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">

        {/* Input Box */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="
            w-full md:w-1/2 h-40 p-4 rounded-lg resize-none
            border border-black/40 dark:border-white/40
            bg-white/40 dark:bg-black/30 backdrop-blur-md
            text-black dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 ring-black/40 dark:ring-white/40
            transition-all
          "
        />

        {/* Output Box */}
        <div
          ref={outputRef}
          className="
            w-full md:w-1/2 h-40 rounded-lg p-4 relative overflow-y-auto
            border border-black/40 dark:border-white/40
            bg-white/40 dark:bg-black/30 backdrop-blur-md
            text-black dark:text-white text-left
          "
        >
          {morse || (
            <span className="text-gray-400 dark:text-gray-500">
              Morse output will appear here...
            </span>
          )}

          {morse && (
            <button
              onClick={copyMorse}
              className="
                absolute top-2 right-2 px-3 py-1 text-xs rounded-md
                bg-black dark:bg-white text-white dark:text-black
                hover:scale-105 active:scale-95 transition-all
              "
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center mt-6">
        <button
          onClick={convertToMorse}
          className="
            px-6 py-2 rounded-md font-semibold
            bg-black text-white dark:bg-white dark:text-black
            hover:scale-105 active:scale-95 transition-all
          "
        >
          CONVERT
        </button>

        <button
          onClick={playMorse}
          disabled={!morse}
          className="
            px-6 py-2 rounded-md font-semibold
            border border-black dark:border-white
            text-black dark:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95 transition-all
          "
        >
          PLAY
        </button>

        <button
          onClick={downloadWav}
          disabled={!morse}
          className="
            px-6 py-2 rounded-md font-semibold
            border border-black dark:border-white
            text-black dark:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95 transition-all
          "
        >
          DOWNLOAD .WAV
        </button>

        <button
          onClick={clearAll}
          className="
            px-5 py-2 rounded-md font-semibold
            border border-black dark:border-white
            text-black dark:text-white
            hover:scale-105 active:scale-95 transition-all
          "
        >
          DELETE
        </button>
      </div>

      <div className="w-full max-w-5xl border-t border-black/20 dark:border-white/20 mt-10"></div>
    </section>
  );
}
