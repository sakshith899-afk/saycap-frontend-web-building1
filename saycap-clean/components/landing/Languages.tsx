"use client";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { name: "Telugu", native: "తెలుగు", script: "Telugu script" },
  { name: "Hindi", native: "हिन्दी", script: "Devanagari" },
  { name: "Tamil", native: "தமிழ்", script: "Tamil script" },
  { name: "Kannada", native: "ಕನ್ನಡ", script: "Kannada script" },
  { name: "Malayalam", native: "മലയാളം", script: "Malayalam script" },
  { name: "Marathi", native: "मराठी", script: "Devanagari" },
  { name: "Bengali", native: "বাংলা", script: "Bengali script" },
  { name: "Gujarati", native: "ગુજરાતી", script: "Gujarati script" },
  { name: "Punjabi", native: "ਪੰਜਾਬੀ", script: "Gurmukhi" },
  { name: "Odia", native: "ଓଡ଼ିଆ", script: "Odia script" },
  { name: "English (IN)", native: "Indian accent", script: "Roman" },
];

export default function Languages() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="languages" className="py-32 px-6" style={{ background: "var(--bg)" }} ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <span className="section-label">Supported languages</span>
          </div>
          <h2 className="font-display font-bold mb-4 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--text-primary)" }}>
            Your language is already here.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            SAYCAP supports the languages 1.4 billion people use every day. Not as a feature. As the whole point.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {LANGUAGES.map((lang, i) => (
            <div
              key={lang.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="lang-pill cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
                borderColor: active === i ? "var(--accent)" : "var(--border)",
                background: active === i ? "var(--accent-dim)" : "var(--surface)",
              }}
            >
              <span className="text-base font-medium" style={{ color: active === i ? "var(--text-primary)" : "var(--text-secondary)" }}>{lang.native}</span>
              <span className="text-xs font-semibold" style={{ color: active === i ? "var(--accent)" : "var(--text-dim)" }}>{lang.name}</span>
            </div>
          ))}
        </div>

        {/* Codemix note */}
        <div className="mt-10 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--accent-dim)", border: "1px solid rgba(251,113,133,0.2)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p className="text-sm text-center sm:text-left" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Code-mixed speech is handled natively.</strong>{" "}
            If your audio switches between Telugu and English in the same sentence, SAYCAP understands both. No extra setup needed.
          </p>
        </div>
      </div>
    </section>
  );
}
