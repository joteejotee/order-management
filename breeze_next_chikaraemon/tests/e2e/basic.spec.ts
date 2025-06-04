import { test, expect } from '@playwright/test';

test.describe('基本機能', () => {
  test('ホームページが正しく表示される', async ({ page }) => {
    await page.goto('/');

    // ページがロードされることを確認
    await expect(page).toHaveTitle(/Laravel/);

    // ページの基本要素が存在することを確認
    await expect(page.locator('html')).toBeVisible();
  });

  test('ページが正常にレンダリングされる', async ({ page }) => {
    await page.goto('/');

    // JavaScriptが実行されてページが完全にロードされることを確認
    await page.waitForLoadState('networkidle');

    // 基本的なレイアウトが存在することを確認
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
