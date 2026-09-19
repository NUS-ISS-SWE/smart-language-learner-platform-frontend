import { test, expect, signIn, composition } from "./fixtures";
import { DOCUMENT_MIME_TYPES } from "../lib/document-upload";

const documentFixture = {
  id: 17,
  filename: "Garden observations.txt",
  fileType: "txt",
  fileSize: 256,
  status: "READY",
  createdAt: "2026-09-01T08:00:00Z",
};
const extracted =
  "Our class planted a garden.\n\n2 < 3 & 4 > 1\n<script>This is literal document text.</script>";
const response = { document: documentFixture, downloadUrl: "https://example.test/garden.txt" };

for (const [extension, mime] of Object.entries(DOCUMENT_MIME_TYPES)) {
  test(`uploads ${extension} and enters the automatic evaluation path`, async ({
    page,
  }) => {
    await signIn(page);
    let uploads = 0;
    await page.route("**/api/documents/upload", (route) => {
      uploads++;
      expect(route.request().postDataBuffer()?.toString()).toContain(
        `Content-Type: ${mime}`,
      );
      return route.fulfill({ json: response });
    });
    await page.route("**/api/documents/17", (route) =>
      route.fulfill({ json: response }),
    );
    await page.route("**/api/documents/17/content", (route) =>
      route.fulfill({
        json: { id: "17", status: "PROCESSING", extractedText: null },
      }),
    );
    await page.goto("/compositions/new?mode=upload");
    await page
      .getByLabel("Document file", { exact: true })
      .setInputFiles({
        name: `Garden.${extension}`,
        mimeType: mime,
        buffer: Buffer.from("Fictional browser transport fixture"),
      });
    await expect(page).toHaveURL(/\/documents\/17\?evaluate=1$/);
    await expect(
      page.getByRole("heading", { name: "Extracting your document’s text" }),
    ).toBeVisible();
    expect(uploads).toBe(1);
  });
}

test("normalizes missing browser MIME while rejecting invalid, empty and oversized files", async ({
  page,
}) => {
  await signIn(page);
  let uploads = 0;
  await page.route("**/api/documents/upload", (route) => {
    uploads++;
    expect(route.request().postDataBuffer()?.toString()).toContain(
      "Content-Type: text/plain",
    );
    return route.fulfill({
      status: 400,
      json: { message: "Fictional confirmed rejection" },
    });
  });
  await page.goto("/compositions/new?mode=upload");
  const input = page.getByLabel("Document file", { exact: true });
  await input.setInputFiles({
    name: "Empty.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(""),
  });
  await expect(
    page.getByText("This file is empty.", { exact: false }),
  ).toBeVisible();
  await input.setInputFiles({
    name: "Bad.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("No"),
  });
  await expect(
    page.getByText(
      "Choose a PDF, DOCX, PPTX or TXT file with a matching file type.",
    ),
  ).toBeVisible();
  await input.setInputFiles({
    name: "Large.txt",
    mimeType: "text/plain",
    buffer: Buffer.alloc(25 * 1024 * 1024 + 1, 65),
  });
  await expect(
    page.getByText("This file is larger than 25 MB.", { exact: false }),
  ).toBeVisible();
  expect(uploads).toBe(0);
  await input.setInputFiles({
    name: "Garden.TXT",
    mimeType: "",
    buffer: Buffer.from("Our class planted a garden."),
  });
  await expect(page.getByText("Fictional confirmed rejection")).toBeVisible();
  expect(uploads).toBe(1);
  await expect(
    page.getByRole("button", { name: "Retry upload", exact: true }),
  ).toBeVisible();
});

