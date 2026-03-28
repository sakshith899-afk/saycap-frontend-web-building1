"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

const PLANS = [
  {
    name: "Starter", price: "₹0", period: "forever",
    tagline: "Dip your toes in.",
    features: ["5 minutes of captions/month", "Upload up to 2 min at a time", "Phonetic + Native modes", "SRT and VTT export", "Community support"],
    missing: ["Caption history", "Codemix + English modes", "Extra credits"],
    cta: "Start free", href: "/dashboard", featured: false,
    bg: "linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)",
    accent: "rgba(200, 200, 200, 0.15)",
  },
  {
    name: "Creator", price: "₹499", period: "month",
    tagline: "Built for serious creators.",
    features: ["1 hour of captions/month", "Upload up to 5 min at a time", "All 4 output modes", "Caption history + re-downloads", "Buy extra credits anytime", "SRT and VTT export", "Email support"],
    missing: [],
    cta: "Start creating", href: "/dashboard", featured: true,
    bg: "linear-gradient(135deg, #3A3A3A 0%, #1E1E1E 50%, #111 100%)",
    accent: "rgba(200, 200, 200, 0.25)",
  },
  {
    name: "Studio", price: "₹999", period: "month",
    tagline: "Your whole production.",
    features: ["3 hours of captions/month", "Everything in Creator", "Direct Slack channel", "Priority processing", "Buy extra credits anytime"],
    missing: [],
    cta: "Go Studio", href: "/dashboard", featured: false,
    bg: "linear-gradient(135deg, #2A2A2A 0%, #181818 100%)",
    accent: "rgba(200, 200, 200, 0.15)",
  },
];

