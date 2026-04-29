"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, Film, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPersonCredits } from "@/lib/tmdb-client";
import { tmdbImageUrl } from "@/lib/tmdb-utils";
import type { Person, Movie } from "@/lib/types";

export type { Movie };

interface MovieSearchProps {
  person: Person;
  onAddMovie: (movie: Movie) => void;
  addedMovieIds: Set<number>;
}

export function MovieSearch({
  person,
  onAddMovie,
  addedMovieIds,
}: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [credits, setCredits] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch credits whenever the selected person changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setCredits([]);
    setQuery("");

    getPersonCredits(person.id)
      .then((data) => {
        if (!cancelled) setCredits(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [person.id]);

  const filtered = query.trim()
    ? credits.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    : credits;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">
          Movies &amp; Shows — {person.name}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add titles from their filmography to your tracking list.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Filter ${person.name}'s filmography...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading filmography…
        </div>
      )}

      {error && (
        <p className="py-4 text-center text-sm text-destructive">
          Failed to load credits. Please try again.
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          {query.trim()
            ? `No results matching "${query}"`
            : "No filmography found."}
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-1 max-h-72 overflow-y-auto rounded-md border border-border p-1.5 pr-2">
          {filtered.map((movie) => {
            const isAdded = addedMovieIds.has(movie.id);
            const posterSrc = movie.posterPath
              ? tmdbImageUrl(movie.posterPath, "w92")
              : null;

            return (
              <div
                key={movie.id}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 transition-colors",
                  isAdded ? "opacity-50" : "hover:bg-accent",
                )}
              >
                {/* Poster thumbnail */}
                <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded bg-muted">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={movie.title}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{movie.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {movie.year}
                    </span>
                    {movie.rating > 0 && (
                      <span className="text-xs text-muted-foreground">
                        · ★ {movie.rating}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[10px] leading-none"
                    >
                      {movie.mediaType === "tv" ? (
                        <>
                          <Tv className="mr-0.5 h-2.5 w-2.5" />
                          TV
                        </>
                      ) : (
                        <>
                          <Film className="mr-0.5 h-2.5 w-2.5" />
                          Film
                        </>
                      )}
                    </Badge>
                  </div>
                  {movie.character && (
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                      {movie.character}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={isAdded ? "secondary" : "default"}
                  disabled={isAdded}
                  className="shrink-0"
                  onClick={() => onAddMovie(movie)}
                >
                  {isAdded ? "Added" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
