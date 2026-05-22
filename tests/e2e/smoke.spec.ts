import { test, expect } from "@playwright/test";

// saas-001 = "Churn Whisperer" (first entry in the SAAS array)
const KNOWN_PROJECT_ID = "saas-001";
const KNOWN_PROJECT_TITLE = "Churn Whisperer";

test.describe("Deep link — /?project=<id>", () => {
  test("opens the correct project modal on load", async ({ page }) => {
    await page.goto(`/?project=${KNOWN_PROJECT_ID}`);
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 6000 });
    await expect(
      modal.getByRole("heading", { name: KNOWN_PROJECT_TITLE }),
    ).toBeVisible();
    await expect(
      modal.getByRole("button", { name: /copy build prompt/i }),
    ).toBeVisible();
  });

  test("ignores an invalid project ID — no modal, page still loads", async ({
    page,
  }) => {
    await page.goto("/?project=not-a-real-id-xyz");
    // Give the page time to settle
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    // Grid of project cards should still be present
    await expect(
      page.locator("article").first(),
    ).toBeVisible({ timeout: 6000 });
  });

  test("closing via Escape removes the query param", async ({ page }) => {
    await page.goto(`/?project=${KNOWN_PROJECT_ID}`);
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 6000 });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 4000 });
    // router.replace is async — wait for the URL to settle
    await page.waitForURL((url) => !url.href.includes("project="), { timeout: 4000 });
  });

  test("closing via the × button removes the query param", async ({ page }) => {
    await page.goto(`/?project=${KNOWN_PROJECT_ID}`);
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 6000 });
    await modal.getByRole("button", { name: "Close" }).click();
    await expect(modal).not.toBeVisible({ timeout: 4000 });
    await page.waitForURL((url) => !url.href.includes("project="), { timeout: 4000 });
  });
});

test.describe("Slot machine — Surprise Me flow", () => {
  test("clicking Surprise Me eventually shows a project modal", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const surpriseBtn = page.getByRole("button", { name: /surprise me/i });
    await expect(surpriseBtn).toBeVisible({ timeout: 6000 });
    await surpriseBtn.click();

    // Slot machine runs for ~2.5 s (18 frames × ~140 ms) then opens the modal
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 12000 });

    // Modal should show a real project (has a copy-prompt button and a heading)
    await expect(
      modal.getByRole("button", { name: /copy build prompt/i }),
    ).toBeVisible();
    await expect(modal.getByRole("heading").first()).toBeVisible();
  });

  test("Surprise Me button is disabled while the slot machine is running", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const surpriseBtn = page.getByRole("button", { name: /surprise me/i });
    await surpriseBtn.click();

    // Button should be disabled immediately after click
    await expect(surpriseBtn).toBeDisabled();

    // Wait for modal to appear (slot machine finished)
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 12000 });
  });
});
