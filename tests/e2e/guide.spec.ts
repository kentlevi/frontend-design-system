import { expect, test } from '@playwright/test';

test.describe('Guide', () => {
    test('slash shortcut focuses guide search input', async ({ page }) => {
        await page.goto('/guide');

        const searchInput = page.getByTestId('guide-sidebar-search-input');
        await expect(searchInput).toBeVisible();

        await page.waitForFunction(() => {
            document.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: '/',
                    code: 'Slash',
                    bubbles: true,
                })
            );
            const input = document.querySelector(
                '[data-testid="guide-sidebar-search-input"]'
            );
            return document.activeElement === input;
        });

        await expect(searchInput).toBeFocused();
    });

    test('restores guide search query from session storage', async ({ page }) => {
        await page.addInitScript(() => {
            window.sessionStorage.setItem('guide-sidebar-query', 'web');
        });

        await page.goto('/guide');

        const searchInput = page.getByTestId('guide-sidebar-search-input');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveValue('web');
    });
});
