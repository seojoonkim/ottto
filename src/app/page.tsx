"use client";

import { useEffect, useRef, useState } from "react";

const GREEN = "#00ff9f";
const CYAN = "#00e5ff";
const DIM = "rgba(0,255,159,0.35)";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitch, setGlitch] = useState(false);
  const [litLetters, setLitLetters] = useState<boolean[]>([false,false,false,false,false]);
  const [allLit, setAllLit] = useState(false);
  const [typed, setTyped] = useState("");
  const [uptime, setUptime] = useState("00:00:00");
  const [memUsage] = useState((Math.random() * 30 + 55).toFixed(1));

  // Typewriter effect for command line
  const CMD = "initialize --mode=agentic --level=extreme";
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(CMD.slice(0, ++i));
      if (i >= CMD.length) clearInterval(iv);
    }, 45);
    return () => clearInterval(iv);
  }, []);

  // Uptime counter
  useEffect(() => {
    let s = 0;
    const iv = setInterval(() => {
      s++;
      const h = String(Math.floor(s / 3600)).padStart(2, "0");
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const sec = String(s % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${sec}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Glitch
  useEffect(() => {
    const schedule = () => {
      setTimeout(() => {
        setGlitch(true);
        setTimeout(() => { setGlitch(false); schedule(); }, 100 + Math.random() * 150);
      }, 3000 + Math.random() * 5000);
    };
    schedule();
  }, []);

  // Letter-by-letter light up sequence
  useEffect(() => {
    const STEP = 180; // ms per letter
    const HOLD = 1200; // ms hold fully lit
    const PAUSE = 1800; // ms dark pause before restart

    function runCycle() {
      // Light up one by one
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          setLitLetters(prev => { const n=[...prev]; n[i]=true; return n; });
          if (i === 4) {
            // All lit — show outline
            setTimeout(() => setAllLit(true), 60);
            // Hold then reset
            setTimeout(() => {
              setAllLit(false);
              setLitLetters([false,false,false,false,false]);
              setTimeout(runCycle, PAUSE);
            }, HOLD);
          }
        }, i * STEP);
      }
    }
    const t = setTimeout(runCycle, 600);
    return () => clearTimeout(t);
  }, []);

  // Anti-gravity particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const CHARS = "01アイウエ><[]{}=_▲▼◆●⬡⬢∞";
    const COLORS = [GREEN, CYAN, "#b388ff", "#69ff47"];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vy: -(0.25 + Math.random() * 0.7),
      vx: (Math.random() - 0.5) * 0.25,
      size: 9 + Math.random() * 7,
      alpha: 0.06 + Math.random() * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      t: 0,
    }));

    let raf: number, frame = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Scanlines
      for (let y = 0; y < H; y += 3) { ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.fillRect(0, y, W, 1); }

      // Particles
      for (const p of particles) {
        if (frame % 35 === 0) p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        p.y += p.vy; p.x += p.vx;
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

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <main style={{ position:"relative", minHeight:"100vh", background:"linear-gradient(160deg,#050d0a 0%,#020810 55%,#0a0505 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden", fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, pointerEvents:"none" }} />

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.8) 100%)" }} />
      {/* Center glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(700px,90vw)", height:400, borderRadius:"50%", background:`radial-gradient(ellipse, rgba(0,255,159,0.055) 0%, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:0, textAlign:"center", padding:"0 16px", width:"100%" }}>

        {/* ── Top status bar ── */}
        <div style={{ display:"flex", gap:"clamp(8px,3vw,24px)", marginBottom:32, flexWrap:"wrap", justifyContent:"center", animation:"fadeSlide 0.6s ease both" }}>
          {[
            { label:"SYS", value:"ONLINE" },
            { label:"MODE", value:"AGENTIC" },
            { label:"UPTIME", value:uptime },
            { label:"MEM", value:`${memUsage}%` },
          ].map((item, i) => (
            <div key={i} style={{ fontFamily:"monospace", fontSize:"clamp(9px,2vw,11px)", letterSpacing:"0.15em", padding:"4px 10px", border:`1px solid ${DIM}`, borderRadius:3, background:"rgba(0,255,159,0.04)", color:DIM, display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ color:"rgba(0,255,159,0.25)" }}>{item.label}</span>
              <span style={{ color: item.label === "SYS" ? GREEN : DIM }}>{item.value}</span>
              {item.label === "SYS" && <span style={{ color:GREEN, animation:"blink 1s step-end infinite", fontSize:8 }}>●</span>}
            </div>
          ))}
        </div>

        {/* ── LOGO ── */}
        <div style={{ position:"relative", animation:"fadeSlide 0.8s 0.15s ease both", opacity:0 }}>
          {/* Glitch layers */}
          {glitch && <>
            <div style={{ position:"absolute", inset:0, fontFamily:"'Inter','Arial Black',sans-serif", fontWeight:900, fontSize:"clamp(96px,20vw,148px)", letterSpacing:"-3px", lineHeight:1, color:"transparent", WebkitTextStroke:"2px #ff003c", transform:`translate(${(Math.random()*8-4).toFixed(1)}px,0)`, opacity:0.6 }}>ottto</div>
            <div style={{ position:"absolute", inset:0, fontFamily:"'Inter','Arial Black',sans-serif", fontWeight:900, fontSize:"clamp(96px,20vw,148px)", letterSpacing:"-3px", lineHeight:1, color:"transparent", WebkitTextStroke:"2px #00e5ff", transform:`translate(${(Math.random()*-6+3).toFixed(1)}px,2px)`, opacity:0.45 }}>ottto</div>
          </>}
          <div style={{ fontWeight:900, fontSize:"clamp(96px,20vw,148px)", letterSpacing:"-3px", lineHeight:1, display:"flex", justifyContent:"center", fontFamily:"'Inter', Arial Black, sans-serif" }}>
            {"ottto".split("").map((ch, i) => (
              <span key={i} style={{
                display:"inline-block",
                transition:"opacity 0.15s ease, text-shadow 0.2s ease, color 0.15s ease",
                color: litLetters[i] ? "#fff" : "rgba(255,255,255,0.08)",
                textShadow: allLit
                  ? `0 0 30px rgba(0,255,159,0.9), 0 0 60px rgba(0,255,159,0.5), 0 0 100px rgba(0,255,159,0.25)`
                  : litLetters[i]
                  ? `0 0 20px rgba(0,255,159,0.6), 0 0 40px rgba(0,255,159,0.3)`
                  : "none",
                WebkitTextStroke: allLit ? `1px rgba(0,255,159,0.8)` : "none",
              }}>{ch}</span>
            ))}
          </div>
          {/* Underline */}
          <div style={{ marginTop:6, height:2, background:`linear-gradient(to right, transparent, ${GREEN}, ${CYAN}, transparent)`, borderRadius:2, animation:"underlineGlow 3s ease-in-out infinite" }} />
        </div>

        {/* ── Terminal command line ── */}
        <div style={{ marginTop:28, fontFamily:"monospace", fontSize:"clamp(10px,2.5vw,13px)", color:DIM, letterSpacing:"0.08em", animation:"fadeSlide 0.8s 0.3s ease both", opacity:0 }}>
          <span style={{ color:"rgba(0,255,159,0.25)" }}>root@ottto</span>
          <span style={{ color:"rgba(0,255,159,0.15)" }}>:~$ </span>
          <span style={{ color:GREEN }}>{typed}</span>
          <span style={{ animation:"blink 0.8s step-end infinite", color:GREEN }}>▌</span>
        </div>

        {/* ── Divider ── */}
        <div style={{ width:1, height:28, background:`linear-gradient(to bottom,transparent,${DIM},transparent)`, margin:"20px 0", animation:"fadeSlide 0.8s 0.4s ease both", opacity:0 }} />

        {/* ── Catchphrase ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"fadeSlide 0.9s 0.5s ease both", opacity:0 }}>
          <p style={{ fontWeight:700, fontSize:"clamp(10px,2.5vw,13px)", letterSpacing:"0.38em", color:GREEN, textTransform:"uppercase", textShadow:`0 0 20px rgba(0,255,159,0.4)`, margin:0 }}>
            The most extreme agentic lab on earth
          </p>
          <p style={{ fontFamily:"monospace", fontWeight:400, fontSize:"clamp(9px,1.8vw,11px)", letterSpacing:"0.2em", color:`rgba(0,229,255,0.45)`, textTransform:"uppercase", margin:0 }}>
            // we build · we break · we ship agents
          </p>
        </div>

        {/* ── Mini terminal log ── */}
        <div style={{ marginTop:28, fontFamily:"monospace", fontSize:"clamp(8px,1.8vw,10px)", color:"rgba(0,255,159,0.22)", letterSpacing:"0.08em", lineHeight:1.9, textAlign:"left", animation:"fadeSlide 1s 0.7s ease both", opacity:0, maxWidth:320, width:"100%" }}>
          {[
            "[OK]  agent runtime initialized",
            "[OK]  deploying experimental builds",
            "[~~]  breaking things intentionally",
            "[>>]  shipping to production...",
          ].map((line, i) => (
            <div key={i} style={{ color: i === 2 ? "rgba(255,100,100,0.35)" : i === 3 ? `rgba(0,229,255,0.35)` : "rgba(0,255,159,0.22)" }}>
              {line}
            </div>
          ))}
        </div>



      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }
        @keyframes breathe {
          0%,100% { opacity:1;    text-shadow:0 0 50px rgba(0,255,159,0.4),0 0 100px rgba(0,255,159,0.15); }
          35%     { opacity:0.12; text-shadow:none; }
          55%     { opacity:0.06; text-shadow:none; }
          75%     { opacity:0.65; text-shadow:0 0 30px rgba(0,255,159,0.2); }
        }
        @keyframes underlineGlow {
          0%   { opacity:0.15; background-size:30% 100%; background-position:0% center; }
          40%  { opacity:0.9;  background-size:100% 100%; background-position:50% center; }
          70%  { opacity:0.5;  background-size:60% 100%; background-position:100% center; }
          100% { opacity:0.15; background-size:30% 100%; background-position:0% center; }
        }
        @media (max-width:480px) {
          main { padding:24px 0; }
        }
      `}</style>
    </main>
  );
}
