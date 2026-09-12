import { test, expect, signIn, composition } from "./fixtures";

const assessed = (language = "en") =>
  composition(1, {
    compositionStatus: "REVIEWED",
    language: language === "zh" ? "CHINESE" : "ENGLISH",
    title:
      language === "zh"
        ? "图书馆后面的小花园"
        : "A garden for our neighbourhood",
    content:
      language === "zh"
        ? "<p>我们班在图书馆旁边种了一个花园。每天清晨，我都能发现细微的变化。</p><p>周五，一朵黄色的小花开了。我停下脚步，想起我们一起播种的那一天。</p>"
        : "<p>Our class planted a garden beside the library. Every morning we noticed something new.</p><p>On Friday, a small yellow flower opened. I stopped to look and remembered the afternoon we had planted the seeds together.</p>",
    systemFeedback:
      language === "zh"
        ? "你的观察很具体。可以再增加一个细节，让读者更清楚地感受到你的心情。\n保留这份完整的评估。"
        : "Your observations are specific and easy to follow. Add one detail about how you felt when the first flower opened.\nKeep this complete assessment available as you revise.",
    suggestionStatus: "AVAILABLE",
    suggestions: [
      {
        criterion: language === "zh" ? "细节描写" : "Specific detail",
        priority: "HIGH",
        recommendation:
          language === "zh"
            ? "用一个具体的动作，表现看到花开时的心情。"
            : "Show how you felt through one small action when you noticed the flower.",
        exampleRevision:
          language === "zh"
            ? "我蹲下身，轻轻拨开叶子，生怕错过它第一次开放的样子。"
            : "I crouched beside the flower and moved a leaf aside, careful not to miss its first morning.",
        learningTip:
          language === "zh"
            ? "试着先写动作，再写感受。"
            : "Try describing the action before naming the feeling.",
        supportingEvidence: {
          excerpt: language === "zh" ? "我停下脚步。" : "I stopped to look.",
          location: language === "zh" ? "第二段" : "Paragraph 2",
        },
      },
    ],
  });

test("editing rechecks cached status before mounting a writable session", async ({
  page,
}) => {
  await signIn(page);
  let reads = 0;
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({
      json:
        ++reads === 1
          ? assessed()
          : composition(1, { compositionStatus: "REVIEWING" }),
    }),
  );
  await page.goto("/compositions/1");
  await page.getByRole("link", { name: "Edit original", exact: true }).click();
  await expect(
    page.getByText("This composition is being processed.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".tiptap[contenteditable=true]")).toHaveCount(0);
});

test("failed fresh edit lookup cannot reuse stale permission to write", async ({
  page,
}) => {
  await signIn(page);
  let reads = 0;
  let fail = true;
  await page.route("**/api/v1/composition/1", (route) =>
    ++reads > 1 && fail
      ? route.fulfill({
          status: 503,
          json: { message: "Could not verify current status" },
        })
      : route.fulfill({ json: assessed() }),
  );
  await page.goto("/compositions/1");
  await page.getByRole("link", { name: "Edit original", exact: true }).click();
  await expect(page.getByText("Could not verify current status")).toBeVisible();
  await expect(page.locator(".tiptap[contenteditable=true]")).toHaveCount(0);
  fail = false;
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Edit original", exact: true }),
  ).toBeVisible();
});

test("invalid composition addresses never request a different numeric record", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/compositions/1junk");
  await expect(
    page.getByText("This composition address is invalid."),
  ).toBeVisible();
  await page.goto("/compositions/1junk/edit");
  await expect(
    page.getByText("This composition address is invalid."),
  ).toBeVisible();
});

test("source document keeps its metadata, view and download links", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.comp.1.docId", "fictional-doc"),
  );
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({ json: assessed() }),
  );
  await page.route("**/api/documents/fictional-doc", (route) =>
    route.fulfill({
      json: {
        document: {
          id: "fictional-doc",
          filename: "Garden observations.txt",
          fileType: "TXT",
          fileSize: 128,
          status: "READY",
          createdAt: "2026-09-01T08:00:00Z",
        },
        downloadUrl: "https://example.test/fictional.txt",
      },
    }),
  );
  await page.goto("/compositions/1");
  const source = page.getByRole("region", { name: "Source document" });
  await expect(source.getByText("Garden observations.txt")).toBeVisible();
  await expect(
    source.getByRole("link", { name: "View document" }),
  ).toHaveAttribute("href", "/documents/fictional-doc");
  await expect(source.getByRole("link", { name: "Download" })).toHaveAttribute(
    "href",
    "https://example.test/fictional.txt",
  );
  await expect(
    source.getByText("This document association is saved in this browser."),
  ).toBeVisible();
});

