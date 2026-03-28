import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#080808", borderTop: "1px solid var(--border)", paddingTop: 64, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 64 }}
          className="grid-footer">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "radial-gradient(ellipse at 50% 0%, #D0D0D0 0%, #888 50%, #444 100%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#0A0A0A",
              }}>S</div>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)" }}>SAYCAP</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.7, maxWidth: 280, letterSpacing: "-0.01em" }}>
              Captions that speak your language. Built for Indian creators making content in Telugu, Hindi, Tamil, and 8 more.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {["SRT", "VTT", "11 Languages"].map(t => (
                <span key={t} className="mono-tag">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="t-label" style={{ marginBottom: 16 }}>Product</p>
            {[["Dashboard", "/dashboard"], ["Pricing", "/#pricing"], ["History", "/history"], ["About", "/about"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: "block", fontSize: 14, color: "var(--text-3)", textDecoration: "none", marginBottom: 12, letterSpacing: "-0.01em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
              >{l}</Link>
            ))}
          </div>

          <div>
            <p className="t-label" style={{ marginBottom: 16 }}>Legal</p>
            {[["Privacy Policy", "#"], ["Terms of Service", "#"], ["Contact", "mailto:hello@saycap.in"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: "block", fontSize: 14, color: "var(--text-3)", textDecoration: "none", marginBottom: 12, letterSpacing: "-0.01em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
              >{l}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: "-0.01em" }}>© 2025 SAYCAP. All rights reserved.</p>
          <p style={{ fontSize: 13, color: "var(--text-3)", letterSpacing: "-0.01em" }}>Built in India. For Indian creators.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-footer { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
