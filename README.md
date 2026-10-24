# Renz Russel Santiago: Portfolio

A single-page portfolio built with Next.js 16 (App Router), TypeScript and Tailwind CSS 4.
It builds to a fully static site (`out/`): no server, database, forms or trackers.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site written to out/
npx serve out    # preview the built site locally
npm run lint
```

## Deploy (Cloudflare Pages, free)

The site is static, so any static host works. Cloudflare Pages settings:

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js (Static HTML Export)) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 or newer (set `NODE_VERSION=22` if needed) |

`public/_headers` adds security headers and long-term caching on Cloudflare.

**Site address:** `siteUrl` in `src/data/site.ts` feeds the SEO tags, sitemap and link
previews. If your Cloudflare project gets a different address (or you add a custom
domain), update it and redeploy.

### After deploying

- **Google Search Console**: add the site URL as a URL-prefix property, verify with the
  HTML-tag method (add the tag via `metadata.verification.google` in `src/app/layout.tsx`),
  then submit `sitemap.xml`.
- **Cloudflare Web Analytics**: in the Cloudflare dashboard, open your Pages project →
  Metrics → enable Web Analytics (no code change needed for Pages sites).
- **PageSpeed Insights**: test the live URL at https://pagespeed.web.dev.

## Edit content

All text, links and figures live in **`src/data/site.ts`**:

| What | Where in `site.ts` |
|---|---|
| Name, title, email, phone, résumé link, photos | `profile` |
| Sidebar / mobile navigation | `navItems` (ids must match section ids) |
| Hero headline and intro | `hero` |
| Tools strip | `tools` (logo files in `public/icons/`; `fit: "cover"` for app-icon style logos) |
| YouTube case study figures, disclosure, screenshot | `caseStudy` |
| Project cards and URLs | `projects` |
| Services, process steps, About, Contact copy | `services`, `processSteps`, `about`, `contact` |

## Images

| File | Purpose |
|---|---|
| `public/images/renz-portrait.webp` | Full portrait with awards (profile card) |
| `public/images/renz-avatar.webp` | Face crop (sidebar and mobile header) |
| `public/images/youtube-analytics.png` | Analytics screenshot (case study and lightbox) |

To regenerate these from new originals:

```bash
node scripts/prepare-images.mjs path/to/portrait.webp path/to/analytics.png
```

The script blurs the name printed on the silver plaque, so the channel name stays private.
If a new photo is framed differently, adjust the polygon coordinates in the script.

## Home background animation

The rotating gold and silver awards come from green-screen footage. To rebuild
them (needs ffmpeg on PATH), pass the source video (preferred: much cleaner than
exported JPEG frames) or a folder of frames:

```bash
node scripts/prepare-playbuttons.mjs path/to/footage.mp4
```

This keys out the green with a soft anti-aliased edge, crossfades the loop seam, and writes 1600x900
`public/media/playbuttons-packed.mp4` (colour on top, transparency underneath)
plus a still `playbuttons-poster.webp`. A small WebGL shader recombines them in
the browser. Visitors who prefer reduced motion see the still frame.

## Motion and interaction

- **Night mode**: toggle in the sidebar and mobile header. Saved per visitor and defaults to the system setting. Colours are tokens in `src/app/globals.css` (`:root[data-theme="dark"]`).
- **Custom cursor**: `src/components/motion/CustomCursor.tsx`. Mouse and pen only; touch devices keep their normal behaviour.
- **Scroll reveals**: wrap any element in `<Reveal>` (or `<Reveal stagger>` with `--i` on children).
- **Pointer effects**: add `data-spotlight`, `data-tilt` or `data-magnetic` to an element.
- **Count-up figures**: `<CountUp value="$13,849.21" />` animates and always ends on the exact string.

Everything respects `prefers-reduced-motion`.

## Structure

```
src/app/            layout, page, global styles (colour tokens in globals.css @theme)
src/components/nav  sidebar + mobile header (shared scrollspy), theme toggle
src/components/motion  cursor, reveals, count-up, pointer effects, hero background
src/components/sections  one component per page section
src/components/ui.tsx    button styles, ExternalLink, SectionHeading
src/data/site.ts    all content
```

Tool logos in `public/icons/` are trademarks of their owners and only identify the tools used. Their presence implies no endorsement or partnership.