function BGShape1() {
  return (
    <motion.svg width="320" height="384" viewBox="0 0 320 384" fill="none" xmlns="http://www.w3.org/2000/svg"
      variants={{ hover: { scale: 1.5 } }} transition={{ duration: 1, ease: "backInOut" }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <motion.circle variants={{ hover: { scaleY: 0.5, y: -25 } }} transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="160.5" cy="114.5" r="101.5" fill="rgba(200, 200, 200, 0.06)" />
      <motion.ellipse variants={{ hover: { scaleY: 2.25, y: -25 } }} transition={{ duration: 1, ease: "backInOut", delay: 0.2 }}
        cx="160.5" cy="265.5" rx="101.5" ry="43.5" fill="rgba(200, 200, 200, 0.06)" />
    </motion.svg>
  );
}

function BGShape2() {
  return (
    <motion.svg width="320" height="384" viewBox="0 0 320 384" fill="none" xmlns="http://www.w3.org/2000/svg"
      variants={{ hover: { scale: 1.05 } }} transition={{ duration: 1, ease: "backInOut" }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <motion.rect x="14" width="153" height="153" rx="15" fill="rgba(200, 200, 200, 0.06)"
        variants={{ hover: { y: 219, rotate: "90deg", scaleX: 2 } }} style={{ y: 12 }}
        transition={{ delay: 0.2, duration: 1, ease: "backInOut" }} />
      <motion.rect x="155" width="153" height="153" rx="15" fill="rgba(200, 200, 200, 0.06)"
        variants={{ hover: { y: 12, rotate: "90deg", scaleX: 2 } }} style={{ y: 219 }}
        transition={{ delay: 0.2, duration: 1, ease: "backInOut" }} />
    </motion.svg>
  );
}

function BGShape3() {
  return (
    <motion.svg width="320" height="384" viewBox="0 0 320 384" fill="none" xmlns="http://www.w3.org/2000/svg"
      variants={{ hover: { scale: 1.25 } }} transition={{ duration: 1, ease: "backInOut" }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <motion.path variants={{ hover: { y: -50 } }} transition={{ delay: 0.3, duration: 1, ease: "backInOut" }}
        d="M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z"
        fill="rgba(200, 200, 200, 0.05)" />
      <motion.path variants={{ hover: { y: -50 } }} transition={{ delay: 0.2, duration: 1, ease: "backInOut" }}
        d="M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z"
        fill="rgba(200, 200, 200, 0.05)" />
      <motion.path variants={{ hover: { y: -50 } }} transition={{ delay: 0.1, duration: 1, ease: "backInOut" }}
        d="M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z"
        fill="rgba(200, 200, 200, 0.05)" />
    </motion.svg>
  );
}

const BG_SHAPES = [BGShape1, BGShape2, BGShape3];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>Pricing</span>
            <ShimmerHeading className="t-h2" style={{ marginTop: 16, marginBottom: 12 }}>
              Start free.<br /><em>Pay when you&apos;re ready.</em>
            </ShimmerHeading>
            <p className="t-body" style={{ maxWidth: 380, margin: "0 auto" }}>
              No traps. No confusing credits. You know exactly what you get.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {PLANS.map((plan, i) => {
            const BGComp = BG_SHAPES[i];
            return (
              <Reveal key={plan.name} delay={i * 80}>
                <motion.div
                  whileHover="hover"
                  transition={{ duration: 1, ease: "backInOut" }}
                  variants={{ hover: { scale: 1.04 } }}
                  style={{
                    position: "relative",
                    width: 300,
                    minHeight: 460,
                    borderRadius: 20,
                    padding: 28,
                    background: plan.bg,
                    border: `1px solid ${plan.featured ? "rgba(200,200,200,0.2)" : "var(--border)"}`,
                    boxShadow: plan.featured
                      ? "0 0 0 1px rgba(200,200,200,0.08), 0 24px 64px rgba(0,0,0,0.4)"
                      : "0 8px 32px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "default",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <BGComp />

                  {plan.featured && (
                    <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 980, background: "var(--silver)", color: "var(--bg)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Popular
                      </span>
                    </div>
                  )}

                  <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: 24 }}>
                      <span style={{
                        display: "inline-block", marginBottom: 12,
                        padding: "4px 12px", borderRadius: 980,
                        background: "rgba(200, 200, 200, 0.1)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(200, 200, 200, 0.12)",
                        fontSize: 12, fontWeight: 600, color: "var(--text-2)",
                      }}>
                        {plan.name}
                      </span>
                      <motion.div
                        initial={{ scale: 0.88 }}
                        variants={{ hover: { scale: 1 } }}
                        transition={{ duration: 1, ease: "backInOut" }}
                        style={{ transformOrigin: "top left" }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--text-1)", lineHeight: 1.1 }}>{plan.price}</span>
                          {plan.period && <span style={{ fontSize: 14, color: "var(--text-3)" }}>/{plan.period}</span>}
                        </div>
                      </motion.div>
                      <p style={{ fontSize: 14, color: "var(--text-2)", marginTop: 8, lineHeight: 1.5 }}>{plan.tagline}</p>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, marginBottom: 24 }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(200,200,200,0.1)", border: "1px solid rgba(200,200,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <Check size={9} color="var(--silver)" />
                          </div>
                          <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                      {plan.missing.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: 0.3 }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <span style={{ fontSize: 9, color: "var(--text-3)", lineHeight: 1 }}>-</span>
                          </div>
                          <span style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={plan.href}
                      style={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        padding: "12px 0", borderRadius: 12,
                        border: plan.featured ? "none" : "1px solid rgba(200, 200, 200, 0.2)",
                        background: plan.featured
                          ? "radial-gradient(ellipse at 50% -10%, #D0D0D0 0%, #909090 45%, #555 100%)"
                          : "rgba(200, 200, 200, 0.06)",
                        color: plan.featured ? "#0A0A0A" : "var(--text-1)",
                        fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        position: "relative", zIndex: 10,
                      }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Enterprise callout */}
        <Reveal delay={200}>
          <div style={{
            marginTop: 24, padding: "24px 32px", borderRadius: 20,
            background: "var(--glass-bg)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.02em", marginBottom: 4 }}>Enterprise</p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>Custom volume, integrations, SLA, and invoicing for media companies.</p>
            </div>
            <Link href="mailto:hello@saycap.in" className="btn btn-ghost btn-sm">
              <span>Talk to us</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
