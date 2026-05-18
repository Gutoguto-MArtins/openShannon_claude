import { describe, it, expect, mock, spyOn } from 'bun:test';
import { which, whichSync } from './which.js';

describe('which and whichSync', () => {
    it('returns a path for known commands (e.g., node)', async () => {
        const path = await which('node');
        expect(path).not.toBeNull();
        expect(path).toContain('node');
    });

    it('returns null for unknown commands', async () => {
        const path = await which('some-unknown-command-xyz-123');
        expect(path).toBeNull();
    });

    it('sync version returns a path for known commands', () => {
        const path = whichSync('node');
        expect(path).not.toBeNull();
        expect(path).toContain('node');
    });

    it('sync version returns null for unknown commands', () => {
        const path = whichSync('some-unknown-command-xyz-123');
        expect(path).toBeNull();
    });
});
