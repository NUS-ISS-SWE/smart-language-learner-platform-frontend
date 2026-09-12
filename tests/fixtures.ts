import { test as base, expect, type Page } from "@playwright/test";
import type { Composition } from "../types/composition";
import type { AdminUser } from "../types/admin";

export const composition = (
  id: number,
  overrides: Partial<Composition> = {},
): Composition => ({
  id,
  userId: 7,
  title: id === 1 ? "A garden for our neighbourhood" : "Writing practice " + id,
  content:
    "<p>Our class planted a garden beside the library. Every morning we noticed something new.</p>",
  compositionSource: "RAW_TEXT",
  language: "ENGLISH",
  compositionStatus: "DRAFT",
  createdAt: "2026-09-01T08:00:00Z",
  updatedAt: "2026-09-08T09:00:00Z",
  ...overrides,
});
export const fictionalUser: AdminUser = {
  id: 7,
  username: "Mei Tan",
  email: "mei@example.test",
  role: "BASIC",
  status: "ACTIVE",
  preferredLanguage: "ENGLISH",
  difficultyLevel: "INTERMEDIATE",
  aiTokenBalance: 12000,
  aiTokenUsed: 800,
  createdAt: "2026-09-01T08:00:00Z",
  deletedAt: null,
};

export async function signIn(page: Page, role = "BASIC", language = "en") {
  await page
    .context()
    .addCookies([
      { name: "sllp_auth", value: "1", url: "http://localhost:3006" },
    ]);
  await page.addInitScript(
    ({ role, language }) => {
      localStorage.setItem("sllp.accessToken", "fictional-browser-test-token");
      localStorage.setItem(
        "sllp.user",
        JSON.stringify({ username: "Mei Tan", role }),
      );
      localStorage.setItem("i18nextLng", language);
    },
    { role, language },
  );
}

// Unhandled API requests fail the test; fixtures can never fall through to real user data.
export const test = base.extend<{ apiGuard: void }>({
  apiGuard: [
    async ({ page }, use) => {
      const unhandled: string[] = [];
      await page.route("**/api/**", async (route) => {
        const path = new URL(route.request().url()).pathname;
        if (route.request().method() === "OPTIONS")
          return route.fulfill({ status: 204 });
        if (path === "/api/v1/subscription/current")
          return route.fulfill({
            json: {
              id: 1,
              plan: {
                code: "BASIC",
                displayName: "Basic",
                priceMinor: 0,
                currency: "SGD",
                features: [],
              },
              status: "ACTIVE",
              startDate: "2026-09-01",
              endDate: null,
              durationDays: null,
              createdAt: "2026-09-01T08:00:00Z",
            },
          });
        if (
          path === "/api/v1/composition" &&
          route.request().method() === "GET"
        )
          return route.fulfill({ json: [composition(1)] });
        if (path === "/api/documents")
          return route.fulfill({
            json: {
              documents: [],
              total: 0,
              page: 0,
              pageSize: 20,
              hasMore: false,
            },
          });
        if (path === "/api/v1/admin/users")
          return route.fulfill({
            json: {
              content: [fictionalUser],
              totalElements: 1,
              totalPages: 1,
              number: 0,
              size: 20,
            },
          });
        unhandled.push(route.request().method() + " " + path);
        await route.abort("blockedbyclient");
      });
      await use();
      expect(
        unhandled,
        "Every API request must have an explicit fictional fixture",
      ).toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
