"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const PLANS = [
  {
    name: "Starter", price: "₹0", period: "forever",
    tagline: "Dip your toes in.",
    features: ["5 minutes of captions/month", "Upload up to 2 min at a time", "Phonetic + Native modes", "SRT + VTT export", "Community support"],
    missing: ["Caption history", "Codemix + English modes", "Extra credits"],
    cta: "Start free", href: "/dashboard", featured: false,
  },
  {
    name: "Creator", price: "₹499", period: "month",
    tagline: "Built for serious creators.",
    features: ["1 hour of captions/month", "Upload up to 5 min at a time", "All 4 output modes", "Caption history + re-downloads", "Buy extra credits anytime", "SRT + VTT export", "Email support"],
    missing: [],
    cta: "Start creating", href: "/dashboard", featured: true,
  },
  {
    name: "Studio", price: "₹999", period: "month",
    tagline: "Your whole production.",
    features: ["3 hours of captions/month", "Everything in Creator", "Direct Slack channel", "Priority processing", "Buy extra credits anytime"],
    missing: [],
    cta: "Go Studio", href: "/dashboard", featured: false,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    tagline: "For media companies.",
    features: ["Custom footage volume", "Custom integrations", "Dedicated account manager", "SLA + invoicing", "Everything in Studio"],
    missing: [],
    cta: "Talk to us", href: "mailto:hello@saycap.in", featured: false,
  },
];

export default function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>Pricing</span>
            <h2 className="t-h2" style={{ marginTop: 16, marginBottom: 12 }}>
              Start free.<br /><em>Pay when you&apos;re ready.</em>
            </h2>
            <p className="t-body" style={{ maxWidth: 380, margin: "0 auto" }}>
              No traps. No confusing credits. You know exactly what you get.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 70}>
              <div
                onMouseEnter={() => setHovered(plan.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: 20, padding: 28,
                  border: `1px solid ${plan.featured ? "rgba(200,200,200,0.2)" : hovered === plan.name ? "var(--border-mid)" : "var(--border)"}`,
                  background: plan.featured
                    ? "linear-gradient(160deg, #1E1E1E 0%, #141414 100%)"
                    : hovered === plan.name ? "var(--glass-bg-hi)" : "var(--glass-bg)",
                  boxShadow: plan.featured ? "0 0 0 1px rgba(200,200,200,0.08), 0 24px 64px rgba(0,0,0,0.35)" : "none",
                  backdropFilter: "blur(24px)",
                  display: "flex", flexDirection: "column",
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  transform: hovered === plan.name && !plan.featured ? "translateY(-4px)" : "none",
                  position: "relative", overflow: "hidden",
                }}
              >
                {plan.featured && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 980, background: "var(--silver)", color: "var(--bg)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Popular
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em", marginBottom: 2 }}>{plan.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 20 }}>{plan.tagline}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)" }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 13, color: "var(--text-3)" }}>/{plan.period}</span>}
                  </div>
                </div>

                <div style={{ flex: 1, marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(200,200,200,0.1)", border: "1px solid rgba(200,200,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={9} color="var(--silver)" />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5, letterSpacing: "-0.005em" }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: 0.3 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 9, color: "var(--text-3)", lineHeight: 1 }}>—</span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.href} className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"} btn-sm`}
                  style={{ display: "flex", justifyContent: "center" }}>
                  <span>{plan.cta}</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #pricing .grid-pricing { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          #pricing .grid-pricing { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
