import { test, expect, signIn } from "./fixtures";

for (const language of ["en", "zh"]) {
  for (const width of [1440, 1024, 390, 320]) {
    test(`writing paper at ${width}px in ${language}`, async ({ page }) => {
      await signIn(page, "BASIC", language);
      await page.addInitScript(() =>
        localStorage.setItem("sllp.autosave.enabled", "false"),
      );
      await page.setViewportSize({ width, height: width >= 1024 ? 900 : 844 });
      const warnings: string[] = [];
      page.on("console", (message) => {
        if (message.text().includes("Duplicate extension"))
          warnings.push(message.text());
      });
      await page.goto("/compositions/new");
      await page
        .getByLabel(language === "zh" ? "标题" : "Title", { exact: true })
        .fill(
          language === "zh"
            ? "图书馆后面的小花园"
            : "A garden for our neighbourhood",
        );
      const body = page.getByRole("textbox", {
        name: language === "zh" ? "正文" : "Content",
        exact: true,
      });
      await body.fill(
        language === "zh"
          ? "我们班在图书馆旁边种了一个花园。每天清晨，我都能发现细微的变化。\n\n周五，一朵黄色的小花开了。我停下脚步，想起我们一起播种的那一天。"
          : "Our class planted a garden beside the library. Every morning we noticed something new.\n\nOn Friday, a small yellow flower opened. I stopped to look and remembered the afternoon we had planted the seeds together.",
      );
      await expect(
        page.getByRole("button", {
          name: language === "zh" ? "提交评估" : "Submit for review",
        }),
      ).toBeEnabled();
      await page.evaluate(() => {
        (document.activeElement as HTMLElement)?.blur();
        window.scrollTo(0, 0);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T05-editor-${width}-${language}.png`,
        fullPage: true,
      });
      const formatting = page.getByRole("toolbar", {
        name: language === "zh" ? "文字格式" : "Text formatting",
        exact: true,
      });
      await expect(formatting.getByRole("button")).toHaveCount(19);
      for (const button of await formatting.getByRole("button").all()) {
        const box = await button.boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(box!.height).toBeGreaterThanOrEqual(width < 1024 ? 44 : 40);
      }
      await page
        .getByText(language === "zh" ? "草稿设置" : "Draft settings", {
          exact: true,
        })
        .click();
      await expect(
        page.getByLabel(language === "zh" ? "语言" : "Language", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", {
          name: language === "zh" ? "生成" : "Generate",
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => {
        (document.activeElement as HTMLElement)?.blur();
        window.scrollTo(0, 0);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T05-options-${width}-${language}.png`,
        fullPage: true,
      });
      expect(warnings).toEqual([]);
    });
  }
}

test("formatting, history, link editing and cursor state remain usable", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  await page.goto("/compositions/new");
  const body = page.getByRole("textbox", { name: "Content", exact: true });
  await body.fill("A garden for everyone");
  await body.press("Control+a");
  await page.getByRole("button", { name: "Bold", exact: true }).click();
  await expect(body.locator("strong")).toHaveText("A garden for everyone");
  await expect(
    page.getByRole("button", { name: "Bold", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(body.locator("strong")).toHaveCount(0);
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(body.locator("strong")).toHaveCount(1);
  await page.getByRole("button", { name: "Heading 2", exact: true }).click();
  await expect(body.locator("h2")).toContainText("A garden");
  page.once("dialog", (dialog) => dialog.accept("https://example.test/garden"));
  await page.getByRole("button", { name: "Insert link", exact: true }).click();
  await expect(body.locator("a")).toHaveAttribute(
    "href",
    "https://example.test/garden",
  );
  await page
    .getByRole("button", { name: "Clear formatting", exact: true })
    .click();
  await expect(body.locator("p").first()).toHaveText("A garden for everyone");
  await expect(body.locator("strong, h2, a")).toHaveCount(0);
});
