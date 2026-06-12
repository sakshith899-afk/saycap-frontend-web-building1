"use client";
import React, { useEffect, useRef, ReactNode } from "react";

const GLOW_CSS = `
[data-glow]::before,
[data-glow]::after {
  pointer-events: none;
  content: "";
  position: absolute;
  inset: calc(var(--border-size) * -1);
  border: var(--border-size) solid transparent;
  border-radius: calc(var(--radius) * 1px);
  background-attachment: fixed;
  background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
  background-repeat: no-repeat;
  background-position: 50% 50%;
  mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  -webkit-mask-composite: destination-in;
}
[data-glow]::before {
  background-image: radial-gradient(
    calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
    calc(var(--x, -999) * 1px) calc(var(--y, -999) * 1px),
    hsl(0 0% 85% / var(--border-spot-opacity, 0.9)),
    transparent 100%
  );
  filter: brightness(2);
}
[data-glow]::after {
  background-image: radial-gradient(
    calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
    calc(var(--x, -999) * 1px) calc(var(--y, -999) * 1px),
    hsl(0 0% 100% / var(--border-light-opacity, 0.12)),
    transparent 100%
  );
}
`;

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderRadius?: number;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor,
  borderRadius = 20,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!injected.current && typeof document !== "undefined") {
      if (!document.getElementById("saycap-glow-styles")) {
        const tag = document.createElement("style");
        tag.id = "saycap-glow-styles";
        tag.textContent = GLOW_CSS;
        document.head.appendChild(tag);
      }
      injected.current = true;
    }

    const sync = (e: PointerEvent) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", e.clientX.toFixed(2));
        cardRef.current.style.setProperty("--xp", (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", e.clientY.toFixed(2));
        cardRef.current.style.setProperty("--yp", (e.clientY / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener("pointermove", sync);
    return () => document.removeEventListener("pointermove", sync);
  }, []);

  return (
    <div
      ref={cardRef}
      data-glow
      className={className}
      style={{
        "--radius": String(borderRadius),
        "--border": "2",
        "--border-size": "calc(var(--border, 2) * 1px)",
        "--backdrop": "hsl(0 0% 100% / 0.035)",
        "--backup-border": "hsl(0 0% 100% / 0.1)",
        "--size": "300",
        "--spotlight-size": "calc(var(--size, 200) * 1px)",
        "--border-spot-opacity": "0.9",
        "--border-light-opacity": "0.12",
        backgroundImage: `radial-gradient(
          300px 300px at calc(var(--x, -999) * 1px) calc(var(--y, -999) * 1px),
          rgba(200,200,200,0.035), transparent
        )`,
        backgroundColor: "var(--backdrop)",
        backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
        backgroundPosition: "50% 50%",
        backgroundAttachment: "fixed",
        border: "var(--border-size) solid var(--backup-border)",
        position: "relative",
        borderRadius,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
