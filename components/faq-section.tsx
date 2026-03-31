import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeInOnScroll } from "@/components/fade-in-on-scroll";

const faqs = [
  {
    question: "What is Cine List?",
    answer:
      "Cine List is a movie and TV show tracking app that lets you build watchlists based on specific actors, actresses, directors, and crew members — not just by title or genre.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! Cine List is completely free. We use the TMDB API to power our search and filmography data.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "All movie and TV show data is sourced from The Movie Database (TMDB), one of the largest community-built databases for film and television.",
  },
  {
    question: "Can I search for crew members like cinematographers or writers?",
    answer:
      "Absolutely. You can search for any person credited on a film or show — actors, directors, writers, cinematographers, composers, and more.",
  },
  {
    question: "Can I save multiple lists for different people?",
    answer:
      "Yes. You can create separate lists for each person you follow and manage them all from your dashboard.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can browse and search without an account, but creating one lets you save your lists and access them from any device.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInOnScroll>
          <div className="text-center space-y-3 mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about Cine List.
            </p>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
