// ---------------------------------------------------------------------------
// Storage abstraction for tracked movies
//
// All methods are async so you can swap the localStorage adapter for a real
// database adapter (e.g. Prisma, Drizzle) without changing any call sites.
// ---------------------------------------------------------------------------

import type { TrackedMovie } from "@/lib/types";

const STORAGE_KEY = "cine-list:tracked-movies";

// ---------------------------------------------------------------------------
// Adapter interface — implement this to add a new storage backend
// ---------------------------------------------------------------------------

export interface StorageAdapter {
  getAll(): Promise<TrackedMovie[]>;
  add(entry: TrackedMovie): Promise<TrackedMovie[]>;
  remove(movieId: number): Promise<TrackedMovie[]>;
  toggleWatched(movieId: number): Promise<TrackedMovie[]>;
}

// ---------------------------------------------------------------------------
// localStorage implementation
// ---------------------------------------------------------------------------

function readFromStorage(): TrackedMovie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrackedMovie[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(movies: TrackedMovie[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export const localStorageAdapter: StorageAdapter = {
  async getAll() {
    return readFromStorage();
  },

  async add(entry) {
    const current = readFromStorage();
    // Prevent duplicate entries for the same movie
    if (current.some((m) => m.movie.id === entry.movie.id)) return current;
    const updated = [...current, entry];
    writeToStorage(updated);
    return updated;
  },

  async remove(movieId) {
    const current = readFromStorage();
    const updated = current.filter((m) => m.movie.id !== movieId);
    writeToStorage(updated);
    return updated;
  },

  async toggleWatched(movieId) {
    const current = readFromStorage();
    const updated = current.map((m) =>
      m.movie.id === movieId ? { ...m, watched: !m.watched } : m,
    );
    writeToStorage(updated);
    return updated;
  },
};

// ---------------------------------------------------------------------------
// Active adapter — change this single line to switch storage backends
// ---------------------------------------------------------------------------
export const storage: StorageAdapter = localStorageAdapter;
