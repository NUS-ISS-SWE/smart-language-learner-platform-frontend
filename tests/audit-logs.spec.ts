import { test, expect, signIn } from "./fixtures";

test("an audit entry expands to show its redacted event data", async ({ page }) => {
  await signIn(page, "ADMIN");
  await page.route("**/api/v1/admin/audit-events**", (route) =>
    route.fulfill({
      json: {
        content: [
          {
            id: "99e9a0e1-8b8f-4f4e-bc3d-1f0e41f4d3b6",
            occurredAt: "2026-09-19T08:32:00Z",
            service: "composition-service",
            category: "DATA_CHANGE",
            action: "HTTP_POST_API_V1_COMPOSITION_GENERATE",
            outcome: "FAILURE",
            actorType: "USER",
            actorId: "1",
            actorName: "Mei Tan",
            actorRole: "BASIC",
            targetType: "HTTP_RESOURCE",
            targetId: "/api/v1/composition/generate",
            requestId: null,
            correlationId: null,
            sourceIp: "127.0.0.1",
            userAgent: "Playwright",
            httpMethod: "POST",
            httpPath: "/api/v1/composition/generate",
            httpStatus: 400,
            beforeData: null,
            afterData: null,
            metadata: {},
            errorCode: null,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 25,
      },
    }),
  );

  await page.goto("/admin/audit-logs");
  const toggle = page.getByRole("button", {
    name: "Show details for HTTP_POST_API_V1_COMPOSITION_GENERATE",
  });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Event data")).toBeVisible();
  await expect(page.locator("pre")).toContainText('"httpStatus": 400');
  await expect(page.locator("pre")).toContainText('"metadata": {}');
});
