import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [, setCurrent] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("white");
  const [hovering, setHovering] = useState(false);

  // Mouse move + color detection
  useEffect(() => {
    const handleMove = (e) => {
      setTarget({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const isHoverable = ["A", "BUTTON", "INPUT", "TEXTAREA"].includes(
        element.tagName
      );
      setHovering(isHoverable);

      const computed = getComputedStyle(element);
      const bg = computed.backgroundColor.match(/\d+/g);
      if (bg) {
        const [r, g, b] = bg.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setColor(brightness > 128 ? "black" : "white");
      } else {
        const isDark = document.documentElement.classList.contains("dark");
        setColor(isDark ? "white" : "black");
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Smooth following motion
  useEffect(() => {
    let rafId;
    const speed = 0.12;

    const follow = () => {
      setCurrent((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const newX = prev.x + dx * speed;
        const newY = prev.y + dy * speed;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
          cursorRef.current.style.backgroundColor = color;
          cursorRef.current.style.boxShadow =
            color === "white"
              ? "0 0 20px rgba(255,255,255,0.4)"
              : "0 0 20px rgba(0,0,0,0.3)";
          cursorRef.current.style.width = hovering ? "38px" : "26px";
          cursorRef.current.style.height = hovering ? "38px" : "26px";
          cursorRef.current.style.filter = hovering
            ? "blur(2px) brightness(1.2)"
            : "blur(0)";
        }

        return { x: newX, y: newY };
      });
      rafId = requestAnimationFrame(follow);
    };

    follow();
    return () => cancelAnimationFrame(rafId);
  }, [target, color, hovering]);

  // Ripple pulse effect
  useEffect(() => {
    const handleClick = () => {
      if (!cursorRef.current || !rippleRef.current) return;

      rippleRef.current.classList.remove("active");
      void rippleRef.current.offsetWidth; // reflow for restart
      rippleRef.current.classList.add("active");
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        id="cursor-glow"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          pointerEvents: "none",
          mixBlendMode: "difference",
          zIndex: 9999,
          opacity: 0.95,
          transition:
            "background-color 0.3s ease, box-shadow 0.3s ease, width 0.3s ease, height 0.3s ease, filter 0.3s ease",
        }}
      />
      <div id="cursor-ripple" ref={rippleRef}></div>
    </>
  );
}