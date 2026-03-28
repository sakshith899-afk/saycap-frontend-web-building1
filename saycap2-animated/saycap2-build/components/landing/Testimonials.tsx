"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

const TESTIMONIALS = [
  { name: "Arjun Reddy", role: "Telugu YouTuber · 340K subs", avatar: "AR", quote: "I was spending two hours per video fixing auto-captions. SAYCAP cut that to literally zero. The Tenglish mode is exactly how my audience reads.", rating: 5 },
  { name: "Priya Nair", role: "Video Editor · Mumbai", avatar: "PN", quote: "I edit for three different creators, all in different languages. Now it's the same four steps every time. The SRT drops straight into Premiere and syncs perfectly.", rating: 5 },
  { name: "Karthik S.", role: "Hindi Podcast Editor · Delhi", avatar: "KS", quote: "The phonetic mode is a game changer for our Hinglish content. We went from 12% watch time to 31% after adding proper captions.", rating: 5 },
  { name: "Deepa Menon", role: "Malayalam Creator · Kochi", avatar: "DM", quote: "I tried five different tools. All of them mangled Malayalam. SAYCAP got it right on the first try, including my regional accent.", rating: 4.5 },
  { name: "Sahil Bhatia", role: "Freelance Editor · Pune", avatar: "SB", quote: "The speed is what got me. Upload, pick Telugu, pick Codemix, hit generate. By the time I switch back to Premiere the file is ready.", rating: 5 },
];

function TestimonialCard({
  testimonial,
  index,
  total,
  progress,
}: {
  testimonial: typeof TESTIMONIALS[0];
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);

  const y = useTransform(progress, [start, end], ["0%", "-160%"]);
  const rotate = useTransform(progress, [start - 0.5, end / 1.5], [-index + 90, 0]);
  const scale = useTransform(progress, [start, end], [1, 0.95]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: index * 8,
        zIndex: (total - index) * 10,
        y,
        rotate,
        scale,
        width: "100%",
        maxWidth: 380,
        left: "50%",
        marginLeft: -190,
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className="card-skeu"
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Stars */}
        <div style={{ display: "flex", gap: 3 }}>
          {[...Array(5)].map((_, si) => (
            <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill={si < Math.floor(testimonial.rating) ? "var(--silver)" : "var(--text-3)"} opacity={si < Math.floor(testimonial.rating) ? 1 : 0.3}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-2)", letterSpacing: "-0.01em" }}>
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "var(--glass-bg)", border: "1px solid var(--border-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600, color: "var(--silver)",
          }}>
            {testimonial.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{testimonial.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{testimonial.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <section style={{ padding: "120px 24px 0", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>From creators</span>
            <ShimmerHeading className="t-h2" style={{ marginTop: 16 }}>
              They said it better<br /><em>than we could.</em>
            </ShimmerHeading>
          </div>
        </Reveal>

        {/* Scroll-driven card stack */}
        <div
          ref={scrollRef}
          style={{
            position: "relative",
            minHeight: "250vh",
            width: "100%",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: 1000,
            }}
          >
            <div style={{ position: "relative", width: 380, height: 450 }}>
              {TESTIMONIALS.map((t, i) => (
                <TestimonialCard
                  key={t.name}
                  testimonial={t}
                  index={i + 1}
                  total={TESTIMONIALS.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
