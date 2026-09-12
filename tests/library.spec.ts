import { test, expect, signIn, composition } from "./fixtures";

test("document cards retain translated view and deletion controls", async ({
  page,
}) => {
  await signIn(page, "BASIC", "zh");
  await page.setViewportSize({ width: 320, height: 844 });
  await page.route("**/api/documents?**", (route) =>
    route.fulfill({
      json: {
        documents: [
          {
            id: "fixture-doc",
            filename: "花园观察笔记与下一篇作文的修改计划.pptx",
            fileType: "PPTX",
            fileSize: 2048,
            status: "READY",
            createdAt: "2026-09-08T09:00:00Z",
          },
        ],
        total: 1,
        page: 0,
        pageSize: 20,
        hasMore: false,
      },
    }),
  );
  await page.goto("/compositions?tab=documents");
  await expect(page.getByRole("button", { name: "查看文档" })).toBeVisible();
  await expect(page.getByText("已就绪", { exact: true })).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page
    .getByRole("button", {
      name: "删除 花园观察笔记与下一篇作文的修改计划.pptx",
    })
    .click();
  await expect(page.getByRole("button", { name: "查看文档" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page.screenshot({
    path: "docs/ux-redesign/evidence/T03-documents-320-zh.png",
    fullPage: true,
  });
});

test("loads beyond twenty, deduplicates and preserves rows after a failed next page", async ({
  page,
}) => {
  await signIn(page);
  let failNext = true;
  await page.route("**/api/v1/composition?**", (route) => {
    const number = Number(
      new URL(route.request().url()).searchParams.get("page"),
    );
    if (number === 0)
      return route.fulfill({
        json: Array.from({ length: 20 }, (_, i) => composition(i + 1)),
      });
    if (failNext)
      return route.fulfill({
        status: 503,
        json: { message: "Fixture: temporarily unavailable" },
      });
    return route.fulfill({ json: [composition(20), composition(21)] });
  });
  await page.goto("/compositions");
  await expect(page.getByRole("status")).toHaveText("20 compositions loaded");
  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Your loaded work is still here",
    { timeout: 15000 },
  );
  await expect(
    page.getByRole("heading", { name: "A garden for our neighbourhood" }),
  ).toBeVisible();
  failNext = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "21 compositions loaded · You have reached the end.",
  );
  await expect(
    page.getByRole("heading", { name: "Writing practice 20", exact: true }),
  ).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Library", exact: true })
    .getByRole("link", { name: "Documents" })
    .click();
  await expect(page).toHaveURL(/tab=documents/);
  await expect(
    page.getByText("No documents yet", { exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Writing practice 21" }),
  ).toBeVisible();
});

test("keeps entry points usable when requests fail; retry reveals first-use state", async ({
  page,
}) => {
  await signIn(page);
  let failing = true;
  await page.route("**/api/v1/composition?**", (route) =>
    failing
      ? route.fulfill({
          status: 503,
          json: { message: "Fixture service unavailable" },
        })
      : route.fulfill({ json: [] }),
  );
  await page.goto("/dashboard");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Fixture service unavailable",
    { timeout: 15000 },
  );
  await expect(
    page.getByRole("link", { name: "New composition", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Upload document", exact: true }),
  ).toBeVisible();
  failing = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByText("Your writing starts here", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Based on the 0 most recently created compositions."),
  ).toBeVisible();
});

test("document failures are errors rather than a false empty library", async ({
  page,
}) => {
  await signIn(page);
  await page.route("**/api/documents?**", (route) =>
    route.fulfill({
      status: 503,
      json: { message: "Document service unavailable" },
    }),
  );
  await page.goto("/compositions?tab=documents");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Document service unavailable",
    { timeout: 15000 },
  );
  await expect(
    page.getByText("No documents yet", { exact: true }),
  ).not.toBeVisible();
});
