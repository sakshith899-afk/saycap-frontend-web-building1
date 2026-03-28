"use client";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

const FEATURES = [
  { emoji: "🎙️", title: "11 languages, zero headaches", body: "Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Gujarati, Marathi, Punjabi, Odia, Indian English. Switch in one click." },
  { emoji: "⏱️", title: "Frame-perfect every time", body: "Every word syncs to the exact millisecond. Drop SRT or VTT into Premiere, CapCut, or DaVinci. It just works." },
  { emoji: "🔀", title: "Tenglish. Hinglish. Kanglish.", body: "Your audio switches languages mid-sentence. So does SAYCAP. Code-mixed speech handled natively, not as an afterthought." },
  { emoji: "🔒", title: "Your audio never stays", body: "Processed and deleted immediately. We don't train on your content. What you upload is yours." },
];

const MODES = [
  { id: "phonetic", name: "Phonetic", desc: "Roman script, sounds as spoken", ex: "Namaste andariki", dot: "#C8C8C8" },
  { id: "native", name: "Native", desc: "Original language script", ex: "నమస్తే అందరికీ", dot: "#888" },
  { id: "codemix", name: "Codemix", desc: "Mixed naturally, word by word", ex: "నేను recently వెళ్ళాను", dot: "#666" },
  { id: "english", name: "English", desc: "Full meaning-for-meaning translation", ex: "I worked very hard", dot: "#444" },
];

const EDITORS = ["Adobe Premiere Pro", "CapCut", "DaVinci Resolve", "Final Cut Pro", "iMovie"];

export default function Features() {
  return (
    <section id="features" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <Reveal>
          <div style={{ marginBottom: 72 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>What it does</span>
            <ShimmerHeading className="t-h2" style={{ maxWidth: 600, marginTop: 16 }}>
              The caption tool Indian creators have been <em>waiting for.</em>
            </ShimmerHeading>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>

          {/* Feature cards with spotlight glow */}
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} style={{ gridColumn: "span 3" }}>
              <SpotlightCard className="card" spotlightColor="rgba(200, 200, 200, 0.2)">
                <div style={{ padding: "28px 24px", height: "100%", position: "relative", zIndex: 3 }}>
                  <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>{f.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-1)", marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                  <p className="t-small">{f.body}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}

          {/* Output modes */}
          <Reveal delay={100} style={{ gridColumn: "span 7" }}>
            <SpotlightCard className="card-skeu" spotlightColor="rgba(200, 200, 200, 0.12)">
              <div style={{ padding: "32px 28px", height: "100%", position: "relative", zIndex: 3 }}>
                <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>4 output modes</span>
                <h3 className="t-h3" style={{ marginBottom: 24 }}>One audio.<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--text-2)" }}>Four captions.</em></h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {MODES.map(m => (
                    <div key={m.id} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 16px", borderRadius: 12,
                      background: "var(--glass-bg)", border: "1px solid var(--border)",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{m.name}</span>
                          <span style={{ fontSize: 11, color: "var(--text-3)" }}>{m.desc}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "SF Mono, monospace", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.ex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* SRT preview */}
          <Reveal delay={150} style={{ gridColumn: "span 5" }}>
            <SpotlightCard className="card-skeu" spotlightColor="rgba(200, 200, 200, 0.12)">
              <div style={{ padding: "32px 28px", height: "100%", position: "relative", zIndex: 3 }}>
                <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>Live output</span>
                <h3 className="t-h3" style={{ marginBottom: 24 }}>Drop it in.<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--text-2)" }}>It syncs.</em></h3>
                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div className="glow-dot" />
                    <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "monospace" }}>output.srt</span>
                    <span className="mono-tag" style={{ marginLeft: "auto" }}>Telugu · Phonetic</span>
                  </div>
                  {[
                    ["1", "00:00:01,200 --> 00:00:02,400", "Namaste andariki"],
                    ["2", "00:00:02,600 --> 00:00:03,800", "ee video lo manamu"],
                    ["3", "00:00:04,000 --> 00:00:05,200", "chala important topic"],
                  ].map(([n, t, tx]) => (
                    <div key={n} className="srt-block">
                      <div className="srt-n">{n}</div>
                      <div className="srt-t">{t}</div>
                      <div className="srt-txt">{tx}</div>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", gap: 6 }}>
                    <span className="mono-tag">SRT</span>
                    <span className="mono-tag">VTT</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Editors */}
          <Reveal delay={80} style={{ gridColumn: "span 12" }}>
            <SpotlightCard className="card" spotlightColor="rgba(200, 200, 200, 0.15)">
              <div style={{ padding: "32px 28px", position: "relative", zIndex: 3 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                  <div>
                    <span className="label-tag" style={{ marginBottom: 14, display: "inline-flex" }}>Works everywhere</span>
                    <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--text-1)", marginTop: 12 }}>Drop it into your editor. Done.</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {EDITORS.map(e => (
                      <div key={e} style={{
                        padding: "8px 16px", borderRadius: 980,
                        border: "1px solid var(--border-mid)",
                        background: "var(--glass-bg)",
                        fontSize: 13, fontWeight: 500, color: "var(--text-1)",
                        letterSpacing: "-0.01em",
                      }}>{e}</div>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #features [style*="span 3"] { grid-column: span 6 !important; }
          #features [style*="span 7"] { grid-column: span 12 !important; }
          #features [style*="span 5"] { grid-column: span 12 !important; }
        }
        @media (max-width: 600px) {
          #features [style*="span 6"] { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  );
}
