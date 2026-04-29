// ---------------------------------------------------------------------------
// TMDB API helpers — SERVER-SIDE ONLY (keeps the API key out of the bundle)
// ---------------------------------------------------------------------------

import type { Person, Movie } from "@/lib/types";

export { tmdbImageUrl } from "@/lib/tmdb-utils";

const TMDB_BASE = "https://api.themoviedb.org/3";

/** Low-level fetch wrapper that injects the Bearer token and handles errors. */
async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const token = process.env.TMDB_API_KEY;
  if (!token) throw new Error("TMDB_API_KEY environment variable is not set");

  const url = new URL(`${TMDB_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// TMDB response shapes (minimal — only what we actually use)
// ---------------------------------------------------------------------------

interface TmdbPersonResult {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
}

interface TmdbSearchPersonResponse {
  results: TmdbPersonResult[];
}

interface TmdbCreditItem {
  id: number;
  title?: string; // movie
  name?: string; // tv
  release_date?: string; // movie
  first_air_date?: string; // tv
  poster_path: string | null;
  vote_average: number;
  media_type: "movie" | "tv";
  character?: string;
  job?: string;
}

interface TmdbCombinedCreditsResponse {
  cast: TmdbCreditItem[];
  crew: TmdbCreditItem[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Search for people (actors, directors, etc.) by name. */
export async function searchPeople(query: string): Promise<Person[]> {
  const data = await tmdbFetch<TmdbSearchPersonResponse>("/search/person", {
    query,
    include_adult: "false",
  });

  return data.results.map((p) => ({
    id: p.id,
    name: p.name,
    knownForDepartment: p.known_for_department ?? "Acting",
    profilePath: p.profile_path,
  }));
}

/** Get all movie/TV credits for a person (cast + directing credits, deduped). */
export async function getPersonCredits(personId: number): Promise<Movie[]> {
  const data = await tmdbFetch<TmdbCombinedCreditsResponse>(
    `/person/${personId}/combined_credits`,
  );

  const seen = new Set<number>();
  const results: Movie[] = [];

  // Combine cast and crew, preferring cast entries when there are duplicates
  const all = [...data.cast, ...data.crew];

  for (const item of all) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);

    const title = item.title ?? item.name ?? "Unknown";
    const rawDate = item.release_date ?? item.first_air_date ?? "";
    const year = rawDate ? rawDate.slice(0, 4) : "—";

    results.push({
      id: item.id,
      title,
      year,
      posterPath: item.poster_path,
      rating: Math.round(item.vote_average * 10) / 10,
      mediaType: item.media_type,
      character: item.character ?? item.job,
    });
  }

  // Sort by year descending (most recent first)
  return results.sort((a, b) => b.year.localeCompare(a.year));
}

interface TmdbTrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

interface TmdbTrendingResponse {
  results: TmdbTrendingItem[];
}

/** Fetch trending movies & shows for the week (used on the landing hero). */
export async function getTrending(
  limit = 6,
): Promise<{ id: number; title: string; posterPath: string | null }[]> {
  const data = await tmdbFetch<TmdbTrendingResponse>("/trending/all/week");
  return data.results.slice(0, limit).map((item) => ({
    id: item.id,
    title: item.title ?? item.name ?? "Unknown",
    posterPath: item.poster_path,
  }));
}
