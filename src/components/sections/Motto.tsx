import { motion } from 'framer-motion';

export const Motto = () => {
    return (
        <section className="py-section px-8 md:px-12 lg:px-20 flex items-center justify-center relative overflow-hidden">
            {/* Decorative orange circle */}
            <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="absolute left-[10%] w-[25vw] h-[25vw] rounded-full bg-accent opacity-80 pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="relative z-10 max-w-5xl"
            >
                <p className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-12 text-center">
                    E X P E R I E N C E
                </p>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-snug tracking-tight text-center italic">
                    <span className="text-cream">Only se</span>
                    <span className="text-accent">decade</span>
                    <span className="text-cream"> of experience produc</span>
                    <span className="text-accent">tive design</span>
                    <span className="text-foreground/40"> and working with some of the most talented people in the business</span>
                </h2>
            </motion.div>
        </section>
    );
};
