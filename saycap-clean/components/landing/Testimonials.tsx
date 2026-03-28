"use client";

const TESTIMONIALS = [
  {
    name: "Arjun Reddy",
    handle: "@arjunreddy.vlogs",
    role: "Telugu YouTuber · 340K subscribers",
    quote: "I was spending two hours per video fixing auto-captions. SAYCAP cut that to literally zero. The Tenglish mode is exactly how my audience reads — Telugu words in Telugu, English words in English. Nothing else does this.",
    avatar: "AR",
    color: "#FB7185",
  },
  {
    name: "Priya Nair",
    handle: "@priyanaircuts",
    role: "Video Editor · Mumbai",
    quote: "I edit for three different creators, all in different languages. Before SAYCAP I had a different workflow for each one. Now it's the same four steps every time. The SRT drops straight into Premiere and syncs perfectly. My clients can't believe how fast I deliver now.",
    avatar: "PN",
    color: "#C8C8C8",
  },
  {
    name: "Karthik S.",
    handle: "@karthik.speaks",
    role: "Hindi Podcast Editor · Delhi",
    quote: "The phonetic mode is a game changer for our Hinglish content. Viewers who understand spoken Hindi but grew up reading English — this is exactly what they needed. We went from 12% watch time to 31% after adding proper captions.",
    avatar: "KS",
    color: "#F59E0B",
  },
  {
    name: "Deepa Menon",
    handle: "@deepacooks",
    role: "Malayalam Content Creator · Kochi",
    quote: "I tried five different tools. All of them mangled Malayalam. SAYCAP got it right on the first try, including my regional accent. The native script output is clean enough to use without editing. That alone is worth the subscription.",
    avatar: "DM",
    color: "#34D399",
  },
  {
    name: "Sahil Bhatia",
    handle: "@sahilbhatia.pro",
    role: "Freelance Video Editor · Pune",
    quote: "The speed is what got me. I upload, pick Telugu, pick Codemix, hit generate. By the time I switch back to Premiere the file is ready. It's faster than making a coffee. I've recommended this to every editor I know.",
    avatar: "SB",
    color: "#A78BFA",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 px-6 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <span className="section-label">From creators</span>
          </div>
          <h2 className="font-display font-bold mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--text-primary)" }}>
            They said it better than we could.
          </h2>
        </div>

        {/* Masonry-style layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="testimonial-card break-inside-avoid"
              style={{
                animationDelay: `${i * 100}ms`,
              }}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill={t.color} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
                  style={{ background: `${t.color}20`, border: `1px solid ${t.color}40`, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-dim)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
