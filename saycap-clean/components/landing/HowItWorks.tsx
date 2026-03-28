"use client";
import { useState, useEffect, useRef } from "react";
import { Upload, Globe, Type, Download, ChevronRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, icon: Upload, label: "Upload audio", short: "Upload" },
  { id: 2, icon: Globe, label: "Pick your language", short: "Language" },
  { id: 3, icon: Type, label: "Choose output mode", short: "Output mode" },
  { id: 4, icon: Download, label: "Download captions", short: "Download" },
];

const LANGUAGES = [
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

const MODES = [
  { id: "phonetic", name: "Phonetic", desc: "Roman script, sounds as spoken", ex: "Namaste andariki", color: "#FB7185" },
  { id: "native", name: "Native", desc: "Original language script", ex: "నమస్తే అందరికీ", color: "#C8C8C8" },
  { id: "codemix", name: "Codemix", desc: "Telugu + English mixed naturally", ex: "నేను recently వెళ్ళాను", color: "#F59E0B" },
  { id: "english", name: "English", desc: "Full translation to English", ex: "I worked very hard", color: "#34D399" },
];

const SRT_PREVIEW = [
  ["1", "00:00:01,200 --> 00:00:02,400", "Namaste andariki"],
  ["2", "00:00:02,600 --> 00:00:03,800", "ee video lo manamu"],
  ["3", "00:00:04,000 --> 00:00:05,200", "chala important topic"],
  ["4", "00:00:05,400 --> 00:00:06,600", "gurinchi matladataamu"],
];

export default function HowItWorks() {
  const [step, setStep] = useState(1);
  const [autoLang, setAutoLang] = useState(0);
  const [autoMode, setAutoMode] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [srtLines, setSrtLines] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goNext = () => {
    if (step === 2) { /* language selected */ }
    if (step === 3) { /* mode selected */ }
    if (step < 4) setStep(s => s + 1);
    else if (step === 4 && !generating && !done) runGenerate();
  };

  const runGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setSrtLines(0);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setSrtLines(i);
        if (i >= SRT_PREVIEW.length) clearInterval(iv);
      }, 350);
    }, 2200);
  };

  const reset = () => {
    setStep(1); setAutoLang(0); setAutoMode(0);
    setGenerating(false); setDone(false); setSrtLines(0);
    setIsAuto(true);
  };

  // Auto-play cycle
  useEffect(() => {
    if (!isAuto) return;
    const seq = [
      () => setStep(1),
      () => setStep(2),
      () => setAutoLang(0),
      () => { setAutoLang(2); },
      () => setStep(3),
      () => { setAutoMode(0); },
      () => { setAutoMode(2); },
      () => setStep(4),
      () => { setGenerating(true); },
      () => { setGenerating(false); setDone(true); setSrtLines(0); },
      () => setSrtLines(1),
      () => setSrtLines(2),
      () => setSrtLines(3),
      () => setSrtLines(4),
      () => { setTimeout(reset, 1500); },
    ];
    const delays = [800, 1200, 600, 800, 1200, 600, 800, 1400, 2200, 300, 350, 350, 350, 350, 2000];
    let idx = 0;
    const runSeq = () => {
      if (idx >= seq.length) return;
      seq[idx]();
      timerRef.current = setTimeout(() => { idx++; runSeq(); }, delays[idx] || 800);
    };
    timerRef.current = setTimeout(runSeq, 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAuto]);

  const handleManual = () => {
    setIsAuto(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <section id="how-it-works" className="py-32 px-6" style={{ background: "var(--surface)", position: "relative" }}>
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <span className="section-label">How it works</span>
          </div>
          <h2 className="font-display font-bold mb-4 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--text-primary)" }}>
            Watch it work. Then use it yourself.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            This isn&apos;t a video. It&apos;s the actual tool running on its own. Click any step to take over.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Step progress */}
          <div className="flex items-center justify-between mb-8 px-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => { handleManual(); setStep(s.id); setDone(false); setGenerating(false); setSrtLines(0); }}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: step > s.id ? "var(--chrome)" : step === s.id ? "var(--accent)" : "var(--surface2)",
                      border: `1px solid ${step === s.id ? "var(--accent)" : "var(--border)"}`,
                      boxShadow: step === s.id ? "0 0 16px var(--accent-glow)" : "none",
                    }}>
                    {step > s.id ? <Check size={14} color="#000" /> : <s.icon size={14} color={step === s.id ? "#fff" : "var(--text-dim)"} />}
                  </div>
                  <span className="text-xs font-medium hidden sm:block" style={{ color: step === s.id ? "var(--text-primary)" : "var(--text-dim)" }}>
                    {s.short}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2" style={{ background: step > s.id ? "var(--chrome)" : "var(--border)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="progress-bar mb-6">
            <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          {/* Step content */}
          <div className="skeu-card p-8 min-h-[320px]">

            {/* Step 1: Upload */}
            {step === 1 && (
              <div className="wizard-step">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-dim)" }}>Step 1 of 4</p>
                <h3 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>Upload your audio</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Drop an MP3 or M4A file. Files are split automatically for long recordings.</p>

                <div className="upload-zone flex flex-col items-center justify-center py-12 gap-3 cursor-pointer" onClick={() => { handleManual(); setStep(2); }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                    <Upload size={20} style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {isAuto ? "my_vlog_audio.mp3" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>MP3 · M4A · Up to 500MB</p>
                  </div>
                  {isAuto && (
                    <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(251,113,133,0.1)", color: "var(--accent)" }}>
                      <div className="glow-dot" style={{ width: 5, height: 5 }} />
                      File loaded — 24.3 MB
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>Your audio is deleted immediately after processing.</p>
                  <button className="btn-glass btn-primary btn-sm" onClick={() => { handleManual(); setStep(2); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Language */}
            {step === 2 && (
              <div className="wizard-step">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-dim)" }}>Step 2 of 4</p>
                <h3 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>What language is spoken?</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>SAYCAP handles code-mixed speech natively — Telugu+English, Hindi+English, and more.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {LANGUAGES.map((lang, i) => (
                    <button
                      key={lang.code}
                      onClick={() => { handleManual(); setAutoLang(i); }}
                      className="select-card text-left"
                      style={{
                        borderColor: autoLang === i ? "var(--accent)" : "var(--border)",
                        background: autoLang === i ? "var(--accent-dim)" : "var(--surface)",
                        boxShadow: autoLang === i ? "0 0 0 1px var(--accent-dim)" : "none",
                      }}
                    >
                      <div className="text-base font-medium" style={{ color: "var(--text-primary)" }}>{lang.name}</div>
                      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{lang.native}</div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => { handleManual(); setStep(1); }}>← Back</button>
                  <button className="btn-glass btn-primary btn-sm" onClick={() => { handleManual(); setStep(3); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Output mode */}
            {step === 3 && (
              <div className="wizard-step">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-dim)" }}>Step 3 of 4</p>
                <h3 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>How should captions look?</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Every line in your SRT and VTT file will follow this format.</p>
                <div className="flex flex-col gap-3 mb-6">
                  {MODES.map((mode, i) => (
                    <button
                      key={mode.id}
                      onClick={() => { handleManual(); setAutoMode(i); }}
                      className="select-card text-left flex items-center gap-4"
                      style={{
                        borderColor: autoMode === i ? mode.color : "var(--border)",
                        background: autoMode === i ? `${mode.color}12` : "var(--surface)",
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: mode.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{mode.name}</span>
                          <span className="text-xs" style={{ color: "var(--text-dim)" }}>{mode.desc}</span>
                        </div>
                        <div className="text-xs mt-0.5 truncate font-mono" style={{ color: "var(--text-secondary)" }}>&ldquo;{mode.ex}&rdquo;</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => { handleManual(); setStep(2); }}>← Back</button>
                  <button className="btn-glass btn-primary btn-sm" onClick={() => { handleManual(); setStep(4); }}>
                    <span>Continue</span><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Generate */}
            {step === 4 && (
              <div className="wizard-step">
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-dim)" }}>Step 4 of 4</p>
                {!generating && !done && (
                  <>
                    <h3 className="font-display font-bold text-2xl mb-6" style={{ color: "var(--text-primary)" }}>Ready to generate</h3>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { label: "File", value: "my_vlog_audio.mp3" },
                        { label: "Language", value: LANGUAGES[autoLang]?.name || "Telugu" },
                        { label: "Mode", value: MODES[autoMode]?.name || "Phonetic" },
                      ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                          <div className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>{item.label}</div>
                          <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="text-sm" style={{ color: "var(--text-dim)" }} onClick={() => { handleManual(); setStep(3); }}>← Back</button>
                      <button className="btn-glass btn-primary" onClick={() => { handleManual(); runGenerate(); }}>
                        <span>Generate captions</span>
                      </button>
                    </div>
                  </>
                )}

                {generating && (
                  <div className="flex flex-col items-center justify-center py-8 gap-5">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `var(--accent) transparent transparent transparent` }} />
                      <div className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin" style={{ borderColor: `rgba(251,113,133,0.3) transparent transparent transparent`, animationDirection: "reverse", animationDuration: "0.8s" }} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Generating your captions&hellip;</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Running speech-to-text · Formatting output</p>
                    </div>
                  </div>
                )}

                {done && (
                  <div className="wizard-step">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)" }}>
                        <Check size={12} color="#34D399" />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#34D399" }}>Captions ready</span>
                    </div>
                    <div className="rounded-xl p-4 mb-5 font-mono text-xs" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                      {SRT_PREVIEW.slice(0, srtLines).map(([idx, time, text]) => (
                        <div key={idx} className="mb-2 srt-line" style={{ animation: "fadeUp 0.3s ease" }}>
                          <div className="srt-index">{idx}</div>
                          <div className="srt-time">{time}</div>
                          <div className="srt-text">{text}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="btn-glass btn-primary flex-1 justify-center">
                        <Download size={15} /><span>Download .srt</span>
                      </button>
                      <button className="btn-glass btn-secondary flex-1 justify-center">
                        <Download size={15} /><span>Download .vtt</span>
                      </button>
                    </div>
                    <button onClick={reset} className="w-full mt-3 text-sm text-center py-2" style={{ color: "var(--text-dim)" }}>
                      Start over
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isAuto && (
            <p className="text-center text-xs mt-4" style={{ color: "var(--text-dim)" }}>
              Auto-playing · Click any step above to take control
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
