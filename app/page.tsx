import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
