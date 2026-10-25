import SunCalc from "suncalc";

const weatherEffects = {
  sunny: ["sunbeams", "light-motes"],
  "clear-night": ["star-twinkle", "shooting-stars"],
  partlycloudy: ["cloud-parallax", "cloud-edge-light"],
  cloudy: ["cloud-parallax", "rolling-cloud-bank"],
  rainy: ["rain-streaks", "rain-ripples"],
  pouring: ["dense-rain", "rain-ripples"],
  snowy: ["falling-snow", "snow-eddies"],
  "snowy-rainy": ["rain-streaks", "falling-snow"],
  lightning: ["lightning-branches", "cloud-illumination"],
  "lightning-rainy": ["lightning-branches", "rain-streaks"],
  fog: ["mist-ribbons", "rolling-cloud-bank"],
  windy: ["wind-streams", "gust-parallax"],
  "windy-variant": ["wind-streams", "gust-parallax"],
  hail: ["falling-hail", "hail-bounces"],
  exceptional: ["cloud-parallax", "wind-streams"],
};
const timeEffects = {
  dawn: ["horizon-bloom", "rising-rays"],
  day: ["daylight-drift", "solar-haze"],
  dusk: ["twilight-ribbons", "horizon-afterglow"],
  night: ["night-airglow", "lunar-haze"],
};

export function skyState(data, now = Date.now()) {
  const sun = data.sun || {},
    rise = +new Date(sun.sunrise),
    set = +new Date(sun.sunset);
  const dawn = +new Date(sun.dawn),
    dusk = +new Date(sun.dusk);
  const night = now < rise || now >= set;
  const period =
    now >= dawn && now < rise
      ? "dawn"
      : now >= set && now < dusk
        ? "dusk"
        : night
          ? "night"
          : "day";
  const condition = data.current.condition || "cloudy";
  const events = [];
  if (
    (data.warnings || []).some(
      (w) => +new Date(w.starts_at) <= now && +new Date(w.ends_at) > now,
    )
  )
    events.push("warning");
  if (
    !/rain|pour|snow|hail|lightning/.test(condition) &&
    (data.rain || []).some(
      (r) =>
        +new Date(r.datetime) > now &&
        +new Date(r.datetime) < now + 20 * 60000 &&
        (r.precipitation > 0 || r.might_rain),
    )
  )
    events.push("incoming-rain");
  if (Math.abs(now - rise) < 25 * 60000) events.push("sunrise");
  if (Math.abs(now - set) < 25 * 60000) events.push("sunset");
  const moon = SunCalc.getMoonIllumination(new Date(now));
  if (night && moon.fraction >= 0.995) events.push("full-moon");
  if (night && moon.fraction <= 0.01) events.push("new-moon");
  if (data.current.temperature >= 30) events.push("heat");
  if (data.current.temperature <= 0) events.push("frost");
  if (data.current.wind_gust_speed >= 50) events.push("gusts");
  return {
    condition,
    period,
    night,
    events,
    effects: [
      ...(weatherEffects[condition] || weatherEffects.cloudy),
      ...timeEffects[period],
    ],
  };
}