test("generation polls its returned record and stops when ready", async ({
  page,
}) => {
  await signIn(page);
  let reads = 0;
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({
      json:
        ++reads === 1
          ? composition(1, { compositionStatus: "GENERATING", content: null })
          : composition(1),
    }),
  );
  await page.goto("/compositions/1");
  await expect(
    page.getByRole("heading", { name: "Creating your draft" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Continue writing" }),
  ).toHaveCount(0);
  await expect(page.locator("#composition-text")).toContainText(
    "Our class planted",
    { timeout: 10000 },
  );
  await expect(
    page.getByRole("link", { name: "Continue writing" }),
  ).toBeVisible();
  const completedReads = reads;
  await page.waitForTimeout(3500);
  expect(reads).toBe(completedReads);
});

test("temporary polling failure preserves state and retries GET without generation", async ({
  page,
}) => {
  await signIn(page);
  let reads = 0;
  let fail = true;
  await page.route("**/api/v1/composition/1", (route) =>
    ++reads > 1 && fail
      ? route.fulfill({
          status: 503,
          json: { message: "Temporary status failure" },
        })
      : route.fulfill({
          json: composition(1, {
            compositionStatus: "GENERATING",
            content: null,
          }),
        }),
  );
  await page.goto("/compositions/1");
  await expect(
    page.getByRole("heading", { name: "Creating your draft" }),
  ).toBeVisible();
  await expect(
    page.getByText("The latest status could not be loaded.", { exact: false }),
  ).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByRole("heading", { name: "Creating your draft" }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Refresh status" }).click();
  await expect(
    page.getByText("The latest status could not be loaded.", { exact: false }),
  ).toHaveCount(0);
});

test("failed generation retries as one new record", async ({ page }) => {
  await signIn(page);
  let creates = 0;
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({
      json: composition(1, {
        compositionStatus: "GENERATION_FAILED",
        content: null,
      }),
    }),
  );
  await page.route("**/api/v1/composition/generate", async (route) => {
    creates++;
    await route.fulfill({
      json: composition(99, { compositionStatus: "GENERATING", content: null }),
    });
  });
  await page.route("**/api/v1/composition/99", (route) =>
    route.fulfill({
      json: composition(99, { compositionStatus: "GENERATING", content: null }),
    }),
  );
  await page.goto("/compositions/1");
  await page.getByRole("button", { name: "Generate a new draft" }).click();
  await expect(page).toHaveURL(/\/compositions\/99$/);
  expect(creates).toBe(1);
});

test("suggestions retain every field and full feedback; revision leaves the original unchanged", async ({
  page,
}) => {
  await signIn(page);
  const original = assessed();
  let copies = 0;
  let copy = composition(2);
  await page.route("**/api/v1/composition/1", (route) => {
    expect(route.request().method()).toBe("GET");
    return route.fulfill({ json: original });
  });
  await page.route("**/api/v1/composition", (route) => {
    copies++;
    const request = route.request().postDataJSON();
    expect(request).toEqual({
      title: original.title + " - Revision",
      content: original.content,
    });
    copy = composition(2, request);
    return route.fulfill({ json: copy });
  });
  await page.route("**/api/v1/composition/2", (route) =>
    route.fulfill({ json: copy }),
  );
  await page.goto("/compositions/1");
  await expect(
    page.getByText("Try describing the action before naming the feeling."),
  ).toBeVisible();
  await expect(page.getByText("Paragraph 2", { exact: true })).toBeVisible();
  await expect(page.getByText(original.systemFeedback!)).not.toBeVisible();
  await page.getByText("Full assessment feedback", { exact: true }).click();
  await expect(page.getByText(original.systemFeedback!)).toBeVisible();
  await page.getByRole("button", { name: "Create revision" }).click();
  await expect(page).toHaveURL(/\/compositions\/2\/edit$/);
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    original.title + " - Revision",
  );
  await expect(page.locator(".tiptap")).toContainText("Our class planted");
  expect(copies).toBe(1);
});

