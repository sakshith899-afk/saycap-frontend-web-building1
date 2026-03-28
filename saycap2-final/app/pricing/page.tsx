import Pricing from "@/components/landing/Pricing";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div style={{ paddingTop: 60, background: "var(--bg)" }}>
      <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 0, padding: "40px 24px 0" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-3)", textDecoration: "none", letterSpacing: "-0.01em" }}>← Back to home</Link>
      </div>
      <Pricing />
    </div>
  );
}
