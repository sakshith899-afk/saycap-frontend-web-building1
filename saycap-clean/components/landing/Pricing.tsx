"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Dip your toes in.",
    price: "₹0",
    period: "forever",
    featured: false,
    cta: "Get started free",
    href: "/dashboard",
    features: [
      "5 minutes of captions per month",
      "Upload videos up to 2 min at a time",
      "Phonetic and Native script modes",
      "SRT + VTT export",
      "Community support",
    ],
    missing: ["Caption history", "Codemix and English modes", "Extra credits"],
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Built for serious creators.",
    price: "₹499",
    period: "per month",
    featured: true,
    cta: "Start creating",
    href: "/dashboard",
    features: [
      "1 hour of captions per month",
      "Upload videos up to 5 min at a time",
      "All 4 output modes",
      "Full caption history with re-downloads",
      "Buy extra credits anytime",
      "SRT + VTT export",
      "Email support",
    ],
    missing: [],
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "Your whole production, covered.",
    price: "₹999",
    period: "per month",
    featured: false,
    cta: "Go Studio",
    href: "/dashboard",
    features: [
      "3 hours of captions per month",
      "Everything in Creator",
      "Direct Slack channel access",
      "Priority processing",
      "Buy extra credits anytime",
      "SRT + VTT export",
    ],
    missing: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For media companies and agencies.",
    price: "Custom",
    period: "",
    featured: false,
    cta: "Talk to us",
    href: "mailto:hello@saycap.in",
    features: [
      "Custom footage volume",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees and invoicing",
      "Everything in Studio",
    ],
    missing: [],
  },
];

export default function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="pricing" className="py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <span className="section-label">Pricing</span>
          </div>
          <h2 className="font-display font-bold mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--text-primary)" }}>
            Start free. Grow when you need to.
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            No hidden limits. No confusing credit systems. You know exactly what you get.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
              className="pricing-card flex flex-col"
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, #1E0E12 0%, #14090C 100%)"
                  : hovered === plan.id
                  ? "var(--surface2)"
                  : "var(--bg)",
                borderColor: plan.featured
                  ? "rgba(251,113,133,0.35)"
                  : hovered === plan.id
                  ? "var(--border-hover)"
                  : "var(--border)",
                boxShadow: plan.featured
                  ? "0 0 0 1px rgba(251,113,133,0.1), 0 30px 80px rgba(244,63,94,0.12)"
                  : "none",
                transform: hovered === plan.id && !plan.featured ? "translateY(-4px)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {plan.featured && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--accent)", color: "#fff" }}>
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="font-display font-bold text-lg mb-0.5" style={{ color: "var(--text-primary)" }}>{plan.name}</p>
                <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>{plan.tagline}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold" style={{ fontSize: "36px", color: "var(--text-primary)" }}>{plan.price}</span>
                  {plan.period && <span className="text-sm" style={{ color: "var(--text-dim)" }}>/{plan.period}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center" style={{ background: plan.featured ? "rgba(251,113,133,0.2)" : "rgba(52,211,153,0.15)" }}>
                      <Check size={10} color={plan.featured ? "#FB7185" : "#34D399"} />
                    </div>
                    <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 opacity-30">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center" style={{ background: "var(--surface2)" }}>
                      <span style={{ color: "var(--text-dim)", fontSize: 10, lineHeight: 1 }}>—</span>
                    </div>
                    <span className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`btn-glass ${plan.featured ? "btn-primary" : "btn-secondary"} justify-center w-full`}
                style={{ display: "flex" }}
              >
                <span>{plan.cta}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
