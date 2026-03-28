import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutTeaser() {
  return (
    <section className="py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="skeu-card p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(244,63,94,0.08) 0%, transparent 70%)",
          }} />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <span className="section-label">Our story</span>
            </div>
            <h2 className="font-display font-bold mb-6 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "var(--text-primary)" }}>
              Built in India.<br />For Indian creators.
            </h2>
            <p className="text-base leading-relaxed max-w-2xl mx-auto mb-4" style={{ color: "var(--text-secondary)" }}>
              Auto-captions on YouTube mangle Indian languages. Expensive transcription tools weren&apos;t built for code-mixed speech. We built SAYCAP because the tool we needed didn&apos;t exist.
            </p>
            <p className="text-base leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
              If you make content in an Indian language — whether it&apos;s Telugu vlogs, Hinglish comedy, or Tamil education — this was made for you.
            </p>
            <Link href="/about" className="btn-glass btn-primary btn-lg inline-flex">
              <span>Read our story</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
