/**
 * The two personas' self-descriptions, as plain paragraphs so both the About
 * section and the book can typeset them their own way. The author's name
 * appears verbatim in each first paragraph; renderers emphasise it themselves.
 */
export interface Voice {
    /** Short label, e.g. for a running head. */
    label: string;
    paragraphs: string[];
}

export const voices: { backend: Voice; ai: Voice } = {
    backend: {
        label: 'The Backend Voice',
        paragraphs: [
            'I’m Mohammed Yaseen Sutar, a backend engineer who designs the systems everything else gets built on. Async APIs, data models that hold up under real load, and the unglamorous parts done properly — auth and token rotation, multi-tenant isolation, rate limiting, migrations that don’t lose rows.',
            'Most of what I shipped this year went to real clients: a gateway translating legacy hospital messaging into a national health platform’s format, a multi-tenant attendance backend enforcing row-level security over children’s biometric data, a reverse-auction engine where concurrent bids had to settle deterministically. I’d rather the infrastructure be boring and the product be interesting.',
        ],
    },
    ai: {
        label: 'The AI & ML Voice',
        paragraphs: [
            'I’m Mohammed Yaseen Sutar, an AI/ML engineer who builds intelligent systems that survive contact with real data. My work runs from computer vision and NLP through to LLM and agentic pipelines — retrieval, embeddings, evaluation, and the deployment story a notebook never has to answer for.',
            'I’ve built a multi-agent sourcing pipeline that researches and contacts suppliers on its own, an embedding-plus-LLM-judge engine that catches bill-of-materials errors before they reach the factory floor, and a face-recognition attendance system tuned so a close second match downgrades instead of silently auto-accepting. The interesting work is always in the failure cases.',
        ],
    },
};
