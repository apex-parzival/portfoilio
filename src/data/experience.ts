/** Work history — shared by the Experience section and the book. */
export interface Role {
    year: string;
    role: string;
    company: string;
    summary: string;
    stack: string[];
}

export const experiences: Role[] = [
    {
        year: 'Feb 2026 — Present',
        role: 'AI/ML Engineer Intern',
        company: 'Mirai Labs',
        summary:
            'Shipping AI and full-stack systems for manufacturing, healthcare, government and logistics clients — agentic pipelines, LLM document extraction, computer vision and the production backends around them.',
        stack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Gemini', 'AWS Bedrock', 'Docker'],
    },
    {
        year: 'Feb 2026 — May 2026',
        role: 'Backend Intern',
        company: 'Erthaloka',
        summary:
            'Built and maintained backend services and REST APIs, focusing on clean data models and dependable integrations.',
        stack: ['Node.js', 'Express', 'MongoDB', 'REST'],
    },
    {
        year: 'Feb 2026 — Mar 2026',
        role: 'Backend Intern',
        company: 'Prodigy InfoTech',
        summary:
            'Delivered backend modules covering authentication, CRUD APIs and database design across assigned projects.',
        stack: ['Node.js', 'Express', 'SQL', 'JWT'],
    },
];
