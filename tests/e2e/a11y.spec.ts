import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/stickers', '/guide/testing', '/auth/login'];

test.describe('Accessibility', () => {
    for (const route of routes) {
        test(`${route} has html[lang] and no serious/critical a11y violations in main content`, async ({
            page,
        }) => {
            await page.goto(route);

            const htmlLang = await page.locator('html').getAttribute('lang');
            expect(htmlLang?.trim().length).toBeGreaterThan(0);

            const results = await new AxeBuilder({ page })
                .include('main')
                .analyze();

            const highImpactViolations = results.violations.filter(
                (violation) =>
                    violation.impact === 'serious' ||
                    violation.impact === 'critical'
            );

            expect(highImpactViolations, JSON.stringify(highImpactViolations, null, 2)).toEqual([]);
        });
    }

    test('home header action buttons expose accessible names', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('button', { name: 'Local preferences' })
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cart' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
    });

    test('stickers product picker images expose alt text', async ({ page }) => {
        await page.goto('/stickers');

        const pickerImages = page.locator('img.product-picker-image');
        const count = await pickerImages.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i += 1) {
            await expect(pickerImages.nth(i)).toHaveAttribute('alt', /.+/);
        }
    });
});
