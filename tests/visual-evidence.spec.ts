import { test, expect, signIn, composition } from "./fixtures";

for (const language of ["en", "zh"]) {
  for (const width of [1440, 1024, 390, 320]) {
    test(`landing and workspace remain readable at ${width}px in ${language}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({
        width,
        height: width === 1440 ? 900 : width === 1024 ? 768 : 844,
      });
      await page.addInitScript((language) => {
        localStorage.setItem("i18nextLng", language);
      }, language);
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        language === "zh"
          ? "让你的下一篇草稿更清晰。"
          : "Make your next draft clearer.",
      );
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T11-landing-${width}-${language}.png`,
        fullPage: true,
      });
      await signIn(page, "ADMIN", language);
      await page.route("**/api/v1/composition?**", (route) =>
        route.fulfill({
          json: [
            composition(
              1,
              language === "zh"
                ? {
                    title: "图书馆后面的小花园",
                    language: "CHINESE",
                    content:
                      "<p>我们班在图书馆旁边种了一个花园。每天清晨，我都能发现细微的变化。</p>",
                  }
                : {},
            ),
            composition(2, {
              title:
                language === "zh"
                  ? "一次让我重新思考如何表达观点的经历，以及接下来希望进一步修改和完善的写作计划"
                  : "What I learned when I started listening: a reflection on small changes and the ideas I want to explore in my next draft",
              compositionStatus: "REVIEWED",
            }),
            composition(3, { compositionStatus: "REVIEWING" }),
          ],
        }),
      );
      await page.goto("/dashboard");
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Mei Tan",
      );
      await expect(
        page.getByRole("heading", {
          name: language === "zh" ? "平台概览" : "Platform overview",
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T03-dashboard-${width}-${language}.png`,
        fullPage: true,
      });
      await page.goto("/compositions");
      await expect(
        page.getByRole("heading", {
          name:
            language === "zh"
              ? "图书馆后面的小花园"
              : "A garden for our neighbourhood",
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T03-library-${width}-${language}.png`,
        fullPage: true,
      });
      if (width < 1024) {
        await page
          .getByRole("button", {
            name: language === "zh" ? "打开导航" : "Open navigation",
          })
          .click();
        await page.screenshot({
          path: `docs/ux-redesign/evidence/T02-drawer-${width}-${language}.png`,
        });
        await page.keyboard.press("Escape");
      }
      expect(errors).toEqual([]);
    });
  }
}

test("signed-in landing routes to writing, library and dashboard", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Start writing", exact: true }),
  ).toHaveAttribute("href", "/compositions/new");
  await expect(
    page.getByRole("link", { name: "Open library", exact: true }),
  ).toHaveAttribute("href", "/compositions");
  await expect(
    page.getByRole("link", { name: "Dashboard", exact: true }),
  ).toHaveAttribute("href", "/dashboard");
  await page.getByRole("link", { name: "Open library", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Library");
});
