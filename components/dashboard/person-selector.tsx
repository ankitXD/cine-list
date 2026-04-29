"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X, Loader2, Clapperboard, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { searchPeople } from "@/lib/tmdb-client";
import { tmdbImageUrl } from "@/lib/tmdb-utils";
import type { Person } from "@/lib/types";

export type { Person };

interface PersonSelectorProps {
  selectedPerson: Person | null;
  onSelectPerson: (person: Person | null) => void;
}

export function PersonSelector({
  selectedPerson,
  onSelectPerson,
}: PersonSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const people = await searchPeople(query);
        setResults(people.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(person: Person) {
    onSelectPerson(person);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  /* ── Selected state — cinematic profile banner ── */
  if (selectedPerson) {
    const bgSrc = selectedPerson.profilePath
      ? tmdbImageUrl(selectedPerson.profilePath, "w500")
      : null;

    return (
      <section className="relative overflow-hidden border-b border-border bg-card">
        {/* Blurred photo background */}
        {bgSrc && (
          <div className="absolute inset-0">
            <Image
              src={bgSrc}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top scale-110 blur-3xl opacity-20"
            />
          </div>
        )}
        {/* Gradient overlay — text readable on left, photo shows on right */}
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-background/40" />

        <div className="relative container mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-5">
            Now exploring
          </p>

          <div className="flex items-center gap-5 md:gap-8">
            {/* Profile photo */}
            <div className="relative h-20 w-20 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
              {selectedPerson.profilePath ? (
                <Image
                  src={tmdbImageUrl(selectedPerson.profilePath, "w185")}
                  alt={selectedPerson.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Name + dept */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight truncate">
                {selectedPerson.name}
              </h2>
              <Badge variant="secondary" className="mt-3 px-3 py-1 text-sm">
                {selectedPerson.knownForDepartment}
              </Badge>
            </div>

            {/* Change button */}
            <button
              onClick={() => onSelectPerson(null)}
              className="shrink-0 flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Change</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── No person — cinematic search hero ── */
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      {/* Glow orb */}
      <div className="pointer-events-none absolute left-1/2 top-0 aspect-square w-3/4 max-w-3xl -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative container mx-auto max-w-3xl px-4 md:px-6 py-20 md:py-28 text-center">
        {/* Pill label */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 backdrop-blur-sm">
          <Clapperboard className="h-3.5 w-3.5" />
          Movies · TV Shows · Documentaries
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
          Whose filmography
          <br className="hidden sm:block" /> are you exploring?
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Search for any actor, director, writer, or crew member and add their
          titles to your tracking list.
        </p>

        {/* Search input */}
        <div ref={containerRef} className="relative max-w-xl mx-auto text-left">
          <div className="relative group">
            {loading ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            )}
            <input
              placeholder="e.g. Zendaya, Christopher Nolan, Anya Taylor-Joy…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              className="w-full h-14 rounded-2xl border border-border bg-background pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            />
          </div>

          {/* Results dropdown */}
          {open && results.length > 0 && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
              {results.map((person) => (
                <button
                  key={person.id}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                  onClick={() => handleSelect(person)}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {person.profilePath ? (
                      <Image
                        src={tmdbImageUrl(person.profilePath, "w92")}
                        alt={person.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium truncate">
                    {person.name}
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs shrink-0">
                    {person.knownForDepartment}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {open && !loading && query.trim() && results.length === 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-popover px-4 py-4 text-sm text-muted-foreground shadow-2xl">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
