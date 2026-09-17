import { useRef } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { scrollToTop } from '../../lib/scroll';
import {
    GitHubIcon,
    InstagramIcon,
    LeetCodeIcon,
    LinkedInIcon,
    MailIcon,
    PhoneIcon,
} from '../ui/icons';

interface Social {
    name: string;
    alt: string;
    url: string;
    external: boolean;
    Icon: ComponentType<{ className?: string }>;
}

const socials: Social[] = [
    {
        name: 'Instagram',
        alt: profile.instagramHandle,
        url: profile.instagram,
        external: true,
        Icon: InstagramIcon,
    },
    {
        name: 'LinkedIn',
        alt: profile.name,
        url: profile.linkedin,
        external: true,
        Icon: LinkedInIcon,
    },
    {
        name: 'GitHub',
        alt: profile.githubHandle,
        url: profile.github,
        external: true,
        Icon: GitHubIcon,
    },
    {
        name: 'LeetCode',
        alt: profile.leetcodeHandle,
        url: profile.leetcode,
        external: true,
        Icon: LeetCodeIcon,
    },
    {
        name: 'Email',
        alt: profile.email,
        url: `mailto:${profile.email}`,
        external: false,
        Icon: MailIcon,
    },
    {
        name: 'Phone',
        alt: profile.phoneDisplay,
        url: `tel:${profile.phone}`,
        external: false,
        Icon: PhoneIcon,
    },
];

// Magnetic round button
const MagneticRoundButton = ({ social }: { social: Social }) => {
    const buttonRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current) return;
        buttonRef.current.style.transform = 'translate(0, 0)';
    };

    const { Icon } = social;

    return (
        <motion.div
            className="flex items-center justify-end gap-4 group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
        >
            {/*
              * The label slot takes whatever width the grid cell leaves over. A fixed
              * width clipped the longer handles ("Mohammed Yaseen Sutar") mid-word.
              */}
            <div className="relative h-[20px] overflow-hidden flex-1 min-w-0 text-right">
                <span className="block text-sm font-medium text-cream tracking-wide truncate transition-all duration-300 ease-in-out group-hover:-translate-y-[22px] group-hover:opacity-0">
                    {social.name}
                </span>
                <span className="absolute top-0 right-0 max-w-full truncate text-xs font-mono text-accent translate-y-[22px] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                    {social.alt}
                </span>
            </div>

            {/* Round bordered button */}
            <a
                ref={buttonRef}
                href={social.url}
                {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-foreground/50 hover:bg-accent hover:border-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all duration-300 motion-reduce:!transform-none"
                style={{
                    transition:
                        'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.3s, border-color 0.3s, background-color 0.3s, box-shadow 0.3s',
                }}
                aria-label={`${social.name} — ${social.alt}`}
                title={social.name}
                data-cursor-hide
            >
                <Icon />
            </a>
        </motion.div>
    );
};

export const Contact = () => {
    const handleTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        scrollToTop();
    };

    return (
        <section
            id="contact"
            className="py-20 px-8 md:px-12 lg:px-20 min-h-[60vh] flex flex-col justify-center"
        >
            <div className="flex-1 flex flex-col justify-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-8"
                >
                    C O N T A C T
                </motion.p>

                {/* Smaller heading */}
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: '100%' }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-cream"
                    >
                        Let's work
                    </motion.h2>
                </div>
                <div className="overflow-hidden mb-8">
                    <motion.h2
                        initial={{ y: '100%' }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                        className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-foreground/20"
                    >
                        together.
                    </motion.h2>
                </div>

                <motion.a
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    href={`mailto:${profile.email}`}
                    className="self-start mb-12 px-7 py-4 rounded-full bg-accent text-[#0a0a0a] text-sm font-bold tracking-widest uppercase hover:bg-accent/85 transition-colors duration-300"
                    data-cursor-hide
                >
                    Start a conversation
                </motion.a>

                {/* Grid of social buttons including Email/Phone */}
                <div className="border-t border-white/10 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10 w-full max-w-7xl">
                        {socials.map((social) => (
                            <MagneticRoundButton key={social.name} social={social} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-16 text-xs text-foreground/20 tracking-widest uppercase">
                <span>© {new Date().getFullYear()} {profile.name}</span>
                <a
                    href="#"
                    onClick={handleTop}
                    className="hover:text-accent transition-colors duration-300"
                    data-cursor-hide
                >
                    Back to Top
                </a>
            </div>
        </section>
    );
};
