import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

export default function AboutTeaser() {
  return (
    <section style={{ padding: "120px 24px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <div className="card-skeu" style={{ padding: "clamp(40px, 6vw, 72px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,200,200,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="label-tag" style={{ marginBottom: 24, display: "inline-flex" }}>Our story</span>
              <ShimmerHeading className="t-h2" style={{ marginTop: 20, marginBottom: 20 }}>
                Built in India.<br /><em>For Indian creators.</em>
              </ShimmerHeading>
              <p className="t-body" style={{ maxWidth: 480, margin: "0 auto 12px" }}>
                {"Auto-captions on YouTube mangle Indian languages. We built the tool we wished existed."}
              </p>
              <p className="t-body" style={{ maxWidth: 480, margin: "0 auto 40px" }}>
                {"If you make content in an Indian language - this was made for you."}
              </p>
              <Link href="/about" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
                <span>Read our story</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
