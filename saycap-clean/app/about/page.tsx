"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <FadeIn>
          <div className="flex justify-start mb-8">
            <span className="section-label">Our story</span>
          </div>
          <h1 className="font-display font-bold leading-tight mb-8" style={{ fontSize: "clamp(40px, 6vw, 72px)", color: "var(--text-primary)" }}>
            We got tired of<br />
            <span className="gradient-text-rose">broken captions.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            If you make videos in Telugu, Hindi, Tamil, or any Indian language, you already know what bad auto-captions look like. Wrong words. Wrong timing. Sometimes the wrong language entirely. You spend more time fixing captions than you spent recording the video.
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="skeu-card p-8 mb-10">
            <p className="text-2xl font-display font-bold leading-snug mb-0" style={{ color: "var(--text-primary)" }}>
              &ldquo;The tools that exist were built for English content, with Indian language support added later. That&apos;s not good enough.&rdquo;
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            Code-mixed speech, regional accents, fast delivery, colloquial vocabulary — none of it gets handled properly by tools that weren&apos;t designed for it from day one.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            SAYCAP was built differently. We started with Indian languages, not English. We built our output modes around how Indian creators actually talk: switching between Telugu and English in the same sentence, using Hinglish naturally, speaking in native script for formal content and Roman script for younger audiences.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            The tool was designed around real creative decisions, not a generic transcription workflow.
          </p>
        </FadeIn>

        {/* What we built */}
        <FadeIn delay={250}>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { n: "11", label: "Indian languages" },
              { n: "4", label: "Output modes" },
              { n: "SRT + VTT", label: "Both formats" },
              { n: "0", label: "Manual fixes needed" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6 text-center">
                <div className="font-display font-bold text-3xl mb-1 gradient-text-rose">{item.n}</div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            Four output formats. Eleven languages. SRT and VTT both included. Frame-perfect timing out of the box. It drops into Premiere, CapCut, and DaVinci without any manual work.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            We&apos;re still building. This is version one. If you have a feature request, a language suggestion, or just want to tell us what&apos;s broken, our Slack is open on the Studio plan.
          </p>
        </FadeIn>

        {/* Who it's for */}
        <FadeIn delay={350}>
          <div className="skeu-card p-8 mb-10">
            <h2 className="font-display font-bold text-2xl mb-6" style={{ color: "var(--text-primary)" }}>Who SAYCAP is for</h2>
            <div className="flex flex-col gap-4">
              {[
                { emoji: "🎬", who: "The creator in Hyderabad", what: "making Telugu vlogs" },
                { emoji: "😂", who: "The comedian in Mumbai", what: "writing Hinglish punchlines" },
                { emoji: "📚", who: "The educator in Chennai", what: "explaining calculus in Tamil" },
                { emoji: "✈️", who: "The travel creator from Kerala", what: "posting Reels in Malayalam" },
                { emoji: "🎙️", who: "The podcast editor in Delhi", what: "captioning Hindi interviews" },
              ].map((item) => (
                <div key={item.who} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.who}</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}> {item.what}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm mt-6 font-semibold" style={{ color: "var(--accent)" }}>This was built for you.</p>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="btn-glass btn-primary btn-lg inline-flex justify-center">
              <span>Try SAYCAP free</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/#pricing" className="btn-glass btn-ghost btn-lg inline-flex justify-center">
              <span>View pricing</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
