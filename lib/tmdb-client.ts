// ---------------------------------------------------------------------------
// TMDB client-side callers — talk to our own API routes, never to TMDB directly
// (keeps the API key server-side)
// ---------------------------------------------------------------------------

import type { Person, Movie } from "@/lib/types";

/** Search for cast/crew people by name. */
export async function searchPeople(query: string): Promise<Person[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `/api/tmdb/search-person?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Person search failed");
  return res.json() as Promise<Person[]>;
}

/** Fetch all movie/TV credits for a person. */
export async function getPersonCredits(personId: number): Promise<Movie[]> {
  const res = await fetch(`/api/tmdb/person/${personId}/credits`);
  if (!res.ok) throw new Error("Failed to fetch person credits");
  return res.json() as Promise<Movie[]>;
}
