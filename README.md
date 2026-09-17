# Portfolio — Mohammed Yaseen Sutar

An interactive portfolio showcasing dual expertise in **AI/ML Engineering** and **Backend Engineering**.

The site is built around a **Dual-Layer Reveal System**: two personas coexist on the same page, and the visitor chooses which one they see — or explores both at once through a spotlight cursor.

## 🌟 Key Features

### 1. Dual-Layer Experience (The "Reveal" Effect)
- **Front Layer (Default):** the **Backend Engineer** persona — clean, structured, foundational.
- **Reveal Layer (Interactive):** the **AI & ML Engineer** persona — vibrant, forward-thinking.
- **Interaction:** pick a mode on the **Loading Screen**, or explore both simultaneously using the **Spotlight Cursor** on Hero, About and Skills.

### 2. Interactive Loading Screen
- **Choice-driven:** "Backend", "AI & ML", or "Both" before entry.
- **Spotlight effect:** a dynamic spotlight follows the cursor, illuminating the options.

### 3. Filterable Project Archive
- Projects are categorised (**AI & ML / Backend / Full-Stack / Web3 / Embedded**) with live counts per filter.
- Each row expands in place to reveal engineering highlights, the full stack, and whether the work was a client engagement or academic.
- All project content lives in one place — `src/data/projects.ts`.

### 4. Advanced Animations & Interactions
- **Custom Cursor:** motion-value driven (no per-frame React re-renders), with idle / engulf / hidden states. Mounts **only for fine pointers** — touch devices keep their native behaviour.
- **Scroll progress bar** pinned to the top of the viewport.
- **Active-section tracking:** an `IntersectionObserver` highlights the current section in the nav and labels the right-hand rail.
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis), skipped entirely under `prefers-reduced-motion`.
- **Framer Motion** for transitions, staggers and layout animation.

### 5. Accessibility & SEO
- Skip-to-content link, visible focus rings, `aria-current` on the active nav item, labelled social links, `aria-hidden` on decorative reveal layers.
- Full `prefers-reduced-motion` support across CSS, Lenis and programmatic scrolling.
- Open Graph + Twitter card metadata, JSON-LD `Person` schema, SVG favicon, and a `<noscript>` fallback with a direct contact route.

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)
- **3D Graphics:** [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — present in `src/components/3d/`, not currently mounted
- **Linting:** ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## 📂 Project Structure

```bash
src/
├── components/
│   ├── 3d/                 # Three.js components (DistortionSphere — unused)
│   ├── layout/             # Navbar, SideBar, Background
│   ├── sections/           # Hero, Education, About, Skills, Projects, Experience, Achievements, Contact
│   └── ui/                 # CustomCursor, ScrollProgress, LoadingScreen, icons
├── data/
│   ├── profile.ts          # Name, contact links, nav links — single source of truth
│   └── projects.ts         # Every project, with category, stack and highlights
├── hooks/
│   └── useActiveSection.ts # IntersectionObserver-based section tracking
├── lib/
│   └── scroll.ts           # Reduced-motion-aware scrolling helpers
├── App.tsx                 # Composition + view-mode state
├── main.tsx                # Entry point
└── index.css               # Global styles & Tailwind directives
```

## 🎨 Editing Content

| What | Where |
|---|---|
| Name, email, phone, social links | `src/data/profile.ts` |
| Nav items and section ids | `src/data/profile.ts` |
| Projects (all of them) | `src/data/projects.ts` |
| Experience timeline | `src/components/sections/Experience.tsx` |
| Skills and stack chips | `src/components/sections/Skills.tsx` |
| Education | `src/components/sections/Education.tsx` |
| Achievements | `src/components/sections/Achievements.tsx` |
| About copy (both personas) | `src/components/sections/About.tsx` |
| Hero headline + taglines | `src/components/sections/Hero.tsx` |
| Page title, meta, JSON-LD | `index.html` |

### Before deploying
`index.html` has a `TODO` for the three things that need a real domain: an absolute `og:url`, a `<link rel="canonical">`, and a 1200×630 `og:image`.

## 📜 License

MIT.
