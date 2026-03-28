"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SWAP_WORDS = [
  { line: "sound", swap: "resound" },
  { line: "sound", swap: "astound" },
  { line: "you", swap: "true" },
];

function HeroHeadline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const [swapIndex, setSwapIndex] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setSwapIndex((i) => (i + 1) % SWAP_WORDS.length);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.12);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.12);
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }
      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };
    currentPos.current = { x, y };
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const currentSwap = SWAP_WORDS[swapIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "none", userSelect: "none" }}
    >
      <h1 className="t-hero" style={{ marginBottom: 0, textAlign: "center" }}>
        Captions that<br />
        <em>actually</em>{" "}
        <span style={{ position: "relative", display: "inline-block", minWidth: "2ch" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSwap.line + currentSwap.swap + swapIndex}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block" }}
            >
              {currentSwap.line}
            </motion.span>
          </AnimatePresence>
        </span>
        <br />like you.
      </h1>

      {/* Magnetic cursor reveal circle */}
      <div
        ref={circleRef}
        style={{
          position: "absolute", top: 0, left: 0, pointerEvents: "none",
          borderRadius: "50%", background: "var(--text-1)", overflow: "hidden",
          width: isHovered ? 130 : 0, height: isHovered ? 130 : 0,
          transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height", zIndex: 20,
        }}
      >
        <div
          ref={innerTextRef}
          style={{
            position: "absolute", display: "flex", alignItems: "center", justifyContent: "center",
            width: containerSize.width, height: containerSize.height,
            top: "50%", left: "50%", willChange: "transform",
          }}
        >
          <span className="t-hero" style={{ color: "var(--bg)", WebkitTextFillColor: "var(--bg)", whiteSpace: "nowrap", textAlign: "center" }}>
            Captions that<br />
            <em>actually</em> {currentSwap.swap}<br />
            like you.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3, o: Math.random() * 0.25 + 0.05,
      });
    }
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,200,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200,200,200,${0.05 * (1 - d / 140)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);

  const langs = ["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "বাংলা", "ગુજરાતી", "मराठी", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ"];

  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 60 }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(200,200,200,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none", opacity: 0.4 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div className="anim-1" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <span className="label-tag">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--silver)", display: "inline-block" }} />
            SRT and VTT · 11 Indian Languages
          </span>
        </div>

        <div className="anim-2" style={{ marginBottom: 24 }}>
          <HeroHeadline />
        </div>

        <p className="anim-3" style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--text-2)", lineHeight: 1.65, letterSpacing: "-0.01em", maxWidth: 520, margin: "0 auto 40px", fontWeight: 400 }}>
          {"YouTube's auto-captions don't speak Telugu. They don't speak Hindi. They definitely don't speak Hinglish. SAYCAP does."}
        </p>

        <div className="anim-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            <span>Generate free captions</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn btn-ghost btn-lg">
            <span>See how it works</span>
          </a>
        </div>

        <p className="anim-5" style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: "-0.005em" }}>
          No account needed. 5 minutes free, forever.
        </p>

        <div className="anim-fade" style={{ marginTop: 64 }}>
          <div className="marquee-wrap" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div className="marquee-track">
              {[...langs, ...langs].map((lang, i) => (
                <div key={i} style={{ padding: "8px 18px", borderRadius: 980, border: "1px solid var(--border-mid)", background: "var(--glass-bg)", backdropFilter: "blur(12px)", fontSize: 14, color: "var(--text-2)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="anim-fade" style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 72px)", flexWrap: "wrap" }}>
          {[["11", "Indian languages"], ["SRT and VTT", "Both formats"], ["3 words", "Per caption block"], ["0", "Manual fixes needed"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, var(--bg))", pointerEvents: "none" }} />
    </section>
  );
}
