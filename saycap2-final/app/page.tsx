import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Languages from "@/components/landing/Languages";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import AboutTeaser from "@/components/landing/AboutTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Testimonials />
      <Pricing />
      <AboutTeaser />
    </>
  );
}
