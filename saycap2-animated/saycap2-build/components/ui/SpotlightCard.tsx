"use client";
import { useState, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ShimmerHeading } from "@/components/ui/ShimmerHeading";

// Simplified but recognisable state outlines as SVG paths (viewBox 0 0 100 100)
const STATE_PATHS: Record<string, string> = {
  Telugu:
    "M 30 15 L 50 10 L 70 18 L 78 35 L 72 55 L 60 75 L 50 85 L 38 72 L 25 55 L 22 38 Z",
  Hindi:
    "M 15 20 L 45 12 L 75 15 L 85 30 L 82 50 L 70 65 L 55 72 L 40 70 L 20 60 L 12 42 Z",
  Tamil:
    "M 35 12 L 60 15 L 72 30 L 70 55 L 58 78 L 45 88 L 35 80 L 28 60 L 25 38 Z",
  Kannada:
    "M 20 18 L 50 12 L 75 20 L 80 42 L 72 62 L 55 75 L 35 72 L 18 58 L 15 35 Z",
  Malayalam:
    "M 38 10 L 58 14 L 68 32 L 65 55 L 55 78 L 44 88 L 36 75 L 30 52 L 32 28 Z",
  Marathi:
    "M 15 25 L 42 15 L 72 20 L 85 38 L 80 58 L 62 72 L 40 75 L 18 62 L 10 42 Z",
  Bengali:
    "M 28 15 L 55 12 L 72 22 L 78 42 L 70 62 L 52 78 L 35 75 L 22 58 L 18 36 Z",
  Gujarati:
    "M 18 22 L 48 12 L 72 18 L 80 36 L 75 55 L 58 70 L 38 72 L 18 60 L 12 40 Z",
  Punjabi:
    "M 20 20 L 55 12 L 78 22 L 82 44 L 72 62 L 48 72 L 25 65 L 14 46 Z",
  Odia:
    "M 30 15 L 58 12 L 74 28 L 75 50 L 62 70 L 44 80 L 28 68 L 20 48 L 22 28 Z",
  "English (IN)":
    "M 20 20 L 50 10 L 80 22 L 88 45 L 80 65 L 65 80 L 50 85 L 35 80 L 18 65 L 12 45 Z",
};

const LANGS = [
  { name: "Telugu",       native: "తెలుగు" },
  { name: "Hindi",        native: "हिन्दी" },
  { name: "Tamil",        native: "தமிழ்" },
  { name: "Kannada",      native: "ಕನ್ನಡ" },
  { name: "Malayalam",    native: "മലയാളം" },
  { name: "Marathi",      native: "मराठी" },
  { name: "Bengali",      native: "বাংলা" },
  { name: "Gujarati",     native: "ગુજરાતી" },
  { name: "Punjabi",      native: "ਪੰਜਾਬੀ" },
  { name: "Odia",         native: "ଓଡ଼ିଆ" },
  { name: "English (IN)", native: "Indian\naccent" },
];

// Distribute langs across 3 arcs: inner=3, mid=4, outer=4
const ARCS = [
  { langs: LANGS.slice(0, 3),  radiusFrac: 0.22, size: 68 },
  { langs: LANGS.slice(3, 7),  radiusFrac: 0.37, size: 64 },
  { langs: LANGS.slice(7, 11), radiusFrac: 0.50, size: 60 },
];

function StateBlob({
  lang,
  size,
  hovered,
  onEnter,
  onLeave,
}: {
  lang: typeof LANGS[0];
  size: number;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const path = STATE_PATHS[lang.name];
  const id = `clip-${lang.name.replace(/[^a-z]/gi, "")}`;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "default",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "scale(1.18)" : "scale(1)",
      }}
    >
      {/* SVG shape */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={id}>
            <path d={path} />
          </clipPath>
          {/* Glow filter */}
          <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={hovered ? "3" : "1.2"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fill */}
        <path
          d={path}
          fill={hovered ? "rgba(200,200,200,0.13)" : "rgba(200,200,200,0.055)"}
          filter={`url(#glow-${id})`}
          style={{ transition: "fill 0.3s ease" }}
        />

        {/* Border */}
        <path
          d={path}
          fill="none"
          stroke={hovered ? "rgba(245,245,245,0.85)" : "rgba(200,200,200,0.25)"}
          strokeWidth={hovered ? "2.5" : "1.5"}
          style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
        />

        {/* Glow border on hover */}
        {hovered && (
          <path
            d={path}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="4"
            style={{ filter: "blur(3px)" }}
          />
        )}

        {/* Native text — fades in on hover, clipped to shape */}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          clipPath={`url(#${id})`}
          style={{
            fontSize: size < 64 ? "13px" : "14px",
            fontWeight: 600,
            fill: "rgba(245,245,245,0.95)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {lang.native.includes("\n") ? (
            <>
              <tspan x="50" dy="-6">{lang.native.split("\n")[0]}</tspan>
              <tspan x="50" dy="14">{lang.native.split("\n")[1]}</tspan>
            </>
          ) : (
            lang.native
          )}
        </text>
      </svg>

      {/* Language name below, fades out on hover */}
      <div
        style={{
          position: "absolute",
          bottom: -18,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          fontWeight: 500,
          color: "var(--text-3)",
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
          opacity: hovered ? 0 : 0.7,
          transition: "opacity 0.25s ease",
        }}
      >
        {lang.name}
      </div>
    </div>
  );
}

