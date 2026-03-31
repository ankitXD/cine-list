import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clapperboard, Sparkles, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-125 w-200 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-75 w-100 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by TMDB
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Track films by the <span className="text-primary">people</span> who
            make them
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Not just another watchlist. Build your collection around the actors,
            directors, and crew you love. Never miss a film from your favorites
            again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" className="gap-2">
              Start Building Your List
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clapperboard className="h-4 w-4" />
              <span>900K+ Movies & Shows</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Actors, Directors & Crew</span>
            </div>
          </div>
        </div>

        {/* Decorative poster grid preview */}
        <div className="relative mt-16 mx-auto max-w-4xl">
          <div className="grid grid-cols-5 gap-3 md:gap-4 opacity-80">
            {[
              { title: "Film 1", color: "bg-primary/10" },
              { title: "Film 2", color: "bg-primary/15" },
              { title: "Film 3", color: "bg-primary/20" },
              { title: "Film 4", color: "bg-primary/15" },
              { title: "Film 5", color: "bg-primary/10" },
            ].map((item, i) => (
              <div
                key={i}
                className={`aspect-2/3 rounded-lg ${item.color} border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards`}
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
