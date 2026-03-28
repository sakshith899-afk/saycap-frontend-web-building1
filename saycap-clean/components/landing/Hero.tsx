"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,113,133,${p.o})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(251,113,133,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const langs = ["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "বাংলা", "ગુજરાતી", "मराठी", "ਪੰਜਾਬੀ"];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(244,63,94,0.08) 0%, transparent 70%)",
      }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(251,113,133,0.08)",
              border: "1px solid rgba(251,113,133,0.2)",
              color: "#FB7185",
            }}>
            <Sparkles size={12} />
            SRT + VTT export &nbsp;·&nbsp; 11 Indian languages
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold leading-[1.05] tracking-tight mb-6"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
          <span className="gradient-text">Speak.</span>{" "}
          <span style={{ color: "var(--text-primary)" }}>Upload.</span>{" "}
          <span className="gradient-text-rose">Caption.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-body"
          style={{ color: "var(--text-secondary)" }}>
          Most subtitle tools were built for English content. SAYCAP was built for creators who think in Telugu, record in Hindi, and edit in CapCut. Upload your audio, pick your language, get a perfectly timed caption file in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/dashboard" className="btn-glass btn-primary btn-lg">
            <span>Generate Free Captions</span>
            <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-glass btn-ghost btn-lg">
            <span>See how it works</span>
          </a>
        </div>

        {/* Trust line */}
        <p className="text-xs mb-12" style={{ color: "var(--text-dim)" }}>
          No credit card. No account needed to try. 5 minutes free, forever.
        </p>

        {/* Floating language pills */}
        <div className="relative flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {langs.map((lang, i) => (
              <div
                key={lang}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  animation: "float 6s ease-in-out infinite",
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            ["11", "Indian languages"],
            ["SRT + VTT", "Both formats"],
            ["3 words", "Per caption block"],
            ["Premiere · CapCut · DaVinci", "Works in"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-xl mb-1" style={{ color: "var(--text-primary)" }}>{value}</div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(transparent, var(--bg))" }} />
    </section>
  );
}
