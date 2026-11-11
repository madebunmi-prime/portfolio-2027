import { expect, test } from '@playwright/test';

test('home page renders every section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  for (const id of ['stack', 'experience', 'work', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('contact form validates before sending', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByRole('status')).not.toBeEmpty();
});
