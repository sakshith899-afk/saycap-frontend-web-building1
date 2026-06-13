"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { API_URL } from "@/lib/saycap";

interface Props { dark: boolean; onToggle: () => void; }

// Small pill that shows the signed-in user's remaining caption minutes.
function CreditsBadge() {
  const { getToken, isSignedIn } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(API_URL + "/credits", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCredits(parseFloat((await res.json()).credits) || 0);
    } catch { /* non-fatal */ }
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn) { setCredits(null); return; }
    refresh();
    // Re-sync when the tab regains focus or a generate finishes (custom event).
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener("saycap:credits", onFocus as EventListener);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("saycap:credits", onFocus as EventListener);
    };
  }, [isSignedIn, refresh]);

  if (credits === null) return null;
  const zero = credits <= 0;
  return (
    <span style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap",
      padding: "6px 12px", borderRadius: 99,
      background: zero ? "rgba(255,90,90,0.12)" : "var(--glass-bg-hi)",
      border: `1px solid ${zero ? "rgba(255,90,90,0.4)" : "var(--border-mid)"}`,
      color: zero ? "#ff7a7a" : "var(--silver)",
    }}>
      {zero ? "0 min left" : credits.toFixed(1) + " min left"}
    </span>
  );
}

export default function Navbar({ dark, onToggle }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.2)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "radial-gradient(ellipse at 50% 0%, #D0D0D0 0%, #888 50%, #444 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#0A0A0A",
          }}>S</div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)" }}>
            SAYCAP
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
          {links.map(l => (
            <Link key={l.label} href={l.href} style={{
              fontSize: 14, fontWeight: 400, color: "var(--text-2)",
              textDecoration: "none", letterSpacing: "-0.01em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
            >{l.label}</Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onToggle} style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "var(--glass-bg)", border: "1px solid var(--border-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-2)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hi)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-mid)")}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <SignedIn>
            <CreditsBadge />
            <Link href="/dashboard" className="btn btn-primary btn-sm hidden md:flex">
              <span>Dashboard</span>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="btn btn-primary btn-sm"><span>Sign in</span></button>
            </SignInButton>
          </SignedOut>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "var(--glass-bg)", border: "1px solid var(--border-mid)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-2)",
            }}
          >
            {open ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "absolute", top: 60, left: 0, right: 0,
          background: "var(--bg2)", borderBottom: "1px solid var(--border)",
          padding: "16px 24px 24px",
          backdropFilter: "blur(40px)",
        }}>
          {links.map(l => (
            <Link key={l.label} href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "var(--text-2)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}
            >{l.label}</Link>
          ))}
          <SignedIn>
            <Link href="/dashboard" className="btn btn-primary" onClick={() => setOpen(false)} style={{ marginTop: 16, width: "100%", display: "flex" }}>
              <span>Open dashboard</span>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="btn btn-primary" onClick={() => setOpen(false)} style={{ marginTop: 16, width: "100%", display: "flex" }}>
                <span>Sign in</span>
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}
