"use client";
import React, { useEffect, useRef, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderRadius?: number;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(200, 200, 200, 0.15)",
  borderRadius = 20,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
    };

    card.addEventListener("pointermove", handleMove);
    return () => card.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        position: "relative",
        borderRadius,
        overflow: "hidden",
        ["--spot-x" as string]: "-999px",
        ["--spot-y" as string]: "-999px",
        ["--spot-color" as string]: spotlightColor,
      }}
    >
      {/* Glow border overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          pointerEvents: "none",
          zIndex: 2,
          background: `radial-gradient(
            320px circle at var(--spot-x) var(--spot-y),
            var(--spot-color),
            transparent 70%
          )`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 1,
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Inner glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          pointerEvents: "none",
          zIndex: 1,
          background: `radial-gradient(
            400px circle at var(--spot-x) var(--spot-y),
            rgba(200, 200, 200, 0.03),
            transparent 60%
          )`,
        }}
      />
      {children}
    </div>
  );
}
