"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid dot field
    const SPACING = 40;
    const dots: { x: number; y: number; base: number; val: number; speed: number }[] = [];

    for (let x = 0; x < width; x += SPACING) {
      for (let y = 0; y < height; y += SPACING) {
        dots.push({
          x: x + SPACING / 2,
          y: y + SPACING / 2,
          base: Math.random() * Math.PI * 2,
          val: 0,
          speed: 0.003 + Math.random() * 0.004,
        });
      }
    }

    let t = 0;
    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      t += 1;

      for (const d of dots) {
        const wave = Math.sin(d.base + t * d.speed + d.x * 0.008 + d.y * 0.005);
        const alpha = (wave + 1) / 2 * 0.25 + 0.03;
        const r = (wave + 1) / 2 * 1.5 + 0.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated dot grid */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* Subtle center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <svg
          viewBox="0 0 380 80"
          width="340"
          height="72"
          style={{ display: "block", animation: "fadeIn 1.2s ease forwards" }}
        >
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="62"
            textAnchor="middle"
            fill="url(#g)"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "80px",
              fontWeight: 200,
              letterSpacing: "24px",
            }}
          >
            ottto
          </text>
        </svg>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "fadeIn 1.4s ease forwards",
          }}
        />

        {/* Catchphrase */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            animation: "slideUp 1s 0.4s ease both",
            opacity: 0,
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(13px, 2.5vw, 16px)",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.85)",
              textTransform: "uppercase",
            }}
          >
            The most extreme agentic lab on earth.
          </p>
          <p
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(10px, 1.8vw, 12px)",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            We build. We break. We ship agents.
          </p>
        </div>

        {/* Three dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 4,
            animation: "slideUp 1s 0.7s ease both",
            opacity: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                animation: `blink 2s ${i * 0.4}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.4); }
        }
      `}</style>
    </main>
  );
}
