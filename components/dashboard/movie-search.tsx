"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, Film, Tv, Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPersonCredits } from "@/lib/tmdb-client";
import { tmdbImageUrl } from "@/lib/tmdb-utils";
import type { Person, Movie } from "@/lib/types";

export type { Movie };

type MediaFilter = "all" | "movie" | "tv";

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
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [credits, setCredits] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setCredits([]);
    setQuery("");
    setMediaFilter("all");

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

  const filtered = credits.filter((m) => {
    const matchesQuery = query.trim()
      ? m.title.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesMedia =
      mediaFilter === "all" ? true : m.mediaType === mediaFilter;
    return matchesQuery && matchesMedia;
  });

  const movieCount = credits.filter((m) => m.mediaType === "movie").length;
  const tvCount = credits.filter((m) => m.mediaType === "tv").length;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Filmography</h2>
          {!loading && credits.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {movieCount} film{movieCount !== 1 ? "s" : ""} · {tvCount} TV show
              {tvCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Filter bar */}
        {!loading && credits.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "movie", "tv"] as MediaFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setMediaFilter(f)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  mediaFilter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {f === "all" ? "All" : f === "movie" ? "Films" : "TV Shows"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search filter */}
      {!loading && credits.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder={`Filter filmography…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl overflow-hidden bg-muted"
            >
              <div className="aspect-2/3" />
              <div className="p-2 space-y-1.5">
                <div className="h-2.5 rounded bg-muted-foreground/15" />
                <div className="h-2 w-10 rounded bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="py-12 text-center text-sm text-destructive">
          Failed to load credits. Please try again.
        </p>
      )}

      {/* Empty filter result */}
      {!loading && !error && filtered.length === 0 && credits.length > 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No titles matching &quot;{query}&quot;
        </p>
      )}

      {/* Poster grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map((movie) => {
            const isAdded = addedMovieIds.has(movie.id);
            const posterSrc = movie.posterPath
              ? tmdbImageUrl(movie.posterPath, "w185")
              : null;

            return (
              <div
                key={movie.id}
                className={cn(
                  "group relative rounded-xl overflow-hidden bg-muted cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl",
                  isAdded &&
                    "opacity-50 hover:scale-100 hover:shadow-none cursor-default",
                )}
              >
                {/* Poster */}
                <div className="relative aspect-2/3">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 17vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Film className="h-8 w-8 text-muted-foreground/25" />
                    </div>
                  )}

                  {/* Hover overlay + Add button */}
                  {!isAdded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/55 transition-all duration-200">
                      <button
                        onClick={() => onAddMovie(movie)}
                        className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  )}

                  {/* Added checkmark */}
                  {isAdded && (
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}

                  {/* Media type badge */}
                  <div className="absolute bottom-1.5 left-1.5">
                    <Badge
                      variant="secondary"
                      className="h-4 gap-0.5 px-1.5 py-0 text-[9px] font-semibold leading-none"
                    >
                      {movie.mediaType === "tv" ? (
                        <>
                          <Tv className="h-2.5 w-2.5" />
                          TV
                        </>
                      ) : (
                        <>
                          <Film className="h-2.5 w-2.5" />
                          Film
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Card info */}
                <div className="p-2">
                  <p className="text-xs font-semibold leading-tight line-clamp-1">
                    {movie.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {movie.year}
                    {movie.rating > 0 && ` · ★${movie.rating}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
