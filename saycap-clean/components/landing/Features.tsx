"use client";
import { useEffect, useRef, useState } from "react";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function FeatureCard({ children, className = "", delay = 0 }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`skeu-card overflow-hidden ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Features() {
  const srtLines = [
    { i: "1", t: "00:00:01,200 → 00:00:02,400", text: "నమస్తే అందరికీ" },
    { i: "2", t: "00:00:02,400 → 00:00:03,600", text: "ఈ వీడియోలో మనం" },
    { i: "3", t: "00:00:03,600 → 00:00:04,800", text: "చాలా important గురించి" },
  ];

  const modes = [
    { name: "Phonetic", label: "Roman", ex: "Namaste andariki", color: "#FB7185" },
    { name: "Native", label: "Script", ex: "నమస్తే అందరికీ", color: "#C8C8C8" },
    { name: "Codemix", label: "Mixed", ex: "నేను recently వెళ్ళాను", color: "#F59E0B" },
    { name: "English", label: "Translated", ex: "Hello everyone", color: "#34D399" },
  ];

  return (
    <section id="features" className="py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-5">
            <span className="section-label">Why SAYCAP</span>
          </div>
          <h2 className="font-display font-bold mb-5 leading-tight" style={{ fontSize: "clamp(36px, 5vw, 60px)", color: "var(--text-primary)" }}>
            The caption tool Indian<br />creators have been waiting for.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Not a generic transcription tool with Indian language support bolted on. Built ground-up for how Indian creators actually make content.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Big feature: SRT preview */}
          <FeatureCard className="md:col-span-7 p-8" delay={0}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="section-label text-xs">Frame-perfect timing</span>
                <h3 className="font-display font-bold text-2xl mt-3" style={{ color: "var(--text-primary)" }}>
                  Drop it in.<br />It just works.
                </h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Every caption syncs to the exact frame. Drag the SRT or VTT file into Premiere, CapCut, or DaVinci. Zero manual fixes.
                </p>
              </div>
            </div>

            {/* SRT mockup */}
            <div className="rounded-xl p-5 font-mono text-xs" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="glow-dot" />
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>output.srt — generating</span>
                <span className="mono-tag ml-auto">Telugu · Phonetic</span>
              </div>
              {srtLines.map((line, i) => (
                <div key={i} className="mb-3 srt-line">
                  <div className="srt-index">{line.i}</div>
                  <div className="srt-time">{line.t}</div>
                  <div className="srt-text">{line.text}</div>
                </div>
              ))}
              <div className="mt-3 pt-3 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="mono-tag">SRT</span>
                <span className="mono-tag">VTT</span>
                <span className="text-xs ml-auto" style={{ color: "var(--text-dim)" }}>3 words/caption</span>
              </div>
            </div>
          </FeatureCard>

          {/* 4 Output modes */}
          <FeatureCard className="md:col-span-5 p-8" delay={100}>
            <span className="section-label text-xs">4 Output modes</span>
            <h3 className="font-display font-bold text-2xl mt-3 mb-6" style={{ color: "var(--text-primary)" }}>
              One audio.<br />Four captions.
            </h3>
            <div className="flex flex-col gap-3">
              {modes.map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{m.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--text-dim)" }}>{m.label}</span>
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{m.ex}</div>
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Languages */}
          <FeatureCard className="md:col-span-4 p-8" delay={150}>
            <span className="section-label text-xs">Languages</span>
            <h3 className="font-display font-bold text-2xl mt-3 mb-2" style={{ color: "var(--text-primary)" }}>
              11 languages.<br />One upload.
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Gujarati, Marathi, Punjabi, Odia, and Indian English.
            </p>
            <div className="flex flex-wrap gap-2">
              {["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "বাংলা"].map((l) => (
                <span key={l} className="text-sm px-3 py-1.5 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{l}</span>
              ))}
              <span className="text-sm px-3 py-1.5 rounded-xl" style={{ background: "var(--accent-dim)", border: "1px solid rgba(251,113,133,0.2)", color: "var(--accent)" }}>+5 more</span>
            </div>
          </FeatureCard>

          {/* Codemix */}
          <FeatureCard className="md:col-span-5 p-8" delay={200}>
            <span className="section-label text-xs">Codemix native</span>
            <h3 className="font-display font-bold text-2xl mt-3 mb-2" style={{ color: "var(--text-primary)" }}>
              Tenglish. Hinglish.<br />Kanglish.
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Your audience switches languages mid-sentence. So does your audio. SAYCAP handles code-mixed speech — not as a workaround, as a feature.
            </p>
            <div className="rounded-xl p-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-primary)" }}>నేను</span>{" "}
                <span style={{ color: "#FB7185" }}>recently</span>{" "}
                <span style={{ color: "var(--text-primary)" }}>ఒక</span>{" "}
                <span style={{ color: "#FB7185" }}>interview</span>{" "}
                <span style={{ color: "var(--text-primary)" }}>attend చేశాను</span>
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--text-dim)" }}>Telugu words stay Telugu · English stays English</p>
            </div>
          </FeatureCard>

          {/* Privacy */}
          <FeatureCard className="md:col-span-3 p-8" delay={250}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>Your audio never stays.</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Files are processed and deleted immediately. We don&apos;t train on your content. What you upload is yours.
            </p>
          </FeatureCard>

          {/* Editors */}
          <FeatureCard className="md:col-span-12 p-8" delay={300}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:max-w-sm">
                <span className="section-label text-xs">Works everywhere</span>
                <h3 className="font-display font-bold text-2xl mt-3 mb-2" style={{ color: "var(--text-primary)" }}>
                  Drop it into your editor. Done.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  SRT and VTT files that plug directly into any video editor. No format juggling, no conversion tools, no manual sync work.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {["Adobe Premiere Pro", "CapCut", "DaVinci Resolve", "Final Cut Pro", "iMovie"].map((editor) => (
                  <div key={editor} className="px-5 py-3 rounded-2xl flex items-center gap-2"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{editor}</span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
