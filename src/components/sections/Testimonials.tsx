import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        quote: "An extraordinary talent that brings a rare blend of technical skill and creative vision to every project.",
        name: "Sarah Chen",
        role: "Creative Director, Studio Labs",
    },
    {
        quote: "The attention to detail and thoughtfulness in the design process was beyond anything we expected.",
        name: "James Morton",
        role: "CEO, TechForward",
    },
    {
        quote: "Working together was effortless. The final product exceeded our expectations in every way.",
        name: "Priya Sharma",
        role: "Product Lead, InnovateCo",
    },
];

export const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-section px-8 md:px-12 lg:px-20">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-16"
            >
                T E S T I M O N I A L S
            </motion.p>

            <div className="max-w-4xl min-h-[220px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-foreground/80 mb-10">
                            "{testimonials[current].quote}"
                        </p>
                        <div>
                            <p className="text-sm font-semibold text-cream">
                                {testimonials[current].name}
                            </p>
                            <p className="text-sm text-foreground/30">
                                {testimonials[current].role}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="flex gap-2 mt-12">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-accent w-6' : 'bg-foreground/20 w-2'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
