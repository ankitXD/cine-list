"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Person } from "@/components/dashboard/person-selector";

export interface Movie {
  id: string;
  title: string;
  year: string;
  posterUrl: string;
  rating: number;
}

// Mock movies keyed by person ID
const MOCK_MOVIES: Record<string, Movie[]> = {
  "1": [
    {
      id: "m1",
      title: "The Devil Wears Prada",
      year: "2006",
      posterUrl: "/placeholder-poster.jpg",
      rating: 7.7,
    },
    {
      id: "m2",
      title: "Les Misérables",
      year: "2012",
      posterUrl: "/placeholder-poster.jpg",
      rating: 7.6,
    },
    {
      id: "m3",
      title: "Interstellar",
      year: "2014",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.7,
    },
    {
      id: "m4",
      title: "The Dark Knight Rises",
      year: "2012",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.4,
    },
    {
      id: "m5",
      title: "Ocean's 8",
      year: "2018",
      posterUrl: "/placeholder-poster.jpg",
      rating: 6.9,
    },
    {
      id: "m6",
      title: "One Day",
      year: "2011",
      posterUrl: "/placeholder-poster.jpg",
      rating: 7.0,
    },
  ],
  "2": [
    {
      id: "m7",
      title: "Inception",
      year: "2010",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.8,
    },
    {
      id: "m8",
      title: "The Dark Knight",
      year: "2008",
      posterUrl: "/placeholder-poster.jpg",
      rating: 9.0,
    },
    {
      id: "m9",
      title: "Interstellar",
      year: "2014",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.7,
    },
    {
      id: "m10",
      title: "Oppenheimer",
      year: "2023",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.5,
    },
    {
      id: "m11",
      title: "Tenet",
      year: "2020",
      posterUrl: "/placeholder-poster.jpg",
      rating: 7.3,
    },
  ],
  "3": [
    {
      id: "m12",
      title: "Inception",
      year: "2010",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.8,
    },
    {
      id: "m13",
      title: "The Wolf of Wall Street",
      year: "2013",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.2,
    },
    {
      id: "m14",
      title: "Shutter Island",
      year: "2010",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.2,
    },
    {
      id: "m15",
      title: "The Revenant",
      year: "2015",
      posterUrl: "/placeholder-poster.jpg",
      rating: 8.0,
    },
  ],
};

// Default movies for people without specific mock data
const DEFAULT_MOVIES: Movie[] = [
  {
    id: "d1",
    title: "Sample Movie 1",
    year: "2023",
    posterUrl: "/placeholder-poster.jpg",
    rating: 7.5,
  },
  {
    id: "d2",
    title: "Sample Movie 2",
    year: "2022",
    posterUrl: "/placeholder-poster.jpg",
    rating: 8.0,
  },
];

interface MovieSearchProps {
  person: Person;
  onAddMovie: (movie: Movie) => void;
  addedMovieIds: Set<string>;
}

export function MovieSearch({
  person,
  onAddMovie,
  addedMovieIds,
}: MovieSearchProps) {
  const [query, setQuery] = useState("");

  const allMovies = MOCK_MOVIES[person.id] ?? DEFAULT_MOVIES;
  const filtered = allMovies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Search Movies for {person.name}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Search ${person.name}'s movies...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-2 max-h-64 overflow-y-auto rounded-md border border-border p-2">
          {filtered.map((movie) => {
            const isAdded = addedMovieIds.has(movie.id);
            return (
              <div
                key={movie.id}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 transition-colors",
                  isAdded
                    ? "bg-muted/50 opacity-60"
                    : "hover:bg-accent cursor-pointer",
                )}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.year} · ★ {movie.rating}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isAdded ? "secondary" : "default"}
                  disabled={isAdded}
                  onClick={() => onAddMovie(movie)}
                >
                  {isAdded ? "Added" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No movies found matching &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
