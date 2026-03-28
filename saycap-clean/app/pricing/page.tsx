import Pricing from "@/components/landing/Pricing";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="pt-16" style={{ background: "var(--bg)" }}>
      <div className="text-center pt-16 pb-4 px-6">
        <Link href="/" className="text-sm" style={{ color: "var(--text-dim)" }}>← Back to home</Link>
      </div>
      <Pricing />
    </div>
  );
}
