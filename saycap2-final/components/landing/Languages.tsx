"use client";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const LANGS = [
  { name: "Telugu",       native: "తెలుగు" },
  { name: "Hindi",        native: "हिन्दी" },
  { name: "Tamil",        native: "தமிழ்" },
  { name: "Kannada",      native: "ಕನ್ನಡ" },
  { name: "Malayalam",    native: "മലയാളം" },
  { name: "Marathi",      native: "मराठी" },
  { name: "Bengali",      native: "বাংলা" },
  { name: "Gujarati",     native: "ગુજરાતી" },
  { name: "Punjabi",      native: "ਪੰਜਾਬੀ" },
  { name: "Odia",         native: "ଓଡ଼ିଆ" },
  { name: "English (IN)", native: "Indian accent" },
];

export default function Languages() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="languages" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>11 Languages</span>
            <h2 className="t-h2" style={{ marginTop: 16, marginBottom: 12 }}>
              Your language<br /><em>is already here.</em>
            </h2>
            <p className="t-body" style={{ maxWidth: 420, margin: "0 auto" }}>
              Built for the languages 1.4 billion people speak every day. Not as an afterthought. As the whole point.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {LANGS.map((l, i) => (
              <div
                key={l.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{
                  padding: "16px 14px",
                  borderRadius: 14,
                  border: `1px solid ${active === i ? "var(--border-hi)" : "var(--border)"}`,
                  background: active === i ? "var(--glass-bg-hi)" : "var(--glass-bg)",
                  backdropFilter: "blur(12px)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  cursor: "default",
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  transform: active === i ? "translateY(-3px)" : "none",
                  boxShadow: active === i ? "0 12px 32px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{l.native}</span>
                <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500, letterSpacing: "0.02em" }}>{l.name}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ marginTop: 32, padding: "20px 24px", borderRadius: 16, background: "var(--glass-bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🗣️</span>
            </div>
            <p className="t-small">
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Code-mixed speech handled natively.</strong>{" "}
              If your audio switches between Telugu and English mid-sentence, SAYCAP understands both. No extra setup needed.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
