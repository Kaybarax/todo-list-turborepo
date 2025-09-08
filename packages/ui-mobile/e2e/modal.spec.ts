import { test, expect } from '@playwright/test';

const STORY = 'components-modal--default';

test('Modal can open', async ({ page, baseURL }) => {
  const resp = await page.goto(`${baseURL}/iframe.html?id=${STORY}`);
  if (!resp || !resp.ok()) test.skip(true, 'Storybook not reachable');
  const open = page.getByRole('button', { name: /open modal/i });
  await open.click();
  await expect(page.getByText('Default Modal')).toBeVisible();
});
