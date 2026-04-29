# Architecture

## File structure

```
app/
  layout.tsx                    — root layout (Clerk provider, ThemeProvider, Navbar)
  page.tsx                      — landing page
  not-found.tsx                 — 404 page
  dashboard/
    page.tsx                    — server component — auth guard via Clerk
    dashboard-content.tsx       — "use client" — owns state + storage calls
  api/
    tmdb/
      search-person/
        route.ts                — GET /api/tmdb/search-person?q=...
      person/[id]/credits/
        route.ts                — GET /api/tmdb/person/:id/credits

components/
  dashboard/
    person-selector.tsx         — search input + dropdown for TMDB person search
    movie-search.tsx            — filmography browser for the selected person
    movie-list.tsx              — tracked movie grid (poster, watched toggle, remove)
  ui/                           — shadcn/ui primitives (do not edit)
  navbar.tsx / footer.tsx / …   — landing page sections

lib/
  types.ts                      — shared domain types (Person, Movie, TrackedMovie)
  tmdb-utils.ts                 — pure tmdbImageUrl() helper (client-safe)
  tmdb.ts                       — server-only TMDB API calls (uses TMDB_API_KEY)
  tmdb-client.ts                — client-side fetch wrappers for our own API routes
  storage.ts                    — StorageAdapter interface + localStorage implementation
  utils.ts                      — cn() classname helper
```

---

## Data flow

```
User types in PersonSelector
        │
        ▼  (debounced 400 ms)
lib/tmdb-client.ts → GET /api/tmdb/search-person?q=…
        │
        ▼  (server route)
lib/tmdb.ts → TMDB /search/person  (TMDB_API_KEY stays server-side)
        │
        ▼
PersonSelector renders results with profile photos

User selects a person
        │
        ▼
MovieSearch mounts → lib/tmdb-client.ts → GET /api/tmdb/person/:id/credits
        │
        ▼  (server route)
lib/tmdb.ts → TMDB /person/:id/combined_credits
        │
        ▼
MovieSearch renders filmography list (posters via image.tmdb.org)

User clicks "Add"
        │
        ▼
dashboard-content.tsx → storage.add(trackedMovie)
        │
        ▼
localStorage (or future DB adapter)
        │
        ▼
MovieList re-renders with updated list
```

---

## Component responsibilities

### `PersonSelector`

- Owns the person-search input and dropdown.
- Debounces calls to `searchPeople()` (400 ms).
- Shows profile photo thumbnails from TMDB.
- Renders selected person as a dismissible chip.

### `MovieSearch`

- Receives the selected `Person` as a prop.
- Fetches their full filmography on mount via `getPersonCredits()`.
- Shows a local filter input (client-side, no extra API call).
- Each row shows: thumbnail poster · title · year · rating · media type badge · character/job · Add button.
- Disabled "Added" state for already-tracked titles.

### `MovieList`

- Pure presentational grid — receives `TrackedMovie[]` and two callbacks.
- Renders real TMDB poster images via `next/image`.
- Watched toggle (Switch) + remove button (appears on hover).

### `DashboardContent`

- Single owner of `trackedMovies` state.
- Loads list from storage on mount.
- Passes storage-mutating callbacks down to `MovieList`.
- Passes `addedMovieIds: Set<number>` to `MovieSearch` to show the "Added" state.

---

## Key design decisions

### API key stays server-side

Client components never call TMDB directly. They call `/api/tmdb/*` routes which live in the Next.js server. This keeps `TMDB_API_KEY` out of the browser bundle entirely.

### `tmdb-utils.ts` is split out

`tmdbImageUrl()` is a pure string helper needed by client components (for image `src` values). It was extracted from `lib/tmdb.ts` so client components don't accidentally pull in server-only code (environment variable reads, `next: { revalidate }` fetch options).

### All storage calls are async

Even though localStorage is synchronous, every `StorageAdapter` method returns a `Promise`. This means replacing the adapter with an async DB client requires zero changes to call sites.

### `addedAt` ISO timestamp on `TrackedMovie`

This is a no-op today but makes future DB rows sortable by insertion time without a schema migration.