// All accents share the card's active-time clock: no independent timers or catch-up.
export function drawSkyAccents(ctx, scene, t, wind, width, height) {
  const { condition, period, events } = scene;
  const has = (effect) => scene.effects.includes(effect);
  ctx.save();
  const ribbon = (y, colour, alpha, amplitude = 12) => {
    ctx.beginPath();
    ctx.moveTo(-40, y);
    for (let x = -40; x <= width + 40; x += 12)
      ctx.lineTo(x, y + Math.sin(x / 100 + t / 4) * amplitude);
    ctx.strokeStyle = colour;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 18;
    ctx.stroke();
  };
  if (has("mist-ribbons")) {
    for (let i = 0; i < 4; i++)
      ribbon(70 + i * 45 + Math.sin(t / 7 + i) * 20, "#e2edf2", 0.06, 18);
  }
  if (has("rain-ripples")) {
    for (let i = 0; i < 12; i++) {
      const life = (t * 0.65 + i * 0.13) % 1;
      ctx.beginPath();
      ctx.ellipse(
        ((i * 0.618 + Math.floor(t / 3) * 0.03) % 1) * width,
        height * (0.55 + (i % 4) * 0.09),
        3 + life * 22,
        1 + life * 5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "#cae8f4";
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = (1 - life) * 0.16;
      ctx.stroke();
    }
  }
  if (
    has("snow-eddies") ||
    (condition === "snowy-rainy" && has("falling-snow"))
  ) {
    for (let i = 0; i < 22; i++) {
      const x =
        (((i * 0.618 * width + Math.sin(t / 2 + i) * 25 - t * wind * 11) %
          width) +
          width) %
        width;
      const y = (i * 37 + t * 13) % height;
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#f4fbff";
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (has("falling-hail")) {
    for (let i = 0; i < 28; i++) {
      const life = (t * 1.2 + i * 0.137) % 1;
      const landing = height * (0.6 + (i % 5) * 0.07);
      const y =
        life < 0.7
          ? (life / 0.7) ** 2 * landing
          : landing -
            (has("hail-bounces")
              ? Math.sin(((life - 0.7) / 0.3) * Math.PI) * 22
              : 0);
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#e7f5ff";
      ctx.beginPath();
      ctx.arc(
        ((i * 0.618) % 1) * width - life * wind * 8,
        y,
        1.8 + (i % 2),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  if (has("lightning-branches")) {
    const phase = (t + 2) % 15;
    if (phase < 1.8) {
      // One broad, low-contrast illumination every 15 active seconds; no strobe.
      const envelope = Math.sin((phase / 1.8) * Math.PI);
      if (has("cloud-illumination")) {
        ctx.globalAlpha = envelope * 0.08;
        ctx.fillStyle = "#dbe6ff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.globalAlpha = envelope * 0.6;
      ctx.strokeStyle = "#e4edff";
      ctx.lineWidth = 1.3;
      const x = width * 0.72;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x - 18, 55);
      ctx.lineTo(x + 2, 51);
      ctx.lineTo(x - 28, 116);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 11, 77);
      ctx.lineTo(x + 17, 88);
      ctx.lineTo(x + 7, 110);
      ctx.stroke();
    }
  }
  if (has("wind-streams") || events.includes("gusts")) {
    for (let i = 0; i < 8; i++) {
      const x = ((t * 75 * wind + i * 113) % (width + 180)) - 180;
      ctx.globalAlpha = 0.11;
      ctx.strokeStyle = "#d8ecf4";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, 35 + i * 30);
      ctx.bezierCurveTo(
        x + 40,
        23 + i * 30,
        x + 75,
        49 + i * 30,
        x + 130,
        35 + i * 30,
      );
      ctx.stroke();
    }
  }
  if (has("twilight-ribbons") || has("horizon-bloom")) {
    for (let i = 0; i < 3; i++)
      ribbon(
        height * 0.72 + i * 14,
        period === "dawn" ? "#ffd8a1" : "#e3b4c7",
        0.035 + 0.02 * Math.sin(t / 5 + i),
        9,
      );
  }
  if (scene.night && !/rain|pour|snow|lightning|hail/.test(condition)) {
    // Twinkle remains visible in calm daylight-coded night conditions as well.
    for (let i = 0; i < 36; i++) {
      ctx.globalAlpha =
        (0.18 + 0.2 * Math.sin(t * 0.8 + i * 2.4)) *
        (condition === "cloudy" ? 0.3 : 1);
      ctx.fillStyle = "#edf6ff";
      ctx.beginPath();
      ctx.arc(
        ((i * 0.618) % 1) * width,
        15 + ((i * 31) % (height * 0.55)),
        0.65,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  if (events.includes("incoming-rain"))
    ribbon(height * 0.8, "#abd9ed", 0.09 * (0.5 + 0.5 * Math.sin(t / 3)), 5);
  if (events.includes("frost")) {
    for (let i = 0; i < 10; i++) {
      const x = ((i * 0.618) % 1) * width,
        y = height - 25 - (i % 3) * 12;
      ctx.globalAlpha = 0.12 * (0.5 + 0.5 * Math.sin(t / 2 + i));
      ctx.strokeStyle = "#d7f5ff";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.lineTo(x + 3, y);
      ctx.moveTo(x, y - 3);
      ctx.lineTo(x, y + 3);
      ctx.stroke();
    }
  }
  if (events.includes("new-moon")) {
    for (let i = 0; i < 24; i++) {
      ctx.globalAlpha = 0.08 + 0.1 * (0.5 + 0.5 * Math.sin(t / 3 + i));
      ctx.fillStyle = "#dbeaff";
      ctx.fillRect(
        ((i * 0.381) % 1) * width,
        12 + ((i * 7) % (height * 0.6)),
        1,
        1,
      );
    }
  }
  if (events.includes("heat")) ribbon(height * 0.85, "#f5d4a3", 0.05, 7);
  ctx.restore();
}
