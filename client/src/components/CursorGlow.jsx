import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);

  const [target, setTarget] = useState({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [cursorColor, setCursorColor] = useState("white");

  // Track mouse movement + dynamic color
  useEffect(() => {
    const move = (e) => {
      setTarget({ x: e.clientX, y: e.clientY });

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const hoverable = ["A", "BUTTON", "INPUT", "TEXTAREA", "DIV"].includes(
        el.tagName
      );

      setHovering(hoverable);

      // Auto-detect brightness for cursor inversion
      const bg = getComputedStyle(el).backgroundColor.match(/\d+/g);

      if (bg) {
        const [r, g, b] = bg.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setCursorColor(brightness > 140 ? "black" : "white");
      } else {
        setCursorColor(
          document.documentElement.classList.contains("dark")
            ? "white"
            : "black"
        );
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Smooth following motion
  useEffect(() => {
    let frame;
    const speed = 0.14;

    const animate = () => {
      pos.current.x += (target.x - pos.current.x) * speed;
      pos.current.y += (target.y - pos.current.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
        cursorRef.current.style.backgroundColor = cursorColor;

        cursorRef.current.style.width = hovering ? "34px" : "24px";
        cursorRef.current.style.height = hovering ? "34px" : "24px";

        cursorRef.current.style.boxShadow = hovering
          ? `0 0 20px ${cursorColor === "white" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}`
          : `0 0 10px ${cursorColor === "white" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}`;

        cursorRef.current.style.filter = hovering ? "blur(1px)" : "blur(0)";
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [target, cursorColor, hovering]);

  // Ripple pulse on click
  useEffect(() => {
    const click = () => {
      if (!rippleRef.current) return;

      rippleRef.current.classList.remove("active");
      void rippleRef.current.offsetWidth;
      rippleRef.current.classList.add("active");
    };

    window.addEventListener("mousedown", click);
    return () => window.removeEventListener("mousedown", click);
  }, []);

  return (
    <>
      {/* Main glow cursor */}
      <div
        ref={cursorRef}
        id="cursor-glow"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          pointerEvents: "none",
          mixBlendMode: "difference",
          zIndex: 9999,
          transition:
            "background-color 0.3s, width 0.2s, height 0.2s, box-shadow 0.3s, filter 0.3s",
        }}
      />

      {/* Ripple click effect */}
      <div id="cursor-ripple" ref={rippleRef}></div>
    </>
  );
}
