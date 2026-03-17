"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitch, setGlitch] = useState(false);

  // Random glitch trigger
  useEffect(() => {
    const trigger = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120 + Math.random() * 180);
    };
    const schedule = () => {
      setTimeout(() => { trigger(); schedule(); }, 2500 + Math.random() * 4000);
    };
    schedule();
  }, []);

  // Anti-gravity particle field (particles float UPWARD)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    type Particle = {
      x: number; y: number;
      vy: number; vx: number;
      size: number; alpha: number;
      color: string; char: string;
    };

    const CHARS = "01アイウエオカキクケコサシスセソABCDEF><[]{}=_";
    const COLORS = ["#00ff9f", "#00e5ff", "#b388ff", "#69ff47", "#00b0ff"];

    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: -(0.3 + Math.random() * 0.8), // UP
        vx: (Math.random() - 0.5) * 0.3,
        size: 10 + Math.random() * 8,
        alpha: 0.08 + Math.random() * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      });
    }

    let raf: number;
    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      t++;

      // Scanlines
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, y, W, 1);
      }

      // Grid lines
      ctx.strokeStyle = "rgba(0,255,159,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Particles floating up
      for (const p of particles) {
        if (t % 40 === 0) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <main style={{
      position: "relative",
      minHeight: "100vh",
      background: "linear-gradient(160deg, #050d0a 0%, #020810 50%, #0a0505 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
      }} />

      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,255,159,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 32, textAlign: "center", padding: "0 24px",
      }}>

        {/* Terminal prompt line */}
        <div style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(0,255,159,0.5)",
          animation: "fadeSlide 0.8s ease both",
        }}>
          root@ottto:~$ <span style={{ animation: "blink 1s step-end infinite", color: "#00ff9f" }}>▌</span>
        </div>

        {/* LOGO — thick, heavy, characterful */}
        <div style={{ position: "relative", animation: "fadeSlide 0.9s 0.1s ease both", opacity: 0 }}>
          {/* Glitch layers */}
          {glitch && <>
            <div style={{
              position: "absolute", inset: 0, zIndex: -1,
              animation: "none",
              transform: `translate(${Math.random() * 8 - 4}px, 0)`,
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "2px #ff003c",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(90px, 18vw, 160px)",
              letterSpacing: "-4px",
              lineHeight: 1,
              opacity: 0.7,
            }}>ottto</div>
            <div style={{
              position: "absolute", inset: 0, zIndex: -1,
              transform: `translate(${Math.random() * -6 + 3}px, 2px)`,
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "2px #00e5ff",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(90px, 18vw, 160px)",
              letterSpacing: "-4px",
              lineHeight: 1,
              opacity: 0.5,
            }}>ottto</div>
          </>}

          <div style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(90px, 18vw, 160px)",
            letterSpacing: "-4px",
            lineHeight: 1,
            color: "#ffffff",
            textShadow: "0 0 40px rgba(0,255,159,0.3), 0 0 80px rgba(0,255,159,0.1)",
            position: "relative",
          }}>
            ottto
          </div>

          {/* Underline bar */}
          <div style={{
            marginTop: 8,
            height: 3,
            background: "linear-gradient(to right, transparent, #00ff9f, #00e5ff, transparent)",
            borderRadius: 2,
            opacity: 0.8,
          }} />
        </div>

        {/* Catchphrase */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          animation: "fadeSlide 1s 0.4s ease both", opacity: 0,
        }}>
          <p style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(11px, 2vw, 14px)",
            letterSpacing: "0.4em",
            color: "#00ff9f",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(0,255,159,0.5)",
          }}>
            The most extreme agentic lab on earth
          </p>
          <p style={{
            fontFamily: "monospace",
            fontWeight: 400,
            fontSize: "clamp(9px, 1.5vw, 11px)",
            letterSpacing: "0.25em",
            color: "rgba(0,229,255,0.5)",
            textTransform: "uppercase",
          }}>
            // we build · we break · we ship agents
          </p>
        </div>

        {/* Status badges */}
        <div style={{
          display: "flex", gap: 12,
          animation: "fadeSlide 1s 0.6s ease both", opacity: 0,
        }}>
          {["ONLINE", "BUILDING", "SHIPPING"].map((s, i) => (
            <div key={i} style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              padding: "4px 10px",
              border: "1px solid rgba(0,255,159,0.2)",
              color: "rgba(0,255,159,0.5)",
              borderRadius: 2,
              background: "rgba(0,255,159,0.04)",
            }}>
              {i === 0 && <span style={{ marginRight: 5, color: "#00ff9f", animation: "blink 1.2s step-end infinite" }}>●</span>}
              {s}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
