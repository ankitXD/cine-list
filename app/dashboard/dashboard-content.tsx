"use client";

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { MovieList } from "@/components/dashboard/movie-list";
import { storage } from "@/lib/storage";
import type { TrackedMovie } from "@/lib/types";

export default function DashboardContent() {
  const [trackedMovies, setTrackedMovies] = useState<TrackedMovie[]>([]);

  useEffect(() => {
    storage.getAll().then(setTrackedMovies);
  }, []);

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
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-10">
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
