"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Globe, Type, Download, Check, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

const STEPS = [
  { id: 1, icon: Upload, label: "Upload audio" },
  { id: 2, icon: Globe, label: "Language" },
  { id: 3, icon: Type, label: "Output mode" },
  { id: 4, icon: Download, label: "Download" },
];

const LANGS = [
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

const MODES = [
  { id: "phonetic", name: "Phonetic", ex: "Namaste andariki", dot: "#C8C8C8" },
  { id: "native", name: "Native", ex: "నమస్తే అందరికీ", dot: "#888" },
  { id: "codemix", name: "Codemix", ex: "నేను recently వెళ్ళాను", dot: "#666" },
  { id: "english", name: "English", ex: "I worked very hard", dot: "#444" },
];

const SRT = [
  ["1", "00:00:01,200 --> 00:00:02,400", "Namaste andariki"],
  ["2", "00:00:02,600 --> 00:00:03,800", "ee video lo manamu"],
  ["3", "00:00:04,000 --> 00:00:05,200", "chala important topic"],
  ["4", "00:00:05,400 --> 00:00:06,600", "gurinchi matladataamu"],
];

export default function HowItWorks() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState(0);
  const [mode, setMode] = useState(0);
  const [genRunning, setGenRunning] = useState(false);
  const [genDone, setGenDone] = useState(false);
  const [srtCount, setSrtCount] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  const reset = useCallback(() => {
    clear();
    setStep(1); setLang(0); setMode(0);
    setGenRunning(false); setGenDone(false); setSrtCount(0); setIsAuto(true);
  }, []);

  const stopAuto = () => { setIsAuto(false); clear(); };

  const runGen = useCallback(() => {
    setGenRunning(true);
    timer.current = setTimeout(() => {
      setGenRunning(false); setGenDone(true);
      let i = 0;
      const iv = setInterval(() => { i++; setSrtCount(i); if (i >= SRT.length) clearInterval(iv); }, 320);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isAuto) return;
    const seq: [() => void, number][] = [
      [() => setStep(1), 900],
      [() => setStep(2), 1200],
      [() => setLang(2), 900],
      [() => setStep(3), 1200],
      [() => setMode(0), 700],
      [() => setStep(4), 1400],
      [() => runGen(), 2800],
      [() => { setTimeout(reset, 2000); }, 2000],
    ];
    let i = 0;
    const run = () => {
      if (i >= seq.length) return;
      const [fn, delay] = seq[i]; fn(); i++;
      timer.current = setTimeout(run, delay);
    };
    timer.current = setTimeout(run, 800);
    return clear;
  }, [isAuto, reset, runGen]);

  const selLang = LANGS[lang];
  const selMode = MODES[mode];

  const stepBtn = (s: typeof STEPS[0]) => (
    <button key={s.id} onClick={() => { stopAuto(); setStep(s.id); setGenRunning(false); setGenDone(false); setSrtCount(0); }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        background: step > s.id ? "var(--silver)" : step === s.id ? "var(--chrome)" : "var(--bg3)",
        border: `1px solid ${step === s.id ? "var(--silver)" : "var(--border-mid)"}`,
        boxShadow: step === s.id ? "0 0 20px rgba(200,200,200,0.15)" : "none",
        transition: "all 0.3s",
      }}>
        {step > s.id ? <Check size={14} color="var(--bg)" /> : <s.icon size={14} color={step === s.id ? "var(--bg)" : "var(--text-3)"} />}
      </div>
      <span style={{ fontSize: 11, color: step === s.id ? "var(--text-1)" : "var(--text-3)", fontWeight: step === s.id ? 500 : 400, letterSpacing: "-0.005em" }}>
        {s.label}
      </span>
    </button>
  );

  return (
    <section id="how-it-works" style={{ padding: "120px 24px", background: "var(--bg2)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none", opacity: 0.5 }} />

      <div style={{ maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>How it works</span>
            <ShimmerHeading className="t-h2" style={{ marginTop: 16, marginBottom: 12 }}>
              Watch it work.<br /><em>Then try it yourself.</em>
            </ShimmerHeading>
            <p className="t-body" style={{ maxWidth: 440, margin: "0 auto" }}>
              {"Not a video. The actual tool, running on its own. Click any step to take over."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0, marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                {stepBtn(s)}
                {i < STEPS.length - 1 && (
                  <div style={{ width: 60, height: 1, background: step > s.id ? "var(--silver)" : "var(--border-mid)", margin: "0 4px", marginBottom: 22, transition: "background 0.4s" }} />
                )}
              </div>
            ))}
          </div>

          <div className="progress-track" style={{ marginBottom: 20 }}>
            <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          <div className="card-skeu" style={{ padding: "clamp(24px, 4vw, 40px)", minHeight: 340 }}>
            {step === 1 && (
              <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <p className="t-label" style={{ marginBottom: 16 }}>Step 1 of 4</p>
                <h3 className="t-h3" style={{ marginBottom: 8 }}>Upload your audio</h3>
                <p className="t-small" style={{ marginBottom: 24 }}>MP3 or M4A. Long files split automatically.</p>
                <div className="upload-zone" style={{ padding: "40px 24px", textAlign: "center" }} onClick={() => { stopAuto(); setStep(2); }}>
                  <Upload size={24} color="var(--text-3)" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", marginBottom: 4 }}>
                    {isAuto ? "my_vlog_audio.mp3 - 24.3 MB" : "Click to upload or drag & drop"}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>MP3 · M4A · Up to 500MB</p>
                  {isAuto && <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 12 }}>
                    <div className="glow-dot" /><span style={{ fontSize: 12, color: "var(--silver)" }}>File loaded</span>
                  </div>}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { stopAuto(); setStep(2); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <p className="t-label" style={{ marginBottom: 16 }}>Step 2 of 4</p>
                <h3 className="t-h3" style={{ marginBottom: 8 }}>What language is spoken?</h3>
                <p className="t-small" style={{ marginBottom: 24 }}>Code-mixed speech handled natively.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
                  {LANGS.map((l, i) => (
                    <button key={l.code} onClick={() => { stopAuto(); setLang(i); }} className="select-card"
                      style={{ borderColor: lang === i ? "var(--silver)" : "var(--border)", textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)" }}>{l.native}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }} onClick={() => { stopAuto(); setStep(1); }}>← Back</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { stopAuto(); setStep(3); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <p className="t-label" style={{ marginBottom: 16 }}>Step 3 of 4</p>
                <h3 className="t-h3" style={{ marginBottom: 8 }}>How should captions look?</h3>
                <p className="t-small" style={{ marginBottom: 24 }}>Every line in your SRT and VTT follows this format.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {MODES.map((m, i) => (
                    <button key={m.id} onClick={() => { stopAuto(); setMode(i); }} className="select-card"
                      style={{ borderColor: mode === i ? "var(--silver)" : "var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "monospace" }}>{m.ex}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }} onClick={() => { stopAuto(); setStep(2); }}>← Back</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { stopAuto(); setStep(4); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && !genRunning && !genDone && (
              <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <p className="t-label" style={{ marginBottom: 16 }}>Step 4 of 4</p>
                <h3 className="t-h3" style={{ marginBottom: 24 }}>Ready to generate</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
                  {[
                    { l: "File", v: "my_vlog_audio.mp3" },
                    { l: "Language", v: selLang.name },
                    { l: "Mode", v: selMode.name },
                  ].map(item => (
                    <div key={item.l} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>{item.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }} onClick={() => { stopAuto(); setStep(3); }}>← Back</button>
                  <button className="btn btn-primary" onClick={() => { stopAuto(); runGen(); }}>
                    <span>Generate captions</span>
                  </button>
                </div>
              </div>
            )}

            {genRunning && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 20 }}>
                <div style={{ position: "relative", width: 56, height: 56 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--silver)", animation: "spin 0.9s linear infinite" }} />
                  <div style={{ position: "absolute", inset: 6, borderRadius: "50%", border: "1.5px solid transparent", borderBottomColor: "var(--text-3)", animation: "spin 0.6s linear infinite reverse" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text-1)", marginBottom: 4 }}>Generating your captions&hellip;</p>
                  <p style={{ fontSize: 13, color: "var(--text-3)" }}>Running speech-to-text · Formatting output</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {genDone && (
              <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(200,200,200,0.12)", border: "1px solid rgba(200,200,200,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={13} color="var(--silver)" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--silver)" }}>Captions ready</span>
                </div>
                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontFamily: "monospace" }}>
                  {SRT.slice(0, srtCount).map(([n, t, tx]) => (
                    <div key={n} className="srt-block" style={{ animation: "slideUp 0.3s ease both" }}>
                      <div className="srt-n">{n}</div>
                      <div className="srt-t">{t}</div>
                      <div className="srt-txt">{tx}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}><span>Download .srt</span></button>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }}><span>Download .vtt</span></button>
                </div>
                <button onClick={reset} style={{ width: "100%", marginTop: 12, fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}>Start over</button>
              </div>
            )}
          </div>

          {isAuto && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)", marginTop: 12 }}>
              Auto-playing · Click any step to take control
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