test("uncertain upload retains the file and requires a document-library check", async ({
  page,
}) => {
  await signIn(page);
  let uploads = 0;
  await page.route("**/api/documents/upload", (route) => {
    uploads++;
    return route.abort("failed");
  });
  await page.goto("/compositions/new?mode=upload");
  await page
    .getByLabel("Document file", { exact: true })
    .setInputFiles({
      name: "Garden.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Garden"),
    });
  await expect(
    page.getByRole("link", { name: "Check documents in a new tab" }),
  ).toBeVisible();
  await expect(page.getByText("Garden.txt", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Choose a document to upload" }),
  ).toBeDisabled();
  await page.waitForTimeout(2500);
  expect(uploads).toBe(1);
});

test("automatic evaluation escapes extracted text and creates only one composition", async ({
  page,
}) => {
  await signIn(page);
  let creates = 0;
  let draft = composition(42);
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: extracted },
    }),
  );
  await page.route("**/api/v1/composition", (route) => {
    creates++;
    const payload = route.request().postDataJSON();
    expect(payload.title).toBe("Garden observations");
    expect(payload.content).toBe(
      "<p>Our class planted a garden.</p><p>2 &lt; 3 &amp; 4 &gt; 1<br>&lt;script&gt;This is literal document text.&lt;/script&gt;</p>",
    );
    draft = composition(42, payload);
    return route.fulfill({ json: draft });
  });
  await page.route("**/api/v1/composition/42", (route) =>
    route.fulfill({ json: draft }),
  );
  await page.goto("/documents/17?evaluate=1");
  await expect(page).toHaveURL(/\/compositions\/42$/);
  await expect(page.locator("#composition-text")).toContainText(
    "<script>This is literal document text.</script>",
  );
  expect(creates).toBe(1);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("sllp.doc.17.compositionId"),
    ),
  ).toBe("42");
});

test("confirmed creation failure preserves extracted text and title until deliberate retry", async ({
  page,
}) => {
  await signIn(page);
  let creates = 0;
  let draft = composition(42);
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: extracted },
    }),
  );
  await page.route("**/api/v1/composition", (route) => {
    creates++;
    if (creates === 1)
      return route.fulfill({
        status: 400,
        json: { message: "Please adjust the composition title" },
      });
    draft = composition(42, route.request().postDataJSON());
    return route.fulfill({ json: draft });
  });
  await page.route("**/api/v1/composition/42", (route) =>
    route.fulfill({ json: draft }),
  );
  await page.goto("/documents/17?evaluate=1");
  await expect(
    page.getByText("Please adjust the composition title"),
  ).toBeVisible();
  await page
    .getByLabel("Composition title", { exact: true })
    .fill("A more specific garden title");
  await expect(page.getByText(extracted, { exact: true })).toBeVisible();
  await page.waitForTimeout(2500);
  expect(creates).toBe(1);
  await page
    .getByRole("button", { name: "Retry composition creation" })
    .click();
  await expect(page).toHaveURL(/\/compositions\/42$/);
  expect(draft.title).toBe("A more specific garden title");
  expect(creates).toBe(2);
});

test("an interrupted creation marker prevents another automatic POST after reload", async ({
  page,
}) => {
  await signIn(page);
  let creates = 0;
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: extracted },
    }),
  );
  await page.route("**/api/v1/composition", (route) => {
    creates++;
    return route.abort("failed");
  });
  await page.goto("/documents/17?evaluate=1");
  await expect(
    page.getByRole("link", { name: "Check library in a new tab" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("link", { name: "Check library in a new tab" }),
  ).toBeVisible();
  await page.waitForTimeout(2500);
  expect(creates).toBe(1);
});

test("a valid local association is verified and reused without creation", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.doc.17.compositionId", "42"),
  );
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: extracted },
    }),
  );
  await page.route("**/api/v1/composition/42", (route) =>
    route.fulfill({ json: composition(42) }),
  );
  await page.goto("/documents/17");
  await expect(
    page.getByRole("link", { name: "Open composition" }),
  ).toHaveAttribute("href", "/compositions/42");
  await expect(page.getByText(extracted, { exact: true })).toBeVisible();
  await page.goto("/documents/17?evaluate=1");
  await expect(page).toHaveURL(/\/compositions\/42$/);
});

