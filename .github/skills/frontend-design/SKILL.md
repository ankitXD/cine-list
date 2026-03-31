---
name: frontend-design
description: Design system, color tokens, typography, spacing, image patterns, file structure, and server vs client component rules for the Cine List movie tracking app.
---

# Frontend Design Skill — Cine List

## Stack

- **Framework**: Next.js 16 (App Router, React Server Components by default)
- **React**: 19.2 (use hooks, Server Components, `use()` where appropriate)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme`, no `tailwind.config.js`)
- **Components**: shadcn/ui v4 (radix-vega style, copy-paste primitives in `components/ui/`)
- **Icons**: Lucide React (`lucide-react`)
- **Fonts**: Inter (sans), Geist Mono (mono) via `next/font/google`
- **Theme**: CSS custom properties with oklch colors, light + dark mode via `.dark` class
- **Animations**: `tw-animate-css`

## Design Principles

1. **Cinematic & Modern** — This is a movie/show tracking app. Use bold typography, generous whitespace, and subtle depth (shadows, overlays on hero images).
2. **Content-First** — Posters, backdrops, and metadata should dominate the UI. Chrome should recede.
3. **Responsive** — Mobile-first layouts. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`).
4. **Dark-mode native** — Design for dark mode first (movie apps feel natural in dark). Light mode is secondary.
5. **Accessible** — Use semantic HTML, proper ARIA attributes, keyboard navigation, sufficient color contrast (WCAG AA minimum).

## Color System

Use the CSS custom property tokens defined in `globals.css`:

| Token                            | Usage                      |
| -------------------------------- | -------------------------- |
| `background`                     | Page background            |
| `foreground`                     | Primary text               |
| `card` / `card-foreground`       | Card surfaces              |
| `primary` / `primary-foreground` | CTAs, active states        |
| `secondary`                      | Secondary actions, tags    |
| `muted` / `muted-foreground`     | Subdued text, placeholders |
| `accent`                         | Hover states, highlights   |
| `destructive`                    | Delete, errors             |
| `border`                         | Dividers, card outlines    |
| `ring`                           | Focus rings                |

Always use `bg-background`, `text-foreground`, `bg-card`, etc. — never hardcode hex/oklch values in components.

## Typography Scale

Use Tailwind's default scale with these conventions:

| Element         | Classes                                         |
| --------------- | ----------------------------------------------- |
| Page title      | `text-3xl md:text-4xl font-bold tracking-tight` |
| Section heading | `text-2xl font-semibold tracking-tight`         |
| Card title      | `text-lg font-semibold`                         |
| Body text       | `text-base text-foreground`                     |
| Caption / meta  | `text-sm text-muted-foreground`                 |
| Tiny label      | `text-xs text-muted-foreground`                 |

Use the `font-heading` variable (`--font-heading`) for headings when differentiation is needed.

## Spacing & Layout

