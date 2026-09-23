/** Prizes — shared by the Achievements section and the book. */
export interface Achievement {
    title: string;
    event: string;
    desc: string;
}

export const achievements: Achievement[] = [
    {
        title: 'Runner Up — ₹1,50,000',
        event: 'RBIH Ideathon @ IIITB',
        desc: 'Created a Web3 money lending system for microbusiness owners',
    },
    {
        title: 'Best Project — ₹5,000',
        event: 'Quant-A-Maze @ NMIT',
        desc: 'Built a Web3 & ML-based food conservation system',
    },
    {
        title: 'Runner Up — ₹1,500',
        event: 'Web Wizards @ DSU',
        desc: 'Built a Halloween-themed website in 3 hours',
    },
];
