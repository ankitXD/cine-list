// ---------------------------------------------------------------------------
// Shared domain types for Cine List
// ---------------------------------------------------------------------------

export interface Person {
  id: number;
  name: string;
  knownForDepartment: string; // e.g. "Acting", "Directing"
  profilePath: string | null;
}

export interface Movie {
  id: number;
  title: string;
  year: string;
  posterPath: string | null;
  rating: number;
  mediaType: "movie" | "tv";
  character?: string; // role played or job title
}

export interface TrackedMovie {
  movie: Movie;
  selectedBecauseOf: Person;
  watched: boolean;
  addedAt: string; // ISO 8601 — makes future DB migration trivial
}
