"use client";
import { motion } from "framer-motion";

interface WaveTextProps {
  text: string;
  className?: string;
}

export function WaveText({ text, className = "" }: WaveTextProps) {
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", cursor: "default" }}
      whileHover="hover"
      initial="initial"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{ display: "inline-block" }}
          variants={{
            initial: {
              y: 0,
              scale: 1,
            },
            hover: {
              y: -3,
              scale: 1.08,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: index * 0.025,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
