"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { PersonSelector } from "@/components/dashboard/person-selector";
import { MovieSearch } from "@/components/dashboard/movie-search";
import { storage } from "@/lib/storage";
import type { Person, Movie, TrackedMovie } from "@/lib/types";

export default function AddContent() {
  const router = useRouter();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [trackedMovies, setTrackedMovies] = useState<TrackedMovie[]>([]);

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
      await storage.add(entry);
      router.push("/dashboard");
    },
    [selectedPerson, router],
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Back link */}
        <div className="container mx-auto max-w-6xl px-4 md:px-6 pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        {/* Person search banner */}
        <PersonSelector
          selectedPerson={selectedPerson}
          onSelectPerson={setSelectedPerson}
        />

        {/* Filmography grid */}
        {selectedPerson && (
          <div className="container mx-auto max-w-6xl px-4 md:px-6 py-10">
            <MovieSearch
              person={selectedPerson}
              onAddMovie={handleAddMovie}
              addedMovieIds={addedMovieIds}
            />
          </div>
        )}
      </main>
    </>
  );
}
