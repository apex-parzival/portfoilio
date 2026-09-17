/** Single source of truth for identity + links, shared by Contact, SideBar and SEO. */
export const profile = {
    name: 'Mohammed Yaseen Sutar',
    shortName: 'Yaseen Sutar',
    initials: 'MS',
    roles: ['Backend Engineer', 'AI & ML Engineer'],
    email: 'sutaryaseen1@gmail.com',
    phone: '+917022012697',
    phoneDisplay: '+91 70220 12697',
    instagram: 'https://www.instagram.com/yaseensutar_?igsh=MXhjeWUzY2FnZ29sMg==',
    instagramHandle: '@yaseensutar_',
    linkedin: 'https://www.linkedin.com/in/mohammedyaseen-sutar-6b0a9b195/',
    github: 'https://github.com/apex-parzival',
    githubHandle: '@apex-parzival',
    leetcode: 'https://leetcode.com/u/MohammedyaseenSutar/',
    leetcodeHandle: '@MohammedyaseenSutar',
} as const;

export const navLinks = [
    { name: 'Education', id: 'education' },
    { name: 'About Me', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Contact', id: 'contact' },
] as const;

/** Stable reference — passed straight into the IntersectionObserver hook. */
export const sectionIds: string[] = navLinks.map((l) => l.id);
