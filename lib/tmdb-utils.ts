// Pure utility — safe to import from both server and client components.
// No API keys, no fetch calls.

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

/** Build a full TMDB image URL. Returns empty string when path is null. */
export function tmdbImageUrl(
  path: string | null,
  size: TmdbImageSize = "w500",
): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
