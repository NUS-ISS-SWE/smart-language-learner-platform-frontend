import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
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
