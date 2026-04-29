"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { User, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  // Debounced search
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

  // Close dropdown on outside click
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

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">Select a Person</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose an actor, actress, director, or any cast/crew member to track
          their work.
        </p>
      </div>

      {selectedPerson ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
            {selectedPerson.profilePath ? (
              <Image
                src={tmdbImageUrl(selectedPerson.profilePath, "w92")}
                alt={selectedPerson.name}
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {selectedPerson.name}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {selectedPerson.knownForDepartment}
            </Badge>
          </div>
          <button
            onClick={() => onSelectPerson(null)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove person</span>
          </button>
        </div>
      ) : (
        <div ref={containerRef} className="relative">
          <div className="relative">
            {loading ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
            ) : (
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              placeholder="Search for a person..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              className="pl-10"
            />
          </div>

          {open && results.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
              {results.map((person) => (
                <button
                  key={person.id}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
                  onClick={() => handleSelect(person)}
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                    {person.profilePath ? (
                      <Image
                        src={tmdbImageUrl(person.profilePath, "w92")}
                        alt={person.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
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
            <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover px-4 py-3 text-sm text-muted-foreground shadow-lg">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
