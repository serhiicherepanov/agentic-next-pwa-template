import { expect, test } from "@playwright/test";

test("home page and health endpoint work", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /small production starter/i })).toBeVisible();

  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const json = await response.json();
  expect(json).toEqual(
    expect.objectContaining({
      ok: true,
      service: "agentic-next-pwa-template",
    }),
  );

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  expect(manifest.headers()["content-type"]).toMatch(/application\/manifest\+json/u);
});
