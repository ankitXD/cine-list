# Storage Layer

## Overview

All persistence is handled through a `StorageAdapter` interface defined in
`lib/storage.ts`. Today the app ships with a `localStorage` implementation.
Adding a real database means writing a new adapter — no component code changes.

---

## The `StorageAdapter` interface

```ts
// lib/storage.ts

export interface StorageAdapter {
  getAll(): Promise<TrackedMovie[]>;
  add(entry: TrackedMovie): Promise<TrackedMovie[]>;
  remove(movieId: number): Promise<TrackedMovie[]>;
  toggleWatched(movieId: number): Promise<TrackedMovie[]>;
}
```

Every method is `async` even though localStorage is synchronous. This ensures
all call sites are already `await`-ready for when you swap in a DB adapter.

Every mutating method returns the **full updated list** so components can do a
single `setState(updated)` — no need to re-fetch after every write.

---

## `TrackedMovie` shape

```ts
// lib/types.ts

interface TrackedMovie {
  movie: Movie; // full TMDB movie/TV data
  selectedBecauseOf: Person; // the person the user was browsing
  watched: boolean;
  addedAt: string; // ISO 8601 timestamp
}
```

`addedAt` is stored as an ISO string so it round-trips through JSON cleanly
and maps directly to a `DateTime` / `TIMESTAMP` column in any SQL DB.

---

## The localStorage adapter

```
Storage key: "cine-list:tracked-movies"
Format:      JSON array of TrackedMovie
```

The adapter:

- Guards against SSR (`typeof window === "undefined"` check in `readFromStorage`).
- Silently returns `[]` if the stored JSON is malformed.
- Prevents duplicate entries — `add()` is a no-op if the movie ID already exists.

---

## Active adapter

At the bottom of `lib/storage.ts`:

```ts
export const storage: StorageAdapter = localStorageAdapter;
```

This is the **only line** you change to switch storage backends. All components
import `storage` from this module, so the swap is transparent.

---

## Using `storage` in a component

```ts
// Load on mount
useEffect(() => {
  storage.getAll().then(setTrackedMovies);
}, []);

// Add a movie
const updated = await storage.add({
  movie,
  selectedBecauseOf,
  watched: false,
  addedAt: new Date().toISOString(),
});
setTrackedMovies(updated);

// Toggle watched
const updated = await storage.toggleWatched(movieId);
setTrackedMovies(updated);

// Remove
const updated = await storage.remove(movieId);
setTrackedMovies(updated);
```

See the full implementation in [app/dashboard/dashboard-content.tsx](../app/dashboard/dashboard-content.tsx).

---

## Adding a new storage backend

See [adding-database.md](adding-database.md) for a complete step-by-step guide.
