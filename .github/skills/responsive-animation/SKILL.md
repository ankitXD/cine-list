---
name: responsive-animation
description: Breakpoint strategy, grid responsiveness, hover/entrance/stagger animations, scroll-triggered effects, reduced-motion support, mobile navigation patterns, and performance guidelines.
---

# Responsive Design & Animation Skill — Cine List

## Breakpoint Strategy

Use Tailwind's default breakpoints with mobile-first approach:

| Breakpoint | Min-width | Target        |
| ---------- | --------- | ------------- |
| (default)  | 0px       | Mobile phones |
| `sm:`      | 640px     | Large phones  |
| `md:`      | 768px     | Tablets       |
| `lg:`      | 1024px    | Laptops       |
| `xl:`      | 1280px    | Desktops      |
| `2xl:`     | 1536px    | Large screens |

### Grid Responsiveness Rules

**Movie/Show card grids:**

```
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4
```

**Two-column detail layout (poster + info):**

```
grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8
```

**Settings / form layout:**

```
max-w-2xl mx-auto
```

### Typography Responsiveness

Scale headings up from mobile:

```
text-2xl md:text-3xl lg:text-4xl
```

### Padding & Spacing

Container padding adjusts at breakpoints:

```
px-4 md:px-6 lg:px-8
py-6 md:py-8 lg:py-12
```

---

## Animation Guidelines

### General Principles

1. **Subtle & purposeful** — Animations should guide attention, not distract.
2. **Fast** — Keep durations between 150ms–300ms for UI transitions.
3. **Ease curves** — Use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes.
4. **Respect preferences** — Always wrap decorative animations with `motion-safe:` or check `prefers-reduced-motion`.

### Tailwind Animation Classes

Use `tw-animate-css` classes and Tailwind transitions:

```tsx
// Hover scale on cards
className = "transition-transform duration-300 hover:scale-105";

// Fade in content
className = "animate-in fade-in duration-300";

// Slide up from bottom
className = "animate-in slide-in-from-bottom-4 fade-in duration-500";

// Zoom in
className = "animate-in zoom-in-95 duration-200";
```

### Page Transition Pattern

```tsx
// Wrap page content for entrance animation
<main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
  {children}
</main>
```

### Card Hover Effects

```tsx
// Poster card with hover lift + scale
<div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
  <Image
    className="object-cover transition-transform duration-500 group-hover:scale-110"
    ...
  />
  {/* Overlay appears on hover */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
      <p className="text-white text-sm font-medium">{title}</p>
    </div>
  </div>
</div>
```

### Loading Shimmer

Skeleton components from shadcn already include shimmer. Use them consistently:

```tsx
// Skeleton automatically pulses — just match dimensions
<Skeleton className="aspect-[2/3] w-full rounded-lg" />
```

### Staggered List Animation

For grids of cards appearing one after another:

```tsx
// Use CSS animation-delay with inline style
{
  items.map((item, i) => (
    <div
      key={item.id}
      className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
      style={{ animationDelay: `${i * 75}ms` }}
    >
      <MovieCard {...item} />
    </div>
  ));
}
```

### Scroll-triggered Animations

For content that animates when scrolled into view, use Intersection Observer:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function FadeInOnScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

---

## Reduced Motion

Always provide reduced-motion alternatives:

```tsx
// In Tailwind
className="motion-safe:animate-in motion-safe:fade-in motion-reduce:opacity-100"

// In CSS
@media (prefers-reduced-motion: reduce) {
  .animate-in { animation: none !important; }
}
```

---

## Touch & Mobile Interactions

1. **Touch targets** — Minimum 44x44px for interactive elements (buttons, links, cards).
2. **Swipe** — Use Embla Carousel (already installed) for swipeable carousels.
3. **Bottom sheet** — Use `Drawer` component on mobile for filters/actions.
4. **Responsive nav** — Use `Sheet` for mobile hamburger menu.

### Mobile Navigation Pattern

```tsx
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/" className="text-lg font-medium">
            Home
          </Link>
          <Link href="/movies" className="text-lg font-medium">
            Movies
          </Link>
          <Link href="/shows" className="text-lg font-medium">
            Shows
          </Link>
          <Link href="/watchlist" className="text-lg font-medium">
            Watchlist
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

---

## Performance Guidelines

1. **Image optimization** — Always use `next/image` with `sizes` prop. Use `priority` only for LCP images.
2. **Lazy load below-fold** — Use `loading="lazy"` for images below the fold (default in `next/image`).
3. **Minimize client JS** — Keep `"use client"` boundaries small. Prefer server components.
4. **Avoid layout shift** — Always set explicit dimensions or aspect ratios on images and dynamic content.
5. **Font loading** — Fonts are loaded via `next/font/google` with `display: swap` (default). No additional config needed.
