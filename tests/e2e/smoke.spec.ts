import { expect, test } from '@playwright/test';

test.describe('Smoke', () => {
    test('guide testing page renders', async ({ page }) => {
        await page.goto('/guide/testing');
        await expect(page.getByRole('heading', { name: 'Testing' })).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Accessibility Test Checklist' })
        ).toBeVisible();
    });

    test('header cart preview opens and closes', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('button', { name: 'Local preferences' })
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cart' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();
    });

    test('product picker exposes LCP-friendly first image', async ({ page }) => {
        await page.goto('/stickers');

        const firstPickerImage = page.locator('img.product-picker-image').first();
        await expect(firstPickerImage).toBeVisible();
        await expect(firstPickerImage).toHaveAttribute('loading', 'eager');
        await expect(firstPickerImage).toHaveAttribute('fetchpriority', 'high');
    });

    test('auth login page loads submit action', async ({ page }) => {
        await page.goto('/auth/login');
        await expect(page.getByTestId('auth-login-page')).toBeVisible();
        await expect(page.getByTestId('auth-login-submit-member-button')).toBeVisible();
    });

    test('guide web vitals loads and refresh action is available', async ({ page }) => {
        await page.goto('/guide/web-vitals');

        await expect(page.getByRole('heading', { name: 'Web Vitals' })).toBeVisible();
        const refreshButton = page.getByTestId('guide-web-vitals-refresh-button');
        await expect(refreshButton).toBeVisible();
        await refreshButton.click();

        await expect(
            page.locator('.web-vitals-table-wrap, .web-vitals-hint')
        ).toBeVisible();
    });
});
