import { existsSync } from "node:fs";
import { test, expect, signIn } from "./fixtures";

// Audit logging is an independent incoming working-tree feature. Retain and
// check its navigation when that route is present, without bundling it into UX.
const auditRouteExists = existsSync("app/(admin)/admin/audit-logs/page.tsx");

test("reflows at the CSS viewport equivalent of 200% desktop zoom", async ({
  page,
}) => {
  await signIn(page, "ADMIN", "zh");
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/admin/users");
  const trigger = page.getByRole("button", { name: "打开导航" });
  await trigger.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByRole("link", { name: "使用数据" })).toBeVisible();
  if (auditRouteExists) await expect(drawer.getByRole("link", { name: "审计日志" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(720);
  await page.screenshot({
    path: "docs/ux-redesign/evidence/T02-admin-reflow-720-zh.png",
  });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "账户选项" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to English" }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/ux-redesign/evidence/T02-admin-account-720-zh.png",
  });
});

test("admin sidebar maximum width and mobile transition preserve navigation", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/admin/users");
  const resize = page.getByRole("separator", { name: "Resize sidebar" });
  await resize.focus();
  await page.keyboard.press("End");
  await expect(resize).toHaveAttribute("aria-valuenow", "420");
  await page.reload();
  await expect(resize).toHaveAttribute("aria-valuenow", "420");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1024);
  await page.screenshot({
    path: "docs/ux-redesign/evidence/T02-admin-max-sidebar-1024-en.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("persists keyboard and pointer sidebar resizing", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard");
  const resize = page.getByRole("separator", { name: "Resize sidebar" });
  await expect(resize).toHaveAttribute("aria-valuenow", "280");
  await resize.focus();
  await page.keyboard.press("ArrowRight");
  await expect(resize).toHaveAttribute("aria-valuenow", "296");
  await page.reload();
  await expect(resize).toHaveAttribute("aria-valuenow", "296");
  await resize.focus();
  await page.keyboard.press("End");
  await expect(resize).toHaveAttribute("aria-valuenow", "420");
  await page.keyboard.press("Home");
  await expect(resize).toHaveAttribute("aria-valuenow", "224");
  const box = (await resize.boundingBox())!;
  await page.mouse.move(box.x + 4, 200);
  await page.mouse.down();
  await page.mouse.move(box.x + 44, 200);
  await page.mouse.up();
  await expect(resize).toHaveAttribute("aria-valuenow", "264");
});

test("mobile drawer traps focus, closes with Escape and retains admin destinations", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/users");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(drawer).toBeVisible();
  if (auditRouteExists) await expect(
    drawer.getByRole("link", { name: "Audit logs" }),
  ).toHaveAttribute("href", "/admin/audit-logs");
  await expect(
    drawer.getByRole("link", { name: "Users", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await drawer.getByRole("link", { name: "About this platform" }).focus();
  await page.keyboard.press("Tab");
  expect(
    await drawer.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await drawer.getByRole("link", { name: "Back to writing" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(drawer).not.toBeVisible();
  await page.getByRole("button", { name: "Account options" }).click();
  await expect(
    page.getByRole("link", { name: "Subscription", exact: true }).first(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Account options" }),
  ).toBeFocused();
});

test("records editor and admin body baselines before their redesign", async ({
  page,
}) => {
  await signIn(page, "ADMIN");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/compositions/new");
  await expect(page.locator(".tiptap")).toBeVisible();
  if (!existsSync("docs/ux-redesign/evidence/T00-editor-body-before-en.png"))
    await page.screenshot({
      path: "docs/ux-redesign/evidence/T00-editor-body-before-en.png",
      fullPage: true,
    });
  await page.goto("/admin/users");
  await expect(page.getByText("mei@example.test")).toBeVisible();
  if (
    !existsSync("docs/ux-redesign/evidence/T00-admin-users-body-before-en.png")
  )
    await page.screenshot({
      path: "docs/ux-redesign/evidence/T00-admin-users-body-before-en.png",
      fullPage: true,
    });
});
