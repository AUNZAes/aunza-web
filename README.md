# AUNZA website

Next.js 15, React 19, TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, Three.js / React Three Fiber.

The site is published as plain files on GitHub Pages. The forms go to a small Cloudflare Worker, `worker/forms.js`.

- `docs/supabase.sql`: database setup.

## Run it

Needs Node.js 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Opens at http://localhost:3000 in Spanish (English at `/en`). Forms need `NEXT_PUBLIC_FORMS_URL` in `.env.local`; without it they show an error and say nothing was sent.

## Images

Final images live in `public/images/final/`. `npm run build` first runs `scripts/build-image-sizes.mjs`, which makes every size `next/image` can ask for in `public/images/w/` (not committed). Anything not yet final shows a visible `TEMP` or `PLACEHOLDER` flag with its ID, so a stand-in can't ship unnoticed.

## The forms

Forms never report success unless a provider accepted the request.

`worker/forms.js` is one file, pasted into the Cloudflare editor. Its addresses are constants at the top. In the Worker's settings it needs two secrets:

- `RESEND_API_KEY`: sends each request by email. The domain must be verified in Resend.
- `SUPABASE_SERVICE_ROLE_KEY`: stores each request. Run `docs/supabase.sql` first. Reference files go to the private `form-uploads` bucket and reach the team as a link valid for 30 days.

After changing `worker/forms.js`, paste it into Cloudflare again: pushing to GitHub doesn't update it. Its wording mirrors `form.api` in `src/content/*/form.ts`, and its labels mirror `form.quote.options` in English.

Rate limiting is per Worker instance, so it is only a first line of defence.

## Publishing

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site into `out/` and publishes it to GitHub Pages. Public settings such as the domain and the Worker's address are in `.env.production`.

GitHub Pages answers unknown addresses with `/404.html`, which `scripts/finish-export.mjs` makes from the `404-page` routes. It can't send custom response headers.

## Before launch

- Add the legal details in `src/content/*/site.ts` and have the text reviewed.
- Send a real test request.
- Replace `src/lib/logo.ts` if an official SVG of the logo exists: it is a hand-traced redraw.

## Project map

```
src/app/                 route files per language, sitemap, robots
worker/forms.js          forms server (Cloudflare Worker)
src/views/               every page, written once
src/components/home/     homepage sections
src/components/three/    WebGL scenes, procedural models and textures (christmas/ for the campaign)
src/components/christmas/ Christmas page sections
src/components/motion/   ScrollStage (3D storytelling), MotionRoot (site-wide), page transition
src/components/detail/   product and market page template
src/components/forms/    quote and contact forms
src/content/              all copy: en/ and es/
src/i18n/config.ts       locales, canonical and hreflang helpers
src/lib/quote.ts         validation shared by the browser and the API
scripts/                 image sizes and export finishing
```

## Languages

Spanish lives at `/` and English at `/en`. Each language has its own root layout (`src/app/(es)` and `src/app/(en)/en`), and those route files only choose the language: every page is written once in `src/views/`.

- Copy: `src/content/en/` and `src/content/es/`, with the same shape. TypeScript fails the build if a Spanish text is missing. The Spanish was written by hand, in informal "tú", not machine translated.
- Links: use `@/components/ui/LocaleLink` with an unprefixed path. It keeps the visitor in their language.
- Client components receive only the copy they need, as props, so a page never ships the other language.
- Requests always reach the team with English field names, plus a `Language` line.

The tagline printed on the 3D cup and box stays in English, as a brand line.

## Motion conventions

Pages stay server components and opt in with attributes handled by `MotionRoot`:

- `data-reveal`, `data-reveal="mask"`, `data-reveal="lines"`: entrance on scroll.
- `data-parallax="0.1"`: scrubbed drift, desktop only.
- `data-scrub-words`, `data-scrub-clip`: scroll-linked text and image reveals.

Three.js only downloads when a scene comes near the screen. Do not import `three` from anything that reaches the main bundle: `src/components/three/scene-utils.ts` exists for that reason.
