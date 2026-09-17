import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/layout/Navbar';
import { Background } from './components/layout/Background';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { SideBar } from './components/layout/SideBar';
import { Hero } from './components/sections/Hero';
import { Education } from './components/sections/Education';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Achievements } from './components/sections/Achievements';
import { Contact } from './components/sections/Contact';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { PersonaToggle } from './components/ui/PersonaToggle';

export type ViewMode = 'view_ai_ml' | 'view_backend' | 'both';

const STORAGE_KEY = 'portfolio:viewMode';

const isViewMode = (value: string | null): value is ViewMode =>
  value === 'view_ai_ml' || value === 'view_backend' || value === 'both';

const storedMode = (): ViewMode | null => {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return isViewMode(value) ? value : null;
  } catch {
    // Private-mode / blocked storage — just show the chooser again.
    return null;
  }
};

function App() {
  // Resolve the stored choice before first paint so a repeat visit in the same
  // session never flashes the chooser.
  const [initialMode] = useState(storedMode);
  const [loading, setLoading] = useState(() => initialMode === null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => initialMode ?? 'both');

  useEffect(() => {
    // Smooth scroll is a flourish, not a feature — skip it entirely for anyone
    // who has asked the OS to reduce motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  // The page content is always in the DOM (crawlers never click the chooser),
  // so the overlay has to be the thing that stops the page scrolling.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  const handleSelectMode = (mode: ViewMode) => {
    setViewMode(mode);
    setLoading(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Non-fatal: the choice just won't survive a reload.
    }
  };

  return (
    // reducedMotion="user" is what actually stops Framer's JS transforms;
    // the CSS media query in index.css only reaches CSS transitions.
    <MotionConfig reducedMotion="user">
    <div className="bg-background text-foreground min-h-screen">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onSelectMode={handleSelectMode} />}
      </AnimatePresence>

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-accent focus:text-[#0a0a0a] focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Background />
      <Navbar />
      <SideBar />
      <main className="relative z-10">
        <Hero viewMode={viewMode} />
        <Education />
        <About viewMode={viewMode} />
        <Skills viewMode={viewMode} />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>

      {!loading && <PersonaToggle viewMode={viewMode} onChange={setViewMode} />}

      <Analytics />
    </div>
    </MotionConfig>
  );
}

export default App;
