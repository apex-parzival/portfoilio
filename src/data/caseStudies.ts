/**
 * Long-form case studies for the project detail pages.
 *
 * Sourced from each project's own README / architecture docs. Metrics are only
 * included where a real measured number exists in those docs — no estimates.
 */

export type NodeKind =
    | 'input'    // what enters the system
    | 'process'  // deterministic work
    | 'ai'       // model / LLM in the loop
    | 'store'    // persistence
    | 'external' // third-party service
    | 'output';  // what the user gets

export interface FlowNode {
    label: string;
    sub?: string;
    kind: NodeKind;
}

export interface FlowColumn {
    /** Stage caption shown above the column. */
    title: string;
    nodes: FlowNode[];
}

export interface Diagram {
    title: string;
    caption?: string;
    columns: FlowColumn[];
}

export interface Metric {
    value: string;
    label: string;
}

export interface Decision {
    title: string;
    body: string;
}

export interface CaseStudy {
    /** The situation before the work existed. */
    problem: string;
    /** How it was solved, at a glance. */
    approach: string;
    diagram: Diagram;
    metrics?: Metric[];
    /** Engineering calls worth explaining — the interesting part. */
    decisions?: Decision[];
    outcome?: string;
}

export const caseStudies: Record<string, CaseStudy> = {
    'bom-error-reduction': {
        problem:
            'Every CNC machine order produces a Closed BOM — a customer-specific parts list derived from a full component hierarchy in Oracle ERP, a customer price list, and a set of configurator rules. Engineers translated natural-language specifications into that rule syntax by hand. A corrupted BOM stops the production line and wastes material, and nobody could tell a bad BOM from a good one until it reached the floor.',
        approach:
            'A deterministic BOM generator that reproduces the ERP output layer by layer, then diffs its own result against the real Oracle Closed BOM so every disagreement becomes a visible, explainable defect. Embeddings plus an LLM judge handle the fuzzy part — mapping free-text price-list options onto BOM items — while the parts that must be exact stay deterministic.',
        diagram: {
            title: 'Generation and verification pipeline',
            caption:
                'Layers 0–3 are deterministic and reproducible. Layer 4 is advisory only, opt-in per run, and never silently overrides the engine.',
            columns: [
                {
                    title: 'Sources',
                    nodes: [
                        { label: 'Open BOM', sub: 'Oracle ERP hierarchy', kind: 'input' },
                        { label: 'Price list', sub: 'Customer selections', kind: 'input' },
                        { label: 'CDL rules', sub: 'Configurator logic', kind: 'input' },
                    ],
                },
                {
                    title: 'Mapping',
                    nodes: [
                        { label: 'Bilingual embeddings', sub: '768-dim, cached', kind: 'ai' },
                        { label: 'LLM judge', sub: 'Option → BOM item', kind: 'ai' },
                    ],
                },
                {
                    title: 'Engine',
                    nodes: [
                        { label: 'L0 Variant expansion', kind: 'process' },
                        { label: 'L1 Backbone closure', kind: 'process' },
                        { label: 'L2 Price-list anchor', kind: 'process' },
                        { label: 'L3 Type pruning', kind: 'process' },
                    ],
                },
                {
                    title: 'Adjudication',
                    nodes: [
                        { label: 'L4 LLM review', sub: 'Advisory, opt-in', kind: 'ai' },
                        { label: 'Cross-machine evidence', kind: 'store' },
                    ],
                },
                {
                    title: 'Verify',
                    nodes: [
                        { label: 'Diff vs Oracle', sub: 'Truth machines', kind: 'process' },
                        { label: 'Conflict + drift checks', kind: 'process' },
                    ],
                },
                {
                    title: 'Output',
                    nodes: [
                        { label: 'Closed BOM', sub: 'With defect report', kind: 'output' },
                        { label: 'NL → CDL suggestions', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '0.850', label: 'F1 on the primary test machine' },
            { value: '96.7%', label: 'Recall against the Oracle BOM' },
            { value: '48/48', label: 'Price-list options mapped correctly' },
            { value: '~75k', label: 'BOM items across 7 machines' },
        ],
        decisions: [
            {
                title: 'The LLM never gets the last word',
                body: 'Layers 0–3 are fully deterministic, so the same inputs always produce the same BOM. Layer 4 adds LLM adjudication but is advisory and opt-in per run. A manufacturing BOM has to be reproducible and auditable — a model that quietly changed its mind between runs would be worse than the manual process it replaced.',
            },
            {
                title: 'Truth machines as a scoring harness',
                body: 'Two of the seven ingested machines have verified Oracle Closed BOMs. Those became the ground truth for F1 scoring and for gating the critique workflow, which turned "does this look right?" into a number that moves when the engine improves.',
            },
            {
                title: 'Remaining error traced to four named causes',
                body: 'The gap to 100% is documented as four specific issues rather than a vague accuracy figure — a broken compulsory-parent chain accounting for ~128 missing items, matrix-lookup rules with no executable syntax, undefined Level-3 filtering criteria, and downstream ancestry breakage. Each has a known impact, so the client can decide what is worth closing.',
            },
        ],
        outcome:
            'Rule errors surface during generation instead of on the production floor, and every discrepancy comes with the evidence for why the engine disagreed with Oracle.',
    },

    'supplier-scout': {
        problem:
            'Sourcing an industrial part meant an engineer typing specs into a search engine, opening dozens of supplier sites, reading each one to work out whether the part actually matched, then writing individual enquiry emails and filling in RFQ forms by hand. Hours of work per part, and the quality of the shortlist depended entirely on who did the searching.',
        approach:
            'A chain of nine specialised agents that takes one plain-English request and runs the whole funnel — clarify, extract specs, generate queries, search, classify each result, scrape it, extract structured product and seller data, then draft the outreach. A separate long-running deep-research track runs in parallel, with a verification agent filtering its findings before anything is persisted.',
        diagram: {
            title: 'Agent pipeline',
            caption:
                'The main pipeline returns in seconds and streams progress over SSE. Deep research runs alongside it for minutes and merges in when it completes.',
            columns: [
                {
                    title: 'Intake',
                    nodes: [
                        { label: 'Plain-English request', kind: 'input' },
                        { label: 'Clarification agent', sub: 'Asks only if needed', kind: 'ai' },
                    ],
                },
                {
                    title: 'Understand',
                    nodes: [
                        { label: 'Requirement agent', sub: 'Structured spec schema', kind: 'ai' },
                        { label: 'Query generator', sub: '5 search queries', kind: 'ai' },
                    ],
                },
                {
                    title: 'Search',
                    nodes: [
                        { label: 'Two search providers', sub: '10 concurrent calls', kind: 'external' },
                        { label: 'URL deduplication', kind: 'process' },
                        { label: 'Classifier agent', sub: 'Product / seller / form', kind: 'ai' },
                    ],
                },
                {
                    title: 'Harvest',
                    nodes: [
                        { label: 'Scrape, 3-tier fallback', sub: 'Concurrency-limited', kind: 'process' },
                        { label: 'Scraper agent', sub: 'Product + match score', kind: 'ai' },
                        { label: 'Persist to Postgres', kind: 'store' },
                    ],
                },
                {
                    title: 'Act',
                    nodes: [
                        { label: 'Email agent', sub: 'Drafts per seller', kind: 'ai' },
                        { label: 'Form agent', sub: 'Auto-fills RFQs', kind: 'ai' },
                    ],
                },
                {
                    title: 'Deliver',
                    nodes: [
                        { label: 'SSE progress stream', kind: 'output' },
                        { label: 'Ranked products + sellers', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '9', label: 'Specialised agents in the chain' },
            { value: '10', label: 'Concurrent search calls per run' },
            { value: '3-tier', label: 'Scraper fallback chain' },
        ],
        decisions: [
            {
                title: 'Clarify before spending money',
                body: 'The first agent decides whether the request is answerable as written. If it is ambiguous it returns multiple-choice questions instead of guessing — cheaper than running a full pipeline against the wrong interpretation, and the answers enrich the prompt for every downstream agent.',
            },
            {
                title: 'Deep research runs in parallel, not in series',
                body: 'The thorough research track takes minutes. Blocking on it would make the tool feel broken, so it is launched as a fire-and-forget task while the fast pipeline streams results immediately, then merges its verified findings in when ready.',
            },
            {
                title: 'A verification agent guards the slow path',
                body: 'Long-form research output is exactly where a model invents plausible suppliers. Everything it produces passes through a separate verification agent before it reaches the database, so hallucinated findings never become part of the shortlist.',
            },
        ],
        outcome:
            'One prompt produces a verified supplier shortlist with drafted enquiries and submitted RFQ forms, with live progress instead of a spinner.',
    },

    'attendance-system': {
        problem:
            'A government school pilot marking attendance on paper for 350 students across 10 classes. Registers are slow, easy to fudge, and produce no usable data. The system also had to handle children\'s biometric data under the DPDP Act, and be designed so scaling to the whole district is a configuration change rather than a rebuild.',
        approach:
            'A face-recognition capture flow with manual override always available, on a multi-tenant Postgres schema with row-level security so one school can never read another\'s rows. Recognition is confidence-tiered rather than binary, and consent is enforced at every capture, not just once at enrolment.',
        diagram: {
            title: 'Capture and matching flow',
            caption:
                'Manual override is reachable at every step — the model assists the teacher rather than replacing them.',
            columns: [
                {
                    title: 'Enrolment',
                    nodes: [
                        { label: 'Guardian consent', sub: 'Required first', kind: 'input' },
                        { label: 'Quality gate', sub: 'Rejects poor captures', kind: 'process' },
                        { label: 'Encrypted encoding', sub: 'Key-versioned', kind: 'store' },
                    ],
                },
                {
                    title: 'Capture',
                    nodes: [
                        { label: 'Teacher opens class', sub: 'PWA on any device', kind: 'input' },
                        { label: 'Frame captured', kind: 'input' },
                        { label: 'Passive liveness check', kind: 'process' },
                    ],
                },
                {
                    title: 'Match',
                    nodes: [
                        { label: 'Face embedding', sub: 'InsightFace', kind: 'ai' },
                        { label: 'Compare to class roster', kind: 'process' },
                        { label: 'Top-1 / top-2 margin', sub: 'Close call → downgrade', kind: 'process' },
                    ],
                },
                {
                    title: 'Decide',
                    nodes: [
                        { label: 'HIGH → auto-mark', kind: 'process' },
                        { label: 'MEDIUM / LOW → confirm', kind: 'process' },
                        { label: 'Consent re-checked', kind: 'process' },
                    ],
                },
                {
                    title: 'Record',
                    nodes: [
                        { label: 'Attendance row', sub: 'IST dates, RLS-scoped', kind: 'store' },
                        { label: 'Match telemetry', sub: 'Rejections logged too', kind: 'store' },
                    ],
                },
                {
                    title: 'Use',
                    nodes: [
                        { label: 'Manual correction', sub: 'Including past days', kind: 'output' },
                        { label: 'Excel reports', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '350', label: 'Students across 10 classes in the pilot' },
            { value: '2', label: 'Languages — English and Kannada' },
            { value: '9', label: 'Schema migrations incl. RLS policies' },
        ],
        decisions: [
            {
                title: 'A close second match downgrades instead of auto-accepting',
                body: 'Confidence tiers alone are not enough — a model can be confidently wrong when two children look alike. A top-1 / top-2 margin check means that when the runner-up is close, the match drops to manual confirmation rather than silently marking the wrong child present.',
            },
            {
                title: 'Failures are recorded, not discarded',
                body: 'Liveness rejections and no-confident-match captures are written to a telemetry table. Without that, the real false-negative and spoof-rejection rates would be guesswork; with it, the thresholds can be tuned from actual pilot data.',
            },
            {
                title: 'Consent checked at capture, not just enrolment',
                body: 'Guardian consent can be withdrawn. Checking it only at enrolment would mean a withdrawal had no effect until someone manually purged the record, so it is re-verified on every single capture.',
            },
            {
                title: 'Refresh tokens live in an httpOnly cookie',
                body: 'The refresh token is never readable from JavaScript, so an XSS bug cannot exfiltrate it from localStorage. Rotation is single-use with reuse detection — a replayed token revokes the entire session.',
            },
        ],
        outcome:
            'Attendance takes a fraction of the time, produces real data, and the privacy posture is defensible under the DPDP Act rather than hoped-for.',
    },

    'hl7-fhir-gateway': {
        problem:
            'Hospitals run legacy systems that speak HL7 v2 — a pipe-delimited text format from the 1980s. The national health-insurance platform they must submit to accepts only FHIR R4 JSON. Without a bridge, every eligibility check, prior authorisation and claim is a manual re-entry job.',
        approach:
            'A translation service that parses HL7 v2 segment by segment into a clean intermediate representation, then assembles a compliant FHIR R4 bundle from it. Splitting parse from build means the messy input format and the strict output profile evolve independently.',
        diagram: {
            title: 'Request path',
            caption:
                'Mock mode returns a realistic gateway response without credentials, so the whole path is testable end to end before certificates exist.',
            columns: [
                {
                    title: 'Inbound',
                    nodes: [
                        { label: 'HL7 v2 message', sub: 'MSH · PID · IN1 · DG1 · PR1', kind: 'input' },
                    ],
                },
                {
                    title: 'Middleware',
                    nodes: [
                        { label: 'Rate limiting', sub: 'Redis-backed', kind: 'process' },
                        { label: 'Correlation ID', kind: 'process' },
                        { label: 'Timing', kind: 'process' },
                        { label: 'Security headers + CORS', kind: 'process' },
                    ],
                },
                {
                    title: 'Parse',
                    nodes: [
                        { label: 'Segment parser', sub: 'Patient, coverage, codes', kind: 'process' },
                        { label: 'Normalised dict', kind: 'process' },
                    ],
                },
                {
                    title: 'Build',
                    nodes: [
                        { label: 'Eligibility bundle', kind: 'process' },
                        { label: 'Prior-auth bundle', kind: 'process' },
                        { label: 'Claim bundle', kind: 'process' },
                    ],
                },
                {
                    title: 'Submit',
                    nodes: [
                        { label: 'mTLS client cert', sub: 'Mock mode in dev', kind: 'external' },
                        { label: 'National gateway', kind: 'external' },
                    ],
                },
                {
                    title: 'Response',
                    nodes: [{ label: 'FHIR R4 JSON', kind: 'output' }],
                },
            ],
        },
        metrics: [
            { value: '3', label: 'Bundle types — eligibility, prior-auth, claim' },
            { value: '5', label: 'Middleware layers on every request' },
        ],
        decisions: [
            {
                title: 'Parser and builder are separate stages',
                body: 'HL7 parsing produces a plain normalised structure that knows nothing about FHIR. The bundle builder consumes that structure and knows nothing about pipes and carets. Either side can change — a new HL7 quirk, a new FHIR profile — without touching the other.',
            },
            {
                title: 'Mock mode is a first-class path',
                body: 'Real submission needs mTLS client certificates that do not exist in development. A feature-flagged mock response means the full request path can be exercised in CI and locally, so the only untested step in production is the TLS handshake itself.',
            },
            {
                title: 'Correlation IDs from the edge',
                body: 'Every request is stamped with a UUID at the outermost middleware layer, so a failed claim can be traced across parsing, bundle assembly and the gateway call from a single identifier.',
            },
        ],
    },

    weconnect: {
        problem:
            'Corporate e-waste disposal in India is a compliance obligation with a paper trail — Form 6, weight slips, recycling and disposal certificates — usually handled over email and spreadsheets. Price discovery is opaque, and proving to a regulator that waste was actually recycled means chasing documents months later.',
        approach:
            'A reverse-auction marketplace that digitises the full lifecycle: corporates list requirements, recyclers audit the site and bid, price is discovered through a sealed round followed by a live open auction, and the compliance documents are collected as part of pickup rather than chased afterwards.',
        diagram: {
            title: 'Lifecycle from listing to certificate',
            caption:
                'Each stage gates the next. The compliance pack is a precondition for completion, not an afterthought.',
            columns: [
                {
                    title: 'List',
                    nodes: [
                        { label: 'Corporate uploads requirement', kind: 'input' },
                        { label: 'Admin approves listing', kind: 'process' },
                    ],
                },
                {
                    title: 'Audit',
                    nodes: [
                        { label: 'Vendor invitation window', kind: 'process' },
                        { label: 'Site audit', sub: 'Accept · SPOC · report', kind: 'process' },
                    ],
                },
                {
                    title: 'Sealed bid',
                    nodes: [
                        { label: 'Blind bids submitted', kind: 'input' },
                        { label: 'Client reviews ranked table', kind: 'process' },
                        { label: 'Shortlist', kind: 'process' },
                    ],
                },
                {
                    title: 'Live auction',
                    nodes: [
                        { label: 'Base + target price', kind: 'process' },
                        { label: 'Real-time rank visibility', kind: 'process' },
                        { label: 'Auto-extension', sub: 'Late bids extend the clock', kind: 'process' },
                    ],
                },
                {
                    title: 'Settle',
                    nodes: [
                        { label: 'Final quote + letterhead', kind: 'input' },
                        { label: 'Split payment', sub: '95% client · 5% platform', kind: 'process' },
                        { label: 'UTR confirmation', kind: 'store' },
                    ],
                },
                {
                    title: 'Comply',
                    nodes: [
                        { label: 'Pickup scheduled', kind: 'process' },
                        { label: 'Form 6 + weight slips', kind: 'output' },
                        { label: 'Recycling + disposal certs', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '4', label: 'Role-scoped dashboards' },
            { value: '3', label: 'Auction stages before award' },
            { value: '5%', label: 'Platform fee, split automatically' },
        ],
        decisions: [
            {
                title: 'Sealed round before the open one',
                body: 'Going straight to a live auction anchors everyone to the first visible number. A blind sealed round establishes genuine reserve prices first, and only the shortlisted vendors move into open bidding.',
            },
            {
                title: 'Auto-extension kills last-second sniping',
                body: 'A bid inside the final window pushes the close time out. Without it the auction rewards network latency rather than price, and the corporate leaves money on the table.',
            },
            {
                title: 'Concurrent bids had to settle deterministically',
                body: 'Two vendors bidding in the same instant could interleave and produce an inconsistent rank order. Resolving that race was the difference between a demo and something that can run a real auction under load.',
            },
        ],
    },

    'prior-auth-automation': {
        problem:
            'A clinic receives referral PDFs — dozens of pages, mixed content, inconsistent layouts — and staff read each one to pull out patient details, diagnosis codes and procedure type, then look up the matching billing code by hand. It is slow, and a transcription slip means a rejected claim.',
        approach:
            'A desktop application that uploads the PDF, runs page-level extraction through a managed LLM, and gates the result on a keyword filter so pages that are not referral forms are discarded before extraction cost is spent. Extracted codes are joined against a master billing inventory, and every row lands in an editable table for review before anything is submitted.',
        diagram: {
            title: 'Document to billing code',
            caption:
                'Nothing is auto-submitted. The output is a reviewable table, because a wrong code is a rejected claim.',
            columns: [
                {
                    title: 'Intake',
                    nodes: [
                        { label: 'Referral PDF', kind: 'input' },
                        { label: 'Upload to object storage', kind: 'store' },
                    ],
                },
                {
                    title: 'Filter',
                    nodes: [
                        { label: 'Page-level scan', kind: 'process' },
                        { label: 'Keyword gate', sub: '≥3 of 8 expected fields', kind: 'process' },
                    ],
                },
                {
                    title: 'Extract',
                    nodes: [
                        { label: 'Managed LLM', sub: 'Bedrock', kind: 'ai' },
                        { label: 'Patient · DOB · insurer', kind: 'process' },
                        { label: 'Procedure · DX codes', kind: 'process' },
                    ],
                },
                {
                    title: 'Match',
                    nodes: [
                        { label: 'Join master inventory', sub: 'DX + procedure → CPT', kind: 'process' },
                        { label: 'Full / partial / none', kind: 'process' },
                    ],
                },
                {
                    title: 'Review',
                    nodes: [
                        { label: 'Editable table', sub: 'Every field correctable', kind: 'output' },
                        { label: 'Save corrections', kind: 'store' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '8', label: 'Clinical fields extracted per page' },
            { value: '3', label: 'Match tiers surfaced to the reviewer' },
        ],
        decisions: [
            {
                title: 'A cheap keyword gate in front of the expensive model',
                body: 'Referral PDFs contain plenty of pages that are not referral forms. Requiring at least three of eight expected field labels before a page reaches extraction cuts both cost and the false-positive rate, using a filter that costs nothing to run.',
            },
            {
                title: 'Partial matches are shown, not hidden',
                body: 'Where only the diagnosis or only the procedure matched, the row is marked partial rather than dropped or silently guessed. The reviewer sees exactly how much the system was sure about.',
            },
            {
                title: 'Electron so it behaves like clinic software',
                body: 'Staff work in a desktop environment, not a browser tab. Wrapping the React UI in Electron over a local Python service made it installable and familiar, with no server for the clinic to run.',
            },
        ],
    },

    'property-hub': {
        problem:
            'Listing a property included a "find nearby places" step that queried schools, hospitals and other amenities around the location. It ran the lookups one after another and took around 90 seconds — long enough that people assumed it had hung and left the page.',
        approach:
            'Fan the lookups out across concurrent workers instead of awaiting them in sequence, so total time approaches the slowest single category rather than the sum of all of them. The work came with a full cost model built from published third-party pricing, so the concurrency increase was a known spend rather than a surprise bill.',
        diagram: {
            title: 'Nearby-amenity lookup, before and after',
            caption:
                'Same API calls, same results — the change is that they stopped waiting in line for each other.',
            columns: [
                {
                    title: 'Trigger',
                    nodes: [
                        { label: 'Property location', kind: 'input' },
                        { label: 'Amenity categories', kind: 'input' },
                    ],
                },
                {
                    title: 'Before',
                    nodes: [
                        { label: 'Category 1', sub: 'await', kind: 'process' },
                        { label: 'Category 2', sub: 'await', kind: 'process' },
                        { label: 'Category N', sub: 'await', kind: 'process' },
                    ],
                },
                {
                    title: 'After',
                    nodes: [
                        { label: 'Worker per category', sub: 'Dispatched together', kind: 'process' },
                        { label: 'Results gathered', kind: 'process' },
                    ],
                },
                {
                    title: 'Present',
                    nodes: [
                        { label: 'Map clustering', kind: 'output' },
                        { label: 'Amenities on listing', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '~90s', label: 'Original sequential lookup' },
            { value: 'Parallel', label: 'One worker per category' },
        ],
        decisions: [
            {
                title: 'Cost modelled from real published pricing',
                body: 'Firing many requests concurrently changes the bill, not just the latency. Every dependency — maps, SMS, backend platform, hosting — was costed against the providers\' actual published rates rather than estimated, so the trade was made with real numbers.',
            },
            {
                title: 'Latency was a product problem, not a backend one',
                body: 'The lookup was not slow because any single call was slow. It was slow because they were serialised for no reason — the classic case where the fix is dispatch strategy rather than optimisation.',
            },
        ],
    },

    'fleet-console': {
        problem:
            'A smart-glasses platform needed to show what its future operations console would do — device fleet monitoring, telemetry, captured-media management, alerting — before the production cloud infrastructure existed to power any of it.',
        approach:
            'A deliberately frontend-only proof of concept driven entirely by a local mock dataset, previewing the screens the production platform will eventually serve. The one piece of real infrastructure is a single serverless route that keeps the AI diagnostic model key off the client, with a deterministic fallback so the demo runs with no keys at all.',
        diagram: {
            title: 'Console surfaces',
            caption:
                'Everything left of the dashed boundary is mock data today, and maps onto managed cloud services in the production phase.',
            columns: [
                {
                    title: 'Access',
                    nodes: [
                        { label: 'Mock role login', sub: 'Admin or read-only', kind: 'input' },
                    ],
                },
                {
                    title: 'Fleet',
                    nodes: [
                        { label: 'Card or table view', kind: 'output' },
                        { label: 'Status · battery · storage', kind: 'process' },
                        { label: 'Filters', sub: 'Site, connection, battery', kind: 'process' },
                    ],
                },
                {
                    title: 'Device',
                    nodes: [
                        { label: 'Telemetry drawer', kind: 'output' },
                        { label: '12-reading battery history', kind: 'process' },
                        { label: 'OTA firmware push', kind: 'process' },
                    ],
                },
                {
                    title: 'Intelligence',
                    nodes: [
                        { label: 'Serverless AI route', sub: 'Key stays server-side', kind: 'ai' },
                        { label: 'Canned fallback', sub: 'Works with no key', kind: 'process' },
                    ],
                },
                {
                    title: 'Operate',
                    nodes: [
                        { label: 'Media repository', sub: 'Tagged for ML training', kind: 'store' },
                        { label: 'Derived alert feed', sub: 'Low battery · offline · temp', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '5', label: 'Console surfaces built' },
            { value: '0', label: 'Keys needed to run the demo' },
        ],
        decisions: [
            {
                title: 'Honest about being a POC',
                body: 'The scope is stated plainly in the repo: mock dataset, no backend, no cloud wiring. Dressing a proof of concept up as a working system is how a client ends up surprised in phase two.',
            },
            {
                title: 'The model key never reaches the browser',
                body: 'Even in a throwaway POC, the AI diagnostic call goes through a serverless function rather than straight from the client. Shipping a key in frontend code is a habit worth not forming.',
            },
            {
                title: 'Deterministic fallback keeps the demo alive',
                body: 'With no key configured the diagnostic returns a pre-canned analysis instead of an error. A demo that fails on stage because of a missing environment variable is a demo that did not need to fail.',
            },
        ],
    },

    'rail-intelligence': {
        problem:
            'Rail operations run on unplanned failures, manual dispatch decisions and very little visibility into asset health. Maintenance is reactive, yard occupancy is guesswork, and customers hear about delays late.',
        approach:
            'An operations command centre proving out the core AI capabilities against a digital-twin target — predictive wagon failure, computer-vision track defect detection, yard occupancy monitoring, dynamic routing and weather impact forecasting — built in a monorepo so the console and future apps share one component system.',
        diagram: {
            title: 'Operational intelligence loop',
            caption:
                'Designed against a production target of 40,000+ rail carts and 20,000+ concurrent active assets.',
            columns: [
                {
                    title: 'Signals',
                    nodes: [
                        { label: 'Wagon telemetry', kind: 'input' },
                        { label: 'Track imagery', kind: 'input' },
                        { label: 'Yard sensors', kind: 'input' },
                        { label: 'Weather feeds', kind: 'external' },
                    ],
                },
                {
                    title: 'Models',
                    nodes: [
                        { label: 'Failure prediction', kind: 'ai' },
                        { label: 'Defect detection', sub: 'Computer vision', kind: 'ai' },
                        { label: 'Occupancy monitoring', kind: 'ai' },
                    ],
                },
                {
                    title: 'Decisions',
                    nodes: [
                        { label: 'Dynamic route optimisation', kind: 'process' },
                        { label: 'Weather impact forecast', kind: 'process' },
                    ],
                },
                {
                    title: 'Command centre',
                    nodes: [
                        { label: 'Operations dashboard', kind: 'output' },
                        { label: 'Predictive alerts', kind: 'output' },
                        { label: 'Asset visibility', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '40k+', label: 'Rail carts in the production target' },
            { value: '6', label: 'Core AI capabilities validated' },
        ],
        decisions: [
            {
                title: 'A monorepo with a shared UI package',
                body: 'The console is the first of several planned surfaces. Putting shared components in their own package from the start means the next app inherits the design system instead of re-implementing it slightly differently.',
            },
            {
                title: 'Proof of concept scoped to feasibility',
                body: 'The POC validates that the core capabilities are technically achievable and worth building, explicitly ahead of the digital-twin production vision rather than pretending to be it.',
            },
        ],
    },

    mediaforge: {
        problem:
            'Small marketing teams juggle a text generator, a separate image tool, a design editor and a scheduling app, moving assets between them by hand. Nothing shares context, and nobody can see what a campaign cost in tokens or what it earned in engagement.',
        approach:
            'One studio covering generation, editing and scheduling. Text, image and video generation share a single model selector; generated assets flow straight into an editable canvas; finished posts go onto a scheduling calendar with AI-written captions. Usage and engagement are tracked per user in the same schema.',
        diagram: {
            title: 'Create to publish',
            caption:
                'Video generation is long-running, so it polls asynchronously rather than holding a request open.',
            columns: [
                {
                    title: 'Brief',
                    nodes: [
                        { label: 'Prompt + tone + format', kind: 'input' },
                        { label: 'Target platforms', kind: 'input' },
                    ],
                },
                {
                    title: 'Generate',
                    nodes: [
                        { label: 'Text models', kind: 'ai' },
                        { label: 'Image models', kind: 'ai' },
                        { label: 'Video, async polling', sub: 'Minutes, not seconds', kind: 'ai' },
                    ],
                },
                {
                    title: 'Refine',
                    nodes: [
                        { label: 'Iterative editor', sub: 'Stacked refinement prompts', kind: 'ai' },
                        { label: 'Canvas templates', sub: 'Fully editable', kind: 'process' },
                    ],
                },
                {
                    title: 'Schedule',
                    nodes: [
                        { label: 'Auto-captioning agent', kind: 'ai' },
                        { label: 'Calendar', sub: 'Multi-platform, time-zoned', kind: 'process' },
                    ],
                },
                {
                    title: 'Measure',
                    nodes: [
                        { label: 'Token accounting', kind: 'store' },
                        { label: 'Reach + engagement', kind: 'output' },
                    ],
                },
            ],
        },
        metrics: [
            { value: '3', label: 'Generation modes — text, image, video' },
            { value: '6', label: 'Editable canvas ad templates' },
        ],
        decisions: [
            {
                title: 'Async polling for video',
                body: 'Video generation runs for minutes. Holding an HTTP request open for that long is fragile on every layer between the browser and the model, so jobs are submitted and polled instead.',
            },
            {
                title: 'Editing is conversational',
                body: 'The first generation is rarely the final asset. Letting users stack refinement prompts on prior media matches how the work actually goes, instead of forcing a fresh prompt each time.',
            },
            {
                title: 'Guarding against lost canvas work',
                body: 'Navigating away mid-edit used to silently discard changes. Global routing interceptors prompt before that happens — unglamorous, and the difference between a tool people trust and one they do not.',
            },
        ],
    },

    traventions: {
        problem:
            'Travel consultants work against enterprise GDS inventory where the same flight carries several different fare types — net, NDC, corporate, commissionable — each with different margin. Most booking tools show one of them, so the consultant re-searches to find the profitable option.',
        approach:
            'A booking engine that unifies all fare types in a single view and adds the tools that decide a booking: a flexible-date price matrix, interactive seat maps, and PNR hold with live expiry tracking. Booking state lives in a client store; server data is cached separately so a complex multi-leg itinerary stays consistent while the user explores.',
        diagram: {
            title: 'Search to ticket',
            columns: [
                {
                    title: 'Search',
                    nodes: [
                        { label: 'One-way · return · multi-city', kind: 'input' },
                        { label: 'Intelligent input chaining', kind: 'process' },
                    ],
                },
                {
                    title: 'Inventory',
                    nodes: [
                        { label: 'Enterprise GDS', sub: '400+ airlines', kind: 'external' },
                        { label: 'Unified fare types', sub: 'Net · NDC · corporate', kind: 'process' },
                    ],
                },
                {
                    title: 'Decide',
                    nodes: [
                        { label: '15-day price matrix', kind: 'output' },
                        { label: 'Seat map', kind: 'output' },
                        { label: 'Baggage + meals', kind: 'process' },
                    ],
                },
                {
                    title: 'Hold',
                    nodes: [
                        { label: 'PNR reservation', kind: 'process' },
                        { label: 'Expiry countdown', sub: 'Real-time', kind: 'output' },
                    ],
                },
                {
                    title: 'Confirm',
                    nodes: [{ label: 'Booking confirmation', kind: 'output' }],
                },
            ],
        },
        metrics: [
            { value: '400+', label: 'Airlines via GDS inventory' },
            { value: '4', label: 'Fare types in one view' },
            { value: '15-day', label: 'Flexible-date price matrix' },
        ],
        decisions: [
            {
                title: 'Booking state and server cache kept separate',
                body: 'A multi-city itinerary is a long-lived client-side draft; fare availability is server truth that goes stale. Conflating them causes a half-built itinerary to be wiped by a background refetch, so they are held in separate layers.',
            },
            {
                title: 'Fare type is a first-class column',
                body: 'Surfacing net, NDC, corporate and commissionable fares side by side turns margin from something the consultant has to hunt for into something they can see.',
            },
        ],
    },

    'ai-recruiter': {
        problem:
            'Screening a large applicant pool means reading CVs against a job description and forming a shortlist — repetitive, slow, and inconsistent between reviewers and between Mondays and Fridays.',
        approach:
            'An assistant that scores resumes against the parsed job description and surfaces a ranked shortlist to the recruiter, then carries through to live interview assistance and a structured final assessment. It runs as a browser extension over the recruiter\'s existing applicant tracking system rather than asking them to move.',
        diagram: {
            title: 'Hiring funnel',
            caption:
                'The system ranks and recommends; a human still decides who progresses.',
            columns: [
                {
                    title: 'Inputs',
                    nodes: [
                        { label: 'Job description', kind: 'input' },
                        { label: 'Applicant resumes', kind: 'input' },
                    ],
                },
                {
                    title: 'Screen',
                    nodes: [
                        { label: 'Requirement parsing', kind: 'ai' },
                        { label: 'Resume scoring', kind: 'ai' },
                        { label: 'Ranked shortlist', kind: 'output' },
                    ],
                },
                {
                    title: 'Interview',
                    nodes: [
                        { label: 'Live interview assistance', kind: 'ai' },
                        { label: 'Structured notes', kind: 'store' },
                    ],
                },
                {
                    title: 'Assess',
                    nodes: [
                        { label: 'Final assessment stage', kind: 'process' },
                        { label: 'Recruiter decision', kind: 'output' },
                    ],
                },
            ],
        },
        decisions: [
            {
                title: 'Shortlist, never auto-reject',
                body: 'The system ranks and recommends; it does not remove candidates. Automated rejection in hiring bakes in whatever bias the scoring carries, with nobody looking.',
            },
            {
                title: 'Meet recruiters where they work',
                body: 'Delivering it as a browser extension over the existing ATS avoided asking a team to adopt a second system, which is usually where internal tools quietly die.',
            },
        ],
    },

    'collision-centre': {
        problem:
            'An auto body shop competing on trust. Generic template sites make every shop look the same, and the client wanted something that felt like a real workshop — then, after seeing the first pass, something warmer and more family-oriented.',
        approach:
            'A brand site built around interactive 3D vehicle models rendered in the browser, on a grey-and-orange identity system, iterated directly against client feedback until both the geometry and the tone landed.',
        diagram: {
            title: 'Build and iteration loop',
            caption:
                'Three review rounds, each one changing something real rather than polishing the same thing.',
            columns: [
                {
                    title: 'Foundation',
                    nodes: [
                        { label: 'React + Vite', kind: 'process' },
                        { label: 'Brand identity', sub: 'Grey and orange', kind: 'process' },
                    ],
                },
                {
                    title: '3D',
                    nodes: [
                        { label: 'In-browser vehicle models', kind: 'process' },
                        { label: 'Geometry iterations', sub: 'Until it read as a car', kind: 'process' },
                    ],
                },
                {
                    title: 'Content',
                    nodes: [
                        { label: 'Services + hours + contact', kind: 'input' },
                        { label: 'Landscape imagery pass', kind: 'process' },
                    ],
                },
                {
                    title: 'Tone',
                    nodes: [
                        { label: 'Family-oriented rework', sub: 'On client feedback', kind: 'process' },
                        { label: 'Layout rebalance', kind: 'process' },
                    ],
                },
                {
                    title: 'Ship',
                    nodes: [{ label: 'Continuous deploys', kind: 'output' }],
                },
            ],
        },
        decisions: [
            {
                title: 'Kept reworking the 3D until it actually read as a car',
                body: 'The first attempts were recognisably wrong, and the client said so bluntly. Rather than defend the abstraction, the models were replaced until the shape read correctly at every viewport — the detail a car owner notices immediately.',
            },
            {
                title: 'A tone pivot is a content problem, not a restyle',
                body: 'Moving from industrial to family-oriented meant changing imagery, copy and layout balance together. Swapping a colour palette would not have changed how the site felt.',
            },
        ],
    },

    echo: {
        problem:
            'A voice dictation tool with genuine setup friction: it is free, but it needs the user to bring their own transcription API key. Hiding that until after download wastes the visit and burns trust at exactly the wrong moment.',
        approach:
            'A marketing and download site that states the bring-your-own-key requirement next to the download button rather than in an FAQ, shows honest per-platform availability, and keeps the build dependency-light so the download path is fast on any connection.',
        diagram: {
            title: 'Visitor path',
            caption:
                'The requirement is disclosed before the download, not after it.',
            columns: [
                {
                    title: 'Arrive',
                    nodes: [
                        { label: 'Positioning', sub: 'Hold a key, speak, get text', kind: 'input' },
                    ],
                },
                {
                    title: 'Understand',
                    nodes: [
                        { label: 'Feature grid', kind: 'output' },
                        { label: 'Setup cost stated upfront', sub: 'Needs your own API key', kind: 'output' },
                    ],
                },
                {
                    title: 'Check',
                    nodes: [
                        { label: 'Windows — available', kind: 'process' },
                        { label: 'Mac / Linux — coming soon', sub: 'Not a dead link', kind: 'process' },
                    ],
                },
                {
                    title: 'Download',
                    nodes: [{ label: 'Versioned build', kind: 'output' }],
                },
            ],
        },
        decisions: [
            {
                title: 'Friction disclosed before the click',
                body: 'A professional evaluating a tool wants to know the setup cost before downloading, not after. Putting it next to the button loses some downloads and keeps the ones that matter.',
            },
            {
                title: '"Coming soon" instead of a broken link',
                body: 'The code supports Mac and Linux but no build existed. Showing those as unavailable rather than linking to nothing is the difference between anticipation and a bug report.',
            },
        ],
    },

    binks: {
        problem:
            'Recycling depends on waste being sorted correctly at the moment of disposal, which is exactly when people have the least incentive to care. Bins collect whatever is dropped in them, and contamination makes whole batches unrecyclable.',
        approach:
            'A bin that classifies what is deposited and pays the depositor for getting it right. An image classifier sorts waste into recycling streams at the point of disposal, and verified deposits mint token rewards on-chain, turning correct disposal into something immediately worth doing.',
        diagram: {
            title: 'Deposit to reward',
            columns: [
                {
                    title: 'Deposit',
                    nodes: [
                        { label: 'Item placed in bin', kind: 'input' },
                        { label: 'Image captured', kind: 'input' },
                    ],
                },
                {
                    title: 'Classify',
                    nodes: [
                        { label: 'Waste classifier', kind: 'ai' },
                        { label: 'Recycling stream assigned', kind: 'process' },
                    ],
                },
                {
                    title: 'Verify',
                    nodes: [
                        { label: 'Deposit validated', kind: 'process' },
                        { label: 'Record written', kind: 'store' },
                    ],
                },
                {
                    title: 'Reward',
                    nodes: [
                        { label: 'Smart contract', sub: 'Solidity', kind: 'process' },
                        { label: 'Tokens to depositor', kind: 'output' },
                    ],
                },
            ],
        },
        decisions: [
            {
                title: 'Incentive at the point of decision',
                body: 'Awareness campaigns act long before the moment that matters. Paying at the bin puts the reward exactly where the choice is made.',
            },
            {
                title: 'On-chain so the ledger is not ours to edit',
                body: 'Token rewards settle on-chain, which makes the incentive credible to a participant who has no reason to trust the operator\'s database.',
            },
        ],
    },

    abhimanyu: {
        problem:
            'Elephant health and drug dosage decisions depend on body weight, and most reserves have no weighbridge capable of taking an elephant. Weight is estimated by eye, which is exactly as reliable as it sounds.',
        approach:
            'A convolutional model that regresses body weight directly from field photographs, trained against a preprocessing pipeline built for genuinely imperfect imagery — varying distance, lighting and partial occlusion — because that is what field data looks like.',
        diagram: {
            title: 'Photograph to weight estimate',
            columns: [
                {
                    title: 'Capture',
                    nodes: [
                        { label: 'Field photograph', sub: 'Uncontrolled conditions', kind: 'input' },
                    ],
                },
                {
                    title: 'Prepare',
                    nodes: [
                        { label: 'Subject isolation', kind: 'process' },
                        { label: 'Distance + lighting normalisation', kind: 'process' },
                    ],
                },
                {
                    title: 'Model',
                    nodes: [
                        { label: 'CNN regression', kind: 'ai' },
                        { label: 'Weight prediction', kind: 'ai' },
                    ],
                },
                {
                    title: 'Apply',
                    nodes: [
                        { label: 'Dosage + health decisions', kind: 'output' },
                    ],
                },
            ],
        },
        decisions: [
            {
                title: 'Built for field data, not benchmark data',
                body: 'Clean, evenly lit, centred images are not what a ranger produces. Most of the effort went into the preprocessing pipeline, because a model that only works on tidy inputs would never be used.',
            },
            {
                title: 'Regression, not classification',
                body: 'Weight bands would have been easier to train and useless in practice — dosage needs a number, so the model predicts one.',
            },
        ],
    },

    'personalized-medicine': {
        problem:
            'Classifying a genetic mutation means reading the clinical literature describing it and deciding which category the evidence supports. It is expert work, it does not scale, and the evidence text is dense domain language that general-purpose language models handle badly.',
        approach:
            'A domain-adapted transformer fine-tuned on clinical evidence text rather than a general model, doing multi-class classification over mutation categories, evaluated honestly against the class imbalance that real clinical data carries.',
        diagram: {
            title: 'Clinical text to mutation class',
            columns: [
                {
                    title: 'Input',
                    nodes: [
                        { label: 'Clinical evidence text', kind: 'input' },
                        { label: 'Gene + variant', kind: 'input' },
                    ],
                },
                {
                    title: 'Represent',
                    nodes: [
                        { label: 'Domain tokenizer', kind: 'process' },
                        { label: 'BioBERT encoder', sub: 'Biomedical pretraining', kind: 'ai' },
                    ],
                },
                {
                    title: 'Classify',
                    nodes: [
                        { label: 'Multi-class head', kind: 'ai' },
                        { label: 'Imbalance-aware evaluation', kind: 'process' },
                    ],
                },
                {
                    title: 'Output',
                    nodes: [{ label: 'Predicted mutation class', kind: 'output' }],
                },
            ],
        },
        decisions: [
            {
                title: 'Domain pretraining beat model size',
                body: 'Clinical evidence text uses vocabulary and sentence structure that general language models tokenize poorly. Starting from a biomedically pretrained encoder mattered more than reaching for something larger.',
            },
            {
                title: 'Accuracy alone would have been misleading',
                body: 'The mutation classes are heavily imbalanced, so a model can look strong while failing every rare class. Evaluation was built around that from the start.',
            },
        ],
    },

    boltbox: {
        problem:
            'Starting a project means the same afternoon of decisions and boilerplate every time — pick a stack, wire auth, set up the database, configure the build — before writing a line of the thing you actually wanted to build.',
        approach:
            'A platform that scaffolds a working project rather than an empty repository, with stack recommendations derived from a description of the product instead of a fixed decision tree.',
        diagram: {
            title: 'Idea to running project',
            columns: [
                {
                    title: 'Describe',
                    nodes: [{ label: 'What you are building', kind: 'input' }],
                },
                {
                    title: 'Recommend',
                    nodes: [
                        { label: 'Stack suggestions', kind: 'ai' },
                        { label: 'Template match', kind: 'process' },
                    ],
                },
                {
                    title: 'Scaffold',
                    nodes: [
                        { label: 'Project generated', sub: 'Wired, not empty', kind: 'process' },
                        { label: 'Config + dependencies', kind: 'process' },
                    ],
                },
                {
                    title: 'Start',
                    nodes: [{ label: 'Running project', kind: 'output' }],
                },
            ],
        },
        decisions: [
            {
                title: 'Scaffold something that runs',
                body: 'A generator that produces a directory tree still leaves the boring work undone. The output is a project that starts, which is the only version that saves the afternoon.',
            },
        ],
    },

    'feed-forward': {
        problem:
            'Restaurants and event venues throw away edible surplus daily while redistribution charities cannot see what is available until it is already waste. The information gap, not the food supply, is the binding constraint.',
        approach:
            'A blockchain-based incentive layer where venues are rewarded for listing surplus instead of discarding it, with redistribution settled on-chain so donors and NGOs can audit where the food actually went.',
        diagram: {
            title: 'Surplus to plate',
            columns: [
                {
                    title: 'List',
                    nodes: [
                        { label: 'Venue posts surplus', kind: 'input' },
                        { label: 'Quantity + window', kind: 'input' },
                    ],
                },
                {
                    title: 'Match',
                    nodes: [
                        { label: 'Nearby recipients notified', kind: 'process' },
                        { label: 'Claim accepted', kind: 'process' },
                    ],
                },
                {
                    title: 'Settle',
                    nodes: [
                        { label: 'Smart contract', kind: 'process' },
                        { label: 'Token incentive released', kind: 'output' },
                    ],
                },
                {
                    title: 'Audit',
                    nodes: [{ label: 'On-chain redistribution record', kind: 'output' }],
                },
            ],
        },
        metrics: [{ value: 'Winner', label: 'Best Project, Quant-A-Maze' }],
        decisions: [
            {
                title: 'Reward listing, not just donating',
                body: 'The moment that decides whether surplus is wasted is when someone chooses whether to list it. Putting the incentive there targets the actual bottleneck.',
            },
        ],
    },

    'virtual-diary': {
        problem:
            'A shared memory belongs to everyone who was there, but photo libraries are single-owner by default. The person who took the photo has it; the other five people in it do not.',
        approach:
            'Group-scoped entries with shared media, so a memory is attached to the group rather than to whoever uploaded it, on a REST API with auth, permissions and media upload handled end to end.',
        diagram: {
            title: 'Shared memory model',
            columns: [
                {
                    title: 'Identity',
                    nodes: [
                        { label: 'Account + auth', kind: 'input' },
                        { label: 'Friends + groups', kind: 'process' },
                    ],
                },
                {
                    title: 'Create',
                    nodes: [
                        { label: 'Entry with media', kind: 'input' },
                        { label: 'Scoped to a group', kind: 'process' },
                    ],
                },
                {
                    title: 'Store',
                    nodes: [
                        { label: 'Document store', kind: 'store' },
                        { label: 'Media upload', kind: 'store' },
                    ],
                },
                {
                    title: 'Revisit',
                    nodes: [{ label: 'Shared timeline', kind: 'output' }],
                },
            ],
        },
        decisions: [
            {
                title: 'The group owns the memory',
                body: 'Modelling entries as group-scoped rather than user-scoped with sharing bolted on kept permissions simple and matched how people actually think about a shared experience.',
            },
        ],
    },

    'iot-integration': {
        problem:
            'Building a multi-sensor measurement rig usually means a microcontroller tethered to a laptop running the logic. That is fine on a bench and useless as a standalone device.',
        approach:
            'A single ESP32 driving a load cell, ultrasonic, infrared and camera modules together, with the readout on an attached display — firmware written against the hardware datasheets so nothing depends on a host computer.',
        diagram: {
            title: 'Sensor integration',
            columns: [
                {
                    title: 'Sensors',
                    nodes: [
                        { label: 'Load cell', sub: 'Weight', kind: 'input' },
                        { label: 'Ultrasonic', sub: 'Distance', kind: 'input' },
                        { label: 'Infrared', sub: 'Presence', kind: 'input' },
                        { label: 'Camera', kind: 'input' },
                    ],
                },
                {
                    title: 'Controller',
                    nodes: [
                        { label: 'ESP32', kind: 'process' },
                        { label: 'Multiplexed reads', kind: 'process' },
                        { label: 'Embedded C firmware', kind: 'process' },
                    ],
                },
                {
                    title: 'Output',
                    nodes: [
                        { label: 'Real-time display', sub: 'No host computer', kind: 'output' },
                    ],
                },
            ],
        },
        decisions: [
            {
                title: 'Standalone by design',
                body: 'Keeping all logic on the microcontroller, with no laptop in the loop, is what separates a demo rig from something that could be deployed.',
            },
        ],
    },
};

export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies[slug];
