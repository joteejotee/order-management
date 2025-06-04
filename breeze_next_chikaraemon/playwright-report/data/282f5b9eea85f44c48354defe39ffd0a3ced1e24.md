# Test info

- Name: 基本機能 >> ホームページが正しく表示される
- Location: /Users/jo-m1/order-management/breeze_next_chikaraemon/tests/e2e/basic.spec.ts:4:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /Users/jo-m1/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
<launched> pid=53049
[pid=53049][err] /Users/jo-m1/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 53055 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"
Call log:
  - <launching> /Users/jo-m1/Library/Caches/ms-playwright/webkit-2158/pw_run.sh --inspector-pipe --headless --no-startup-window
  - <launched> pid=53049
  - [pid=53049][err] /Users/jo-m1/Library/Caches/ms-playwright/webkit-2158/pw_run.sh: line 7: 53055 Bus error: 10           DYLD_FRAMEWORK_PATH="$DYLIB_PATH" DYLD_LIBRARY_PATH="$DYLIB_PATH" "$PLAYWRIGHT" "$@"

```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('基本機能', () => {
>  4 |   test('ホームページが正しく表示される', async ({ page }) => {
     |       ^ Error: browserType.launch: Target page, context or browser has been closed
   5 |     await page.goto('/');
   6 |
   7 |     // ページがロードされることを確認
   8 |     await expect(page).toHaveTitle(/Laravel/);
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