- Use `container mx-auto px-4 md:px-6` for page-level horizontal containment.
- Section vertical spacing: `py-8 md:py-12`.
- Card grid: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4`.
- Stack elements vertically with `flex flex-col gap-*` or `space-y-*`.
- Max content width: `max-w-7xl` for standard pages, `max-w-4xl` for reading/form pages.

## Component Usage (shadcn/ui)

Always import from `@/components/ui/*`. The project already has these installed:

### Core layout

- `Card` — Movie/show cards, detail panels
- `Separator` — Section dividers
- `Accordion`, `Tabs` — Organizing content sections
- `Sheet`, `Drawer` — Mobile overlays, filters
- `Dialog` — Confirmations, quick actions
- `ScrollArea` — Horizontal scrollable rows (e.g., movie carousels)

### Forms & Input

- `Button` — Actions (use variants: `default`, `secondary`, `outline`, `ghost`, `destructive`)
- `Input`, `Textarea` — Text fields
- `Select`, `Combobox` — Dropdowns, search selectors
- `Checkbox`, `Switch` — Toggles
- `Label`, `Field` — Form field wrappers

### Feedback

- `Badge` — Genre tags, ratings, status labels
- `Skeleton` — Loading placeholders (always show skeletons during data fetch)
- `Spinner` — Inline loading indicator
- `Sonner` (toast) — Success/error notifications
- `Empty` — Empty state placeholder
- `Progress` — Progress bars
- `Alert` — Inline warnings/info

### Navigation

- `NavigationMenu` — Top nav
- `Breadcrumb` — Detail page breadcrumbs
- `Pagination` — List pagination
- `Sidebar` — App sidebar navigation
- `DropdownMenu`, `ContextMenu` — Action menus
- `Command` — Command palette (⌘K)

### Data Display

- `Table` — Tabular data (watchlists, detailed views)
- `Avatar` — User profile images
- `AspectRatio` — Poster images (use 2/3 ratio for movie posters)
- `Carousel` — Featured content sliders
- `Tooltip`, `HoverCard` — Info on hover
- `Popover` — Inline expanded content

## Image Patterns

```tsx
// Movie poster with aspect ratio
<AspectRatio ratio={2 / 3} className="overflow-hidden rounded-lg">
  <Image
    src={posterUrl}
    alt={title}
    fill
    className="object-cover transition-transform hover:scale-105"
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
  />
</AspectRatio>

// Backdrop / hero image
<div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
  <Image src={backdropUrl} alt="" fill className="object-cover" priority />
  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
</div>
```

## Movie Card Pattern

```tsx
<Card className="group overflow-hidden border-0 bg-transparent">
  <AspectRatio ratio={2 / 3} className="overflow-hidden rounded-lg">
    <Image
      src={posterUrl}
      alt={title}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
    />
  </AspectRatio>
  <div className="pt-2">
    <h3 className="text-sm font-medium leading-tight line-clamp-2">{title}</h3>
    <p className="text-xs text-muted-foreground">{year}</p>
  </div>
</Card>
```

## Loading States

Always show skeleton placeholders that match the final layout shape:

```tsx
// Movie card skeleton
<div className="space-y-2">
  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-3 w-1/2" />
</div>
```

## Server vs Client Components

- **Server Components** (default): Pages, layouts, data-fetching wrappers, static content.
- **Client Components** (`"use client"`): Interactive UI — forms, modals, carousels, search bars, anything with `useState`/`useEffect`/event handlers.
- Keep client boundaries as small as possible — wrap only the interactive part, not entire pages.

## File Organization

```
app/
  layout.tsx            # Root layout (fonts, theme provider, global nav)
  page.tsx              # Home page
  (routes)/             # Route groups
    movies/
      page.tsx          # Movie list
      [id]/page.tsx     # Movie detail
    shows/
      page.tsx          # Show list
      [id]/page.tsx     # Show detail
components/
  ui/                   # shadcn primitives (do not edit)
  movie-card.tsx        # Reusable movie card
  movie-grid.tsx        # Grid of movie cards
  hero-section.tsx      # Hero/backdrop section
  search-bar.tsx        # Search input
  genre-badge.tsx       # Genre tag
  rating-display.tsx    # Star/score display
  navbar.tsx            # Site navigation
  footer.tsx            # Site footer
  theme-toggle.tsx      # Dark/light mode switch
lib/
  utils.ts              # cn() helper
hooks/
  use-mobile.ts         # Mobile breakpoint detection
```

## Tailwind v4 Notes

- Config is CSS-first: all customization is in `globals.css` under `@theme inline { }`.
- No `tailwind.config.js` file — do NOT create one.
- Custom colors use `--color-*` mapped to CSS custom properties.
- Use `@custom-variant dark (&:is(.dark *))` for dark mode styles.
- Border radius tokens: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, etc.

## Dos and Don'ts

**Do:**

- Use `cn()` from `@/lib/utils` to merge class names conditionally.
- Use `next/image` for all images with proper `sizes` and `alt`.
- Use `next/link` for all internal navigation.
- Add `priority` to above-the-fold images.
- Use CSS custom property tokens for all colors.
- Show loading skeletons during data fetches.
- Use semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<article>`).

**Don't:**

- Don't use inline styles — use Tailwind utility classes.
- Don't hardcode color values — use theme tokens.
- Don't create a `tailwind.config.js` — Tailwind v4 uses CSS config.
- Don't wrap entire pages in `"use client"` — minimize client boundaries.
- Don't use `<img>` — always use `next/image`.
- Don't use `<a>` for internal links — use `next/link`.
- Don't install additional UI libraries — use existing shadcn components.
