import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export default function About() {
  return (
    <div style={{ minHeight: "100svh", paddingTop: 60, background: "var(--bg)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 96px" }}>

        <Reveal>
          <span className="label-tag" style={{ marginBottom: 28, display: "inline-flex" }}>Our story</span>
          <h1 style={{ fontSize: "clamp(44px, 8vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.96, color: "var(--text-1)", marginTop: 20, marginBottom: 40 }}>
            We got tired of<br />
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--silver)" }}>broken captions.</em>
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p className="t-body" style={{ marginBottom: 24 }}>
            If you make videos in Telugu, Hindi, Tamil, or any Indian language, you already know what bad auto-captions look like. Wrong words. Wrong timing. Sometimes the wrong language entirely. You spend more time fixing captions than you spent recording the video.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="card-skeu" style={{ padding: 32, marginBottom: 32 }}>
            <p style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", lineHeight: 1.35 }}>
              &ldquo;The tools that exist were built for English content, with Indian language support added later. That&apos;s not good enough.&rdquo;
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="t-body" style={{ marginBottom: 20 }}>
            Code-mixed speech, regional accents, fast delivery, colloquial vocabulary — none of it gets handled properly by tools that were not designed for it from day one.
          </p>
          <p className="t-body" style={{ marginBottom: 20 }}>
            SAYCAP was built differently. We started with Indian languages, not English. We built our output modes around how Indian creators actually talk — switching between Telugu and English in the same sentence, using Hinglish naturally, speaking in native script for formal content and Roman script for younger audiences.
          </p>
          <p className="t-body" style={{ marginBottom: 40 }}>
            Four output modes. Eleven languages. SRT and VTT both included. Frame-perfect timing. It drops into Premiere, CapCut, and DaVinci without any manual work.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 40 }}>
            {[["11", "Indian languages"], ["4", "Output modes"], ["SRT + VTT", "Both formats"], ["0", "Manual fixes needed"]].map(([v, l]) => (
              <div key={l} className="card" style={{ padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="card-skeu" style={{ padding: 28, marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-1)", marginBottom: 20 }}>Who SAYCAP is for</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🎬", "The creator in Hyderabad", "making Telugu vlogs"],
                ["😂", "The comedian in Mumbai", "writing Hinglish punchlines"],
                ["📚", "The educator in Chennai", "explaining calculus in Tamil"],
                ["✈️", "The travel creator from Kerala", "posting Reels in Malayalam"],
                ["🎙️", "The podcast editor in Delhi", "captioning Hindi interviews"],
              ].map(([emoji, who, what]) => (
                <div key={who} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <p style={{ fontSize: 13, letterSpacing: "-0.01em" }}>
                    <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>{who}</strong>
                    <span style={{ color: "var(--text-2)" }}> {what}</span>
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--silver)", fontWeight: 600, marginTop: 20, letterSpacing: "-0.01em" }}>This was built for you.</p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
              <span>Try SAYCAP free</span><ArrowRight size={16} />
            </Link>
            <Link href="/#pricing" className="btn btn-ghost btn-lg" style={{ display: "inline-flex" }}>
              <span>View pricing</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
