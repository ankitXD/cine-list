---
name: ui-component-patterns
description: Ready-to-use component templates for movie cards, hero sections, scroll rails, genre filters, search command palette, detail pages, navbar, empty states, and rating displays.
---

# UI Component Patterns Skill — Cine List

## Purpose

Reference patterns for building polished, consistent UI components in the Cine List app. Use these as templates when creating new components.

---

## Pattern: Horizontal Scroll Row (Movie/Show Rail)

A Netflix-style horizontally scrollable row of cards.

```tsx
"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ContentRail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          See all
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">{children}</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
```

---

## Pattern: Hero Section with Backdrop

A cinematic hero with gradient overlay and metadata.

```tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";

interface HeroProps {
  title: string;
  overview: string;
  backdropUrl: string;
  genres: string[];
  rating: number;
  year: string;
}

export function HeroSection({
  title,
  overview,
  backdropUrl,
  genres,
  rating,
  year,
}: HeroProps) {
  return (
    <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
      <Image
        src={backdropUrl}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-3xl space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{year}</Badge>
          <Badge variant="outline">★ {rating.toFixed(1)}</Badge>
          {genres.map((g) => (
            <Badge key={g} variant="secondary">
              {g}
            </Badge>
          ))}
        </div>

        <p className="text-sm md:text-base text-muted-foreground line-clamp-3 max-w-xl">
          {overview}
        </p>

        <div className="flex gap-3 pt-2">
          <Button size="lg">
            <Play className="mr-2 h-4 w-4" /> Watch Trailer
          </Button>
          <Button variant="outline" size="lg">
            <Plus className="mr-2 h-4 w-4" /> Add to List
          </Button>
        </div>
      </div>
    </section>
  );
}
```

---

## Pattern: Genre Filter Bar

Horizontal scrollable badges for genre filtering.

```tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GenreFilterProps {
  genres: string[];
  selected: string | null;
  onSelect: (genre: string | null) => void;
}

export function GenreFilter({ genres, selected, onSelect }: GenreFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Badge
          variant={!selected ? "default" : "outline"}
          className="cursor-pointer shrink-0"
          onClick={() => onSelect(null)}
        >
          All
        </Badge>
        {genres.map((genre) => (
          <Badge
            key={genre}
            variant={selected === genre ? "default" : "outline"}
            className="cursor-pointer shrink-0"
            onClick={() => onSelect(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
```

---

## Pattern: Search with Command Palette

A ⌘K style search experience using the Command component.

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full max-w-sm justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search movies & shows...
        <Kbd className="ml-auto">⌘K</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search movies, shows, actors..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Movies">{/* items */}</CommandGroup>
          <CommandGroup heading="Shows">{/* items */}</CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
```

---

## Pattern: Movie Detail Page Layout

```tsx
// app/movies/[id]/page.tsx structure
export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      {/* Hero backdrop */}
      <HeroSection {...movie} />

      {/* Content area */}
      <div className="container mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar: Poster + Quick Info */}
          <aside className="hidden md:block">
            <AspectRatio
              ratio={2 / 3}
              className="overflow-hidden rounded-xl shadow-lg"
            >
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </AspectRatio>
          </aside>

          {/* Main content */}
          <div className="space-y-8">
            {/* Tabs: Overview, Cast, Reviews, Similar */}
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cast">Cast</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="similar">Similar</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                {/* Overview content */}
              </TabsContent>
              {/* ... other tabs */}
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## Pattern: Rating Display

```tsx
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number; // 0-10
  max?: number;
  size?: "sm" | "md";
}

export function RatingDisplay({ value, max = 10, size = "md" }: RatingProps) {
  const normalized = (value / max) * 5;
  return (
    <div
      className={cn(
        "flex items-center gap-1",
        size === "sm" ? "text-xs" : "text-sm",
      )}
    >
      <Star
        className={cn(
          "fill-yellow-500 text-yellow-500",
          size === "sm" ? "h-3 w-3" : "h-4 w-4",
        )}
      />
      <span className="font-semibold">{value.toFixed(1)}</span>
      <span className="text-muted-foreground">/ {max}</span>
    </div>
  );
}
```

---

## Pattern: Empty State

```tsx
import { Empty } from "@/components/ui/empty";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Film className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">Your watchlist is empty</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Start adding movies and shows you want to watch.
      </p>
      <Button className="mt-4">Browse Movies</Button>
    </div>
  );
}
```

---

## Pattern: Navbar

```tsx
import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/search-command";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Film className="h-5 w-5" />
          Cine List
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link
            href="/movies"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Movies
          </Link>
          <Link
            href="/shows"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Shows
          </Link>
          <Link
            href="/watchlist"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Watchlist
          </Link>
        </nav>

        <div className="flex-1" />
        <SearchCommand />
        <ThemeToggle />
      </div>
    </header>
  );
}
```

---

## Anti-Patterns to Avoid

1. **Oversized client components** — Don't put data fetching and interactivity in the same component. Split into a server wrapper + client interactive piece.
2. **Bare `<div>` soup** — Use semantic elements: `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`, `<nav>`.
3. **Missing loading states** — Every data-dependent section needs a Skeleton or Suspense boundary.
4. **Unoptimized images** — Always specify `sizes`, use `priority` for LCP images, use `fill` with `object-cover` for responsive images.
5. **Inconsistent spacing** — Stick to the spacing scale (multiples of 4: `gap-2`, `gap-4`, `gap-6`, `gap-8`).
