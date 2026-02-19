import { motion } from 'framer-motion';

const projects = [
    {
        id: 1,
        title: 'Neon Eclipse',
        category: 'Web Design',
        color: '#FF6B6B',
    },
    {
        id: 2,
        title: 'Cyber Construct',
        category: '3D Interaction',
        color: '#4ECDC4',
    },
    {
        id: 3,
        title: 'Minimal Focus',
        category: 'Branding',
        color: '#FFE66D',
    },
    {
        id: 4,
        title: 'Urban Pulse',
        category: 'Mobile App',
        color: '#1A535C',
    },
];

export const Works = () => {
    return (
        <section id="work" className="min-h-screen py-32 px-4 md:px-10 bg-background text-foreground">
            <h2 className="text-[10vw] uppercase font-bold tracking-tighter mb-20 leading-none">Selected Works</h2>

            <div className="space-y-40">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        viewport={{ once: true, margin: "-10%" }}
                        className={`flex flex-col md:flex-row gap-10 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-2/3 aspect-video bg-neutral-900 overflow-hidden relative group cursor-none">
                            <div
                                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundColor: project.color }}
                            >
                                {/* Placeholder for project image */}
                                <div className="absolute inset-0 flex items-center justify-center text-black/20 text-9xl font-bold uppercase opacity-50">
                                    {project.title.charAt(0)}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-4">
                            <span className="text-accent text-sm tracking-widest uppercase">0{index + 1}</span>
                            <h3 className="text-5xl font-bold uppercase leading-none">{project.title}</h3>
                            <p className="text-lg opacity-60">{project.category}</p>
                            <div className="pt-8">
                                <button className="px-6 py-3 border border-white/20 rounded-full uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors">
                                    View Case Study
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
