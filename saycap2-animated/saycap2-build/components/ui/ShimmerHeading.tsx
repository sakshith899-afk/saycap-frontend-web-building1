"use client";
import { useEffect, useRef, useState, ReactNode } from "react";

interface ShimmerHeadingProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
  delay?: number;
}

export function ShimmerHeading({
  children,
  className = "",
  style = {},
  as: Tag = "h2",
  delay = 0,
}: ShimmerHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Tag
        ref={ref as React.RefObject<HTMLHeadingElement>}
        className={`${className} ${visible ? "shimmer-heading-visible" : "shimmer-heading"}`}
        style={{
          ...style,
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </Tag>
      <style>{`
        .shimmer-heading {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .shimmer-heading-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          animation: shimmerSlide 1.8s ease 0.4s 1 both;
        }
        @keyframes shimmerSlide {
          0% {
            background-position: 250% center;
          }
          100% {
            background-position: -100% center;
          }
        }
        .shimmer-heading-visible {
          background-image: linear-gradient(
            90deg,
            var(--text-1) 0%,
            var(--text-1) 35%,
            rgba(200, 200, 200, 0.9) 50%,
            var(--text-1) 65%,
            var(--text-1) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shimmer-heading-visible em {
          -webkit-text-fill-color: var(--silver);
        }
      `}</style>
    </>
  );
}
