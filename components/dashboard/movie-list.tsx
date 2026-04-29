"use client";

import Image from "next/image";
import { Trash2, Eye, EyeOff, Film, Tv } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { tmdbImageUrl } from "@/lib/tmdb-utils";
import type { TrackedMovie } from "@/lib/types";

export type { TrackedMovie };

interface MovieListProps {
  movies: TrackedMovie[];
  onToggleWatched: (movieId: number) => void;
  onRemoveMovie: (movieId: number) => void;
}

export function MovieList({
  movies,
  onToggleWatched,
  onRemoveMovie,
}: MovieListProps) {
  if (movies.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Film className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No movies added yet</EmptyTitle>
          <EmptyDescription>
            Select a person above and add titles from their filmography to start
            building your list.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Your Movie List
        </h2>
        <Badge variant="secondary">
          {movies.length} title{movies.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {movies.map(({ movie, selectedBecauseOf, watched }) => {
          const posterSrc = movie.posterPath
            ? tmdbImageUrl(movie.posterPath, "w342")
            : null;
          const MediaIcon = movie.mediaType === "tv" ? Tv : Film;

          return (
            <Card
              key={movie.id}
              className={cn(
                "group overflow-hidden rounded-xl bg-card p-3 shadow-sm transition-all",
                watched && "opacity-60",
              )}
            >
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted">
                {posterSrc ? (
                  <Image
                    src={posterSrc}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <MediaIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent" />

                {watched && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge
                      variant="default"
                      className="bg-green-600 text-white"
                    >
                      Watched
                    </Badge>
                  </div>
                )}

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 z-10 h-7 w-7 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 hover:text-destructive"
                  onClick={() => onRemoveMovie(movie.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove movie</span>
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {movie.year}
                    {movie.rating > 0 && ` · ★ ${movie.rating}`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Because of
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {selectedBecauseOf.name}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={watched}
                    onCheckedChange={() => onToggleWatched(movie.id)}
                    size="sm"
                  />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {watched ? (
                      <>
                        <Eye className="h-3 w-3" /> Watched
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> Not watched
                      </>
                    )}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
