import { test, expect } from '@playwright/test';

const STORY = 'components-button--primary';

test('Button primary story renders', async ({ page, baseURL }) => {
  const resp = await page.goto(`${baseURL}/iframe.html?id=${STORY}`);
  if (!resp || !resp.ok()) test.skip(true, 'Storybook not reachable');
  await expect(page.getByRole('button', { name: /primary button/i })).toBeVisible();
});
