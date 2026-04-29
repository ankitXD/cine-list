# Cine List — Project Overview

Cine List is a movie and TV-show tracking app. The core workflow is:

1. **Search for a person** — any actor, actress, director, or crew member.
2. **Browse their filmography** — all movies and TV shows they have credits for, pulled live from TMDB.
3. **Add titles to your list** — track what you want to watch and what you've already seen.
4. **Your list persists** — everything is saved locally (localStorage today, database-ready for tomorrow).

---

## Tech stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| Framework   | Next.js 16 (App Router)                                 |
| UI          | React 19, Tailwind CSS v4, shadcn/ui v4                 |
| Language    | TypeScript                                              |
| Data source | [TMDB API](https://developer.themoviedb.org/docs)       |
| Storage     | localStorage (swappable — see [storage.md](storage.md)) |
| Auth        | Clerk                                                   |

---

## Docs index

| File                                     | What it covers                                            |
| ---------------------------------------- | --------------------------------------------------------- |
| [overview.md](overview.md)               | This file — what the app does                             |
| [architecture.md](architecture.md)       | File structure, data flow, component tree                 |
| [api.md](api.md)                         | Internal API routes (`/api/tmdb/*`)                       |
| [storage.md](storage.md)                 | Storage abstraction, localStorage adapter                 |
| [adding-database.md](adding-database.md) | Step-by-step guide to swapping localStorage for a real DB |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set your TMDB API key
echo "TMDB_API_KEY=your_read_access_token_here" >> .env.local

# 3. Set your Clerk keys (see https://clerk.com/docs)
echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=..." >> .env.local
echo "CLERK_SECRET_KEY=..." >> .env.local

# 4. Start the dev server
npm run dev     # runs on port 5000
```
