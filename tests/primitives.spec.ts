import { test, expect, signIn, composition } from "./fixtures";

test("admin forms open as true modals with focus containment and return", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/v1/admin/rubrics", (route) =>
    route.fulfill({ json: [] }),
  );
  await page.goto("/admin/rubrics");
  const trigger = page.getByRole("button", {
    name: "Add criterion",
    exact: true,
  }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.matches(":modal"))).toBe(
    true,
  );
  const last = dialog.getByRole("button").last();
  await last.focus();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.screenshot({
    path: "docs/ux-redesign/evidence/T01-dialog-390-en.png",
  });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("assessment stage labels render from the active Chinese resources", async ({
  page,
}) => {
  await signIn(page, "BASIC", "zh");
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({
      json: composition(1, {
        compositionStatus: "REVIEWING",
        gradingProgressStage: "SUGGESTING",
      }),
    }),
  );
  await page.goto("/compositions/1");
  await expect(
    page.getByText("正在创建改进建议", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("assessmentStages.suggesting", { exact: true }),
  ).not.toBeVisible();
});

test("learner access to administration redirects to their workspace", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/admin/users");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("link", { name: "Administration", exact: true }),
  ).not.toBeVisible();
});
