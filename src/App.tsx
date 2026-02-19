import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Background } from './components/layout/Background';
import { CustomCursor } from './components/ui/CustomCursor';
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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleSelectMode = (mode: ViewMode) => {
    setViewMode(mode);
    setLoading(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen cursor-none">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onSelectMode={handleSelectMode} />}
      </AnimatePresence>

      {!loading && (
        <>
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
