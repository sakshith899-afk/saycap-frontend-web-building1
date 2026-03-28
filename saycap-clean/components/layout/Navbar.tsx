"use client";
import Link from "next/link";
import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

interface NavbarProps { dark: boolean; onToggle: () => void; }

export default function Navbar({ dark, onToggle }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(13,13,13,0.7)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, #ff8fa3 0%, #f43f5e 50%, #9f1239 100%)",
              boxShadow: "0 0 0 1px rgba(255,180,200,0.3), 0 4px 12px rgba(244,63,94,0.4)",
            }}
          >
            S
          </div>
          <span
            className="font-display font-bold text-lg tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            SAYCAP
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[["Home", "/"], ["Pricing", "/#pricing"], ["About", "/about"], ["Contact", "mailto:hello@saycap.in"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link href="/dashboard" className="btn-glass btn-primary btn-sm">
            <span>Start Free</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={onToggle} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ borderTop: "1px solid var(--border)" }}>
          {[["Home", "/"], ["Pricing", "/#pricing"], ["About", "/about"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="text-sm font-medium py-2" style={{ color: "var(--text-secondary)" }}>
              {label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn-glass btn-primary btn-sm text-center" onClick={() => setOpen(false)}>
            <span>Start Free</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
