import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const sample = JSON.parse(
  readFileSync(new URL("./live-sample.json", import.meta.url)),
);
async function open(page, transform = (d) => d) {
  const data = transform(structuredClone(sample));
  data.updated_at = new Date().toISOString();
  await page.route("**/tests/live-sample.json", (r) =>
    r.fulfill({ json: data }),
  );
  await page.goto("/preview.html");
  await expect(
    page.getByRole("heading", { name: "Malle", exact: true }),
  ).toBeVisible();
}

test("live provider sample renders responsive forecasts and every detail interaction", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1400 });
  await open(page);
  await expect(page.getByRole("button", { name: /Stormtij/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Neerslag", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Neerslag", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Wind", exact: true }).first().click();
  await page.getByRole("button", { name: "Temperatuur", exact: true }).click();
  for (const selector of [
    ".warning",
    ".day",
    ".hour",
    ".metrics .panel",
    ".moon-panel",
    ".small-metrics .panel",
  ]) {
    await page.locator(selector).first().click();
    await expect(page.locator("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Sluiten", exact: true }).click();
    await expect(page.locator("dialog")).not.toBeVisible();
  }
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1400 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const panels = page.locator(".metrics .panel");
    for (let i = 0; i < 6; i++) await expect(panels.nth(i)).toBeVisible();
    await page.setViewportSize({
      width,
      height: await page.evaluate(() => document.documentElement.scrollHeight),
    });
    await page.screenshot({
      path: `screenshots/preview-${width}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("warning outage never claims there are no warnings", async ({ page }) => {
  await open(page, (d) => ({ ...d, available: false, warnings: [] }));
  await expect(page.getByRole("status")).toContainText(
    "Waarschuwingsstatus niet beschikbaar",
  );
  await page.locator(".warning").click();
  await expect(page.locator("dialog")).toContainText(
    "Waarschuwingsstatus niet beschikbaar",
  );
  await expect(page.locator("dialog")).not.toContainText(
    "Geen lokale waarschuwingen",
  );
});

test("radar scrubs provider frames and opens maps only on request", async ({
  page,
}) => {
  const maps = [];
  page.on("request", (r) => {
    if (r.url().includes("embed.windy.com")) maps.push(r.url());
  });
  await page.route("https://**.meteo.be/**", (r) =>
    r.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#466b84"/></svg>',
    }),
  );
  await open(page);
  expect(maps).toEqual([]);
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await expect(page.locator(".radar-frame")).toBeVisible();
  await page.locator(".radar-slider").fill("10");
  await expect(page.locator(".radar-time")).not.toBeEmpty();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await page.route("https://embed.windy.com/**", (r) =>
    r.fulfill({ body: "<h1>Windy map endpoint</h1>" }),
  );
  await page.getByRole("button", { name: "Windkaart", exact: true }).click();
  await expect(page.locator(".map-host iframe")).toHaveAttribute(
    "src",
    /overlay=wind/,
  );
  await expect.poll(() => maps.length).toBeGreaterThan(0);
});

test("reduced motion, missing optional sources, empty radar and weather changes are safe", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, (d) => ({
    ...d,
    current: {
      ...d.current,
      condition: "snowy",
      apparent_temperature: null,
      humidity: null,
    },
    air: {},
    radar: { frames: [], overlay: null },
  }));
  await expect(page.locator(".atmosphere")).toHaveClass(/paused/);
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await expect(page.locator("dialog")).toContainText(
    "Radarbeeld niet beschikbaar",
  );
  await page.keyboard.press("Escape");
  await page.locator(".moon-panel").click();
  await expect(page.locator(".detail-moon")).toBeVisible();
});
