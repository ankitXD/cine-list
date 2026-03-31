import { Card, CardContent } from "@/components/ui/card";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { Users, Film, Tv, Clapperboard } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Person-Centric Lists",
    description:
      "Build your watchlist around actors, directors, writers, and crew — not just genres or trends.",
  },
  {
    icon: Film,
    title: "Complete Filmographies",
    description:
      "Access full filmographies powered by TMDB. Every movie and show credit in one place.",
  },
  {
    icon: Tv,
    title: "Movies & TV Shows",
    description:
      "Track both films and television series. If they worked on it, you can find it.",
  },
  {
    icon: Clapperboard,
    title: "Beyond the Cast",
    description:
      "Go beyond actors. Follow cinematographers, composers, editors — anyone who helped create the work.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInOnScroll>
          <div className="text-center space-y-3 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Why{" "}
              <span className="font-brand text-3xl md:text-4xl">Cine List</span>
              ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A smarter way to discover and track what to watch next.
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <FadeInOnScroll key={i}>
              <Card className="bg-card border-border/50 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
