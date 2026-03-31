import { Button } from "@/components/ui/button";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInOnScroll>
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 md:p-16 text-center space-y-6">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight relative">
              Ready to build your list?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto relative">
              Join thousands of film enthusiasts who track movies and shows by
              the people behind them. It&apos;s free, fast, and powered by TMDB.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Button size="lg" className="gap-2">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
