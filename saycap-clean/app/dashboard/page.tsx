"use client";
import { useState, useCallback } from "react";
import { Upload, Globe, Type, Download, Check, ChevronRight, FileAudio, X } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { id: 1, icon: Upload, label: "Upload audio" },
  { id: 2, icon: Globe, label: "Language" },
  { id: 3, icon: Type, label: "Output mode" },
  { id: 4, icon: Download, label: "Generate" },
];

const LANGUAGES = [
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "en", name: "English (IN)", native: "Indian accent" },
];

const MODES = [
  {
    id: "phonetic",
    name: "Phonetic",
    desc: "Every spoken word written in Roman (English) letters exactly as it sounds. Best for audiences who understand the language but can't read the native script.",
    ex: '"నమస్తే అందరికీ" → "Namaste andariki"',
    color: "#FB7185",
  },
  {
    id: "native",
    name: "Native",
    desc: "Output in the original language script with proper formatting. Best for formal content and native script readers.",
    ex: '"Hello everyone" → "హలో అందరికీ"',
    color: "#C8C8C8",
  },
  {
    id: "codemix",
    name: "Codemix",
    desc: "Telugu words stay in Telugu. English words stay in English. Exactly how mixed-language speech looks when written naturally.",
    ex: '"నేను recently ఒక interview attend చేశాను"',
    color: "#F59E0B",
  },
  {
    id: "english",
    name: "English",
    desc: "Full translation into English. The AI understands meaning and rewrites every caption naturally in English.",
    ex: '"నేను చాలా కష్టపడ్డాను" → "I worked very hard"',
    color: "#34D399",
  },
];

