"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import {
  PersonSelector,
  type Person,
} from "@/components/dashboard/person-selector";
import { MovieSearch, type Movie } from "@/components/dashboard/movie-search";
import {
  MovieList,
  type TrackedMovie,
} from "@/components/dashboard/movie-list";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [trackedMovies, setTrackedMovies] = useState<TrackedMovie[]>([]);

  const addedMovieIds = new Set(trackedMovies.map((tm) => tm.movie.id));

  const handleAddMovie = useCallback(
    (movie: Movie) => {
      if (!selectedPerson) return;
      setTrackedMovies((prev) => [
        ...prev,
        { movie, selectedBecauseOf: selectedPerson, watched: false },
      ]);
    },
    [selectedPerson],
  );

  const handleToggleWatched = useCallback((movieId: string) => {
    setTrackedMovies((prev) =>
      prev.map((tm) =>
        tm.movie.id === movieId ? { ...tm, watched: !tm.watched } : tm,
      ),
    );
  }, []);

  const handleRemoveMovie = useCallback((movieId: string) => {
    setTrackedMovies((prev) => prev.filter((tm) => tm.movie.id !== movieId));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track movies by the people you love.
            </p>
          </div>

          <Separator />

          {/* Step 1: Pick a person */}
          <PersonSelector
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />

          {/* Step 2: Search movies (shown after person is selected) */}
          {selectedPerson && (
            <>
              <Separator />
              <MovieSearch
                person={selectedPerson}
                onAddMovie={handleAddMovie}
                addedMovieIds={addedMovieIds}
              />
            </>
          )}

          {/* Movie list always visible */}
          <Separator />
          <MovieList
            movies={trackedMovies}
            onToggleWatched={handleToggleWatched}
            onRemoveMovie={handleRemoveMovie}
          />
        </div>
      </main>
    </>
  );
}