function SemiCircleOrbit({
  langs,
  radiusFrac,
  baseWidth,
  centerX,
  centerY,
  size,
  hoveredLang,
  onEnter,
  onLeave,
}: {
  langs: typeof LANGS;
  radiusFrac: number;
  baseWidth: number;
  centerX: number;
  centerY: number;
  size: number;
  hoveredLang: string | null;
  onEnter: (name: string) => void;
  onLeave: () => void;
}) {
  const radius = baseWidth * radiusFrac;
  const count = langs.length;

  return (
    <>
      {/* Orbit ring */}
      <div
        style={{
          position: "absolute",
          left: centerX - radius,
          top: centerY - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          border: "1px solid rgba(200,200,200,0.08)",
          clipPath: "inset(0 0 50% 0)", // show only top half
          pointerEvents: "none",
        }}
      />

      {langs.map((lang, i) => {
        // Spread evenly across 180° top arc
        const angle = (i / (count - 1)) * 180; // 0° = right, 180° = left
        const rad = (angle * Math.PI) / 180;
        // Semi-circle: x goes right-to-left across top
        const x = centerX + radius * Math.cos(Math.PI - rad);
        const y = centerY - radius * Math.sin(rad);

        return (
          <div
            key={lang.name}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              zIndex: 5,
            }}
          >
            <StateBlob
              lang={lang}
              size={size}
              hovered={hoveredLang === lang.name}
              onEnter={() => onEnter(lang.name)}
              onLeave={onLeave}
            />
          </div>
        );
      })}
    </>
  );
}

export default function Languages() {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const baseWidth = Math.min(width * 0.85, 760);
  const centerX = baseWidth / 2;
  // centerY is where the "base" of the semi-circle sits
  const centerY = baseWidth * 0.52;
  const canvasHeight = baseWidth * 0.56;

  return (
    <section id="languages" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="label-tag" style={{ marginBottom: 20, display: "inline-flex" }}>
              11 Languages
            </span>
            <ShimmerHeading className="t-h2" style={{ marginTop: 16, marginBottom: 12 }}>
              Your language<br /><em>is already here.</em>
            </ShimmerHeading>
            <p className="t-body" style={{ maxWidth: 420, margin: "0 auto" }}>
              Built for the languages 1.4 billion people speak every day. Not as an afterthought. As the whole point.
            </p>
          </div>
        </Reveal>

        {/* Semi-circle orbit */}
        {width > 0 && (
          <Reveal delay={100}>
            <div
              style={{
                position: "relative",
                width: baseWidth,
                height: canvasHeight,
                margin: "0 auto",
              }}
            >
              {/* Radial glow from center bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: baseWidth * 0.7,
                  height: baseWidth * 0.4,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at center bottom, rgba(200,200,200,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {ARCS.map((arc) => (
                <SemiCircleOrbit
                  key={arc.radiusFrac}
                  langs={arc.langs}
                  radiusFrac={arc.radiusFrac}
                  baseWidth={baseWidth}
                  centerX={centerX}
                  centerY={centerY}
                  size={arc.size}
                  hoveredLang={hoveredLang}
                  onEnter={setHoveredLang}
                  onLeave={() => setHoveredLang(null)}
                />
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={200}>
          <div
            style={{
              marginTop: 48,
              padding: "20px 24px",
              borderRadius: 16,
              background: "var(--glass-bg)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--bg3)", border: "1px solid var(--border-mid)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16 }}>🗣️</span>
            </div>
            <p className="t-small">
              <strong style={{ color: "var(--text-1)", fontWeight: 600 }}>
                Code-mixed speech handled natively.
              </strong>{" "}
              If your audio switches between Telugu and English mid-sentence, SAYCAP understands both. No extra setup needed.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
