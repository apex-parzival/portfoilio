# Portfolio — Mohammed Yaseen Sutar

An interactive portfolio showcasing dual expertise in **AI/ML Engineering** and **Backend Engineering**.

Live at **https://portfoilio-yaseen.vercel.app**

The site is built around a **Dual-Layer Reveal System**: two personas coexist on the same page, and the visitor chooses which one they see — or explores both at once through a spotlight cursor.

## 🌟 Key Features

### 1. Dual-Layer Experience (The "Reveal" Effect)
- **Front Layer (Default):** the **Backend Engineer** persona — clean, structured, foundational.
- **Reveal Layer (Interactive):** the **AI & ML Engineer** persona — vibrant, forward-thinking.
- **Desktop:** pick a mode on the loading screen, or explore both via the **Spotlight Cursor** on Hero, About and Skills.
- **Mobile:** a persona toggle, because the spotlight needs a pointer to drive it.

### 2. Project Archive
- 21 projects in `src/data/projects.ts`, filterable by **AI & ML / Backend / Full-Stack / Web3 / Embedded** with live counts.
- Rows expand in place for a quick look; **featured work sorts first**.
- Every project also has its own page at **`/projects/:slug`** — a shareable URL with highlights, stack and prev/next navigation.

### 3. Built to be found
- Page content renders unconditionally — the loading screen is an overlay, not a gate, so crawlers that execute JS see the whole page.
- Mode choice persists in `sessionStorage`; `Skip` and `Escape` both dismiss the chooser.
- `robots.txt` and a 22-URL `sitemap.xml` are **generated from the project data at build time**, so they can't drift.
- Open Graph + Twitter cards with a real 1200×630 image, JSON-LD `Person` schema, per-route canonical URLs.

### 4. Accessibility
- **Contrast-checked palette.** `muted` (5.73:1) and `faint` (3.72:1) tokens replace stacked opacities that bottomed out near 1.4:1.
- **Real reduced-motion support** via `MotionConfig reducedMotion="user"` plus `useReducedMotion()` — CSS media queries alone don't reach Framer's JS transforms.
- Section headings are real `<h2>`s with an `sr-only` clean label behind the decorative letter-spaced form.
- Focus trap, `Escape`, and focus restoration on the mobile menu; skip link; visible focus rings.

### 5. Performance
- Vendor split into `react` / `motion` chunks so editing a project description doesn't bust the framework cache.
- Detail pages are lazy-loaded.
- Inter is **self-hosted** via `@fontsource` (4 weights) — no third-party request, no render-blocking `@import` chain.

## 🛠️ Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · React Router · Lenis · Vitest

## 🚀 Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck → generate sitemap → build
npm run lint
npm test           # data-integrity tests
npm run sitemap    # regenerate robots.txt + sitemap.xml
```

### Environment

| Variable | Purpose |
|---|---|
| `VITE_WEB3FORMS_KEY` | Enables the contact form. Without it, Contact falls back to a mailto button rather than a form that silently drops messages. Get a key at [web3forms.com](https://web3forms.com), then set it locally in `.env.local` and in the Vercel project settings. |

## 📂 Project Structure

```bash
src/
├── components/
│   ├── layout/             # Navbar, SideBar, Background
│   ├── sections/           # Hero, Education, About, Skills, Projects, Experience, Achievements, Contact
│   └── ui/                 # CustomCursor, ScrollProgress, LoadingScreen, PersonaToggle,
│                           # SectionLabel, ContactForm, icons
├── data/
│   ├── profile.ts          # Name, contact links, nav links, siteUrl — single source of truth
│   ├── projects.ts         # Every project: slug, category, stack, highlights
│   └── *.test.ts           # Data-integrity tests
├── hooks/
│   ├── useActiveSection.ts # IntersectionObserver-based section tracking
│   └── useFocusTrap.ts     # Modal focus containment
├── lib/
│   ├── scroll.ts           # Reduced-motion-aware scrolling
│   └── contact.ts          # Contact form config
├── pages/
│   └── ProjectDetail.tsx   # /projects/:slug
├── App.tsx                 # Home composition + view-mode state
└── main.tsx                # Router entry
scripts/
└── generate-sitemap.mjs    # Builds robots.txt + sitemap.xml from project data
```

## 🎨 Editing Content

| What | Where |
|---|---|
| Name, email, phone, social links, site URL | `src/data/profile.ts` |
| Projects (all of them, incl. slugs + featured) | `src/data/projects.ts` |
| Experience timeline | `src/components/sections/Experience.tsx` |
| Skills and stack chips | `src/components/sections/Skills.tsx` |
| Education / Achievements | the matching file in `src/components/sections/` |
| About copy (both personas) | `src/components/sections/About.tsx` |
| Hero headline + taglines | `src/components/sections/Hero.tsx` |
| Page title, meta, JSON-LD | `index.html` |

> Adding a project? Give it a unique kebab-case `slug` — it becomes a public URL. `npm run build` regenerates the sitemap; CI fails if you commit without doing so.

## 🧪 CI

`.github/workflows/ci.yml` runs lint, tests, build, and a check that the committed sitemap matches the generated one, on every push to `main` and every PR.

## ⚠️ Known limitation

The site is client-rendered — the raw HTML response is an empty `#root`. Crawlers that execute JavaScript (Googlebot) see the full page; those that don't (most link-preview bots) rely on the static OG meta tags, which are in the HTML head. Prerendering would close this gap if it matters.

## 📜 License

MIT.
