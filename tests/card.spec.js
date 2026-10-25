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
    ".metrics .panel:visible",
    ".moon-panel",
    ".condition",
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
    const panels = page.locator(".metrics .panel:visible");
    await expect(panels).toHaveCount(4);
    for (let i = 0; i < 4; i++) await expect(panels.nth(i)).toBeVisible();
    const headings = await panels
      .locator("h2")
      .evaluateAll((nodes) =>
        nodes.slice(0, 2).map((node) => node.getBoundingClientRect().top),
      );
    expect(Math.abs(headings[0] - headings[1])).toBeLessThan(1);
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

test("interactive radar and wind load only on request and switch directly", async ({
  page,
}) => {
  const maps = [];
  page.on("request", (r) => {
    if (r.url().includes("embed.windy.com")) maps.push(r.url());
  });
  await page.route("https://embed.windy.com/**", (r) =>
    r.fulfill({ body: "<h1>Weather map</h1>" }),
  );
  await open(page);
  expect(maps).toEqual([]);
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await expect(page.locator("dialog iframe")).toHaveAttribute(
    "src",
    /overlay=radar/,
  );
  await page.getByRole("button", { name: "Windkaart", exact: true }).click();
  await expect(page.locator("dialog iframe")).toHaveAttribute(
    "src",
    /overlay=wind/,
  );
  await page
    .getByRole("button", { name: "Neerslag · Verwachting", exact: true })
    .click();
  await expect(page.locator("dialog iframe")).toHaveAttribute(
    "src",
    /overlay=rain/,
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(page.locator("dialog iframe")).toHaveCount(0);
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
  await expect(page.locator("dialog iframe")).toBeVisible();
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
          device_trackers: ["device_tracker.phone_b", "device_tracker.phone_c"],
        }),
        "device_tracker.phone_c": state("device_tracker.phone_c", {
          source_type: "gps",
          latitude: 51.2,
          longitude: 4.9,
          gps_accuracy: 15,
          friendly_name: "Other device",
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
  await page.route("https://embed.windy.com/**", (r) =>
    r.fulfill({ body: "Map" }),
  );
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await page.getByRole("button", { name: "Sluiten", exact: true }).click();
  await page
    .getByRole("button", { name: "Huidige locatie", exact: true })
    .click();
  await expect(page.locator("dialog")).not.toHaveClass(/map-dialog/);
  await page.getByRole("button", { name: /Phone B/ }).click();
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
    document.querySelector("atmosphere-card").setConfig({
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
  await expect(page.locator("dialog iframe")).toHaveAttribute("src", /zoom=11/);
  await expect(page.locator(".radar-layers")).toHaveCount(0);
});

test("sky motion freezes while hidden and resumes without elapsed-time catchup", async ({
  page,
}) => {
  const time = Date.now();
  await page.clock.install({ time: new Date(time) });
  await page.clock.pauseAt(new Date(time + 1000));
  await open(page);
  await page.clock.runFor(5000);
  // Capture and hide atomically so a queued RAF cannot run between observations.
  const before = await page.evaluate(() => {
    const cloud = document
      .querySelector("atmosphere-card")
      .shadowRoot.querySelector(".clouds.far");
    const snapshot = getComputedStyle(cloud).transform;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    return snapshot;
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

test("detailed maps open directly and graph geometry has continuous curves", async ({
  page,
}) => {
  await open(page, (d) => ({
    ...d,
    hourly: d.hourly.map((h, i) => ({
      ...h,
      temperature: [5, 18, 5, 18, 5, 18][i % 6],
    })),
  }));
  await page.locator(".hour").first().click();
  const smooth = await page
    .locator("dialog .detail-chart svg")
    .evaluate((svg) => {
      const curve = svg.querySelector("path[data-forecast-curve],polyline");
      if (!curve) return false;
      const length = curve.getTotalLength();
      let previous = null,
        maxTurn = 0;
      for (let t = 1; t < length - 1; t += 1) {
        const a = curve.getPointAtLength(t - 1),
          b = curve.getPointAtLength(t + 1);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        if (previous !== null)
          maxTurn = Math.max(maxTurn, Math.abs(angle - previous));
        previous = angle;
      }
      return maxTurn < 0.65;
    });
  expect(smooth).toBe(true);
  await page.getByRole("button", { name: "Sluiten", exact: true }).click();
  await page.route("https://embed.windy.com/**", (r) =>
    r.fulfill({ body: "<h1>Weather map</h1>" }),
  );
  await page.getByRole("button", { name: "Regenkaart", exact: false }).click();
  await expect(page.locator("dialog iframe")).toBeVisible();
  await expect(page.locator("dialog iframe")).toHaveAttribute("src", /zoom=11/);
});

test("SVG controls are centered and sparse metrics are combined in current conditions", async ({
  page,
}) => {
  await open(page);
  await expect(page.locator("[data-section=humidity]")).not.toBeVisible();
  await expect(page.locator("[data-section=visibility]")).not.toBeVisible();
  await expect(page.locator("[data-section=pressure]")).not.toBeVisible();
  await expect(page.locator("[data-section=feels]")).not.toBeVisible();
  for (const width of [1440, 390, 240]) {
    await page.setViewportSize({ width, height: 1000 });
    const offsets = await page
      .locator(".segmented button,.location-pin,.motion")
      .evaluateAll((buttons) =>
        buttons.map((button) => {
          const b = button.getBoundingClientRect(),
            s = button.querySelector("svg")?.getBoundingClientRect();
          return s
            ? Math.max(
                Math.abs(b.x + b.width / 2 - s.x - s.width / 2),
                Math.abs(b.y + b.height / 2 - s.y - s.height / 2),
              )
            : Infinity;
        }),
      );
    expect(Math.max(...offsets)).toBeLessThan(0.6);
  }
  await page.locator(".condition").click();
  await expect(page.locator("dialog")).toContainText("Luchtvochtigheid");
  await expect(page.locator("dialog")).toContainText("Luchtdruk");
  const offset = await page.locator(".close").evaluate((button) => {
    const b = button.getBoundingClientRect(),
      s = button.querySelector("svg").getBoundingClientRect();
    return Math.abs(b.y + b.height / 2 - s.y - s.height / 2);
  });
  expect(offset).toBeLessThan(0.6);
});

test("condition-specific skies render day, night, rain and snow effects", async ({
  page,
}) => {
  await page.clock.install();
  for (const [condition, night] of [
    ["sunny", false],
    ["clear-night", true],
    ["rainy", false],
    ["snowy", false],
  ]) {
    await open(page, (d) => ({
      ...d,
      current: { ...d.current, condition },
      sun: {
        ...d.sun,
        sunrise: new Date(
          Date.now() + (night ? 3600000 : -3600000),
        ).toISOString(),
        sunset: new Date(Date.now() + 7200000).toISOString(),
      },
    }));
    await page.clock.runFor(5000);
    await expect
      .poll(
        async () => {
          await page.clock.runFor(50);
          return page.locator(".precipitation").evaluate((canvas) => {
            const pixels = canvas
              .getContext("2d")
              .getImageData(0, 0, canvas.width, canvas.height).data;
            return pixels.some((v, i) => i % 4 === 3 && v > 0);
          });
        },
        { message: condition, timeout: 4000 },
      )
      .toBe(true);
    await expect(page.locator(".atmosphere")).toHaveAttribute(
      "data-night",
      String(night),
    );
    await page.screenshot({
      path: `screenshots/sky-${condition}.png`,
      fullPage: false,
    });
  }
});

test("lunar surface renders with the correct illuminated hemisphere across phases", async ({
  page,
}) => {
  // Fixed astronomical dates cover both terminator directions and the two extremes.
  for (const [date, phase] of [
    ["2026-10-18", "waxing"],
    ["2026-10-26", "full"],
    ["2026-11-01", "waning"],
    ["2026-11-09", "new"],
  ]) {
    await page.clock.install({ time: new Date(`${date}T12:00:00Z`) });
    await open(page);
    await page.locator(".moon-panel").click();
    const moon = page.locator(".detail-moon");
    await expect
      .poll(() =>
        moon.evaluate((canvas) => {
          const { data } = canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, canvas.height);
          return data.some((value, index) => index % 4 === 3 && value > 0);
        }),
      )
      .toBe(true);
    const brightness = await moon.evaluate((canvas) => {
      const w = canvas.width,
        pixels = canvas.getContext("2d").getImageData(0, 0, w, w).data;
      let left = 0,
        right = 0,
        count = 0;
      for (let y = w * 0.25; y < w * 0.75; y++) {
        for (let x = w * 0.25; x < w * 0.5; x++) {
          left += pixels[(y * w + x) * 4];
          right += pixels[(y * w + w - 1 - x) * 4];
          count++;
        }
      }
      return { left: left / count, right: right / count };
    });
    if (phase === "waxing")
      expect(brightness.right).toBeGreaterThan(brightness.left * 5);
    if (phase === "waning")
      expect(brightness.left).toBeGreaterThan(brightness.right * 5);
    if (phase === "full") {
      expect(Math.min(brightness.left, brightness.right)).toBeGreaterThan(70);
      await page
        .locator("dialog")
        .screenshot({ path: "screenshots/moon-realistic.png" });
    }
    if (phase === "new")
      expect(Math.max(brightness.left, brightness.right)).toBeLessThan(12);
    await page.clock.resume();
  }
});

test("detail panels preserve focus and motion preferences across pointer and keyboard use", async ({
  page,
}) => {
  await open(page);
  const trigger = page.locator(".condition"),
    dialog = page.locator("dialog");
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator(".close")).toBeFocused();
  expect(
    await dialog.evaluate((el) =>
      parseFloat(getComputedStyle(el).transitionDuration),
    ),
  ).toBeGreaterThan(0);
  await page.locator(".close").click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".moon-panel").click();
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).isIdentity,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await page.locator(".rain-total").click();
  await expect(dialog).toContainText("mm");
});