const FORMATS = [
  { id: "srt", name: "SRT", desc: "SubRip · Works in Premiere, CapCut, DaVinci, iMovie" },
  { id: "vtt", name: "VTT", desc: "WebVTT · Works on web players and YouTube" },
  { id: "both", name: "Both", desc: "SRT + VTT — download both formats" },
];

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState("");
  const [mode, setMode] = useState("");
  const [format, setFormat] = useState("both");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStage, setGenStage] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.includes("audio") || f.name.endsWith(".mp3") || f.name.endsWith(".m4a"))) {
      setFile(f);
    }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const runGenerate = () => {
    setGenerating(true);
    setGenProgress(0);
    const stages = [
      [15, "Uploading your file..."],
      [35, "Splitting into audio chunks..."],
      [65, "Running speech-to-text..."],
      [85, "Formatting caption output..."],
      [100, "Finalising files..."],
    ];
    let i = 0;
    const run = () => {
      if (i >= stages.length) {
        setTimeout(() => { setGenerating(false); setDone(true); }, 400);
        return;
      }
      const [progress, stage] = stages[i];
      setGenProgress(progress as number);
      setGenStage(stage as string);
      i++;
      setTimeout(run, 600 + Math.random() * 400);
    };
    setTimeout(run, 300);
  };

  const reset = () => {
    setStep(1); setFile(null); setLanguage(""); setMode(""); setFormat("both");
    setGenerating(false); setDone(false); setGenProgress(0); setGenStage("");
  };

  const selectedLang = LANGUAGES.find(l => l.code === language);
  const selectedMode = MODES.find(m => m.id === mode);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "var(--text-primary)" }}>
            Generate Captions
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Four steps. One perfect caption file.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => { if (s.id < step) setStep(s.id); }}
                className="flex flex-col items-center gap-1.5"
                style={{ cursor: s.id < step ? "pointer" : "default" }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: step > s.id ? "var(--chrome)" : step === s.id ? "var(--accent)" : "var(--surface2)",
                    border: `1px solid ${step === s.id ? "var(--accent)" : "var(--border)"}`,
                    boxShadow: step === s.id ? "0 0 20px var(--accent-glow)" : "none",
                  }}>
                  {step > s.id ? <Check size={15} color="#000" /> : <s.icon size={15} color={step === s.id ? "#fff" : "var(--text-dim)"} />}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: step === s.id ? "var(--text-primary)" : "var(--text-dim)" }}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-3" style={{ background: step > s.id ? "var(--chrome)" : "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {/* Step content */}
        <div className="skeu-card p-8 md:p-10">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="wizard-step">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--text-dim)" }}>Step 1 of 4</p>
              <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>Upload your audio</h2>
              <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>
                Drop an MP3 or M4A file. Long files are split automatically — no manual trimming needed.
              </p>

              {!file ? (
                <label
                  className={`upload-zone flex flex-col items-center justify-center py-14 gap-4 ${dragging ? "dragging" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input type="file" accept=".mp3,.m4a,audio/mpeg,audio/mp4" onChange={handleFile} className="hidden" />
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                    <Upload size={22} style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      <span style={{ color: "var(--accent)" }}>Click to upload</span> or drag &amp; drop
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-dim)" }}>Your audio stays private and is deleted after processing</p>
                  </div>
                  <div className="flex gap-2">
                    {["MP3", "M4A", "Up to 500MB"].map(t => <span key={t} className="mono-tag">{t}</span>)}
                  </div>
                </label>
              ) : (
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-dim)", border: "1px solid rgba(251,113,133,0.2)" }}>
                    <FileAudio size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{file.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <X size={13} />
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  className="btn-glass btn-primary btn-sm"
                  onClick={() => setStep(2)}
                  style={{ opacity: file ? 1 : 0.4, pointerEvents: file ? "auto" : "none" }}
                >
                  <span>Continue</span><ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="wizard-step">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--text-dim)" }}>Step 2 of 4</p>
              <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>What language is spoken?</h2>
              <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>
                Select the primary language in your audio. SAYCAP handles code-mixed speech natively.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => setLanguage(lang.code)} className="select-card text-left"
                    style={{
                      borderColor: language === lang.code ? "var(--accent)" : "var(--border)",
                      background: language === lang.code ? "var(--accent-dim)" : "var(--surface)",
                      boxShadow: language === lang.code ? "0 0 0 1px var(--accent-dim)" : "none",
                    }}>
                    <div className="text-base font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{lang.name}</div>
                    <div className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{lang.native}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn-glass btn-primary btn-sm" onClick={() => setStep(3)}
                  style={{ opacity: language ? 1 : 0.4, pointerEvents: language ? "auto" : "none" }}>
                  <span>Continue</span><ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="wizard-step">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--text-dim)" }}>Step 3 of 4</p>
              <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>How should captions look?</h2>
              <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>
                This controls the language and script your caption text appears in.
              </p>
              <div className="flex flex-col gap-3 mb-7">
                {MODES.map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)} className="select-card text-left p-5"
                    style={{
                      borderColor: mode === m.id ? m.color : "var(--border)",
                      background: mode === m.id ? `${m.color}10` : "var(--surface)",
                    }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                      <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{m.name}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{m.desc}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{m.ex}</p>
                  </button>
                ))}
              </div>
              {/* Format selector */}
              <div className="mb-6">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Output format</p>
                <div className="flex gap-2">
                  {FORMATS.map((f) => (
                    <button key={f.id} onClick={() => setFormat(f.id)} className="flex-1 px-3 py-2.5 rounded-xl text-center transition-all"
                      style={{
                        background: format === f.id ? "var(--accent-dim)" : "var(--surface)",
                        border: `1px solid ${format === f.id ? "var(--accent)" : "var(--border)"}`,
                      }}>
                      <div className="text-sm font-bold" style={{ color: format === f.id ? "var(--accent)" : "var(--text-primary)" }}>{f.name}</div>
                      <div className="text-xs mt-0.5 hidden sm:block" style={{ color: "var(--text-dim)" }}>{f.desc.split("·")[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => setStep(2)}>← Back</button>
                <button className="btn-glass btn-primary btn-sm" onClick={() => setStep(4)}
                  style={{ opacity: mode ? 1 : 0.4, pointerEvents: mode ? "auto" : "none" }}>
                  <span>Continue</span><ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && !generating && !done && (
            <div className="wizard-step">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--text-dim)" }}>Step 4 of 4 — Review & generate</p>
              <h2 className="font-display font-bold text-2xl mb-7" style={{ color: "var(--text-primary)" }}>Everything look right?</h2>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {[
                  { label: "Audio file", value: file?.name || "—", action: () => setStep(1) },
                  { label: "Language", value: selectedLang ? `${selectedLang.name} · ${selectedLang.native}` : "—", action: () => setStep(2) },
                  { label: "Output mode", value: selectedMode?.name || "—", action: () => setStep(3) },
                  { label: "Format", value: format.toUpperCase(), action: () => setStep(3) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "var(--text-dim)" }}>{item.label}</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full" onClick={item.action}
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      edit
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => setStep(3)}>← Back</button>
                <button className="btn-glass btn-primary" onClick={runGenerate}>
                  <span>Generate captions</span>
                </button>
              </div>
            </div>
          )}

          {/* Generating */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor: "var(--accent) transparent transparent transparent" }} />
                <div className="absolute inset-2 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(251,113,133,0.3) transparent transparent transparent", animationDirection: "reverse", animationDuration: "0.7s" }} />
                <div className="absolute inset-0 rounded-full opacity-20" style={{ background: "var(--accent)", animation: "pulseGlow 2s ease-in-out infinite" }} />
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>Generating your captions&hellip;</p>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{genStage}</p>
                <div className="w-64 mx-auto">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${genProgress}%` }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>Processing</span>
                    <span className="text-xs" style={{ color: "var(--accent)" }}>{genProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Done */}
          {done && (
            <div className="wizard-step">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <Check size={16} color="#34D399" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#34D399" }}>Captions ready</p>
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>{selectedLang?.name} · {selectedMode?.name} · {format.toUpperCase()}</p>
                </div>
              </div>

              {/* SRT preview */}
              <div className="rounded-xl p-5 mb-6 font-mono text-xs overflow-auto" style={{ background: "var(--bg)", border: "1px solid var(--border)", maxHeight: 180 }}>
                {[["1","00:00:01,200 --> 00:00:02,400","Namaste andariki"],["2","00:00:02,600 --> 00:00:03,800","ee video lo manamu"],["3","00:00:04,000 --> 00:00:05,200","chala important topic"],["4","00:00:05,400 --> 00:00:06,600","gurinchi matladataamu"]].map(([idx,time,text]) => (
                  <div key={idx} className="mb-2 srt-line">
                    <div className="srt-index">{idx}</div>
                    <div className="srt-time">{time}</div>
                    <div className="srt-text">{text}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button className="btn-glass btn-primary flex-1 justify-center" style={{ display: "flex" }}>
                  <Download size={15} /><span>Download .srt</span>
                </button>
                <button className="btn-glass btn-secondary flex-1 justify-center" style={{ display: "flex" }}>
                  <Download size={15} /><span>Download .vtt</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={reset} className="text-sm" style={{ color: "var(--text-dim)" }}>Start over</button>
                <Link href="/history" className="text-sm" style={{ color: "var(--accent)" }}>View caption history →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
