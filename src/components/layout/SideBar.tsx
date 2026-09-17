import { motion } from 'framer-motion';
import { navLinks, profile, sectionIds } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import { GitHubIcon, InstagramIcon, LeetCodeIcon, LinkedInIcon } from '../ui/icons';

const socials = [
    { label: 'Instagram', href: profile.instagram, Icon: InstagramIcon },
    { label: 'LinkedIn', href: profile.linkedin, Icon: LinkedInIcon },
    { label: 'GitHub', href: profile.github, Icon: GitHubIcon },
    { label: 'LeetCode', href: profile.leetcode, Icon: LeetCodeIcon },
];

export const SideBar = () => {
    const active = useActiveSection(sectionIds);
    const activeLabel = navLinks.find((l) => l.id === active)?.name ?? '';

    return (
        <>
            {/* Left side social icons — circular bordered buttons */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-4"
            >
                {socials.map(({ label, href, Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_16px_rgba(255,77,0,0.15)] transition-all duration-300"
                        aria-label={`${profile.name} on ${label}`}
                        title={label}
                        data-cursor-hide
                    >
                        <Icon className="w-4 h-4" />
                    </a>
                ))}
            </motion.div>

            {/* Right side vertical text — reflects the section currently in view */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
                aria-hidden="true"
            >
                <span
                    className="text-[10px] tracking-[0.3em] uppercase text-faint block transition-colors duration-500"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    {activeLabel}
                </span>
            </motion.div>
        </>
    );
};
