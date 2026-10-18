import Hero from "@/components/home/Hero";
import ConverterGrid from "@/components/home/ConverterGrid";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import CTABand from "@/components/home/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <ConverterGrid />
      <HowItWorks />
      <Features />
      <FAQ />
      <CTABand />
    </>
  );
}