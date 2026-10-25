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
  await expect(page.locator(".radar-base")).toBeVisible();
  await expect(page.locator(".radar-caption")).toContainText("mm/10min");
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

test("GPS lookup uses this browser location and can return to the saved place", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({
    latitude: 50.85,
    longitude: 4.35,
    accuracy: 15,
  });
  await open(page);
  await page.evaluate((sample) => {
    window.weatherRequests = [];
    document.querySelector("atmosphere-card").hass = {
      user: { id: "viewer" },
      states: {
        "weather.malle_weather": {
          entity_id: "weather.malle_weather",
          state: "cloudy",
          attributes: {
            atmosphere_entry_id: "preview",
            updated_at: sample.updated_at,
          },
        },
      },
      callWS: async (command) => {
        window.weatherRequests.push(command);
        return {
          ...sample,
          name: command.type === "atmosphere/location" ? "Brussel" : "Malle",
        };
      },
    };
  }, sample);
  await page
    .getByRole("button", { name: "Huidige locatie", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Brussel", exact: true }),
  ).toBeVisible();
  const request = await page.evaluate(() =>
    window.weatherRequests.find((r) => r.type === "atmosphere/location"),
  );
  expect(request.latitude).toBe(50.85);
  expect(request.longitude).toBe(4.35);
  await page
    .getByRole("button", { name: "Opgeslagen locatie", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Malle", exact: true }),
  ).toBeVisible();
});

test("Companion fallback chooses only the signed-in viewer GPS tracker", async ({
  page,
}) => {
  await open(page);
  await page.evaluate((sample) => {
    window.externalApp = {};
    window.weatherRequests = [];
    const now = new Date().toISOString();
    const state = (id, attrs) => ({
      entity_id: id,
      state: "home",
      attributes: attrs,
      last_updated: now,
    });
    document.querySelector("atmosphere-card").hass = {
      user: { id: "viewer-b" },
      states: {
        "weather.malle_weather": state("weather.malle_weather", {
          atmosphere_entry_id: "preview",
          updated_at: sample.updated_at,
        }),
        "person.a": state("person.a", {
          user_id: "viewer-a",
          device_trackers: ["device_tracker.phone_a"],
        }),
        "person.b": state("person.b", {
          user_id: "viewer-b",
          device_trackers: ["device_tracker.phone_b"],
        }),
        "device_tracker.phone_a": state("device_tracker.phone_a", {
          source_type: "gps",
          latitude: 50.8,
          longitude: 4.3,
          gps_accuracy: 10,
          friendly_name: "Phone A",
        }),
        "device_tracker.phone_b": state("device_tracker.phone_b", {
          source_type: "gps",
          latitude: 51.1,
          longitude: 4.7,
          gps_accuracy: 20,
          friendly_name: "Phone B",
        }),
      },
      callWS: async (command) => {
        window.weatherRequests.push(command);
        return {
          ...sample,
          name:
            command.type === "atmosphere/location"
              ? "Phone B location"
              : "Malle",
        };
      },
    };
  }, sample);
  await page
    .getByRole("button", { name: "Huidige locatie", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Phone B location", exact: true }),
  ).toBeVisible();
  const request = await page.evaluate(() =>
    window.weatherRequests.find((r) => r.type === "atmosphere/location"),
  );
  expect(request.latitude).toBe(51.1);
  expect(request.longitude).toBe(4.7);
  await expect(page.locator(".location-note")).toContainText("Phone B");
});

test("visible panels reflow in a compact card and radar zooms around the location", async ({
  page,
}) => {
  await open(page);
  await page.setViewportSize({ width: 240, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() =>
    document
      .querySelector("atmosphere-card")
      .setConfig({
        entity: "weather.malle_weather",
        show: ["hourly", "wind", "radar"],
      }),
  );
  await expect(page.locator(".hero")).not.toBeVisible();
  await expect(page.locator(".daily")).not.toBeVisible();
  await expect(page.locator(".moon-panel")).not.toBeVisible();
  await expect(page.locator(".hourly")).toBeVisible();
  await expect(page.locator("[data-section=wind]")).toBeVisible();
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  const before = await page
    .locator(".radar-layers")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.getByRole("button", { name: "Inzoomen", exact: true }).click();
  const after = await page
    .locator(".radar-layers")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(before).not.toBe(after);
});

test("sky motion freezes while hidden and resumes without elapsed-time catchup", async ({
  page,
}) => {
  await page.clock.install();
  await open(page);
  await page.clock.runFor(5000);
  const before = await page
    .locator(".clouds.far")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(10 * 60000);
  expect(
    await page
      .locator(".clouds.far")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(before);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(16);
  expect(
    await page
      .locator(".clouds.far")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(before);
  await page.clock.runFor(1000);
  expect(
    await page
      .locator(".clouds.far")
      .evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe(before);
});
