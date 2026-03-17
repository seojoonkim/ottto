"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; r: number;
      vx: number; vy: number; alpha: number; va: number;
    }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        va: (Math.random() - 0.5) * 0.005,
      });
    }

    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.va;
        if (p.alpha < 0.05) p.va = Math.abs(p.va);
        if (p.alpha > 0.6) p.va = -Math.abs(p.va);
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 160, 255, ${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#07050F]">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2a1a5e] opacity-20 blur-[120px]" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-[#1a0a3e] opacity-15 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[250px] w-[250px] rounded-full bg-[#0d1a4a] opacity-20 blur-[80px]" />
      </div>

      {/* 파티클 캔버스 */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* SVG 로고 */}
        <div className="logo-float">
          <svg
            viewBox="0 0 320 90"
            width="320"
            height="90"
            xmlns="http://www.w3.org/2000/svg"
            className="select-none"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text
              x="50%"
              y="72"
              textAnchor="middle"
              fill="url(#logoGrad)"
              filter="url(#glow)"
              style={{
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive",
                fontSize: "72px",
                fontWeight: "bold",
                letterSpacing: "8px",
              }}
            >
              ottto
            </text>
          </svg>
        </div>

        {/* 구분선 */}
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />

        {/* 캐치프레이즈 */}
        <div className="catchphrase max-w-sm space-y-2">
          <p className="text-sm font-light tracking-[0.25em] text-purple-200 opacity-80 uppercase">
            where agents go feral
          </p>
          <p className="text-xs text-purple-300 opacity-50 tracking-widest">
            극단적으로 agentic한 실험과 빌딩이 일어나는 곳
          </p>
        </div>

        {/* 점 3개 장식 */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="dot-pulse h-1 w-1 rounded-full bg-purple-400 opacity-60"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .logo-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .catchphrase {
          animation: fadeIn 2s ease-in forwards;
          opacity: 0;
          animation-delay: 0.5s;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .dot-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </main>
  );
}
