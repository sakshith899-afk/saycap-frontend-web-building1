"use client";
import { useState, useCallback } from "react";
import { Upload, Globe, Type, Download, Check, ChevronRight, FileAudio, X } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { id: 1, icon: Upload,   label: "Upload audio" },
  { id: 2, icon: Globe,    label: "Language" },
  { id: 3, icon: Type,     label: "Output mode" },
  { id: 4, icon: Download, label: "Generate" },
];

const LANGS = [
  { code: "te", name: "Telugu",       native: "తెలుగు" },
  { code: "hi", name: "Hindi",        native: "हिन्दी" },
  { code: "ta", name: "Tamil",        native: "தமிழ்" },
  { code: "kn", name: "Kannada",      native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam",    native: "മലയാളം" },
  { code: "mr", name: "Marathi",      native: "मराठी" },
  { code: "bn", name: "Bengali",      native: "বাংলা" },
  { code: "gu", name: "Gujarati",     native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi",      native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia",         native: "ଓଡ଼ିଆ" },
  { code: "en", name: "English (IN)", native: "Indian accent" },
];

const MODES = [
  { id: "phonetic", name: "Phonetic", desc: "Roman letters, sounds as spoken. Best for audiences who can't read native script.", ex: '"నమస్తే" → "Namaste"', dot: "#C8C8C8" },
  { id: "native",   name: "Native",   desc: "Original language script, properly formatted. Best for formal content.",            ex: '"Hello" → "హలో"',            dot: "#888" },
  { id: "codemix",  name: "Codemix",  desc: "Telugu words in Telugu, English in English. Exactly how mixed speech is written.",  ex: '"నేను recently వెళ్ళాను"',      dot: "#666" },
  { id: "english",  name: "English",  desc: "Full meaning-for-meaning translation. Best for global reach.",                      ex: '"నేను కష్టపడ్డాను" → "I worked hard"', dot: "#444" },
];

const FORMATS = [
  { id: "srt",  name: "SRT",      desc: "Premiere · CapCut · DaVinci" },
  { id: "vtt",  name: "VTT",      desc: "Web players · YouTube" },
  { id: "both", name: "Both",     desc: "SRT + VTT" },
];

const SRT_PREVIEW = [
  ["1","00:00:01,200 --> 00:00:02,400","Namaste andariki"],
  ["2","00:00:02,600 --> 00:00:03,800","ee video lo manamu"],
  ["3","00:00:04,000 --> 00:00:05,200","chala important topic"],
  ["4","00:00:05,400 --> 00:00:06,600","gurinchi matladataamu"],
];

export default function Dashboard() {
  const [step,       setStep]       = useState(1);
  const [file,       setFile]       = useState<File | null>(null);
  const [dragging,   setDragging]   = useState(false);
  const [lang,       setLang]       = useState("");
  const [mode,       setMode]       = useState("");
  const [format,     setFormat]     = useState("both");
  const [generating, setGenerating] = useState(false);
  const [done,       setDone]       = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [stage,      setStage]      = useState("");

  const handleFile = (f: File) => {
    if (f && (f.name.endsWith(".mp3") || f.name.endsWith(".m4a"))) setFile(f);
  };

  const runGenerate = useCallback(() => {
    setGenerating(true); setProgress(0);
    const stages: [number, string][] = [
      [20, "Uploading your file..."],
      [40, "Splitting into chunks..."],
      [65, "Running speech-to-text..."],
      [85, "Formatting caption output..."],
      [100, "Finalising files..."],
    ];
    let i = 0;
    const tick = () => {
      if (i >= stages.length) { setTimeout(() => { setGenerating(false); setDone(true); }, 300); return; }
      const [p, s] = stages[i]; setProgress(p); setStage(s); i++;
      setTimeout(tick, 550 + Math.random() * 350);
    };
    setTimeout(tick, 200);
  }, []);

  const reset = () => {
    setStep(1); setFile(null); setLang(""); setMode(""); setFormat("both");
    setGenerating(false); setDone(false); setProgress(0); setStage("");
  };

  const selLang = LANGS.find(l => l.code === lang);
  const selMode = MODES.find(m => m.id === mode);

  const card = (content: React.ReactNode) => (
    <div className="card-skeu" style={{ padding: "clamp(24px, 4vw, 40px)", minHeight: 360 }}>{content}</div>
  );

  return (
    <div style={{ minHeight: "100svh", paddingTop: 60, paddingBottom: 64, background: "var(--bg)" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 6 }}>
            Generate Captions
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", letterSpacing: "-0.01em" }}>Four steps. One perfect caption file.</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <button onClick={() => { if (s.id < step) { setStep(s.id); setDone(false); setGenerating(false); } }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: "none", border: "none", cursor: s.id < step ? "pointer" : "default" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: step > s.id ? "var(--silver)" : step === s.id ? "var(--chrome)" : "var(--bg3)",
                  border: `1px solid ${step === s.id ? "var(--silver)" : "var(--border-mid)"}`,
                  boxShadow: step === s.id ? "0 0 16px rgba(200,200,200,0.12)" : "none",
                  transition: "all 0.3s",
                }}>
                  {step > s.id ? <Check size={13} color="var(--bg)" /> : <s.icon size={13} color={step === s.id ? "var(--bg)" : "var(--text-3)"} />}
                </div>
                <span style={{ fontSize: 10, color: step === s.id ? "var(--text-1)" : "var(--text-3)", fontWeight: 500, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: step > s.id ? "var(--silver)" : "var(--border-mid)", margin: "0 6px", marginBottom: 18, transition: "background 0.4s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="progress-track" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {/* Step 1 — Upload */}
        {step === 1 && card(
          <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="t-label" style={{ marginBottom: 16 }}>Step 1 of 4</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>Upload your audio</h2>
            <p className="t-small" style={{ marginBottom: 24 }}>MP3 or M4A. Long files are split automatically — no manual trimming needed.</p>

            {!file ? (
              <label className={`upload-zone ${dragging ? "drag-over" : ""}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 12, cursor: "pointer" }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
                <input type="file" accept=".mp3,.m4a" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} style={{ display: "none" }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg3)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Upload size={20} color="var(--text-3)" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", marginBottom: 3 }}>
                    <span style={{ color: "var(--silver)" }}>Click to upload</span> or drag &amp; drop
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>Your audio is deleted immediately after processing</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["MP3", "M4A", "Up to 500MB"].map(t => <span key={t} className="mono-tag">{t}</span>)}
                </div>
              </label>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 14, background: "var(--glass-bg)", border: "1px solid var(--border-mid)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileAudio size={18} color="var(--silver)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={() => setFile(null)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--text-3)" }}>
                  <X size={12} />
                </button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(2)}
                style={{ opacity: file ? 1 : 0.35, pointerEvents: file ? "auto" : "none" }}>
                <span>Continue</span><ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Language */}
        {step === 2 && card(
          <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="t-label" style={{ marginBottom: 16 }}>Step 2 of 4</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>What language is spoken?</h2>
            <p className="t-small" style={{ marginBottom: 24 }}>SAYCAP handles code-mixed speech natively.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`select-card ${lang === l.code ? "active" : ""}`} style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>{l.native}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(1)} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(3)}
                style={{ opacity: lang ? 1 : 0.35, pointerEvents: lang ? "auto" : "none" }}>
                <span>Continue</span><ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Mode */}
        {step === 3 && card(
          <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="t-label" style={{ marginBottom: 16 }}>Step 3 of 4</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>How should captions look?</h2>
            <p className="t-small" style={{ marginBottom: 24 }}>Every line in your SRT and VTT follows this format.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} className={`select-card ${mode === m.id ? "active" : ""}`}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 3 }}>{m.desc}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "monospace" }}>{m.ex}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 10 }}>Output format</p>
              <div style={{ display: "flex", gap: 8 }}>
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => setFormat(f.id)}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: 12, textAlign: "center", cursor: "pointer", transition: "all 0.2s",
                      background: format === f.id ? "var(--glass-bg-hi)" : "var(--glass-bg)",
                      border: `1px solid ${format === f.id ? "var(--silver)" : "var(--border)"}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: format === f.id ? "var(--chrome)" : "var(--text-1)" }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(2)} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(4)}
                style={{ opacity: mode ? 1 : 0.35, pointerEvents: mode ? "auto" : "none" }}>
                <span>Continue</span><ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && !generating && !done && card(
          <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="t-label" style={{ marginBottom: 16 }}>Step 4 of 4</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 24 }}>Everything look right?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[
                { label: "Audio file", value: file?.name || "—", goto: 1 },
                { label: "Language", value: selLang ? `${selLang.name} · ${selLang.native}` : "—", goto: 2 },
                { label: "Output mode", value: selMode?.name || "—", goto: 3 },
                { label: "Format", value: format.toUpperCase(), goto: 3 },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{item.value}</div>
                  </div>
                  <button onClick={() => setStep(item.goto)} style={{ fontSize: 11, color: "var(--text-3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>edit</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(3)} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
              <button className="btn btn-primary" onClick={runGenerate}><span>Generate captions</span></button>
            </div>
          </div>
        )}

        {/* Generating */}
        {generating && card(
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 24 }}>
            <div style={{ position: "relative", width: 60, height: 60 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--silver)", animation: "spin 0.9s linear infinite" }} />
              <div style={{ position: "absolute", inset: 7, borderRadius: "50%", border: "1.5px solid transparent", borderBottomColor: "var(--text-3)", animation: "spin 0.6s linear infinite reverse" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--text-1)", marginBottom: 4 }}>Generating your captions&hellip;</p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>{stage}</p>
            </div>
            <div style={{ width: "100%", maxWidth: 280 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>Processing</span>
                <span style={{ fontSize: 11, color: "var(--silver)" }}>{progress}%</span>
              </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Done */}
        {done && card(
          <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(200,200,200,0.1)", border: "1px solid rgba(200,200,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={13} color="var(--silver)" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--silver)" }}>Captions ready</span>
              <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 4 }}>
                {selLang?.name} · {selMode?.name} · {format.toUpperCase()}
              </span>
            </div>

            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, maxHeight: 160, overflow: "auto", fontFamily: "monospace" }}>
              {SRT_PREVIEW.map(([n, t, tx]) => (
                <div key={n} className="srt-block">
                  <div className="srt-n">{n}</div>
                  <div className="srt-t">{t}</div>
                  <div className="srt-txt">{tx}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                <Download size={14} /><span>Download .srt</span>
              </button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                <Download size={14} /><span>Download .vtt</span>
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={reset} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>Start over</button>
              <Link href="/history" style={{ fontSize: 13, color: "var(--silver)", textDecoration: "none" }}>View history →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
