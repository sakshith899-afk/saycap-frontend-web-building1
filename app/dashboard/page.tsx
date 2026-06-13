"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Globe, Type, Sliders, Download, Check, ChevronRight, FileAudio, FileVideo, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/nextjs";
import {
  API_URL, LANGS, MODES, DENSITIES, LATIN_FONTS,
  ACCEPT_ATTR, isSupported, isVideo,
  parseSRT, loadGoogleFont, type Cue,
} from "@/lib/saycap";

const STEPS = [
  { id: 1, icon: Upload,   label: "Upload" },
  { id: 2, icon: Globe,    label: "Language" },
  { id: 3, icon: Type,     label: "Output mode" },
  { id: 4, icon: Sliders,  label: "Density" },
  { id: 5, icon: Download, label: "Generate" },
];

// ── Full-page login gate ────────────────────────────────────────────────────────
function Gate() {
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "80px 20px", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8 }}>
          Sign in to SAYCAP
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", letterSpacing: "-0.01em" }}>
          Log in to generate captions and access your history.
        </p>
      </div>
      <SignIn routing="hash" forceRedirectUrl="/dashboard" />
    </div>
  );
}

// ── Error modal ──────────────────────────────────────────────────────────────────
function Modal({ title, msg, onClose }: { title: string; msg: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card-skeu" style={{ maxWidth: 380, width: "100%", padding: 28, textAlign: "center" }}>
        <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)", marginBottom: 8 }}>{title}</p>
        <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 20 }}>{msg}</p>
        <button className="btn btn-primary btn-sm" onClick={onClose} style={{ justifyContent: "center", width: "100%" }}><span>Got it</span></button>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────────
