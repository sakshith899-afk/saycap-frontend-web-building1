import { Reveal } from "@/components/ui/Reveal";

const TESTIMONIALS = [
  { name: "Arjun Reddy", role: "Telugu YouTuber · 340K subs", avatar: "AR", quote: "I was spending two hours per video fixing auto-captions. SAYCAP cut that to literally zero. The Tenglish mode is exactly how my audience reads." },
  { name: "Priya Nair", role: "Video Editor · Mumbai", avatar: "PN", quote: "I edit for three different creators, all in different languages. Now it's the same four steps every time. The SRT drops straight into Premiere and syncs perfectly." },
  { name: "Karthik S.", role: "Hindi Podcast Editor · Delhi", avatar: "KS", quote: "The phonetic mode is a game changer for our Hinglish content. We went from 12% watch time to 31% after adding proper captions." },
  { name: "Deepa Menon", role: "Malayalam Creator · Kochi", avatar: "DM", quote: "I tried five different tools. All of them mangled Malayalam. SAYCAP got it right on the first try, including my regional accent." },
  { name: "Sahil Bhatia", role: "Freelance Editor · Pune", avatar: "SB", quote: "The speed is what got me. Upload, pick Telugu, pick Codemix, hit generate. By the time I switch back to Premiere the file is ready." },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "120px 24px", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>From creators</span>
            <h2 className="t-h2" style={{ marginTop: 16 }}>
              They said it better<br /><em>than we could.</em>
            </h2>
          </div>
        </Reveal>

        <div style={{ columns: "300px 3", gap: 12 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="card-skeu" style={{ padding: 28, marginBottom: 12, breakInside: "avoid" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width="13" height="13" viewBox="0 0 24 24" fill="var(--silver)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-2)", letterSpacing: "-0.01em", marginBottom: 20 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: "var(--glass-bg)", border: "1px solid var(--border-mid)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600, color: "var(--silver)",
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
