/** Education history — shared by the Education section and the book. */
export interface EducationEntry {
    year: string;
    degree: string;
    institution: string;
    details: string;
    cgpa?: string;
    percentage?: string;
}

export const education: EducationEntry[] = [
    {
        year: '2022 — 2026',
        degree: 'B.Tech in Computer Science Engineering — Artificial Intelligence and Machine Learning',
        institution: 'Dayananda Sagar University',
        details: 'Specialization in AI & Machine Learning',
        cgpa: '8.16',
    },
    {
        year: '2020 — 2022',
        degree: 'Higher Secondary Education',
        institution: 'ICS Mahesh PU College',
        details: 'Science Stream — PCM with Computer Science',
        percentage: '81.5%',
    },
    {
        year: '2018 — 2020',
        degree: 'Secondary Education',
        institution: 'JSS Shri Manjunatheswara Central School',
        details: 'CBSE Board',
        percentage: '82.7%',
    },
];
