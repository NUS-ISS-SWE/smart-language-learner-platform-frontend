import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("switches language interactively and retains it after reload", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("button", { name: "切换到中文" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "让你的下一篇草稿更清晰。",
    );
    await expect(page.getByText("反馈示例", { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "让你的下一篇草稿更清晰。",
    );
    expect(errors).toEqual([]);
  });
  test("shows an accessible writing-focused entry point", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Make your next draft clearer.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign up" }).first(),
    ).toHaveAttribute("href", "/register");
    await expect(page.getByText("Illustrative feedback example")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.getByRole("heading", { level: 1 }).click();
    await expect(page).toHaveScreenshot("landing-desktop.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("keeps the writing example readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByLabel("Illustrative feedback example"),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390);
    await expect(page).toHaveScreenshot("landing-mobile.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
