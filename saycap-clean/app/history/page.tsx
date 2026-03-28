"use client";
import { useState } from "react";
import { Download, Search, Filter, Clock, FileText } from "lucide-react";
import Link from "next/link";

const MOCK_HISTORY = [
  { id: "1", file: "vlog_ep42_audio.mp3", language: "Telugu", mode: "Phonetic", format: "SRT + VTT", date: "Today, 2:34 PM", duration: "8 min 22 sec", status: "ready" },
  { id: "2", file: "podcast_hindi_ep7.mp3", language: "Hindi", mode: "Codemix", format: "SRT", date: "Today, 11:12 AM", duration: "24 min 10 sec", status: "ready" },
  { id: "3", file: "tutorial_kannada.m4a", language: "Kannada", mode: "Native", format: "VTT", date: "Yesterday", duration: "15 min 43 sec", status: "ready" },
  { id: "4", file: "shorts_tamil_content.mp3", language: "Tamil", mode: "English", format: "SRT + VTT", date: "Yesterday", duration: "1 min 8 sec", status: "ready" },
  { id: "5", file: "interview_malayalam.mp3", language: "Malayalam", mode: "Phonetic", format: "SRT", date: "2 days ago", duration: "42 min 0 sec", status: "ready" },
];

const MODE_COLORS: Record<string, string> = {
  Phonetic: "#FB7185",
  Native: "#C8C8C8",
  Codemix: "#F59E0B",
  English: "#34D399",
};

export default function History() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_HISTORY.filter(h =>
    h.file.toLowerCase().includes(search.toLowerCase()) ||
    h.language.toLowerCase().includes(search.toLowerCase()) ||
    h.mode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1" style={{ color: "var(--text-primary)" }}>Caption History</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Re-download any file from previous sessions.</p>
          </div>
          <Link href="/dashboard" className="btn-glass btn-primary btn-sm">
            <span>New caption</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-dim)" }} />
          <input
            type="text"
            placeholder="Search by file name, language, or mode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total files", value: MOCK_HISTORY.length },
            { label: "Minutes captioned", value: "91 min" },
            { label: "Languages used", value: "5" },
          ].map(stat => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="font-display font-bold text-2xl mb-1" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={40} className="mx-auto mb-4" style={{ color: "var(--text-dim)" }} />
              <p style={{ color: "var(--text-secondary)" }}>No captions found</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <div key={item.id} className="skeu-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                style={{ animation: `fadeUp 0.4s ease ${i * 60}ms forwards`, opacity: 0 }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <FileText size={18} style={{ color: "var(--text-secondary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate mb-1" style={{ color: "var(--text-primary)" }}>{item.file}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono-tag">{item.language}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${MODE_COLORS[item.mode]}15`, color: MODE_COLORS[item.mode], border: `1px solid ${MODE_COLORS[item.mode]}30` }}>
                      {item.mode}
                    </span>
                    <span className="mono-tag">{item.format}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
                      <Clock size={11} />{item.duration}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>{item.date}</span>
                  <div className="flex gap-2">
                    <button className="btn-glass btn-secondary btn-sm text-xs">
                      <Download size={12} /><span>.srt</span>
                    </button>
                    <button className="btn-glass btn-ghost btn-sm text-xs">
                      <Download size={12} /><span>.vtt</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upgrade prompt */}
        <div className="mt-10 p-6 rounded-2xl text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            Caption history is a <strong style={{ color: "var(--text-primary)" }}>Creator</strong> and <strong style={{ color: "var(--text-primary)" }}>Studio</strong> feature.
          </p>
          <Link href="/#pricing" className="btn-glass btn-primary btn-sm inline-flex">
            <span>Upgrade to unlock history</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
