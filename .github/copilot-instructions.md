# Copilot Instructions — Cine List

## Project Overview

Cine List is a movie and TV show tracking app built with:

- Next.js 16 (App Router, React Server Components)
- React 19
- Tailwind CSS v4 (CSS-first config in `globals.css`)
- shadcn/ui v4 (radix-vega style)
- Lucide React icons
- TypeScript

## Key Rules

1. **Read AGENTS.md first** — Next.js 16 has breaking changes. Check `node_modules/next/dist/docs/` before writing Next.js code.
2. **Tailwind v4** — No `tailwind.config.js`. All theme config is in `app/globals.css` under `@theme inline {}`.
3. **shadcn/ui** — Import from `@/components/ui/*`. Do not modify files in `components/ui/`.
4. **Use `cn()`** — Always merge classnames with `cn()` from `@/lib/utils`.
5. **Server Components by default** — Only add `"use client"` when the component needs interactivity.
6. **Images** — Always use `next/image` with `sizes` and `alt`. Use `next/link` for internal navigation.
7. **Dark mode** — Design dark-mode-first. Use CSS custom property color tokens, never hardcoded values.
