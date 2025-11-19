import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] overflow-hidden px-6 select-none">

      {/* Background glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-transparent to-pink-100/10 dark:from-blue-900/10 dark:to-pink-800/10 blur-3xl pointer-events-none"></div>

      {/* Floating Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl backdrop-blur-xl bg-white/30 dark:bg-white/5 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-10 transition-all duration-500 hover:shadow-xl hover:scale-[1.015] overflow-hidden"
      >
        {/* Animated Subtle Morse Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.25)_0px,rgba(255,255,255,0.25)_2px,transparent_2px,transparent_8px)] animate-[pulse_6s_ease-in-out_infinite]"></div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-5xl md:text-6xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        >
          Learn Morse Code Effortlessly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="relative text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
        >
          Convert, practice, and master Morse Code visually and interactively.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative flex flex-wrap gap-4 justify-center"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-black to-gray-700 text-white font-medium shadow-md transition-all duration-300"
          >
            Get Started
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-full bg-white/40 dark:bg-gray-800/40 border border-white/20 text-black dark:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-md"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Soft glowing orbs */}
      <div className="absolute -top-24 -left-16 w-72 h-72 bg-gradient-to-br from-gray-300/20 to-white/10 dark:from-gray-700/20 dark:to-black/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tl from-gray-400/20 to-white/10 dark:from-gray-800/20 dark:to-black/10 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
}