test("a deleted linked draft offers explicit recovery without a redirect loop", async ({
  page,
}) => {
  await signIn(page);
  await page.addInitScript(() =>
    localStorage.setItem("sllp.doc.17.compositionId", "42"),
  );
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: extracted },
    }),
  );
  await page.route("**/api/v1/composition/42", (route) =>
    route.fulfill({ status: 404, json: { message: "Composition not found" } }),
  );
  await page.goto("/documents/17?evaluate=1");
  await expect(
    page.getByRole("button", { name: "Create a new composition", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/documents\/17\?evaluate=1$/);
  await expect(page.getByText(extracted, { exact: true })).toBeVisible();
});

test("an extraction GET error retries that operation and preserves the uploaded document", async ({
  page,
}) => {
  await signIn(page);
  let fail = true;
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    fail
      ? route.fulfill({
          status: 503,
          json: { message: "Temporary extraction lookup failure" },
        })
      : route.fulfill({
          json: { id: "17", status: "READY", extractedText: extracted },
        }),
  );
  await page.goto("/documents/17");
  await expect(
    page.getByRole("button", { name: "Retry extraction status" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download original" }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Retry extraction status" }).click();
  await expect(page.getByText(extracted, { exact: true })).toBeVisible();
});

test("ready but empty text is explicit; admin inspection cannot create or delete", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  await page.route("**/api/documents/admin/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/admin/17/content", (route) =>
    route.fulfill({ json: { id: "17", status: "READY", extractedText: "" } }),
  );
  await page.goto("/documents/17?context=admin");
  await expect(
    page.getByText("Extraction finished, but no usable text was found.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create composition", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Delete document", exact: true }),
  ).toHaveCount(0);
  await page.route("**/api/documents/17", (route) =>
    route.fulfill({ json: response }),
  );
  await page.route("**/api/documents/17/content", (route) =>
    route.fulfill({
      json: { id: "17", status: "READY", extractedText: "My own document." },
    }),
  );
  await page.goto("/documents/17");
  await expect(
    page.getByRole("button", { name: "Create composition", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Delete document", exact: true }),
  ).toBeVisible();
});

for (const language of ["en", "zh"])
  for (const width of [1440, 1024, 390, 320]) {
    test(`upload and extracted text at ${width}px in ${language}`, async ({
      page,
    }) => {
      await signIn(page, "BASIC", language);
      await page.setViewportSize({ width, height: width >= 1024 ? 900 : 844 });
      await page.goto("/compositions/new?mode=upload");
      await expect(
        page.getByRole("button", {
          name:
            language === "zh"
              ? "选择要上传的文档"
              : "Choose a document to upload",
        }),
      ).toBeVisible();
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T07-upload-${width}-${language}.png`,
        fullPage: true,
      });
      await page.route("**/api/documents/17", (route) =>
        route.fulfill({
          json: {
            ...response,
            document: {
              ...documentFixture,
              filename:
                language === "zh"
                  ? "图书馆旁的小花园——我的观察笔记和接下来的写作计划.txt"
                  : "Garden observations — notes and ideas for my next composition.txt",
            },
          },
        }),
      );
      await page.route("**/api/documents/17/content", (route) =>
        route.fulfill({
          json: {
            id: "17",
            status: "READY",
            extractedText:
              language === "zh"
                ? "我们班在图书馆旁边种了一个花园。\n\n每天清晨，我都能发现细微的变化。\n2 < 3 & 4 > 1"
                : extracted,
          },
        }),
      );
      await page.goto("/documents/17");
      await expect(
        page.getByRole("button", {
          name: language === "zh" ? "创建作文" : "Create composition",
          exact: true,
        }),
      ).toBeEnabled();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/ux-redesign/evidence/T07-document-${width}-${language}.png`,
        fullPage: true,
      });
    });
  }