test("uncertain revision creation requires checking the library", async ({
  page,
}) => {
  await signIn(page);
  let copies = 0;
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({ json: assessed() }),
  );
  await page.route("**/api/v1/composition", (route) => {
    copies++;
    return route.abort("failed");
  });
  await page.goto("/compositions/1");
  await page.getByRole("button", { name: "Create revision" }).click();
  await expect(
    page.getByRole("link", { name: "Check library in a new tab" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create revision" }),
  ).toBeDisabled();
  await page.waitForTimeout(2500);
  expect(copies).toBe(1);
  await expect(page.locator("#composition-text")).toContainText(
    "Our class planted",
  );
});

test("legacy text remains literal; supported rich HTML is sanitized", async ({
  page,
}) => {
  await signIn(page);
  const prose = "<script>alert('literal')</script>\n2 < 3 & 4 > 1\n第二段";
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({ json: composition(1, { content: prose }) }),
  );
  await page.goto("/compositions/1");
  await expect(page.locator("#composition-text .tiptap")).toContainText(
    "<script>alert('literal')</script>",
  );
  await expect(page.locator("#composition-text .tiptap p")).toHaveCount(3);
  await page.getByRole("link", { name: "Continue writing" }).click();
  await expect(page.locator(".tiptap")).toContainText("2 < 3 & 4 > 1");
  const markup =
    '<p onclick="window.compromised=true"><strong>Bold</strong> <a href="javascript:window.compromised=true">unsafe link</a></p><script>window.compromised=true</script><h2>Heading</h2><ul><li>List item</li></ul>';
  await page.route("**/api/v1/composition/2", (route) =>
    route.fulfill({ json: composition(2, { content: markup }) }),
  );
  await page.goto("/compositions/2");
  await expect(page.locator("#composition-text strong")).toHaveText("Bold");
  await expect(page.locator("#composition-text h2").last()).toHaveText(
    "Heading",
  );
  await expect(
    page.locator(
      "#composition-text [onclick], #composition-text script, #composition-text a[href^='javascript:']",
    ),
  ).toHaveCount(0);
  expect(await page.evaluate(() => "compromised" in window)).toBe(false);
});

test("missing suggestions preserve complete feedback and unknown stages stay neutral", async ({
  page,
}) => {
  await signIn(page);
  await page.route("**/api/v1/composition/1", (route) =>
    route.fulfill({
      json: {
        ...assessed(),
        suggestionStatus: "NOT_AVAILABLE_FOR_LANGUAGE",
        suggestions: null,
      },
    }),
  );
  await page.goto("/compositions/1");
  await expect(page.getByText(assessed().systemFeedback!)).toBeVisible();
  await expect(
    page.getByText("Structured suggestions are not available", {
      exact: false,
    }),
  ).toBeVisible();
  await page.route("**/api/v1/composition/2", (route) =>
    route.fulfill({
      json: composition(2, {
        compositionStatus: "REVIEWING",
        gradingProgressStage: "FUTURE_STAGE",
        gradingProgressMessage: "Waiting for assessment",
      }),
    }),
  );
  await page.goto("/compositions/2");
  await expect(
    page.getByText(
      "The assessment is in progress. Its current stage is not available yet.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Waiting for assessment")).toBeVisible();
  await expect(page.getByLabel("Complete", { exact: true })).toHaveCount(0);
});

test("admin inspection is read only while own work uses the learner endpoint", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  let ownReads = 0;
  await page.route("**/api/v1/admin/compositions/1", (route) =>
    route.fulfill({ json: assessed() }),
  );
  await page.route("**/api/v1/composition/1", (route) => {
    ownReads++;
    return route.fulfill({ json: assessed() });
  });
  await page.goto("/compositions/1?context=admin");
  await expect(page.getByText("Admin inspection · read only")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create revision" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Delete", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Edit original" })).toHaveCount(
    0,
  );
  expect(ownReads).toBe(0);
  await page.goto("/compositions/1");
  await expect(
    page.getByRole("button", { name: "Create revision" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit original" })).toBeVisible();
  expect(ownReads).toBeGreaterThan(0);
});

test("delete confirmation cancellation preserves the composition", async ({
  page,
}) => {
  await signIn(page);
  await page.route("**/api/v1/composition/1", (route) => {
    expect(route.request().method()).toBe("GET");
    return route.fulfill({ json: assessed() });
  });
  await page.goto("/compositions/1");
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Delete", exact: true }),
  ).toBeFocused();
});

for (const language of ["en", "zh"])
  for (const width of [1440, 1024, 390, 320]) {
    test(`feedback reflows at ${width}px in ${language}`, async ({ page }) => {
      await signIn(page, "BASIC", language);
      await page.setViewportSize({ width, height: width >= 1024 ? 900 : 844 });
      await page.route("**/api/v1/composition/1", (route) =>
        route.fulfill({ json: assessed(language) }),
      );
      await page.goto("/compositions/1");
      await expect(page.locator("#composition-text .tiptap p")).toHaveCount(2);
      const columns = page.locator(".detail-columns");
      const available = (await page
        .locator(".composition-detail")
        .boundingBox())!.width;
      const paper = (await page.locator("#composition-text").boundingBox())!;
      const feedback = (await columns.locator("aside").boundingBox())!;
      if (available >= 960)
        await expect
          .poll(async () => {
            const currentPaper = (await page
              .locator("#composition-text")
              .boundingBox())!;
            const currentFeedback = (await columns
              .locator("aside")
              .boundingBox())!;
            return Math.abs(currentPaper.y - currentFeedback.y);
          })
          .toBeLessThan(2);
      else expect(feedback.y).toBeGreaterThanOrEqual(paper.y + paper.height);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T06-feedback-${width}-${language}.png`,
        fullPage: true,
      });
    });
  }
