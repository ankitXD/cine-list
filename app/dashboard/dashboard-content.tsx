"use client";

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { PersonSelector } from "@/components/dashboard/person-selector";
import { MovieSearch } from "@/components/dashboard/movie-search";
import { MovieList } from "@/components/dashboard/movie-list";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/storage";
import type { Person, Movie, TrackedMovie } from "@/lib/types";

export default function DashboardContent() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [trackedMovies, setTrackedMovies] = useState<TrackedMovie[]>([]);

  // Load persisted list on first render
  useEffect(() => {
    storage.getAll().then(setTrackedMovies);
  }, []);

  const addedMovieIds = new Set(trackedMovies.map((tm) => tm.movie.id));

  const handleAddMovie = useCallback(
    async (movie: Movie) => {
      if (!selectedPerson) return;
      const entry: TrackedMovie = {
        movie,
        selectedBecauseOf: selectedPerson,
        watched: false,
        addedAt: new Date().toISOString(),
      };
      const updated = await storage.add(entry);
      setTrackedMovies(updated);
    },
    [selectedPerson],
  );

  const handleToggleWatched = useCallback(async (movieId: number) => {
    const updated = await storage.toggleWatched(movieId);
    setTrackedMovies(updated);
  }, []);

  const handleRemoveMovie = useCallback(async (movieId: number) => {
    const updated = await storage.remove(movieId);
    setTrackedMovies(updated);
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

          {/* Step 2: Browse filmography (shown after person is selected) */}
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

          {/* Movie list — always visible */}
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
