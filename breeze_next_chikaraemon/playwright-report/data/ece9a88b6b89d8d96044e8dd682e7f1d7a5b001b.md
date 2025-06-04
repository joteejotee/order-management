# Test info

- Name: 基本機能 >> ホームページが正しく表示される
- Location: /Users/jo-m1/order-management/breeze_next_chikaraemon/tests/e2e/basic.spec.ts:4:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)

Locator: locator(':root')
Expected pattern: /Laravel/
Received string:  ""
Call log:
  - expect.toHaveTitle with timeout 5000ms
  - waiting for locator(':root')
    4 × locator resolved to <html lang="ja" class="__variable_e8ce0c __variable_f470d0">…</html>
      - unexpected value ""
    - waiting for" http://localhost:3000/login" navigation to finish...

    at /Users/jo-m1/order-management/breeze_next_chikaraemon/tests/e2e/basic.spec.ts:8:24
```

# Page snapshot

```yaml
- img
- heading "Login" [level=1]
- img
- text: Email
- textbox "Email"
- img
- text: Password
- textbox
- button:
    - img
- button "Login"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('基本機能', () => {
   4 |   test('ホームページが正しく表示される', async ({ page }) => {
   5 |     await page.goto('/');
   6 |
   7 |     // ページがロードされることを確認
>  8 |     await expect(page).toHaveTitle(/Laravel/);
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)
   9 |
  10 |     // ページの基本要素が存在することを確認
  11 |     await expect(page.locator('html')).toBeVisible();
  12 |   });
  13 |
  14 |   test('ページが正常にレンダリングされる', async ({ page }) => {
  15 |     await page.goto('/');
  16 |
  17 |     // JavaScriptが実行されてページが完全にロードされることを確認
  18 |     await page.waitForLoadState('networkidle');
  19 |
  20 |     // 基本的なレイアウトが存在することを確認
  21 |     const body = page.locator('body');
  22 |     await expect(body).toBeVisible();
  23 |   });
  24 | });
  25 |
```
