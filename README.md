# Aswanth K.T — Portfolio v2

**From building railways to building production web apps.**
Live: [aswanthkt.in](https://www.aswanthkt.in)

A scroll-driven portfolio where the hero film shows the career path: the railway worker walks down the track, crosses a holographic "switch" into an office, and sits down as a developer.

## Stack

- **Next.js 16** (App Router, static export) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** smooth scrolling
- **EmailJS** for the contact form

## Features

| | |
|---|---|
| Preloader | An odometer-style counter that tracks how much of the hero film has actually loaded |
| Hero | 270-frame canvas sequence scrubbed by scroll, with three chapters: *The Track*, *The Switch*, *The Stack* |
| Caution tape | Two crossing marquees that speed up and reverse with your scroll |
| About | Words light up as you scroll; an ASCII portrait shows the real photo under the cursor (tap on phones) |
| Stack | Bento grid with a cursor spotlight, plus a **working terminal** (`help`, `projects`, `hire`, …) |
| Experience | A railway-track timeline that fills in as you scroll |
| Work | Sticky stacked project cards with tilt-on-hover browser mockups |
| Contact | Copy-to-clipboard email, live Kannur clock, topic chips, a validated form |
| Everywhere | **⌘K / Ctrl K command palette**, magnetic buttons, a context-aware cursor, rolling hover text |

It also handles accessibility and speed: `prefers-reduced-motion` is respected (no smooth scroll, pinning or reveals), there is a skip link, the palette is keyboard-first, focus rings are visible, and the custom cursor is off on touch screens. Phones get a lighter frame set, and frames load coarse-to-fine so fast scrolling never shows a blank.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site → ./out
npm start          # preview ./out locally
```

## Edit content

Almost everything lives in **`src/data/content.ts`**: links, hero chapters, stats, skills, the timeline and projects.

- **Project screenshots:** `public/work/<slug>.webp` (1280×800 works best)
- **Portrait:** `public/profile.webp`
- **Social share image:** `public/og-image-v2.jpg` (1200×630). When you replace it, give it a new name and update `src/app/layout.tsx`, so LinkedIn and WhatsApp drop their cached copy.
- **Skill logos:** `public/icons/skills/*.svg`, mapped to skill names in `src/data/skill-icons.ts`. To add one, drop in an SVG (e.g. from [devicon.dev](https://devicon.dev) or [simpleicons.org](https://simpleicons.org)) and add its name to the map.
- **Colours:** three RGB variables at the top of `src/app/globals.css` (`--bg-rgb`, `--fg-rgb`, `--accent-rgb`) re-theme the whole site.
- **Hero film:** run `npm run frames -- <folder-of-jpgs>` to regenerate `public/frames/`. If the frame count or story timing changes, update `FRAME_COUNT` / `BEATS` in `src/components/hero/frames.ts`.

## Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

The old `VITE_EMAILJS_*` names still work, so keys already set on your host don't need renaming. Without keys, the form opens the visitor's mail app instead.

## Deploy

The build is a plain static site in **`out/`**:

- **Vercel:** set Framework Preset to *Next.js*. No other changes are needed.
- **Netlify / Render / any static host:** build command `npm run build`, publish directory **`out`** (previously `dist`).

Google Analytics only loads on `aswanthkt.in`, so local development and preview deploys don't skew the stats.

## Structure

```
src/
  app/            layout (SEO, fonts, JSON-LD), page, sitemap, robots, icon, 404
  components/
    hero/         scroll-scrubbed frame sequence
    layout/       preloader, navbar, command palette, cursor, smooth scroll, footer
    sections/     about, stack + terminal, experience, projects, contact, marquee
    ui/           rolling numbers, roll text, magnetic, icons, headings
  data/           all site content
  lib/            gsap setup, event bus, helpers
```
