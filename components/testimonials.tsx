import { Card, CardContent } from "@/components/ui/card";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Film Enthusiast",
    content:
      "I've been following Denis Villeneuve's entire filmography and Cine List made it so easy to track every single one. Absolute game changer!",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Cinephile",
    content:
      "Finally a site that lets me follow an actor's career properly. I added every Saoirse Ronan film in minutes. Love the simplicity.",
    rating: 5,
  },
  {
    name: "Aisha K.",
    role: "TV Binge-Watcher",
    content:
      "I use it to track shows by their showrunners. Found so many hidden gems I would have never discovered otherwise.",
    rating: 5,
  },
  {
    name: "Jake R.",
    role: "Casual Viewer",
    content:
      "My friend recommended it when I said I wanted to watch every Christopher Nolan movie. Now I use it for everything.",
    rating: 4,
  },
  {
    name: "Lina M.",
    role: "Film Student",
    content:
      "As a film student, tracking directors and cinematographers is essential. Cine List is the tool I didn't know I needed.",
    rating: 5,
  },
  {
    name: "David W.",
    role: "Movie Buff",
    content:
      "The crew-based approach is brilliant. I followed Roger Deakins and discovered masterpieces I'd missed. Simple and effective.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInOnScroll>
          <div className="text-center space-y-3 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Loved by film fans
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              See what people are saying about building their lists around the
              creators they admire.
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <FadeInOnScroll key={i}>
              <Card className="bg-card border-border/50 h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < t.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed">{t.content}</p>
                  <div className="pt-2">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
