import { expect, test } from '@playwright/test';

test('home page renders every section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  for (const id of ['lifecycle', 'systems', 'agents', 'capabilities', 'work', 'experience', 'leadership', 'toolbox', 'testimonials', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('system diagram inspector follows the selected node', async ({ page }) => {
  await page.goto('/#systems');
  const node = page.locator('#systems .aspect-video button').nth(2);
  const label = (await node.locator('span').nth(1).textContent()) ?? '';
  await node.click();
  await expect(page.locator('#systems aside h3')).toHaveText(label);
});

test('contact form validates before sending', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByRole('status')).not.toBeEmpty();
});
