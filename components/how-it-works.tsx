import { FadeInOnScroll } from "@/components/fade-in-on-scroll";
import { Search, ListPlus, Tv } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search for a person",
    description:
      "Find any actor, actress, director, or crew member using the TMDB database.",
  },
  {
    icon: ListPlus,
    title: "Browse their filmography",
    description:
      "See every movie and TV show they've been involved in — all in one place.",
  },
  {
    icon: Tv,
    title: "Add to your list",
    description:
      "Save the titles you want to watch and build a collection centered around the people you follow.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInOnScroll>
          <div className="text-center space-y-3 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to build your person-centered watchlist.
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <FadeInOnScroll key={i}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
