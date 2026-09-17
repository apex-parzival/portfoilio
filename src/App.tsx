import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
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

export type ViewMode = 'view_ai_ml' | 'view_backend' | 'both';

function App() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('both');

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

  // Keep the page from scrolling behind the loading overlay.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  const handleSelectMode = (mode: ViewMode) => {
    setViewMode(mode);
    setLoading(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onSelectMode={handleSelectMode} />}
      </AnimatePresence>

      {!loading && (
        <>
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
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
