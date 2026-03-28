"use client";
import { useState } from "react";
import { Download, Search, FileText, Clock } from "lucide-react";
import Link from "next/link";

const HISTORY = [
  { id: "1", file: "vlog_ep42_audio.mp3",    lang: "Telugu",    mode: "Phonetic", fmt: "SRT + VTT", date: "Today, 2:34 PM",   dur: "8 min 22 sec" },
  { id: "2", file: "podcast_hindi_ep7.mp3",   lang: "Hindi",     mode: "Codemix",  fmt: "SRT",       date: "Today, 11:12 AM",  dur: "24 min 10 sec" },
  { id: "3", file: "tutorial_kannada.m4a",    lang: "Kannada",   mode: "Native",   fmt: "VTT",       date: "Yesterday",        dur: "15 min 43 sec" },
  { id: "4", file: "shorts_tamil.mp3",        lang: "Tamil",     mode: "English",  fmt: "SRT + VTT", date: "Yesterday",        dur: "1 min 8 sec" },
  { id: "5", file: "interview_malayalam.mp3", lang: "Malayalam", mode: "Phonetic", fmt: "SRT",       date: "2 days ago",       dur: "42 min 0 sec" },
];

const DOT: Record<string, string> = { Phonetic: "#C8C8C8", Native: "#888", Codemix: "#666", English: "#444" };

export default function History() {
  const [search, setSearch] = useState("");
  const filtered = HISTORY.filter(h =>
    [h.file, h.lang, h.mode].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100svh", paddingTop: 60, paddingBottom: 64, background: "var(--bg)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 4 }}>Caption History</h1>
            <p style={{ fontSize: 14, color: "var(--text-3)", letterSpacing: "-0.01em" }}>Re-download any file from previous sessions.</p>
          </div>
          <Link href="/dashboard" className="btn btn-primary btn-sm"><span>New caption</span></Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          {[["5", "Total files"], ["91 min", "Captioned"], ["5", "Languages used"]].map(([v, l]) => (
            <div key={l} className="card" style={{ padding: "16px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 2 }}>{v}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input
            type="text" placeholder="Search by file, language, or mode..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 40px", borderRadius: 14, fontSize: 14,
              background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--text-1)",
              outline: "none", letterSpacing: "-0.01em", transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--border-hi)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <FileText size={36} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>No captions found</p>
            </div>
          ) : filtered.map((item, i) => (
            <div key={item.id} className="card-skeu" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={16} color="var(--text-3)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{item.file}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  <span className="mono-tag">{item.lang}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)", padding: "2px 8px", borderRadius: 6, background: "var(--bg3)", border: "1px solid var(--border)" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: DOT[item.mode] || "#888" }} />
                    {item.mode}
                  </span>
                  <span className="mono-tag">{item.fmt}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)" }}>
                    <Clock size={10} />{item.dur}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>{item.date}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "6px 12px" }}>
                    <Download size={11} /><span>.srt</span>
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "6px 12px" }}>
                    <Download size={11} /><span>.vtt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade note */}
        <div style={{ marginTop: 24, padding: "20px 24px", borderRadius: 16, background: "var(--glass-bg)", border: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 12 }}>
            Caption history is a <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Creator</strong> and <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>Studio</strong> feature.
          </p>
          <Link href="/#pricing" className="btn btn-primary btn-sm" style={{ display: "inline-flex" }}>
            <span>Upgrade to unlock history</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
