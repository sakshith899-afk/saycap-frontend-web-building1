"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Match Clerk's hosted UI to the dark, monochrome SAYCAP theme.
const clerkAppearance = {
  variables: {
    colorPrimary: "#C8C8C8",
    colorBackground: "#111111",
    colorInputBackground: "#181818",
    colorText: "#F5F5F5",
    colorTextSecondary: "#888888",
    colorInputText: "#F5F5F5",
    borderRadius: "12px",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sc-theme");
    if (saved === "light") setDark(false);
  }, []);

  const toggle = () => {
    setDark(d => {
      const next = !d;
      localStorage.setItem("sc-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ClerkProvider appearance={clerkAppearance}>
    <html lang="en" className={dark ? "" : "light"} suppressHydrationWarning>
      <head>
        <title>SAYCAP — Captions that speak your language</title>
        <meta name="description" content="SAYCAP converts Indian language audio into frame-perfect SRT caption files. 11 languages. 4 output modes. Built for creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23888'/><text x='50%25' y='56%25' text-anchor='middle' dominant-baseline='middle' font-family='-apple-system,Helvetica' font-weight='800' font-size='16' fill='%230A0A0A'>S</text></svg>" />
      </head>
      <body>
        <Navbar dark={dark} onToggle={toggle} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
