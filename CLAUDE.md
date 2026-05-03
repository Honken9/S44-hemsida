# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for the property at **Skatelövsvägen 44, Grimslöv** — eight rental apartments. All copy and form labels are in Swedish; keep them that way.

## Commands

```bash
npm run dev      # Astro dev server on http://localhost:4321
npm run build    # Production build (writes .vercel/output/ for Vercel)
npm run preview  # Serve the built site locally
```

There is no test suite or linter configured.

## Stack & deploy

- **Astro 5** in SSR mode (`output: 'server'`) with the `@astrojs/vercel` adapter — required because the contact form is a real API route, not a static page.
- **Tailwind v4** via the `@tailwindcss/vite` plugin (no `tailwind.config.js`). The design tokens (colors, fonts) live in `@theme { ... }` inside `src/styles/global.css` — edit that block to retheme.
- **Resend** for transactional email from the contact form.
- Deploys to **Vercel**. Vercel pins Node 22 for serverless functions; local Node ≥ 20 is fine.

## Environment variables

The contact API route fails closed without these. Set them in Vercel project settings (Production + Preview) and in a local `.env` for dev:

| Var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend account API key |
| `CONTACT_TO_EMAIL` | Recipient — defaults to `hakfastigheter@gmail.com` |
| `CONTACT_FROM_EMAIL` | Sender — must be a verified Resend domain in production; `onboarding@resend.dev` works for dev only |

See `.env.example`.

## Architecture

- `src/data/site.ts` — single source of truth for site metadata, the hero image URL, and the `apartments` array. **Edit this file to change apartment listings, status, or images.** Both the start page and `/lagenheter` consume it.
- `src/layouts/Layout.astro` — wraps every page with `Header`, `Footer`, fonts, and global CSS. New pages should use it.
- `src/pages/` — file-based routing. `index.astro` (start), `lagenheter.astro`, `kontakt.astro`, and `api/contact.ts` (POST endpoint).
- `src/pages/api/contact.ts` — `export const prerender = false` is required so this route runs on the Vercel serverless function, not at build time. Includes a `company` honeypot field; if filled, the request is silently accepted but no email is sent.
- Placeholder property/apartment images are hot-linked from Unsplash. Replace by swapping the URLs in `src/data/site.ts` (and `heroImage`); when real photos arrive, drop them in `public/` and reference as `/filename.jpg`.

## Conventions

- Swedish locale: `<html lang="sv">` in `Layout.astro`, all user-facing copy in Swedish.
- Tailwind utility classes only — no separate component CSS files. Color/font tokens come from `@theme` (e.g. `bg-bone`, `text-stone`, `font-serif`); prefer those over raw hex.
- The contact form submits via `fetch` JSON, not a native form POST — keep the client script and API route's JSON branch in sync.
