import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { navLinks, profile, sectionIds, siteUrl } from './profile';

const SECTIONS_DIR = join(process.cwd(), 'src/components/sections');

const sectionSource = () =>
    readdirSync(SECTIONS_DIR)
        .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
        .map((f) => readFileSync(join(SECTIONS_DIR, f), 'utf8'))
        .join('\n');

describe('profile and navigation', () => {
    it('exposes a canonical site URL with no trailing slash', () => {
        expect(siteUrl).toMatch(/^https:\/\//);
        expect(siteUrl.endsWith('/')).toBe(false);
    });

    it('points every social link at a real absolute URL', () => {
        for (const key of ['instagram', 'linkedin', 'github', 'leetcode'] as const) {
            expect(() => new URL(profile[key]), `${key} is not a valid URL`).not.toThrow();
            // Guards against the template placeholders this site actually shipped
            // with once ("github.com/yourgithub").
            expect(profile[key], `${key} still looks like a placeholder`).not.toMatch(
                /your(github|handle|profile|leetcode|name)/i
            );
        }
    });

    it('keeps nav ids unique', () => {
        expect(new Set(sectionIds).size).toBe(sectionIds.length);
        expect(sectionIds.length).toBe(navLinks.length);
    });

    /**
     * The nav scrolls by element id. A link whose target id does not exist in any
     * section fails silently — exactly how `#experience` stayed broken.
     */
    it('has a matching id="..." in the sections for every nav link', () => {
        const source = sectionSource();
        for (const id of sectionIds) {
            expect(source, `no section renders id="${id}"`).toContain(`id="${id}"`);
        }
    });
});
