"use client";
import { useState, useEffect, useCallback } from "react";
import { Download, Search, FileText, Loader2, Eye, X } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/nextjs";
import { API_URL } from "@/lib/saycap";

interface Caption {
  id: string;
  file_name: string;
  srt_content: string;
  created_at: string;
}

function Gate() {
  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "80px 20px", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8 }}>Sign in to SAYCAP</h1>
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>Log in to view your caption history.</p>
      </div>
      <SignIn routing="hash" forceRedirectUrl="/history" />
    </div>
  );
}

function downloadSrt(cap: Caption) {
  const name = cap.file_name.replace(/\.[^.]+$/, "") + ".srt";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([cap.srt_content], { type: "text/plain;charset=utf-8" }));
  a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function History() {
  const { getToken } = useAuth();
  const [items,   setItems]   = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed,  setFailed]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [preview, setPreview] = useState<Caption | null>(null); // file open in the preview modal

  const load = useCallback(async () => {
    setLoading(true); setFailed(false);
    try {
      const token = await getToken();
      if (!token) { setFailed(true); setLoading(false); return; }
      const res = await fetch(API_URL + "/history", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  // Close the preview modal with the Escape key.
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const filtered = items.filter((h) => h.file_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100svh", paddingTop: 60, paddingBottom: 64, background: "var(--bg)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 4 }}>Caption History</h1>
            <p style={{ fontSize: 14, color: "var(--text-3)", letterSpacing: "-0.01em" }}>Re-download any caption file from a previous session.</p>
          </div>
          <Link href="/dashboard" className="btn btn-primary btn-sm"><span>New caption</span></Link>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input
            type="text" placeholder="Search by file name..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 40px", borderRadius: 14, fontSize: 14,
              background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--text-1)",
              outline: "none", letterSpacing: "-0.01em", fontFamily: "inherit",
            }}
          />
        </div>

        {/* States */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-3)" }}>
            <Loader2 size={28} style={{ margin: "0 auto 12px", animation: "spin 0.9s linear infinite" }} />
            <p style={{ fontSize: 14 }}>Loading your history…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : failed ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <FileText size={36} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 16 }}>Couldn’t load your history.</p>
            <button className="btn btn-ghost btn-sm" onClick={load}><span>Try again</span></button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <FileText size={36} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 16 }}>{items.length === 0 ? "No captions saved yet." : "No files match your search."}</p>
            {items.length === 0 && <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ display: "inline-flex" }}><span>Generate your first caption</span></Link>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((item, i) => (
              <div key={item.id} className="card-skeu" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={16} color="var(--text-3)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{item.file_name}</p>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                    {item.created_at ? "Generated " + new Date(item.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreview(item)} style={{ fontSize: 12, padding: "8px 14px", flexShrink: 0 }}>
                  <Eye size={12} /><span>Preview</span>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => downloadSrt(item)} style={{ fontSize: 12, padding: "8px 14px", flexShrink: 0 }}>
                  <Download size={12} /><span>.srt</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview modal: shows the SRT before downloading */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.18s ease both" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-skeu"
            style={{ width: "100%", maxWidth: 640, maxHeight: "82vh", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={15} color="var(--text-3)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preview.file_name}</p>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>Preview only. Nothing is changed.</span>
              </div>
              <button onClick={() => setPreview(null)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 6, display: "flex" }}>
                <X size={18} />
              </button>
            </div>

            {/* SRT body */}
            <pre style={{ flex: 1, overflow: "auto", margin: 0, padding: "18px 20px", fontSize: 12.5, lineHeight: 1.7, color: "var(--text-2)", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {preview.srt_content || "This file has no saved content."}
            </pre>

            {/* Modal footer */}
            <div style={{ display: "flex", gap: 10, padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
              <button className="btn btn-primary btn-sm" onClick={() => downloadSrt(preview)} style={{ flex: 1, justifyContent: "center" }}>
                <Download size={13} /><span>Download .srt</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)} style={{ justifyContent: "center", minWidth: 100 }}>
                <span>Close</span>
              </button>
            </div>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <>
      <SignedIn><History /></SignedIn>
      <SignedOut><Gate /></SignedOut>
    </>
  );
}
