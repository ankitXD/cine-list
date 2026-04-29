# Adding a Database

This guide shows how to replace the `localStorage` adapter with a real
database. The example uses **Prisma + PostgreSQL** but the same pattern works
for any ORM or query builder (Drizzle, Kysely, raw SQL, etc.).

---

## Step 1 — Install Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

---

## Step 2 — Define the schema

`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model TrackedMovie {
  id                  Int      @id @default(autoincrement())
  userId              String                      // Clerk user ID
  movieId             Int
  movieTitle          String
  movieYear           String
  moviePosterPath     String?
  movieRating         Float
  movieMediaType      String                      // "movie" | "tv"
  movieCharacter      String?
  personId            Int
  personName          String
  personDepartment    String
  personProfilePath   String?
  watched             Boolean  @default(false)
  addedAt             DateTime @default(now())

  @@unique([userId, movieId])                     // prevents duplicates per user
}
```

```bash
npx prisma migrate dev --name init
```

---

## Step 3 — Create the Prisma adapter

Create `lib/storage-prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import type { StorageAdapter } from "@/lib/storage";
import type { TrackedMovie } from "@/lib/types";

const prisma = new PrismaClient();

function rowToTrackedMovie(row: any): TrackedMovie {
  return {
    movie: {
      id: row.movieId,
      title: row.movieTitle,
      year: row.movieYear,
      posterPath: row.moviePosterPath,
      rating: row.movieRating,
      mediaType: row.movieMediaType as "movie" | "tv",
      character: row.movieCharacter ?? undefined,
    },
    selectedBecauseOf: {
      id: row.personId,
      name: row.personName,
      knownForDepartment: row.personDepartment,
      profilePath: row.personProfilePath,
    },
    watched: row.watched,
    addedAt: row.addedAt.toISOString(),
  };
}

export function createPrismaAdapter(userId: string): StorageAdapter {
  return {
    async getAll() {
      const rows = await prisma.trackedMovie.findMany({
        where: { userId },
        orderBy: { addedAt: "desc" },
      });
      return rows.map(rowToTrackedMovie);
    },

    async add(entry) {
      await prisma.trackedMovie.upsert({
        where: { userId_movieId: { userId, movieId: entry.movie.id } },
        create: {
          userId,
          movieId: entry.movie.id,
          movieTitle: entry.movie.title,
          movieYear: entry.movie.year,
          moviePosterPath: entry.movie.posterPath,
          movieRating: entry.movie.rating,
          movieMediaType: entry.movie.mediaType,
          movieCharacter: entry.movie.character,
          personId: entry.selectedBecauseOf.id,
          personName: entry.selectedBecauseOf.name,
          personDepartment: entry.selectedBecauseOf.knownForDepartment,
          personProfilePath: entry.selectedBecauseOf.profilePath,
          watched: entry.watched,
          addedAt: new Date(entry.addedAt),
        },
        update: {}, // no-op if already exists
      });
      return this.getAll();
    },

    async remove(movieId) {
      await prisma.trackedMovie.deleteMany({
        where: { userId, movieId },
      });
      return this.getAll();
    },

    async toggleWatched(movieId) {
      const row = await prisma.trackedMovie.findUnique({
        where: { userId_movieId: { userId, movieId } },
      });
      if (row) {
        await prisma.trackedMovie.update({
          where: { userId_movieId: { userId, movieId } },
          data: { watched: !row.watched },
        });
      }
      return this.getAll();
    },
  };
}
```

---

## Step 4 — Wire the adapter into `DashboardContent`

Because the adapter now needs the logged-in `userId`, pass it from the server
component (`dashboard/page.tsx`) down to `DashboardContent`.

`app/dashboard/page.tsx`:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  return <DashboardContent userId={userId} />;
}
```

`app/dashboard/dashboard-content.tsx` — add the prop and create the adapter:

```ts
// Add to props
interface Props {
  userId: string;
}

export default function DashboardContent({ userId }: Props) {
  const [storage] = useState(() => createPrismaAdapter(userId));
  // ... rest unchanged
}
```

Import at the top:

```ts
import { createPrismaAdapter } from "@/lib/storage-prisma";
```

> **Note:** Prisma calls happen server-side when you use Server Actions or
> Route Handlers. If you call them from a client component you'll need to
> route through an API or use Next.js Server Actions.

---

## Step 5 — (Recommended) Move mutations to Server Actions

For a cleaner architecture, move the four storage operations into Server
Actions so Prisma never runs in the browser bundle:

```ts
// app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { createPrismaAdapter } from "@/lib/storage-prisma";
import type { TrackedMovie } from "@/lib/types";

async function getAdapter() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return createPrismaAdapter(userId);
}

export async function getAllMovies() {
  return (await getAdapter()).getAll();
}

export async function addMovie(entry: TrackedMovie) {
  return (await getAdapter()).add(entry);
}

export async function removeMovie(movieId: number) {
  return (await getAdapter()).remove(movieId);
}

export async function toggleWatched(movieId: number) {
  return (await getAdapter()).toggleWatched(movieId);
}
```

Then in `DashboardContent` replace `storage.*` calls with the imported
server actions. The `await` call sites don't change.

---

## Summary of changes required

| File                                  | What to change                                          |
| ------------------------------------- | ------------------------------------------------------- |
| `prisma/schema.prisma`                | New — define the schema                                 |
| `lib/storage-prisma.ts`               | New — Prisma adapter implementing `StorageAdapter`      |
| `app/dashboard/actions.ts`            | New (optional) — server actions wrapping the adapter    |
| `app/dashboard/page.tsx`              | Pass `userId` prop to `DashboardContent`                |
| `app/dashboard/dashboard-content.tsx` | Accept `userId`, use Prisma adapter (or server actions) |
| `lib/storage.ts`                      | No changes needed                                       |
| All other components                  | **No changes**                                          |
