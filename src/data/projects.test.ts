import { describe, expect, it } from 'vitest';
import {
    getProjectBySlug,
    getProjectNeighbours,
    orderedProjects,
    projectCategories,
    projects,
} from './projects';
import { caseStudies } from './caseStudies';

describe('project data', () => {
    it('gives every project the fields the UI reads', () => {
        for (const p of projects) {
            expect(p.slug, `${p.title} slug`).toBeTruthy();
            expect(p.title, `${p.slug} title`).toBeTruthy();
            expect(p.reveal, `${p.slug} reveal`).toBeTruthy();
            expect(p.desc, `${p.slug} desc`).toBeTruthy();
            expect(p.org, `${p.slug} org`).toBeTruthy();
            expect(p.year, `${p.slug} year`).toMatch(/^\d{4}$/);
            expect(p.highlights.length, `${p.slug} highlights`).toBeGreaterThan(0);
            expect(p.tech.length, `${p.slug} tech`).toBeGreaterThan(0);
            expect(p.category.length, `${p.slug} category`).toBeGreaterThan(0);
        }
    });

    // Slugs are public URLs — a duplicate silently shadows a project.
    it('keeps slugs unique and URL-safe', () => {
        const slugs = projects.map((p) => p.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) {
            expect(slug, `${slug} must be lowercase kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        }
    });

    it('only uses categories the filter can offer', () => {
        for (const p of projects) {
            for (const c of p.category) {
                expect(projectCategories, `${p.slug} category ${c}`).toContain(c);
            }
        }
    });

    it('surfaces featured work first without dropping or duplicating anything', () => {
        expect(orderedProjects).toHaveLength(projects.length);
        expect(new Set(orderedProjects.map((p) => p.slug)).size).toBe(projects.length);

        const featuredCount = projects.filter((p) => p.featured).length;
        expect(featuredCount).toBeGreaterThan(0);
        expect(orderedProjects.slice(0, featuredCount).every((p) => p.featured)).toBe(true);
    });

    it('resolves slugs both ways', () => {
        for (const p of projects) {
            expect(getProjectBySlug(p.slug)?.title).toBe(p.title);
        }
        expect(getProjectBySlug('does-not-exist')).toBeUndefined();
    });

    it('links neighbours without running off either end', () => {
        const first = orderedProjects[0];
        const last = orderedProjects[orderedProjects.length - 1];

        expect(getProjectNeighbours(first.slug).prev).toBeUndefined();
        expect(getProjectNeighbours(first.slug).next?.slug).toBe(orderedProjects[1].slug);
        expect(getProjectNeighbours(last.slug).next).toBeUndefined();
        expect(getProjectNeighbours('does-not-exist')).toEqual({
            prev: undefined,
            next: undefined,
        });
    });

    // Every category chip shows a count; a chip that always reads 0 is dead UI.
    it('has at least one project behind every filter chip', () => {
        for (const c of projectCategories) {
            if (c === 'All') continue;
            const count = projects.filter((p) => p.category.includes(c)).length;
            expect(count, `filter "${c}" matches nothing`).toBeGreaterThan(0);
        }
    });
});

describe('case studies', () => {
    it('gives every project a case study', () => {
        for (const p of projects) {
            expect(caseStudies[p.slug], `${p.slug} has no case study`).toBeDefined();
        }
    });

    it('has no case study pointing at a project that does not exist', () => {
        const slugs = new Set(projects.map((p) => p.slug));
        for (const key of Object.keys(caseStudies)) {
            expect(slugs.has(key), `case study "${key}" matches no project`).toBe(true);
        }
    });

    it('gives every case study the narrative and a diagram with connected stages', () => {
        for (const [slug, study] of Object.entries(caseStudies)) {
            expect(study.problem.length, `${slug} problem`).toBeGreaterThan(80);
            expect(study.approach.length, `${slug} approach`).toBeGreaterThan(80);
            expect(study.diagram.title, `${slug} diagram title`).toBeTruthy();
            // A single column is a list, not a flow.
            expect(study.diagram.columns.length, `${slug} needs >1 stage`).toBeGreaterThan(1);
            for (const column of study.diagram.columns) {
                expect(column.nodes.length, `${slug} / ${column.title} is empty`).toBeGreaterThan(0);
            }
        }
    });

    it('uses only node kinds the diagram component can style', () => {
        const kinds = new Set(['input', 'process', 'ai', 'store', 'external', 'output']);
        for (const [slug, study] of Object.entries(caseStudies)) {
            for (const column of study.diagram.columns) {
                for (const node of column.nodes) {
                    expect(kinds.has(node.kind), `${slug}: unknown kind "${node.kind}"`).toBe(true);
                }
            }
        }
    });
});
