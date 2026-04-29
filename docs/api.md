# Internal API Routes

All routes live under `app/api/tmdb/`. They act as a thin proxy between the
browser and TMDB, keeping `TMDB_API_KEY` server-side at all times.

The client never speaks to TMDB directly — it only calls these routes via
`lib/tmdb-client.ts`.

---

## `GET /api/tmdb/search-person`

Search for people (actors, directors, crew) by name.

### Query parameters

| Parameter | Type     | Required | Description        |
| --------- | -------- | -------- | ------------------ |
| `q`       | `string` | Yes      | Name to search for |

### Response

`200 OK` — array of `Person` objects.

```ts
// lib/types.ts
interface Person {
  id: number;
  name: string;
  knownForDepartment: string; // e.g. "Acting", "Directing"
  profilePath: string | null; // TMDB relative path, e.g. "/abc123.jpg"
}
```

### Example

```
GET /api/tmdb/search-person?q=Anne+Hathaway
```

```json
[
  {
    "id": 1813,
    "name": "Anne Hathaway",
    "knownForDepartment": "Acting",
    "profilePath": "/tLSSqlS5PaFyHpUuVkknDPBa7V.jpg"
  }
]
```

### Error responses

| Status | Cause                                                  |
| ------ | ------------------------------------------------------ |
| `500`  | TMDB_API_KEY not set, or TMDB returned a non-OK status |

---

## `GET /api/tmdb/person/:id/credits`

Fetch the combined filmography (movies + TV shows) for a person.

### Path parameters

| Parameter | Type     | Description    |
| --------- | -------- | -------------- |
| `id`      | `number` | TMDB person ID |

### Response

`200 OK` — array of `Movie` objects sorted by year descending (newest first).

```ts
// lib/types.ts
interface Movie {
  id: number;
  title: string;
  year: string; // "2024", or "—" when unknown
  posterPath: string | null;
  rating: number; // TMDB vote_average, rounded to 1 decimal
  mediaType: "movie" | "tv";
  character?: string; // role (cast) or job title (crew)
}
```

### Example

```
GET /api/tmdb/person/1813/credits
```

```json
[
  {
    "id": 49026,
    "title": "The Dark Knight Rises",
    "year": "2012",
    "posterPath": "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    "rating": 7.8,
    "mediaType": "movie",
    "character": "Selina Kyle"
  },
  ...
]
```

### Notes

- Cast and crew credits are merged and deduplicated by `id`.
- Items with no `release_date` / `first_air_date` show `"—"` as year.
- Results are cached by Next.js for **1 hour** (`next: { revalidate: 3600 }`).

### Error responses

| Status | Cause                                                  |
| ------ | ------------------------------------------------------ |
| `400`  | `id` is not a valid number                             |
| `500`  | TMDB_API_KEY not set, or TMDB returned a non-OK status |

---

## Image URLs

TMDB poster and profile images are not returned as full URLs. Use
`tmdbImageUrl()` from `lib/tmdb-utils.ts` to build them:

```ts
import { tmdbImageUrl } from "@/lib/tmdb-utils";

// Available sizes: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original"
const src = tmdbImageUrl(movie.posterPath, "w342");
// → "https://image.tmdb.org/t/p/w342/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg"
// → "" when posterPath is null
```

`image.tmdb.org` is allow-listed in `next.config.ts` so `next/image` works
without additional configuration.
