/** Disciplines with the tools used in each — shared by the Skills section and the book. */
export interface SkillArea {
    title: string;
    desc: string;
    tech: string[];
}

export const skills: SkillArea[] = [
    {
        title: 'AI & ML',
        desc: 'LLM pipelines, agentic workflows, retrieval and embeddings, computer vision and NLP — trained, evaluated and actually deployed.',
        tech: ['PyTorch', 'Hugging Face', 'Gemini', 'AWS Bedrock', 'OpenCV', 'InsightFace', 'Embeddings', 'RAG'],
    },
    {
        title: 'BACKEND',
        desc: 'Async APIs, relational data modelling, row-level multi-tenancy, auth and token rotation, caching and rate limiting.',
        tech: ['FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'JWT', 'SSE'],
    },
    {
        title: 'FULL-STACK',
        desc: 'Component-driven product interfaces with real server state, not just screens — typed end to end.',
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'TanStack Query', 'Zustand', 'Prisma'],
    },
    {
        title: 'CLOUD & DEVOPS',
        desc: 'Containerised services, CI/CD that actually deploys, managed data stores and cost-aware infrastructure choices.',
        tech: ['AWS', 'Docker', 'GitHub Actions', 'Vercel', 'Amplify', 'Firebase', 'Supabase', 'Kubernetes'],
    },
    {
        title: 'WEB3',
        desc: 'Smart contract design, token incentive mechanics and safe integration between chain state and application state.',
        tech: ['Solidity', 'Hardhat', 'Web3.js', 'Ethers'],
    },
    {
        title: 'FOUNDATIONS',
        desc: 'System design, data structures and algorithms, testing discipline, and writing the docs that outlive the sprint.',
        tech: ['Python', 'C++', 'SQL', 'Git', 'System Design', 'Testing'],
    },
];
