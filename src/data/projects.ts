export type ProjectCategory = 'AI & ML' | 'Backend' | 'Full-Stack' | 'Web3' | 'Embedded';
export type ProjectContext = 'Client' | 'Academic';

export interface Project {
    /** URL segment for /projects/:slug — must stay stable, it's a public link. */
    slug: string;
    /** Surfaced first under the "All" filter. */
    featured?: boolean;
    /** Backend-layer title (front layer) */
    title: string;
    /** AI/ML-layer title (reveal layer) */
    reveal: string;
    /** One-line summary shown on the collapsed row */
    desc: string;
    /** Who it was built for — kept deliberately generic for NDA'd engagements */
    org: string;
    year: string;
    context: ProjectContext;
    category: ProjectCategory[];
    highlights: string[];
    tech: string[];
}

/**
 * Professional work first (most recent / highest impact), then academic + personal.
 * Client names are generalised where the engagement is under NDA.
 */
export const projects: Project[] = [
    {
        slug: 'bom-error-reduction',
        featured: true,
        title: 'BOM ERROR REDUCTION',
        reveal: 'AI BILL-OF-MATERIALS ENGINE',
        desc: 'AI platform that generates and validates machine-specific Bills of Materials, replacing an error-prone manual ERP process',
        org: 'Industrial CNC manufacturer',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Backend'],
        highlights: [
            'Bilingual embedding retrieval plus an LLM judge maps customer price-list options onto BOM items across seven machine families',
            'Deterministic closed-BOM generation, diffed against the ERP configurator output to surface rule errors before they reach production',
            'Natural-language → CDL rule translation with conflict, dead-reference and drift detection across releases',
        ],
        tech: ['Python', 'FastAPI', 'Next.js', 'Gemini', 'Embeddings', 'Vector Search', 'TypeScript'],
    },
    {
        slug: 'supplier-scout',
        featured: true,
        title: 'SUPPLIER SCOUT',
        reveal: 'MULTI-AGENT SOURCING PIPELINE',
        desc: 'Agentic procurement engine that finds, verifies and contacts suppliers for a part from a single plain-English request',
        org: 'Industrial CNC manufacturer',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Backend'],
        highlights: [
            'Nine specialised agents chained end to end: clarification → requirement extraction → query generation → search → classification → scraping → extraction → outreach',
            'Concurrent scraping with a three-tier fallback chain, plus a parallel long-running deep-research track with a verification agent that filters hallucinated findings',
            'Live progress streamed to the UI over SSE, with drafted supplier emails and auto-filled RFQ forms as the output',
        ],
        tech: ['Python', 'FastAPI', 'PostgreSQL', 'Gemini', 'Playwright', 'SSE', 'Next.js'],
    },
    {
        slug: 'attendance-system',
        featured: true,
        title: 'ATTENDANCE SYSTEM',
        reveal: 'FACE RECOGNITION AT SCHOOL SCALE',
        desc: 'Face-recognition attendance platform for a government school pilot, designed to scale to an entire district as config, not a rebuild',
        org: 'Government school pilot',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Backend', 'Full-Stack'],
        highlights: [
            'Confidence-tiered matching with an enrolment quality gate, passive liveness check and a top-1/top-2 margin rule so close calls downgrade instead of silently auto-accepting',
            'Multi-tenant Postgres with row-level security, encrypted face encodings with key rotation, and refresh-token rotation with replay detection',
            'DPDP-Act consent enforced at every capture, not just at enrolment; bilingual (English/Kannada) installable PWA for teachers',
        ],
        tech: ['Python', 'FastAPI', 'PostgreSQL', 'InsightFace', 'React', 'PWA', 'AWS', 'Docker'],
    },
    {
        slug: 'hl7-fhir-gateway',
        featured: true,
        title: 'HL7 → FHIR GATEWAY',
        reveal: 'HEALTHCARE INTEROPERABILITY BRIDGE',
        desc: 'Translation service bridging 1980s hospital messaging formats to a modern national health-insurance platform',
        org: 'Healthcare interoperability',
        year: '2026',
        context: 'Client',
        category: ['Backend'],
        highlights: [
            'Parses pipe-delimited HL7 v2 messages and assembles compliant FHIR R4 bundles for eligibility, prior-authorisation and claim submission',
            'Five-layer middleware stack: rate limiting, correlation IDs, request timing, security headers and CORS',
            'mTLS client-certificate submission to the national gateway, with a mock mode so the whole pipeline runs without production credentials',
        ],
        tech: ['Python', 'FastAPI', 'HL7 v2', 'FHIR R4', 'Redis', 'Docker', 'Kubernetes'],
    },
    {
        slug: 'weconnect',
        featured: true,
        title: 'WECONNECT',
        reveal: 'E-WASTE REVERSE AUCTION PLATFORM',
        desc: 'B2B e-waste aggregation platform running sealed and live reverse auctions between corporates and certified recyclers',
        org: 'Sustainability marketplace',
        year: '2026',
        context: 'Client',
        category: ['Full-Stack', 'Backend'],
        highlights: [
            'Three-stage auction engine — invitation → sealed bid → live open auction with auto-extension, rank visibility and tick-size controls',
            'Resolved live-bidding race conditions so concurrent bids settle deterministically under load',
            'Four role-scoped dashboards and end-to-end compliance paperwork: Form 6, weight slips, recycling and disposal certificates',
        ],
        tech: ['Next.js', 'TypeScript', 'Firebase', 'Firestore', 'AWS Amplify'],
    },
    {
        slug: 'prior-auth-automation',
        featured: true,
        title: 'PRIOR-AUTH AUTOMATION',
        reveal: 'CLINICAL DOCUMENT EXTRACTION',
        desc: 'Desktop app that reads referral PDFs, extracts clinical fields with an LLM and maps them to billing codes',
        org: 'US pain-management clinic',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Full-Stack'],
        highlights: [
            'Documents land in S3, then page-level extraction runs through AWS Bedrock behind a keyword gate that rejects pages missing the expected clinical fields',
            'Extracted diagnosis and procedure codes are joined against a master CPT inventory, with full/partial/no-match tiers surfaced to the reviewer',
            'Electron shell over a React UI and a FastAPI backend, so clinic staff run it as a normal desktop application',
        ],
        tech: ['Python', 'FastAPI', 'AWS Bedrock', 'S3', 'Electron', 'React'],
    },
    {
        slug: 'property-hub',
        title: 'PROPERTY HUB',
        reveal: 'GEOSPATIAL PROPERTY DISCOVERY',
        desc: 'Real-estate platform with map-driven listings and automated neighbourhood amenity discovery',
        org: 'Real-estate marketplace',
        year: '2026',
        context: 'Client',
        category: ['Full-Stack', 'Backend'],
        highlights: [
            'Re-architected the nearby-amenities lookup from sequential calls into concurrent workers, collapsing a ~90-second wait into a fraction of it',
            'Costed every third-party dependency — Maps, SMS, Firebase, hosting — against real published pricing rather than estimates',
            'Map clustering, rich-text listing editor and role-scoped dashboards on Next.js with Prisma and Supabase',
        ],
        tech: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'Google Maps', 'AWS Amplify'],
    },
    {
        slug: 'fleet-console',
        title: 'FLEET CONSOLE',
        reveal: 'IOT SMART-GLASSES OPERATIONS',
        desc: 'Operations console previewing an AWS IoT platform for a smart-glasses fleet: telemetry, media and alerts',
        org: 'Smart-glasses OEM',
        year: '2026',
        context: 'Client',
        category: ['Full-Stack'],
        highlights: [
            'Fleet view with battery, connectivity, storage and firmware telemetry per device, plus OTA push and a 12-reading battery history',
            'Captured-media repository tagged for ML training, and a derived alert feed standing in for production push notifications',
            'A single serverless route holds the AI diagnostic model key server-side, with a deterministic fallback so the demo runs fully offline',
        ],
        tech: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Serverless', 'Gemini'],
    },
    {
        slug: 'rail-intelligence',
        title: 'RAIL INTELLIGENCE',
        reveal: 'PREDICTIVE RAIL OPERATIONS',
        desc: 'Enterprise rail operations POC covering predictive maintenance, defect detection and dynamic routing',
        org: 'Rail logistics',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Full-Stack'],
        highlights: [
            'Command-centre dashboards for wagon failure prediction, track defect detection, yard occupancy and weather impact forecasting',
            'Designed against a digital-twin target of 40,000+ rail carts and 20,000+ concurrent active assets across multiple yards',
            'Turborepo monorepo with a shared component package so the console and future apps stay visually consistent',
        ],
        tech: ['Next.js', 'TypeScript', 'Turborepo', 'Computer Vision', 'Predictive Analytics'],
    },
    {
        slug: 'mediaforge',
        title: 'MEDIAFORGE',
        reveal: 'GENERATIVE CREATIVE STUDIO',
        desc: 'AI creative studio for social teams — generate text, images and video, edit on canvas, then schedule it',
        org: 'Marketing SaaS',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Full-Stack'],
        highlights: [
            'Multi-modal generation with async polling for long-running video jobs, plus an iterative editor that stacks refinement prompts on prior media',
            'Six fully editable canvas ad templates with one-click export, and an auto-captioning agent on the scheduling calendar',
            'PostgreSQL schema tracking fine-grained token usage, scheduled posts and engagement metrics per user',
        ],
        tech: ['Next.js', 'TypeScript', 'Gemini', 'PostgreSQL', 'better-auth', 'Framer Motion'],
    },
    {
        slug: 'traventions',
        title: 'TRAVENTIONS',
        reveal: 'GDS FLIGHT BOOKING ENGINE',
        desc: 'Flight booking and travel-management platform built on enterprise GDS inventory for travel consultants',
        org: 'Travel management',
        year: '2026',
        context: 'Client',
        category: ['Backend', 'Full-Stack'],
        highlights: [
            'Multi-city, round-trip and one-way flows over live GDS inventory, unifying net, NDC, corporate and commissionable fares in one view',
            'Interactive seat maps, a 15-day flexible-date price matrix, and PNR hold with real-time expiry tracking',
            'Zustand for booking state with TanStack Query for server cache, keeping complex multi-leg itineraries consistent',
        ],
        tech: ['Next.js', 'TypeScript', 'Amadeus GDS', 'Zustand', 'TanStack Query', 'Mapbox'],
    },
    {
        slug: 'ai-recruiter',
        title: 'AI RECRUITER',
        reveal: 'AUTOMATED HIRING PIPELINE',
        desc: 'Recruitment platform automating resume screening, interview assistance and candidate assessment',
        org: 'HR tech',
        year: '2026',
        context: 'Client',
        category: ['AI & ML', 'Full-Stack'],
        highlights: [
            'Resume screening scored against a parsed job description, with the shortlist surfaced to recruiters rather than auto-rejecting',
            'Live interview assistance and a structured final-assessment stage completing the funnel',
            'Browser extension front end over a Python service, so recruiters work inside the ATS they already use',
        ],
        tech: ['Python', 'FastAPI', 'NLP', 'React', 'Browser Extension'],
    },
    {
        slug: 'collision-centre',
        title: 'COLLISION CENTRE',
        reveal: '3D AUTOMOTIVE EXPERIENCE',
        desc: 'Brand site for a Canadian auto body shop, built around interactive 3D vehicle models',
        org: 'Auto body shop, Canada',
        year: '2026',
        context: 'Client',
        category: ['Full-Stack'],
        highlights: [
            'Real 3D car models rendered in-browser with Three.js, iterated until the geometry actually read as a vehicle at every viewport',
            'Full rebrand to a grey and orange identity system, then a second pass toward warmer, family-oriented messaging on client feedback',
            'Built and shipped on React 19 + Vite with continuous deploys',
        ],
        tech: ['React', 'Vite', 'Three.js', 'React Router', 'Vercel'],
    },
    {
        slug: 'echo',
        title: 'ECHO',
        reveal: 'VOICE DICTATION PRODUCT SITE',
        desc: 'Marketing and download site for a system-wide push-to-talk voice dictation desktop app',
        org: 'Desktop productivity product',
        year: '2026',
        context: 'Client',
        category: ['Full-Stack'],
        highlights: [
            'Positioned a bring-your-own-API-key product honestly — setup friction stated next to the download button rather than buried in an FAQ',
            'Versioned download flow with per-platform availability, including explicit "coming soon" states instead of dead links',
            'Static, dependency-light build so the download path stays fast on any connection',
        ],
        tech: ['HTML', 'CSS', 'JavaScript', 'Python'],
    },
    {
        slug: 'binks',
        title: 'BINKS',
        reveal: 'SMART WASTE MANAGEMENT',
        desc: 'AI + blockchain system for waste classification and token-based user incentives',
        org: 'Academic project',
        year: '2025',
        context: 'Academic',
        category: ['AI & ML', 'Web3'],
        highlights: [
            'Image classifier sorts deposited waste into recycling streams at the bin',
            'On-chain token rewards issued per verified deposit, making correct disposal directly worth something to the user',
            'Smart contracts on Solidity/Hardhat with a React dashboard over a MongoDB-backed service',
        ],
        tech: ['Python', 'React', 'Solidity', 'Hardhat', 'MongoDB'],
    },
    {
        slug: 'abhimanyu',
        title: 'ABHIMANYU',
        reveal: 'ELEPHANT WEIGHT ESTIMATION',
        desc: 'Computer vision system estimating elephant weight from photographs for wildlife conservation',
        org: 'Academic project',
        year: '2025',
        context: 'Academic',
        category: ['AI & ML'],
        highlights: [
            'CNN regression over field photographs, replacing physical weighbridges that most reserves simply do not have',
            'Preprocessing pipeline built for genuinely imperfect field data — varied distance, lighting and occlusion',
            'Supports dosage and health decisions for animals that cannot be safely weighed directly',
        ],
        tech: ['Python', 'PyTorch', 'CNNs', 'OpenCV', 'TensorFlow'],
    },
    {
        slug: 'personalized-medicine',
        title: 'PERSONALIZED MEDICINE',
        reveal: 'GENETIC MUTATION PREDICTION',
        desc: 'NLP deep-learning model predicting genetic mutation classes from clinical literature',
        org: 'Academic project',
        year: '2025',
        context: 'Academic',
        category: ['AI & ML'],
        highlights: [
            'Domain-adapted transformer (BioBERT) fine-tuned on clinical evidence text rather than a general-purpose language model',
            'Multi-class classification over mutation categories, evaluated on class-imbalanced real data',
            'Built as an end-to-end pipeline from raw clinical text through to a served prediction',
        ],
        tech: ['Python', 'BioBERT', 'Hugging Face', 'PyTorch', 'NLP'],
    },
    {
        slug: 'boltbox',
        title: 'BOLTBOX',
        reveal: 'AI DEV TOOLKIT',
        desc: 'Full-stack platform to bootstrap projects from templates with AI-suggested tech stacks',
        org: 'Personal project',
        year: '2025',
        context: 'Academic',
        category: ['Full-Stack'],
        highlights: [
            'Template catalogue that scaffolds a working project rather than a bare repo',
            'AI stack recommendations driven by the described product, not a fixed decision tree',
            'Next.js + TypeScript front to back with MongoDB persistence',
        ],
        tech: ['Next.js', 'TypeScript', 'Tailwind', 'MongoDB'],
    },
    {
        slug: 'feed-forward',
        title: 'FEED FORWARD',
        reveal: 'CRYPTO FOR FOOD REDISTRIBUTION',
        desc: 'Blockchain incentive system routing surplus food to people who need it',
        org: 'Hackathon winner',
        year: '2024',
        context: 'Academic',
        category: ['Web3'],
        highlights: [
            'Token incentives for restaurants and event venues that list surplus instead of discarding it',
            'On-chain settlement so the redistribution record is auditable by donors and NGOs',
            'Won Best Project at Quant-A-Maze',
        ],
        tech: ['Solidity', 'Hardhat', 'Web3.js', 'React'],
    },
    {
        slug: 'virtual-diary',
        title: 'VIRTUAL DIARY',
        reveal: 'SOCIAL MEMORY PLATFORM',
        desc: 'Collaborative web app for storing memories with friends, groups and shared media',
        org: 'Personal project',
        year: '2024',
        context: 'Academic',
        category: ['Full-Stack', 'Backend'],
        highlights: [
            'Group-scoped entries with shared media, so a memory belongs to everyone who was there',
            'REST API over Node and Express with MongoDB document storage',
            'Auth, permissions and media upload handled end to end',
        ],
        tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    },
    {
        slug: 'iot-integration',
        title: 'IOT INTEGRATION',
        reveal: '3D CIRCUIT SYSTEM',
        desc: 'ESP32 hardware system integrating multiple sensors with a real-time display',
        org: 'Academic project',
        year: '2024',
        context: 'Academic',
        category: ['Embedded'],
        highlights: [
            'Load cell, ultrasonic, IR and camera modules multiplexed on a single ESP32',
            'Real-time readout on an attached display with no host computer in the loop',
            'Embedded C firmware written against the hardware datasheets',
        ],
        tech: ['ESP32', 'Embedded C', 'Load Cell', 'Ultrasonic', 'IR', 'Camera'],
    },
];

export const projectCategories: (ProjectCategory | 'All')[] = [
    'All',
    'AI & ML',
    'Backend',
    'Full-Stack',
    'Web3',
    'Embedded',
];

/** Featured work first under "All"; declaration order is preserved otherwise. */
export const orderedProjects: Project[] = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
];

export const getProjectBySlug = (slug: string): Project | undefined =>
    projects.find((p) => p.slug === slug);

/** Neighbours in `orderedProjects`, for prev/next links on a detail page. */
export const getProjectNeighbours = (slug: string) => {
    const i = orderedProjects.findIndex((p) => p.slug === slug);
    if (i === -1) return { prev: undefined, next: undefined };
    return {
        prev: i > 0 ? orderedProjects[i - 1] : undefined,
        next: i < orderedProjects.length - 1 ? orderedProjects[i + 1] : undefined,
    };
};