function Dashboard() {
  const { getToken } = useAuth();

  const [step,       setStep]       = useState(1);
  const [file,       setFile]       = useState<File | null>(null);
  const [video,      setVideo]      = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [lang,       setLang]       = useState("");
  const [mode,       setMode]       = useState("");
  const [density,    setDensity]    = useState(3);
  const [generating, setGenerating] = useState(false);
  const [done,       setDone]       = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [stage,      setStage]      = useState("");
  const [srt,        setSrt]        = useState("");
  const [error,      setError]      = useState<{ title: string; msg: string } | null>(null);

  // Video preview state
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [cues,        setCues]        = useState<Cue[]>([]);
  const [overlayText, setOverlayText] = useState("");
  const [fonts,       setFonts]       = useState<string[]>([]);
  const [font,        setFont]        = useState("");
  const videoUrlRef   = useRef<string | null>(null);

  const selLang = LANGS.find((l) => l.code === lang);
  const selMode = MODES.find((m) => m.id === mode);
  const selDensity = DENSITIES.find((d) => d.val === density);
  const modeLabel = selMode ? (selMode.id === "codemix" && selLang ? selLang.mix : selMode.name) : "";

  const handleFile = (f: File) => {
    if (!isSupported(f.name)) {
      setError({ title: "Unsupported format", msg: "Please upload an audio file (MP3, M4A) or a video file (MP4, MOV, M4V)." });
      return;
    }
    if (f.size > 1024 * 1024 * 1024) {
      setError({ title: "File too large", msg: "Your file is over 1GB. Please use a smaller clip and try again." });
      return;
    }
    setFile(f);
    setVideo(isVideo(f.name));
  };

  // Clean up the object URL when leaving / resetting.
  useEffect(() => () => { if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current); }, []);

  const setupVideoPreview = useCallback((srtText: string, f: File, langCode: string) => {
    const parsed = parseSRT(srtText);
    setCues(parsed);
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    const url = URL.createObjectURL(f);
    videoUrlRef.current = url;
    if (videoRef.current) videoRef.current.src = url;

    const scriptFonts = LANGS.find((l) => l.code === langCode)?.scriptFonts || [];
    const fontList = [...scriptFonts, ...LATIN_FONTS];
    fontList.forEach(loadGoogleFont);
    setFonts(fontList);
    setFont(fontList[0] || "sans-serif");
  }, []);

  function handleError(status: number, msg: string) {
    if (status === 402) {
      try { const d = JSON.parse(msg); setError({ title: "Not enough credits", msg: d.needed ? `This file needs ${d.needed} min but you only have ${parseFloat(d.credits).toFixed(1)} min left. Contact your admin for more credits.` : "You have 0 credits remaining. Contact your admin to add more." }); }
      catch { setError({ title: "Not enough credits", msg: "You don't have enough credits for this file." }); }
    } else if (status === 413 || msg.includes("large")) setError({ title: "File too large", msg: "Your file is too large. Please try a shorter clip." });
    else if (status === 422 || msg.includes("silent") || msg.includes("EMPTY")) setError({ title: "No speech detected", msg: "No clear speech was found. Make sure your audio has minimal background noise." });
    else if (status === 429 || msg.includes("QUOTA")) setError({ title: "Service busy", msg: "The service is temporarily at capacity. Please wait a moment and try again." });
    else if (status === 401 || status === 403) setError({ title: "Access denied", msg: "Authentication failed. Sign out fully, sign back in, and try again." });
    else setError({ title: "Something went wrong", msg: "An unexpected error occurred. Please try again." });
  }

  const runGenerate = useCallback(async () => {
    if (!file) return;
    const token = await getToken();
    if (!token) { setError({ title: "Session expired", msg: "Please sign in again and retry." }); return; }

    setGenerating(true); setDone(false); setProgress(0); setStage("Uploading your file...");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("fileName", file.name);
    fd.append("sourceLanguage", lang);
    fd.append("translationFormat", selMode?.apiValue || "phonetic");
    fd.append("wordsPerCaption", String(density));

    try {
      const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + "/generate", true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.timeout = 600000;
        // Real upload progress, capped at 90% — the rest is server-side work.
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.min(90, Math.round((e.loaded / e.total) * 90)));
        };
        xhr.upload.onload = () => { setProgress(92); setStage("Transcribing & timing captions..."); };
        xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
        xhr.onerror = () => reject(new Error("CONNECTION_FAILED"));
        xhr.ontimeout = () => reject(new Error("TIMEOUT"));
        xhr.send(fd);
      });

      window.dispatchEvent(new Event("saycap:credits")); // refresh navbar balance

      if (result.status !== 200) { setGenerating(false); handleError(result.status, result.body); return; }

      setProgress(100);
      setSrt(result.body);
      if (video) setupVideoPreview(result.body, file, lang);
      setGenerating(false);
      setDone(true);
    } catch (err: unknown) {
      setGenerating(false);
      const m = err instanceof Error ? err.message : "";
      if (m === "TIMEOUT") setError({ title: "Processing timeout", msg: "This file took too long. Please try a shorter clip." });
      else setError({ title: "Connection error", msg: "Could not reach the server. Check your internet and try again." });
    }
  }, [file, lang, density, selMode, video, getToken, setupVideoPreview]);

  const reset = () => {
    if (videoUrlRef.current) { URL.revokeObjectURL(videoUrlRef.current); videoUrlRef.current = null; }
    setStep(1); setFile(null); setVideo(false); setLang(""); setMode(""); setDensity(3);
    setGenerating(false); setDone(false); setProgress(0); setStage(""); setSrt("");
    setCues([]); setOverlayText(""); setFonts([]); setFont("");
  };

  const download = () => {
    const name = (file ? file.name.replace(/\.[^.]+$/, "") : "captions") + ".srt";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([srt], { type: "text/plain;charset=utf-8" }));
    a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // Value shown under each step in the sidebar.
  const stepVals: Record<number, string> = {
    1: file?.name || "",
    2: selLang ? selLang.name : "",
    3: modeLabel,
    4: selDensity?.short || "",
    5: done ? "Captions ready" : "",
  };

  const goStep = (id: number) => {
    if (generating) return;
    if (id < step || done) { setStep(id); setDone(false); }
  };

  return (
    <div style={{ minHeight: "100svh", paddingTop: 60, paddingBottom: 72, background: "var(--bg)" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "44px 20px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, letterSpacing: "-0.045em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.02 }}>
            Generate Captions
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-3)", letterSpacing: "-0.01em" }}>
            Upload, choose your settings, and get a frame-perfect SRT in five quick steps.
          </p>
        </div>

        {/* Main card: sidebar + panel */}
        <div className="card-skeu" style={{ overflow: "hidden", padding: 0 }}>
          <div className="dash-grid">

            {/* ── Sidebar ── */}
            <div className="dash-side" style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)", padding: "22px 0" }}>
              {STEPS.map((s, i) => {
                const state = done ? "done" : step > s.id ? "done" : step === s.id ? "active" : "todo";
                const clickable = !generating && (s.id < step || done);
                return (
                  <div key={s.id}>
                    <button
                      onClick={() => goStep(s.id)}
                      className={`dash-step ${state === "active" ? "active" : ""}`}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 12, width: "100%",
                        padding: "13px 22px", cursor: clickable ? "pointer" : "default",
                        background: state === "active" ? "var(--glass-bg-hi)" : "transparent",
                        border: "none", borderLeft: `3px solid ${state === "active" ? "var(--silver)" : "transparent"}`,
                        textAlign: "left", transition: "background 0.15s",
                      }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: state === "done" ? "var(--silver)" : state === "active" ? "var(--chrome)" : "var(--bg3)",
                        border: `1px solid ${state === "active" ? "var(--silver)" : "var(--border-mid)"}`,
                        boxShadow: state === "active" ? "0 0 14px rgba(200,200,200,0.12)" : "none",
                        transition: "all 0.25s",
                      }}>
                        {state === "done" ? <Check size={13} color="var(--bg)" /> : <s.icon size={13} color={state === "active" ? "var(--bg)" : "var(--text-3)"} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: state === "active" ? "var(--text-1)" : state === "done" ? "var(--text-2)" : "var(--text-3)" }}>
                          {s.label}
                        </div>
                        {stepVals[s.id] && (
                          <div className="dash-val" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                            {stepVals[s.id]}
                          </div>
                        )}
                      </div>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="dash-connector" style={{ width: 1.5, height: 10, marginLeft: 37, background: step > s.id || done ? "var(--silver)" : "var(--border-mid)", transition: "background 0.3s" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Panel ── */}
            <div style={{ padding: "clamp(28px, 4vw, 44px)", display: "flex", flexDirection: "column", minHeight: 480 }}>

              {/* Step 1 — Upload */}
              {step === 1 && !generating && !done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Step 1 of 5</p>
                  <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>Upload your audio or video</h2>
                  <p className="t-small" style={{ marginBottom: 26 }}>MP3, M4A, MP4, MOV. Long files are split automatically — no manual trimming needed.</p>

                  {!file ? (
                    <label className={`upload-zone ${dragging ? "drag-over" : ""}`}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", gap: 14, cursor: "pointer" }}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
                      <input type="file" accept={ACCEPT_ATTR} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} style={{ display: "none" }} />
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--bg3)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Upload size={24} color="var(--text-3)" />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text-1)", marginBottom: 4 }}>
                          <span style={{ color: "var(--silver)" }}>Click to upload</span> or drag &amp; drop
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-3)" }}>Your file is deleted immediately after processing</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                        {["MP3", "M4A", "MP4", "MOV", "Up to 1GB"].map((t) => <span key={t} className="mono-tag">{t}</span>)}
                      </div>
                    </label>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderRadius: 14, background: "var(--glass-bg)", border: "1px solid var(--border-mid)" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--bg3)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {video ? <FileVideo size={20} color="var(--silver)" /> : <FileAudio size={20} color="var(--silver)" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-3)" }}>{(video ? "Video · " : "Audio · ") + (file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                      <button onClick={() => setFile(null)} style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--text-3)" }}>
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setStep(2)}
                      style={{ opacity: file ? 1 : 0.35, pointerEvents: file ? "auto" : "none" }}>
                      <span>Continue</span><ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Language */}
              {step === 2 && !generating && !done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Step 2 of 5</p>
                  <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>What language is spoken?</h2>
                  <p className="t-small" style={{ marginBottom: 26 }}>SAYCAP handles code-mixed speech natively.</p>
                  <div className="dash-lang-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
                    {LANGS.map((l) => (
                      <button key={l.code} onClick={() => setLang(l.code)} className={`select-card ${lang === l.code ? "active" : ""}`} style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{l.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>{l.native}</div>
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
              {step === 3 && !generating && !done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Step 3 of 5</p>
                  <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>How should captions look?</h2>
                  <p className="t-small" style={{ marginBottom: 26 }}>Every line in your SRT follows this format.</p>
                  <div className="dash-mode-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 26 }}>
                    {MODES.map((m) => {
                      const label = m.id === "codemix" && selLang ? selLang.mix : m.name;
                      return (
                        <button key={m.id} onClick={() => setMode(m.id)} className={`select-card ${mode === m.id ? "active" : ""}`}
                          style={{ display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0, marginTop: 5 }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", marginBottom: 3 }}>{label}</div>
                            <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 4 }}>{m.desc}</div>
                            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "monospace" }}>{m.ex}</div>
                          </div>
                        </button>
                      );
                    })}
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

              {/* Step 4 — Density */}
              {step === 4 && !generating && !done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Step 4 of 5</p>
                  <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 6 }}>How many words per caption?</h2>
                  <p className="t-small" style={{ marginBottom: 26 }}>3 words is the short-form standard for Reels, Shorts and YouTube.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {DENSITIES.map((d) => (
                      <button key={d.val} onClick={() => setDensity(d.val)} className={`select-card ${density === d.val ? "active" : ""}`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{d.label}</span>
                        {d.val === 3 && <span className="mono-tag">Recommended</span>}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setStep(3)} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
                    <button className="btn btn-primary btn-sm" onClick={() => setStep(5)}>
                      <span>Continue</span><ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5 — Review */}
              {step === 5 && !generating && !done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Step 5 of 5</p>
                  <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: 26 }}>Everything look right?</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
                    {[
                      { label: "File", value: file?.name || "—", goto: 1 },
                      { label: "Language", value: selLang ? `${selLang.name} · ${selLang.native}` : "—", goto: 2 },
                      { label: "Output mode", value: modeLabel || "—", goto: 3 },
                      { label: "Caption density", value: selDensity?.label || "—", goto: 4 },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</div>
                        </div>
                        <button onClick={() => setStep(item.goto)} style={{ fontSize: 11, color: "var(--text-3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", flexShrink: 0, marginLeft: 12 }}>edit</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setStep(4)} style={{ fontSize: 13, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
                    <button className="btn btn-primary" onClick={runGenerate}><span>Generate captions</span></button>
                  </div>
                </div>
              )}

              {/* Generating */}
              {generating && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 26 }}>
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--silver)", animation: "spin 0.9s linear infinite" }} />
                    <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1.5px solid transparent", borderBottomColor: "var(--text-3)", animation: "spin 0.6s linear infinite reverse" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.025em", color: "var(--text-1)", marginBottom: 4 }}>Generating your captions&hellip;</p>
                    <p style={{ fontSize: 13, color: "var(--text-3)" }}>{stage}</p>
                  </div>
                  <div style={{ width: "100%", maxWidth: 320 }}>
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
              {done && (
                <div style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(200,200,200,0.1)", border: "1px solid rgba(200,200,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={14} color="var(--silver)" />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "var(--silver)" }}>Captions ready</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 4 }}>
                      {selLang?.name} · {modeLabel} · {selDensity?.short}
                    </span>
                  </div>

                  {/* Video preview with live caption overlay */}
                  {video && (
                    <div style={{ marginBottom: 22 }}>
                      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", border: "1px solid var(--border)" }}>
                        <video ref={videoRef} controls playsInline style={{ width: "100%", display: "block", maxHeight: 420 }}
                          onTimeUpdate={(e) => {
                            const t = e.currentTarget.currentTime;
                            const cue = cues.find((c) => t >= c.start && t < c.end);
                            setOverlayText(cue ? cue.text : "");
                          }} />
                        {overlayText && (
                          <div style={{
                            position: "absolute", left: 0, right: 0, bottom: "8%", textAlign: "center",
                            padding: "0 16px", pointerEvents: "none",
                            fontFamily: `'${font}', sans-serif`, fontWeight: 700, fontSize: "clamp(15px, 3.2vw, 28px)",
                            color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
                          }}>{overlayText}</div>
                        )}
                      </div>
                      {fonts.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "var(--text-3)" }}>Caption font</span>
                          <select value={font} onChange={(e) => { loadGoogleFont(e.target.value); setFont(e.target.value); }}
                            style={{ background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--text-1)", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                            {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                          {selLang && selLang.scriptFonts.length > 0 && (
                            <span style={{ fontSize: 11, color: "var(--text-3)" }}>Pick a “Noto” font for native-script captions.</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SRT preview */}
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", marginBottom: 22, maxHeight: 280, overflow: "auto", fontFamily: "monospace", whiteSpace: "pre-wrap", fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>
                    {srt}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                    <button className="btn btn-primary btn-sm" onClick={download} style={{ flex: 1, justifyContent: "center", minWidth: 180 }}>
                      <Download size={14} /><span>Download .srt</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(srt); }} style={{ flex: 1, justifyContent: "center", minWidth: 180 }}>
                      <span>Copy to clipboard</span>
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
        </div>
      </div>

      {error && <Modal title={error.title} msg={error.msg} onClose={() => setError(null)} />}

      {/* Responsive: collapse to a single column with a horizontal step strip on small screens */}
      <style>{`
        .dash-grid { display: grid; grid-template-columns: 248px 1fr; }
        @media (max-width: 820px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-side { flex-direction: row; overflow-x: auto; border-right: none !important; border-bottom: 1px solid var(--border); padding: 14px 8px !important; }
          .dash-side > div { display: flex; align-items: center; }
          .dash-step { border-left: none !important; border-bottom: 3px solid transparent; min-width: max-content; padding: 8px 14px !important; }
          .dash-step.active { border-bottom-color: var(--silver); }
          .dash-connector { display: none !important; }
          .dash-val { display: none !important; }
        }
        @media (max-width: 560px) {
          .dash-lang-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-mode-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Page: login gate, then dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <>
      <SignedIn><Dashboard /></SignedIn>
      <SignedOut><Gate /></SignedOut>
    </>
  );
}
