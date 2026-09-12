import { test, expect, signIn, composition } from "./fixtures";

test("Save and leave waits for the write before following the original link", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let creates = 0;
  await page.route("**/api/v1/composition", async (route) => {
    creates++;
    await gate;
    await route.fulfill({
      json: composition(42, route.request().postDataJSON()),
    });
  });
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Ready to save");
  await page.locator(".tiptap").fill("A complete draft.");
  await page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByRole("link", { name: "Library" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Keep your changes?" });
  await dialog.getByRole("button", { name: "Save and leave" }).click();
  await expect.poll(() => creates).toBe(1);
  await expect(page).toHaveURL(/\/compositions\/new$/);
  release();
  await expect(page).toHaveURL(/\/compositions$/);
});

test("browser reload warns and cancelling retains the local draft", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Before reload");
  await page.locator(".tiptap").fill("Unsaved words.");
  await expect(page.getByRole("button", { name: "Submit for review" })).toBeEnabled();
  const prompt = page.waitForEvent("dialog");
  const reload = page.reload({ timeout: 3000 }).catch(() => {});
  const dialog = await prompt;
  expect(dialog.type()).toBe("beforeunload");
  await dialog.dismiss();
  await reload;
  await expect(page.locator(".tiptap")).toContainText("Unsaved words.");
});

test("generation saves meaningful draft content before creating a separate record", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  const writes: string[] = [];
  await page.route("**/api/v1/composition", (route) => {
    writes.push("SAVE");
    return route.fulfill({
      json: composition(42, route.request().postDataJSON()),
    });
  });
  await page.route("**/api/v1/composition/generate", (route) => {
    writes.push("GENERATE");
    return route.fulfill({
      json: composition(99, { content: null, compositionStatus: "GENERATING" }),
    });
  });
  await page.route("**/api/v1/composition/99", (route) =>
    route.fulfill({
      json: composition(99, { content: null, compositionStatus: "GENERATING" }),
    }),
  );
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("A second garden");
  await page.locator(".tiptap").fill("Keep my original draft.");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  await expect(page).toHaveURL(/\/compositions\/99$/);
  expect(writes).toEqual(["SAVE", "GENERATE"]);
});

test("autosave create and review serialize the latest input without a trailing PUT", async ({
  page,
}) => {
  await signIn(page);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const requests: { method: string; content?: string }[] = [];
  let record = composition(42);
  await page.route("**/api/v1/composition", async (route) => {
    const draft = route.request().postDataJSON();
    requests.push({ method: "POST", content: draft.content });
    await gate;
    record = composition(42, draft);
    await route.fulfill({ json: record });
  });
  await page.route("**/api/v1/composition/42", async (route) => {
    if (route.request().method() === "PUT") {
      const draft = route.request().postDataJSON();
      requests.push({ method: "PUT", content: draft.content });
      record = composition(42, draft);
    }
    await route.fulfill({ json: record });
  });
  await page.route("**/api/v1/composition/42/grading", (route) => {
    requests.push({ method: "GRADE" });
    record = {
      ...record,
      compositionStatus: "REVIEWING",
      gradingProgressStage: "PREPARING",
    };
    return route.fulfill({ json: record });
  });
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("My garden");
  await page.locator(".tiptap").fill("Version A");
  await expect.poll(() => requests.length).toBe(1);
  await page.locator(".tiptap").fill("Version B");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.locator(".tiptap")).toHaveAttribute(
    "contenteditable",
    "false",
  );
  release();
  await expect(page).toHaveURL(/\/compositions\/42$/);
  // Wait beyond the real autosave debounce to catch a trailing update.
  await page.waitForTimeout(2300);
  expect(requests).toEqual([
    { method: "POST", content: "<p>Version A</p>" },
    { method: "PUT", content: "<p>Version B</p>" },
    { method: "GRADE" },
  ]);
});

test("reviewed originals require a warning and do not save on hydration or toggle", async ({
  page,
}) => {
  await signIn(page);
  let updates = 0;
  const record = composition(1, {
    content: "Legacy plain text stays unchanged.",
    compositionStatus: "REVIEWED",
    systemFeedback: "Preserve this feedback.",
  });
  await page.route("**/api/v1/composition/1", (route) => {
    if (route.request().method() === "PUT") updates++;
    return route.fulfill({ json: record });
  });
  await page.goto("/compositions/1/edit");
  await expect(
    page.getByRole("heading", { name: "Edit the assessed original?" }),
  ).toBeVisible();
  await expect(page.locator(".tiptap")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Edit original", exact: true })
    .click();
  await expect(page.locator(".tiptap")).toContainText(
    "Legacy plain text stays unchanged.",
  );
  await page.getByRole("switch", { name: "Toggle auto-save" }).click();
  await page.getByRole("switch", { name: "Toggle auto-save" }).click();
  await page.waitForTimeout(2300);
  expect(updates).toBe(0);
});

test("confirmed create failure preserves input and supports a manual retry", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  let creates = 0;
  await page.route("**/api/v1/composition", (route) => {
    creates++;
    return creates === 1
      ? route.fulfill({
          status: 400,
          json: { message: "Fixture: rejected save" },
        })
      : route.fulfill({
          json: composition(42, route.request().postDataJSON()),
        });
  });
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Keep this draft");
  await page.locator(".tiptap").fill("Keep all these words.");
  await page.waitForTimeout(2300);
  expect(creates).toBe(0);
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(
    page
      .getByRole("main")
      .getByRole("alert")
      .filter({ hasText: "Fixture: rejected save" }),
  ).toBeVisible();
  await expect(page.locator(".tiptap")).toContainText("Keep all these words.");
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "View saved draft" }),
  ).toHaveAttribute("href", "/compositions/42");
  expect(creates).toBe(2);
});

test("uncertain create is never automatically repeated", async ({ page }) => {
  await signIn(page);
  let creates = 0;
  await page.route("**/api/v1/composition", (route) => {
    creates++;
    return route.abort("failed");
  });
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Uncertain save");
  await page.locator(".tiptap").fill("Keep this draft while I check.");
  await expect(
    page.getByRole("link", { name: "Check library in a new tab" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.waitForTimeout(2300);
  expect(creates).toBe(1);
  await expect(page.locator(".tiptap")).toContainText(
    "Keep this draft while I check.",
  );
});

test("mode changes offer Stay, Save and leave, and Discard; failed save stays", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.autosave.enabled", "false"),
  );
  await page.route("**/api/v1/composition", (route) =>
    route.fulfill({ status: 400, json: { message: "Fixture: save failed" } }),
  );
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Do not lose this");
  await page.locator(".tiptap").fill("Still here.");
  const upload = page
    .getByRole("navigation", { name: "New composition" })
    .getByRole("link", { name: "Upload document" });
  await upload.click();
  const dialog = page.getByRole("dialog", { name: "Keep your changes?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Stay here" }).click();
  await expect(page.locator(".tiptap")).toContainText("Still here.");
  await upload.click();
  await dialog.getByRole("button", { name: "Save and leave" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Fixture: save failed");
  await expect(page).toHaveURL(/\/compositions\/new$/);
  await dialog.getByRole("button", { name: "Discard unsaved changes" }).click();
  await expect(page).toHaveURL(/mode=upload/);
});

test("empty rich text cannot start a review", async ({ page }) => {
  await signIn(page);
  await page.goto("/compositions/new");
  await page.getByLabel("Title", { exact: true }).fill("Empty composition");
  await page.locator(".tiptap").fill(" ");
  await expect(
    page.getByRole("button", { name: "Submit for review" }),
  ).toBeDisabled();
});
