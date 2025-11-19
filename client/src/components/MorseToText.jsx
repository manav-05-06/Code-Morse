import { useState, useRef } from "react";

export default function MorseToText() {
  const [morse, setMorse] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const outputRef = useRef(null);

  const morseCodeMap = {
    ".-": "a", "-...": "b", "-.-.": "c", "-..": "d", ".": "e", "..-.": "f",
    "--.": "g", "....": "h", "..": "i", ".---": "j", "-.-": "k", ".-..": "l",
    "--": "m", "-.": "n", "---": "o", ".--.": "p", "--.-": "q", ".-.": "r",
    "...": "s", "-": "t", "..-": "u", "...-": "v", ".--": "w", "-..-": "x",
    "-.--": "y", "--..": "z",
    "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4",
    ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9",
    "/": " "
  };

  // Convert Morse → Text
  const convertToText = () => {
    const result = morse
      .trim()
      .split(" ")
      .map((code) => morseCodeMap[code] || "")
      .join("");

    setText(result);

    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 50);
  };

  // Play Morse sound
  const playMorse = () => {
    if (!morse) return;

    const unit = 120;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;

    const beep = (dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = 650;
      gain.gain.setValueAtTime(0.6, t);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur / 1000);
      t += dur / 1000;
      t += unit / 1500; // small spacing
    };

    morse.split("").forEach((symbol) => {
      if (symbol === ".") beep(unit);
      else if (symbol === "-") beep(unit * 3);
      else t += (unit * 2) / 1000;
    });

    setTimeout(() => ctx.close(), morse.length * unit * 3 + 300);
  };

  const clearAll = () => {
    setMorse("");
    setText("");
    setCopied(false);
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  // Generate WAV samples
  const generateMorseSamples = (morseString, sampleRate = 44100, unitMs = 120) => {
    const freq = 650;
    const unitSamples = Math.floor((unitMs / 1000) * sampleRate);
    const gapSamples = unitSamples;

    let total = 0;
    for (const ch of morseString) {
      if (ch === ".") total += unitSamples + gapSamples;
      else if (ch === "-") total += unitSamples * 3 + gapSamples;
      else total += unitSamples * 2;
    }

    const samples = new Float32Array(total || 1);
    let idx = 0;

    for (const ch of morseString) {
      if (ch === "." || ch === "-") {
        const toneLen = ch === "." ? unitSamples : unitSamples * 3;

        for (let i = 0; i < toneLen; i++, idx++) {
          samples[idx] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.6;
        }

        for (let i = 0; i < gapSamples; i++, idx++) {
          samples[idx] = 0; // FIXED INDEX BUG
        }
      } else {
        for (let i = 0; i < unitSamples * 2; i++, idx++) {
          samples[idx] = 0;
        }
      }
    }

    return samples;
  };

  const encodeWAV = (samples, sr = 44100) => {
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
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let s of samples) {
      const clamped = Math.max(-1, Math.min(1, s));
      view.setInt16(offset, clamped * 0x7fff, true);
      offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  const downloadWav = () => {
    if (!morse.trim()) return;

    const samples = generateMorseSamples(morse);
    const wav = encodeWAV(samples);
    const url = URL.createObjectURL(wav);

    const a = document.createElement("a");
    a.href = url;
    a.download = "morse-code.wav";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-black dark:text-white">
        Morse to Text
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-5xl">

        {/* Input Box */}
        <textarea
          value={morse}
          onChange={(e) => setMorse(e.target.value)}
          placeholder="Enter Morse code (use spaces between symbols)..."
          className="
            w-full md:w-1/2 h-40 p-4
            border border-black/40 dark:border-white/40
            bg-white/40 dark:bg-black/30 backdrop-blur-md
            rounded-lg outline-none resize-none
            text-black dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 ring-black/40 dark:ring-white/40
            transition-all duration-300
          "
        />

        {/* Output Box */}
        <div
          ref={outputRef}
          className="
            relative w-full md:w-1/2 h-40 p-4 overflow-y-auto
            border border-black/40 dark:border-white/40
            bg-white/40 dark:bg-black/30 backdrop-blur-md
            rounded-lg text-left text-black dark:text-white
          "
        >
          {text || (
            <span className="text-gray-400 dark:text-gray-500">
              Converted text will appear here...
            </span>
          )}

          {text && (
            <button
              onClick={copyText}
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
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        <button
          onClick={convertToText}
          className="
            px-6 py-2 bg-black text-white
            dark:bg-white dark:text-black rounded-md font-semibold
            hover:scale-105 active:scale-95 transition-all
          "
        >
          CONVERT
        </button>

        <button
          onClick={playMorse}
          disabled={!morse}
          className="
            px-6 py-2 border border-black dark:border-white
            text-black dark:text-white rounded-md font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95 transition-all
          "
        >
          PLAY
        </button>

        <button
          onClick={downloadWav}
          disabled={!morse.trim()}
          className="
            px-6 py-2 border border-black dark:border-white
            text-black dark:text-white rounded-md font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:scale-105 active:scale-95 transition-all
          "
        >
          DOWNLOAD .WAV
        </button>

        <button
          onClick={clearAll}
          className="
            px-5 py-2 border border-black dark:border-white
            text-black dark:text-white rounded-md font-semibold
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
