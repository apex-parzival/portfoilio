import { describe, expect, it } from 'vitest';
import {
    getProjectBySlug,
    getProjectNeighbours,
    orderedProjects,
    projectCategories,
    projects,
} from './projects';

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
