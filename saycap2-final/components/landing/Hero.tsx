"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.25 + 0.05,
      });
    }

    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,200,${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200,200,200,${0.05 * (1 - d / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);

  const langs = ["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "বাংলা", "ગુજરાતી", "मराठी", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ"];

  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 60 }}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

      {/* Subtle radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(200,200,200,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none", opacity: 0.4 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>

        {/* Badge */}
        <div className="anim-1" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <span className="label-tag">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--silver)", display: "inline-block" }} />
            SRT · VTT · 11 Indian Languages
          </span>
        </div>

        {/* Main headline */}
        <h1 className="t-hero anim-2" style={{ marginBottom: 24 }}>
          Captions that<br />
          <em>actually</em> sound<br />
          like you.
        </h1>

        {/* Subheadline */}
        <p className="anim-3" style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--text-2)", lineHeight: 1.65, letterSpacing: "-0.01em", maxWidth: 520, margin: "0 auto 40px", fontWeight: 400 }}>
          {"YouTube's auto-captions don't speak Telugu. They don't speak Hindi. They definitely don't speak Hinglish. SAYCAP does."}
        </p>

        {/* CTAs */}
        <div className="anim-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            <span>Generate free captions</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn btn-ghost btn-lg">
            <span>See how it works</span>
          </a>
        </div>

        {/* Trust */}
        <p className="anim-5" style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: "-0.005em" }}>
          No account needed. 5 minutes free, forever.
        </p>

        {/* Language pills marquee */}
        <div className="anim-fade" style={{ marginTop: 64 }}>
          <div className="marquee-wrap" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div className="marquee-track">
              {[...langs, ...langs].map((lang, i) => (
                <div key={i} style={{
                  padding: "8px 18px", borderRadius: 980,
                  border: "1px solid var(--border-mid)",
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(12px)",
                  fontSize: 14, color: "var(--text-2)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="anim-fade" style={{ marginTop: 56, display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 72px)", flexWrap: "wrap" }}>
          {[
            ["11", "Indian languages"],
            ["SRT + VTT", "Both formats"],
            ["3 words", "Per caption block"],
            ["0", "Manual fixes needed"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, var(--bg))", pointerEvents: "none" }} />
    </section>
  );
}
