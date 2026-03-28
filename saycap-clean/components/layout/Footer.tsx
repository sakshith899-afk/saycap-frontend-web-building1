import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "radial-gradient(ellipse at 50% 0%, #ff8fa3 0%, #f43f5e 50%, #9f1239 100%)", boxShadow: "0 0 0 1px rgba(255,180,200,0.3), 0 4px 12px rgba(244,63,94,0.3)" }}>
                S
              </div>
              <span className="font-display font-bold text-lg" style={{ color: "#F5F5F5" }}>SAYCAP</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#555" }}>
              Captions that speak your language. Built for Indian creators making content in Telugu, Hindi, Tamil, and 8 more languages.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="mono-tag">SRT</span>
              <span className="mono-tag">VTT</span>
              <span className="mono-tag">11 Languages</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#333" }}>Product</p>
            <div className="flex flex-col gap-3">
              {[["Dashboard", "/dashboard"], ["Pricing", "/#pricing"], ["History", "/history"], ["About", "/about"]].map(([label, href]) => (
                <Link key={label} href={href} className="text-sm transition-colors" style={{ color: "#555" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C8C8C8"}
                  onMouseLeave={e => e.currentTarget.style.color = "#555"}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#333" }}>Legal</p>
            <div className="flex flex-col gap-3">
              {[["Privacy Policy", "#"], ["Terms of Service", "#"], ["Contact", "mailto:hello@saycap.in"]].map(([label, href]) => (
                <Link key={label} href={href} className="text-sm transition-colors" style={{ color: "#555" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C8C8C8"}
                  onMouseLeave={e => e.currentTarget.style.color = "#555"}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "#333" }}>© 2025 SAYCAP. All rights reserved.</p>
          <p className="text-xs" style={{ color: "#333" }}>Built in India. For Indian creators.</p>
        </div>
      </div>
    </footer>
  );
}
