import SunCalc from "suncalc";
import { styles } from "./styles.js";

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const num = (v, digits = 0) =>
  v == null || !Number.isFinite(Number(v)) ? "—" : Number(v).toFixed(digits);
const valid = (v) => v != null && Number.isFinite(Number(v));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const conditions = {
  sunny: ["Sunny", "Zonnig"],
  "clear-night": ["Clear", "Helder"],
  partlycloudy: ["Partly cloudy", "Wisselend bewolkt"],
  cloudy: ["Cloudy", "Bewolkt"],
  rainy: ["Rain", "Regen"],
  pouring: ["Heavy rain", "Zware regen"],
  snowy: ["Snow", "Sneeuw"],
  "snowy-rainy": ["Sleet", "Natte sneeuw"],
  lightning: ["Thunderstorms", "Onweer"],
  "lightning-rainy": ["Thunderstorms", "Onweer"],
  fog: ["Fog", "Mist"],
  windy: ["Windy", "Winderig"],
  "windy-variant": ["Windy", "Winderig"],
  hail: ["Hail", "Hagel"],
  exceptional: ["Severe weather", "Zwaar weer"],
};
const words = {
  en: {
    hourly: "Hourly forecast",
    daily: "Daily forecast",
    feels: "Feels like",
    sunset: "Sunset",
    sunrise: "Sunrise",
    air: "Air quality",
    wind: "Wind",
    uv: "UV index",
    rain: "Precipitation",
    humidity: "Humidity",
    visibility: "Visibility",
    pressure: "Pressure",
    moon: "Moon",
    radar: "Rain radar",
    now: "Now",
    today: "Today",
    tomorrow: "Tomorrow",
    high: "H",
    low: "L",
    gusts: "Gusts",
    dew: "Dew point",
    warnings: "Weather warnings",
    clear: "No local warnings",
    unavailable: "Weather unavailable",
    stale: "Forecast out of date",
    warnUnavailable: "Warning status unavailable",
    upcoming: "Upcoming",
    active: "Active",
    until: "until",
    from: "from",
    close: "Close",
    pause: "Pause animation",
    play: "Animate weather",
    temperature: "Temperature",
    updated: "Updated",
    details: "Details",
    windmap: "Wind map",
    rainmap: "Rain map",
    forecast: "Forecast",
    lowUV: "Low",
    moderate: "Moderate",
    highUV: "High",
    veryHigh: "Very high",
    extreme: "Extreme",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    veryPoor: "Very poor",
    extremelyPoor: "Extremely poor",
    excellent: "Excellent",
    illuminated: "illuminated",
    nextFull: "Next full moon",
    new: "New moon",
    waxCrescent: "Waxing crescent",
    first: "First quarter",
    waxGibbous: "Waxing gibbous",
    full: "Full moon",
    waneGibbous: "Waning gibbous",
    last: "Last quarter",
    waneCrescent: "Waning crescent",
    rainSoon: "Rain in the next 90 minutes",
    noRain: "No rain expected in the next 90 minutes",
    mapError: "Radar image unavailable",
    refresh: "Refresh",
    outlook: "Weather outlook",
    source: "Weather data",
    km: "km",
    rainAmount: "Rainfall",
    light: "Light",
    heavy: "Heavy",
    model: "Modelled air quality",
    unavailableDetail: "This source is temporarily unavailable.",
    coverage:
      "KMI warnings returned for this location. Read the affected areas below.",
    current: "Current conditions",
  },
  nl: {
    hourly: "Uurlijkse verwachting",
    daily: "Dagelijkse verwachting",
    feels: "Gevoelstemperatuur",
    sunset: "Zonsondergang",
    sunrise: "Zonsopgang",
    air: "Luchtkwaliteit",
    wind: "Wind",
    uv: "UV-index",
    rain: "Neerslag",
    humidity: "Luchtvochtigheid",
    visibility: "Zicht",
    pressure: "Luchtdruk",
    moon: "Maan",
    radar: "Regenradar",
    now: "Nu",
    today: "Vandaag",
    tomorrow: "Morgen",
    high: "H",
    low: "L",
    gusts: "Windstoten",
    dew: "Dauwpunt",
    warnings: "Weerwaarschuwingen",
    clear: "Geen lokale waarschuwingen",
    unavailable: "Weer niet beschikbaar",
    stale: "Verwachting verouderd",
    warnUnavailable: "Waarschuwingsstatus niet beschikbaar",
    upcoming: "Binnenkort",
    active: "Actief",
    until: "tot",
    from: "vanaf",
    close: "Sluiten",
    pause: "Animatie pauzeren",
    play: "Weer animeren",
    temperature: "Temperatuur",
    updated: "Bijgewerkt",
    details: "Details",
    windmap: "Windkaart",
    rainmap: "Regenkaart",
    forecast: "Verwachting",
    lowUV: "Laag",
    moderate: "Matig",
    highUV: "Hoog",
    veryHigh: "Zeer hoog",
    extreme: "Extreem",
    good: "Goed",
    fair: "Redelijk",
    poor: "Slecht",
    veryPoor: "Zeer slecht",
    extremelyPoor: "Extreem slecht",
    excellent: "Uitstekend",
    illuminated: "verlicht",
    nextFull: "Volgende volle maan",
    new: "Nieuwe maan",
    waxCrescent: "Wassende maan",
    first: "Eerste kwartier",
    waxGibbous: "Wassende maan",
    full: "Volle maan",
    waneGibbous: "Afnemende maan",
    last: "Laatste kwartier",
    waneCrescent: "Afnemende maan",
    rainSoon: "Regen in de komende 90 minuten",
    noRain: "Geen regen verwacht in de komende 90 minuten",
    mapError: "Radarbeeld niet beschikbaar",
    refresh: "Vernieuwen",
    outlook: "Weerbericht",
    source: "Weergegevens",
    km: "km",
    rainAmount: "Regenhoeveelheid",
    light: "Licht",
    heavy: "Zwaar",
    model: "Gemodelleerde luchtkwaliteit",
    unavailableDetail: "Deze bron is tijdelijk niet beschikbaar.",
    coverage:
      "KMI-waarschuwingen voor deze locatie. Lees hieronder voor welke gebieden ze gelden.",
    current: "Huidige omstandigheden",
  },
};

function icon(condition, night = false, size = 28) {
  const rain = /rain|pour|hail/.test(condition),
    snow = /snow/.test(condition),
    thunder = /lightning|exceptional/.test(condition),
    cloudy = /cloud|rain|pour|snow|hail|lightning/.test(condition);
  const moon = condition === "clear-night" || night;
  let body = "";
  if (/wind/.test(condition))
    body =
      '<path d="M4 11h21c8 0 8-9 2-9-4 0-5 3-4 5M1 18h32c7 0 7 9 1 9-4 0-4-3-4-4M6 25h12" fill="none" stroke="#e1f2ff" stroke-width="2.4" stroke-linecap="round"/>';
  else if (condition === "fog")
    body =
      '<path d="M7 9h26M2 16h34M6 23h30M12 30h20" stroke="#e0edf4" stroke-width="3" stroke-linecap="round"/>';
  else {
    if (!cloudy || condition === "partlycloudy")
      body += moon
        ? '<path d="M28 2a15 15 0 1 0 10 23A14 14 0 0 1 28 2Z" fill="#eff5ff"/>'
        : '<g stroke="#ffd05c" stroke-width="2.2" stroke-linecap="round"><path d="M20 1v3m0 28v3M3 18h3m28 0h3M8 6l2 3m20 19 2 2M8 30l2-3M30 8l2-2"/><circle cx="20" cy="18" r="10" fill="#ffd05c" stroke="none"/></g>';
    if (cloudy)
      body +=
        '<path d="M9 29C-1 29-1 16 8 15 10 3 28 4 30 16 40 15 43 29 32 29Z" fill="#f4f8ff"/><path d="M9 29h23c7 0 8-4 8-4H1s2 4 8 4" fill="#c4d8ec" opacity=".5"/>';
    if (rain)
      body +=
        '<path d="m12 33-2 5m12-5-2 5m12-5-2 5" stroke="#74d3ff" stroke-width="2.6" stroke-linecap="round"/>';
    if (snow)
      body +=
        '<g fill="#b7e6ff"><circle cx="12" cy="35" r="2"/><circle cx="23" cy="38" r="2"/><circle cx="33" cy="34" r="2"/></g>';
    if (thunder)
      body += '<path d="m22 24-7 10h6l-3 9 12-14h-8l4-5Z" fill="#ffcf55"/>';
  }
  return `<svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 42 44" aria-hidden="true">${body}</svg>`;
}
const symbols = {
  hourly: "◷",
  daily: "▦",
  feels: "♨",
  sunset: "☀",
  sunrise: "☀",
  air: "⠿",
  wind: "≋",
  uv: "☀",
  rain: "◒",
  humidity: "♧",
  visibility: "◉",
  pressure: "◴",
  moon: "☾",
  radar: "◉",
  warnings: "△",
};

class AtmosphereCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._mode = "temperature";
    this._paused = false;
    this._fetching = false;
    this._reduced = matchMedia("(prefers-reduced-motion: reduce)");
    this.shadowRoot.innerHTML = `<style>${styles}</style><ha-card><div class="atmosphere"><div class="sky" aria-hidden="true"><div class="sun-orb"></div><div class="rays"></div><div class="stars"></div><div class="clouds far"></div><div class="clouds near"></div><canvas class="precipitation"></canvas><div class="horizon"></div></div><div class="body"></div></div></ha-card><dialog aria-labelledby="detail-title"><div class="dialog-inner"></div></dialog>`;
    this.shadowRoot.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");
      if (button) this._action(button.dataset.action, button.dataset.value);
    });
    this.shadowRoot.querySelector("dialog").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) e.currentTarget.close();
    });
    this._onVisibility = () => this._animate();
    this._onMotion = () => {
      this._animate();
      if (this._reduced.matches) {
        this._radarPlaying = false;
        clearInterval(this._radarTimer);
      }
      this._render();
    };
    this.shadowRoot
      .querySelector("dialog")
      .addEventListener("close", () => clearInterval(this._radarTimer));
    this._radarFrame = 0;
  }
  setConfig(config) {
    if (config.entity && !config.entity.startsWith("weather."))
      throw new Error("Select an Atmosphere weather entity.");
    this._config = { ...config };
    this._data = null;
    this._lastKey = null;
    if (this._hass) this._fetch();
  }
  static getConfigElement() {
    return document.createElement("atmosphere-card-editor");
  }
  static getStubConfig(hass) {
    return {
      entity: Object.keys(hass?.states || {}).find(
        (k) => hass.states[k].attributes.atmosphere_entry_id,
      ),
    };
  }
  getCardSize() {
    return 15;
  }
  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 6 };
  }
  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const entity = this._entity();
    const key = `${entity?.attributes?.updated_at}|${entity?.state}|${hass.connection?.connected}`;
    if (!this._data || key !== this._lastKey) {
      this._lastKey = key;
      this._fetch();
    }
  }
  _entity() {
    const entities = this._hass?.states || {};
    return (
      entities[this._config?.entity] ||
      (!this._config?.entity
        ? Object.values(entities).find(
            (e) =>
              e.entity_id.startsWith("weather.") &&
              e.attributes.atmosphere_entry_id,
          )
        : null)
    );
  }
  connectedCallback() {
    this._observer ||= new IntersectionObserver((entries) => {
      this._visible = entries[0].isIntersecting;
      this._animate();
    });
    this._observer.observe(this);
    this._resize ||= new ResizeObserver(() => this._sizeCanvas());
    this._resize.observe(this);
    document.addEventListener("visibilitychange", this._onVisibility);
    this._reduced.addEventListener("change", this._onMotion);
    this._timer = setInterval(() => {
      this._render();
      if (
        !this._data ||
        Date.now() - new Date(this._data.updated_at) > 8 * 60000
      )
        this._fetch();
    }, 60000);
    this._render();
    if (this._hass) this._fetch();
  }
  disconnectedCallback() {
    clearInterval(this._timer);
    clearInterval(this._radarTimer);
    cancelAnimationFrame(this._raf);
    this._observer?.disconnect();
    this._resize?.disconnect();
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._reduced.removeEventListener("change", this._onMotion);
  }
  async _fetch() {
    if (!this._hass || !this._config || this._fetching) return;
    this._fetching = true;
    const config = this._config;
    try {
      const entity = this._entity();
      if (this._config.entity && !entity)
        throw new Error(`Entity unavailable: ${this._config.entity}`);
      const data = await this._hass.callWS({
        type: "atmosphere/data",
        ...(entity?.attributes?.atmosphere_entry_id
          ? { entry_id: entity.attributes.atmosphere_entry_id }
          : {}),
      });
      if (config !== this._config) return;
      this._data = data;
      this._error = null;
    } catch (error) {
      this._error = error.message || "Connection unavailable";
    } finally {
      this._fetching = false;
      if (config !== this._config) this._fetch();
      else this._render();
    }
  }
  get _nl() {
    return (
      this._config?.language ||
      this._data?.language ||
      this._hass?.language ||
      "en"
    ).startsWith("nl");
  }
  _t(key) {
    return words[this._nl ? "nl" : "en"][key] || key;
  }
  _condition(c) {
    return conditions[c]?.[this._nl ? 1 : 0] || "—";
  }
  _time(date, options = {}) {
    if (!date || !Number.isFinite(new Date(date).getTime())) return "—";
    return new Intl.DateTimeFormat(this._nl ? "nl-BE" : "en-GB", {
      timeZone: this._data?.timezone || "Europe/Brussels",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    }).format(new Date(date));
  }
  _date(date, options = {}) {
    return new Intl.DateTimeFormat(this._nl ? "nl-BE" : "en-GB", {
      timeZone: this._data?.timezone || "Europe/Brussels",
      ...options,
    }).format(new Date(date));
  }
  _temp(v) {
    return `${num(v)}${valid(v) ? "°" : ""}`;
  }
  _isStale() {
    return (
      this._error ||
      !this._data?.available ||
      Date.now() - new Date(this._data.updated_at).getTime() > 20 * 60000
    );
  }
  _warnings() {
    return (this._data?.warnings || [])
      .filter((w) => new Date(w.ends_at) > new Date())
      .sort(
        (a, b) =>
          (b.level || 0) - (a.level || 0) ||
          new Date(a.starts_at) - new Date(b.starts_at),
      );
  }
  _panel(title, content, action = title, classes = "") {
    return `<button class="panel ${classes}" data-action="detail" data-value="${esc(action)}"><h2><span aria-hidden="true">${symbols[title] || "◉"}</span>${this._t(title)}<span class="chevron" aria-hidden="true">›</span></h2>${content}</button>`;
  }
  _render() {
    if (!this.isConnected) return;
    const body = this.shadowRoot.querySelector(".body");
    if (!this._data) {
      body.innerHTML = `<div class="empty"><h1>Atmosphere</h1><p>${this._error ? esc(this._error) : this._nl ? "Het weer wordt opgehaald…" : "Fetching the weather…"}</p><button data-action="refresh">${this._t("refresh")}</button></div>`;
      return;
    }
    const d = this._data,
      c = d.current,
      today = d.daily[0] || {},
      warnings = this._warnings(),
      stale = this._isStale();
    const night =
      Date.now() < new Date(d.sun.sunrise) ||
      Date.now() > new Date(d.sun.sunset);
    const condition = c.condition || "cloudy";
    const sky = this.shadowRoot.querySelector(".atmosphere");
    sky.dataset.condition = condition;
    sky.dataset.night = String(night);
    sky.classList.toggle(
      "paused",
      this._paused ||
        this._reduced.matches ||
        !this._visible ||
        document.hidden,
    );
    const hourly = d.hourly
      .filter((f) => new Date(f.datetime).getTime() > Date.now() - 3600000)
      .slice(0, 24)
      .map((f, i) =>
        i === 0
          ? { ...f, temperature: c.temperature, condition, is_daytime: !night }
          : f,
      );
    const oldScroll = body.querySelector(".hours")?.scrollLeft || 0;
    const scrollTop = body.querySelector(".days")?.scrollTop || 0;
    const moon = SunCalc.getMoonIllumination(new Date());
    const sunIsNext = Date.now() > new Date(d.sun.sunset).getTime();
    const sunKey = sunIsNext ? "sunrise" : "sunset";
    const sunNext = sunIsNext
      ? SunCalc.getTimes(
          new Date(Date.now() + 86400000),
          d.latitude,
          d.longitude,
        ).sunrise
      : d.sun.sunset;
    const aq = d.air?.european_aqi;
    const aqTitle = !valid(aq)
      ? "—"
      : this._t(
          aq <= 20
            ? "good"
            : aq <= 40
              ? "fair"
              : aq <= 60
                ? "moderate"
                : aq <= 80
                  ? "poor"
                  : aq <= 100
                    ? "veryPoor"
                    : "extremelyPoor",
        );
    const uv = c.uv_index;
    const uvTitle = valid(uv)
      ? this._t(
          uv < 3
            ? "lowUV"
            : uv < 6
              ? "moderate"
              : uv < 8
                ? "highUV"
                : uv < 11
                  ? "veryHigh"
                  : "extreme",
        )
      : "—";
    const windDirection = valid(c.wind_bearing)
      ? ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][
          Math.round(c.wind_bearing / 45) % 8
        ]
      : "—";
    const rainNext = d.rain.filter(
      (r) =>
        new Date(r.datetime) > new Date() &&
        new Date(r.datetime) < new Date(Date.now() + 90 * 60000),
    );
    const willRain = rainNext.some(
      (r) => (r.precipitation || 0) > 0 || r.might_rain,
    );
    body.innerHTML = `
      <div class="toolbar"><span class="location-pin" aria-hidden="true">⌖</span><span>${esc(this._config.name || d.name)}</span><button class="motion" data-action="motion" aria-label="${this._t(this._paused || this._reduced.matches ? "play" : "pause")}" aria-pressed="${!this._paused && !this._reduced.matches}">${this._paused ? "▷" : "Ⅱ"}</button></div>
      <header class="hero"><h1>${esc(this._config.name || d.name)}</h1><div class="temperature">${this._temp(c.temperature)}</div><div class="condition">${this._condition(condition)}</div><div class="hero-range">${valid(c.apparent_temperature) ? `${this._t("feels")} ${this._temp(c.apparent_temperature)}<span>·</span>` : ""}${this._t("high")}:${this._temp(today.temperature)} ${this._t("low")}:${this._temp(today.templow)}</div></header>
      ${stale ? `<div class="connection-status" role="status">${this._t("stale")} · ${this._t("warnUnavailable")}<button data-action="refresh">${this._t("refresh")}</button></div>` : ""}
      <div class="forecast-grid">
        <button class="panel warning ${warnings.length ? "has-warning" : ""} level-${warnings[0]?.level || 0}" data-action="detail" data-value="warnings"><h2><span aria-hidden="true">${warnings.length ? "△" : "✓"}</span>${this._t("warnings")}<span class="chevron">›</span></h2>${warnings.length ? `<div class="warning-title">${esc(warnings[0].friendly_name)}</div><div class="warning-line"><span class="severity-dot"></span>${this._t(stale ? "stale" : new Date(warnings[0].starts_at) <= new Date() ? "active" : "upcoming")} · ${this._time(warnings[0].starts_at)} – ${this._time(warnings[0].ends_at)}</div><p class="warning-preview">${esc(warnings[0].text)}</p>${warnings.length > 1 ? `<span class="warning-count">+${warnings.length - 1}</span>` : ""}` : `<div class="warning-title">${this._t(stale ? "warnUnavailable" : "clear")}</div><div class="warning-line">KMI / IRM</div>`}</button>
        <section class="panel hourly"><div class="panel-header"><h2><span aria-hidden="true">◷</span>${this._t("hourly")}</h2><div class="segmented" role="group" aria-label="${this._t("hourly")}">${["temperature", "rain", "wind"].map((m, i) => `<button data-action="mode" data-value="${m}" aria-label="${this._t(m)}" aria-pressed="${this._mode === m}">${["°", "♧", "≋"][i]}</button>`).join("")}</div></div><div class="hours">${hourly.map((f, i) => `<button class="hour" data-action="hour" data-value="${esc(f.datetime)}"><span>${i === 0 ? this._t("now") : this._time(f.datetime, { minute: undefined })}</span>${icon(f.condition, !f.is_daytime, 32)}<span class="chance">${valid(f.precipitation_probability) ? num(f.precipitation_probability) + "%" : "—"}</span><strong>${this._mode === "temperature" ? this._temp(f.temperature) : this._mode === "rain" ? num(f.precipitation, 1) : num(f.wind_speed)}</strong>${this._mode !== "temperature" ? `<small>${this._mode === "rain" ? "mm" : "km/h"}</small>` : ""}</button>`).join("")}</div></section>
        <section class="panel daily"><h2><span aria-hidden="true">▦</span>${d.daily.length} ${this._nl ? "dagen" : "days"}</h2><div class="days">${this._dailyRows(d.daily)}</div></section>
        <div class="metrics">
          ${this._panel("feels", `<div class="metric-value">${this._temp(c.apparent_temperature)}</div><div class="metric-note">${this._nl ? "Werkelijk" : "Actual"} ${this._temp(c.temperature)}</div><div class="feels-line"><span style="left:${clamp(50 + ((c.apparent_temperature ?? c.temperature) - c.temperature) * 4, 5, 95)}%"></span></div>`)}
          ${this._panel(sunKey, `<div class="metric-value">${this._time(sunNext)}</div>${this._sunArc()}<div class="metric-note sun-note">${this._t(sunKey === "sunset" ? "sunrise" : "sunset")} ${this._time(d.sun[sunKey === "sunset" ? "sunrise" : "sunset"])}</div>`, "sun")}
          ${this._panel("air", `<div class="aq-head"><span class="metric-value">${num(aq)}</span><span class="aq-category">${aqTitle}</span></div><div class="spectrum aqi"><i style="left:${clamp(((aq || 0) / 120) * 100, 2, 98)}%"></i></div><div class="metric-note">European AQI</div>`)}
          ${this._panel("wind", `<div class="wind-layout"><div><span class="metric-value">${num(c.wind_speed)}</span><span class="unit">km/h</span><div class="metric-note">${this._t("gusts")} ${num(c.wind_gust_speed)}</div></div><div class="compass"><span class="north">N</span><span class="west">W</span><span class="east">E</span><span class="south">S</span><div class="needle" style="transform:rotate(${valid(c.wind_bearing) ? c.wind_bearing : 0}deg)"></div><b>${windDirection}</b></div></div>`)}
          ${this._panel("uv", `<div class="metric-value">${num(uv, 1)}</div><div class="metric-note">${uvTitle}</div><div class="spectrum uv"><i style="left:${clamp(((uv || 0) / 12) * 100, 2, 98)}%"></i></div>`)}
          ${this._panel(
            "rain",
            `<div class="metric-value">${num(today.precipitation, 1)}<span class="unit">mm</span></div><div class="metric-note">${this._t("today")}</div><div class="mini-rain">${hourly
              .slice(0, 18)
              .map(
                (f) =>
                  `<i style="height:${clamp((f.precipitation || 0) * 35 + 3, 3, 40)}px"></i>`,
              )
              .join("")}</div>`,
          )}
        </div>
        <section class="panel radar-panel"><div class="panel-header"><h2><span aria-hidden="true">◉</span>${this._t("radar")}</h2><button class="text-button" data-action="detail" data-value="radar">${this._t("rainmap")} <span aria-hidden="true">↗</span></button></div><button class="rain-outlook" data-action="detail" data-value="radar"><span>${this._t(willRain ? "rainSoon" : "noRain")}</span><span aria-hidden="true">›</span></button><div class="rain-chart">${this._rainChart(rainNext)}</div><div class="chart-times"><span>${this._t("now")}</span><span>+30 min</span><span>+60 min</span><span>+90 min</span></div></section>
        ${this._panel("moon", `<div class="moon-layout"><div><div class="moon-phase">${this._moonName(moon.phase)}</div><div class="metric-note">${num(moon.fraction * 100)}% ${this._t("illuminated")}</div><div class="moon-date">${this._date(this._nextFullMoon(), { day: "numeric", month: "short" })}<span>${this._t("nextFull")}</span></div></div><canvas class="moon" width="240" height="240" aria-hidden="true"></canvas></div>`, "moon", "moon-panel")}
        <div class="small-metrics">${this._panel("humidity", `<div class="small-value">${num(c.humidity)}<span>%</span></div><div class="metric-note">${this._t("dew")} ${this._temp(c.dew_point)}</div>`)}${this._panel("visibility", `<div class="small-value">${num(c.visibility, 1)}<span>km</span></div>`)}${this._panel("pressure", `<div class="small-value">${num(c.pressure)}<span>hPa</span></div><div class="pressure-scale"><span>980</span><i style="left:${clamp((((c.pressure || 1013) - 980) / 60) * 100, 0, 100)}%"></i><span>1040</span></div>`)}</div>
      </div><footer><span>${this._t("updated")} ${this._time(d.updated_at)} · KMI / IRM</span><button data-action="detail" data-value="source">${this._t("source")} ⓘ</button></footer>`;
    body.querySelector(".hours").scrollLeft = oldScroll;
    body.querySelector(".days").scrollTop = scrollTop;
    this._drawMoon(body.querySelector(".moon"));
    this._sizeCanvas();
    this._animate();
  }
  _dailyRows(days) {
    const vals = days.flatMap((f) => [f.temperature, f.templow]).filter(valid),
      min = Math.min(...vals) - 1,
      max = Math.max(...vals) + 1;
    return days
      .map(
        (f, i) =>
          `<button class="day" data-action="day" data-value="${i}" aria-label="${esc(this._date(`${f.datetime.slice(0, 10)}T12:00:00`, { weekday: "long" }))}: ${this._temp(f.templow)} – ${this._temp(f.temperature)}"><span class="day-name">${i === 0 ? this._t("today") : this._date(`${f.datetime.slice(0, 10)}T12:00:00`, { weekday: "short" })}</span><span class="day-condition">${icon(f.condition, false, 28)}<small>${valid(f.precipitation_probability) ? num(f.precipitation_probability) + "%" : ""}</small></span><span class="low">${this._temp(f.templow)}</span><span class="range"><span style="left:${clamp((((f.templow ?? f.temperature) - min) / (max - min)) * 100, 0, 100)}%;width:${Math.max(3, (((f.temperature ?? min) - (f.templow ?? f.temperature)) / (max - min)) * 100)}%"></span>${i === 0 && valid(this._data.current.temperature) ? `<i style="left:${clamp(((this._data.current.temperature - min) / (max - min)) * 100, 0, 100)}%"></i>` : ""}</span><span class="high">${this._temp(f.temperature)}</span></button>`,
      )
      .join("");
  }
  _sunArc() {
    const d = this._data,
      start = new Date(d.sun.sunrise).getTime(),
      end = new Date(d.sun.sunset).getTime(),
      p = clamp((Date.now() - start) / (end - start), 0, 1),
      x = 10 + 180 * p,
      y = 57 - Math.sin(p * Math.PI) * 47;
    return `<svg class="sun-arc" viewBox="0 0 200 76" aria-hidden="true"><path d="M-10 65 Q10 65 40 35 Q100 -28 160 35 Q190 65 210 65" fill="none" stroke="white" stroke-opacity=".22" stroke-width="5"/><path d="M0 57h200" stroke="white" stroke-opacity=".3"/><circle cx="${x}" cy="${y}" r="6" fill="#fff8d9" style="filter:drop-shadow(0 0 6px #fff)"/></svg>`;
  }
  _rainChart(rain) {
    if (!rain.length) return '<span class="no-data">—</span>';
    const max = Math.max(1, ...rain.map((r) => r.precipitation || 0));
    const position = (r) =>
      clamp(((new Date(r.datetime) - Date.now()) / (90 * 60000)) * 500, 0, 500);
    return `<svg viewBox="0 0 500 64" preserveAspectRatio="none" aria-label="${this._t("rain")}"><path d="M0 62H500M0 32H500" stroke="white" stroke-opacity=".1"/>${rain.map((r, i) => `<rect x="${position(r)}" y="${61 - ((r.precipitation || 0) / max) * 56}" width="${Math.max(1, 500 / rain.length - 2)}" height="${Math.max(1, ((r.precipitation || 0) / max) * 56)}" fill="#91dbfa" rx="2"/>`).join("")}</svg>`;
  }
  _moonName(phase) {
    return this._t(
      [
        "new",
        "waxCrescent",
        "first",
        "waxGibbous",
        "full",
        "waneGibbous",
        "last",
        "waneCrescent",
      ][Math.round(phase * 8) % 8],
    );
  }
  _nextFullMoon() {
    let previous = SunCalc.getMoonIllumination(new Date()).phase;
    for (let hour = 1; hour <= 32 * 24; hour++) {
      const date = new Date(Date.now() + hour * 3600000),
        phase = SunCalc.getMoonIllumination(date).phase;
      if (previous < 0.5 && phase >= 0.5) return date;
      previous = phase;
    }
    return new Date(Date.now() + 29.53 * 86400000);
  }
  _drawMoon(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d"),
      w = canvas.width,
      r = w * 0.43,
      c = w / 2;
    const phase = SunCalc.getMoonIllumination(new Date()).phase;
    ctx.clearRect(0, 0, w, w);
    ctx.save();
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.clip();
    const base = ctx.createRadialGradient(
      c - r * 0.25,
      c - r * 0.3,
      0,
      c,
      c,
      r,
    );
    base.addColorStop(0, "#eceff3");
    base.addColorStop(0.7, "#bdc6d2");
    base.addColorStop(1, "#79899d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, w);
    let seed = 73;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 260; i++) {
      const x = random() * w,
        y = random() * w,
        size = 2 + random() * 14;
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.8, random() * 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,52,73,${random() * 0.15})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.09)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const waxing = phase < 0.5,
      cosine = Math.cos(phase * 2 * Math.PI);
    // The terminator is a projected semicircle, so quarter moons have a straight edge.
    ctx.beginPath();
    for (let y = -r; y <= r; y += 1) {
      const half = Math.sqrt(r * r - y * y),
        term = (waxing ? 1 : -1) * cosine * half;
      if (y === -r) ctx.moveTo(c + term, c + y);
      else ctx.lineTo(c + term, c + y);
    }
    for (let y = r; y >= -r; y -= 1) {
      const half = Math.sqrt(r * r - y * y);
      ctx.lineTo(c + (waxing ? -half : half), c + y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(7,17,35,.9)";
    ctx.fill();
    ctx.restore();
  }
  _sizeCanvas() {
    const canvas = this.shadowRoot.querySelector(".precipitation"),
      rect = this.getBoundingClientRect();
    if (
      canvas.width !== Math.round(rect.width) ||
      canvas.height !== Math.round(Math.min(rect.height, 1700))
    ) {
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(Math.min(rect.height, 1700));
    }
  }
  _animate() {
    cancelAnimationFrame(this._raf);
    this._raf = null;
    const moving =
      this.isConnected &&
      this._visible &&
      !document.hidden &&
      !this._paused &&
      !this._reduced.matches;
    this.shadowRoot
      .querySelector(".atmosphere")
      .classList.toggle("paused", !moving);
    const canvas = this.shadowRoot.querySelector(".precipitation"),
      ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const condition = this._data?.current?.condition || "";
    if (!moving || !/(rain|pour|snow|hail|lightning)/.test(condition)) return;
    const snow = /snow/.test(condition),
      particles = Array.from({ length: snow ? 65 : 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: 0.4 + Math.random(),
        r: 1 + Math.random() * 2,
      }));
    let last = 0;
    const frame = (time) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(210,233,255,.3)";
      ctx.fillStyle = "rgba(238,247,255,.7)";
      ctx.lineWidth = 0.8;
      for (const p of particles) {
        p.y += dt * (snow ? 25 : 530) * p.s;
        p.x += dt * (snow ? Math.sin(time / 2000 + p.s) * 12 : -95);
        if (p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        ctx.beginPath();
        if (snow) {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 4, p.y + 18 * p.s);
          ctx.stroke();
        }
      }
      this._raf = requestAnimationFrame(frame);
    };
    this._raf = requestAnimationFrame(frame);
  }
  _action(action, value) {
    if (action === "refresh") return this._fetch();
    if (action === "motion") {
      this._paused = !this._paused;
      this._render();
      return;
    }
    if (action === "mode") {
      this._mode = value;
      this._render();
      return;
    }
    if (action === "close") {
      clearInterval(this._radarTimer);
      this.shadowRoot.querySelector("dialog").close();
      return;
    }
    if (action === "radar-play") {
      this._radarPlaying = !this._radarPlaying;
      this._startRadar();
      return;
    }
    if (action === "radar-frame") {
      this._radarFrame = Number(value);
      this._paintRadar();
      return;
    }
    if (action === "map") {
      this._showMap(value);
      return;
    }
    this._openDetail(action === "detail" ? value : action, value);
  }
  _openDetail(type, value) {
    clearInterval(this._radarTimer);
    const d = this._data,
      c = d.current,
      t = this._t.bind(this);
    let title = t(type),
      content = "";
    const stats = (rows) =>
      `<dl class="detail-stats">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
    if (type === "warnings") {
      content = `<p>${t("coverage")}</p>${this._isStale() ? `<p class="error">${t("warnUnavailable")}</p>` : ""}${
        this._warnings()
          .map(
            (w) =>
              `<article class="warning-detail level-${w.level}"><h3><span class="severity-dot"></span>${esc(w.friendly_name)}</h3><p class="warning-dates">${this._date(w.starts_at, { weekday: "long", day: "numeric", month: "short" })} ${this._time(w.starts_at)} – ${this._time(w.ends_at)}</p><p>${esc(w.text)}</p><a href="https://www.meteo.be/nl/weer/waarschuwingen" target="_blank" rel="noopener noreferrer">KMI / IRM ↗</a></article>`,
          )
          .join("") ||
        `<p>${t(this._isStale() ? "warnUnavailable" : "clear")}</p>`
      }`;
    } else if (type === "day" || type === "hour") {
      const f =
        type === "day"
          ? d.daily[Number(value)]
          : d.hourly.find((f) => f.datetime === value);
      title =
        type === "day"
          ? this._date(f.datetime + "T12:00:00", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          : this._time(f.datetime);
      const hours =
        type === "day"
          ? d.hourly.filter(
              (h) =>
                this._date(h.datetime, { day: "numeric", month: "numeric" }) ===
                this._date(f.datetime + "T12:00:00", {
                  day: "numeric",
                  month: "numeric",
                }),
            )
          : d.hourly
              .filter((h) => new Date(h.datetime) >= new Date(f.datetime))
              .slice(0, 12);
      content = `<div class="detail-weather">${icon(f.condition, !f.is_daytime, 64)}<div class="detail-temperature">${this._temp(f.temperature)}</div><p>${this._condition(f.condition)}${f.condition_2 && f.condition_2 !== f.condition ? " → " + this._condition(f.condition_2) : ""}</p></div>${f.text ? `<p>${esc(f.text)}</p>` : ""}${hours.length ? this._hourChart(hours) : ""}${stats(
        [
          [t("low"), this._temp(f.templow)],
          [
            t("rain"),
            `${num(f.precipitation, 1)} mm · ${num(f.precipitation_probability)}%`,
          ],
          [t("wind"), `${num(f.wind_speed)} km/h`],
          [t("gusts"), `${num(f.wind_gust_speed)} km/h`],
        ],
      )}`;
    } else if (type === "radar") {
      title = t("radar");
      content = `<div class="map-switch"><button data-action="map" data-value="radar">${t("rainmap")}</button><button data-action="map" data-value="wind">${t("windmap")}</button></div><div class="radar-stage"><img class="radar-frame" alt="${t("radar")}"/><img class="radar-overlay" alt=""/><div class="radar-error" hidden>${t("mapError")}</div></div><div class="radar-controls"><button data-action="radar-play" aria-label="${t("play")}">▶ / Ⅱ</button><input class="radar-slider" type="range" min="0" max="${Math.max(0, d.radar.frames.length - 1)}" value="0" aria-label="${t("radar")}"/><time class="radar-time"></time></div><div class="radar-caption">KMI / IRM · mm/h</div><div class="map-host"></div>`;
    } else if (type === "wind") {
      content = `<div class="detail-temperature">${num(c.wind_speed)}<span> km/h</span></div>${stats(
        [
          [t("gusts"), `${num(c.wind_gust_speed)} km/h`],
          [this._nl ? "Windrichting" : "Direction", `${num(c.wind_bearing)}°`],
        ],
      )}${this._hourChart(d.hourly.filter((h) => new Date(h.datetime) > new Date()).slice(0, 24), "wind_speed")}<button class="full-button" data-action="map" data-value="wind">${t("windmap")} ↗</button><div class="map-host"></div>`;
    } else if (type === "sun") {
      title = this._nl ? "Zon" : "Sun";
      content = `${this._sunArc()}${stats([
        [t("sunrise"), this._time(d.sun.sunrise)],
        [t("sunset"), this._time(d.sun.sunset)],
        [this._nl ? "Ochtendschemering" : "Dawn", this._time(d.sun.dawn)],
        [this._nl ? "Avondschemering" : "Dusk", this._time(d.sun.dusk)],
      ])}`;
    } else if (type === "moon") {
      const m = SunCalc.getMoonIllumination(new Date()),
        times = SunCalc.getMoonTimes(new Date(), d.latitude, d.longitude, true);
      content = `<canvas class="moon detail-moon" width="400" height="400"></canvas><h3>${this._moonName(m.phase)}</h3>${stats(
        [
          [t("illuminated"), `${num(m.fraction * 100, 1)}%`],
          [
            t("nextFull"),
            this._date(this._nextFullMoon(), { day: "numeric", month: "long" }),
          ],
          [this._nl ? "Maanopkomst" : "Moonrise", this._time(times.rise)],
          [this._nl ? "Maanondergang" : "Moonset", this._time(times.set)],
        ],
      )}`;
    } else if (type === "air") {
      const a = d.air;
      content = `<div class="detail-temperature">${num(a.european_aqi)}</div><p>European AQI · ${t("model")}</p>${stats(
        [
          ["PM2.5", `${num(a.pm2_5, 1)} µg/m³`],
          ["PM10", `${num(a.pm10, 1)} µg/m³`],
          ["NO₂", `${num(a.nitrogen_dioxide, 1)} µg/m³`],
          ["O₃", `${num(a.ozone, 1)} µg/m³`],
        ],
      )}<p>CAMS ENSEMBLE / Open-Meteo · ${this._time(a.time ? a.time * 1000 : null)}</p>`;
    } else if (type === "rain") {
      content = `<div class="detail-temperature">${num(d.daily[0]?.precipitation, 1)}<span> mm</span></div><p>${t("today")}</p>${this._hourChart(d.hourly.filter((h) => new Date(h.datetime) > new Date()).slice(0, 24), "precipitation")}<button class="full-button" data-action="detail" data-value="radar">${t("radar")} ↗</button>`;
    } else if (type === "source") {
      content = `<p>${esc(d.attribution)}</p><p>${this._nl ? "Voorspellingen en waarschuwingen worden elke 7 minuten opgehaald. Aanvullende modelgegevens elke 30 minuten. Waarschuwingen kunnen een ruimer gebied betreffen: lees de waarschuwingstekst." : "Forecasts and warnings refresh every 7 minutes; supplementary model data every 30 minutes. Warnings may concern a wider area: read the warning text."}</p><p>${this._nl ? "Windkaarten worden op verzoek geladen van Windy. Zon- en maangegevens worden lokaal berekend." : "Wind maps load from Windy on request. Sun and moon information is calculated locally."}</p><p>${t("updated")}: ${this._time(d.updated_at)}${this._isStale() ? " · " + t("stale") : ""}</p><a href="https://github.com/TwilightDuck/ha-atmosphere" target="_blank" rel="noopener noreferrer">Atmosphere 1.0.0 ↗</a>`;
    } else {
      const map = {
          feels: [c.apparent_temperature, "°C"],
          uv: [c.uv_index, ""],
          humidity: [c.humidity, "%"],
          visibility: [c.visibility, "km"],
          pressure: [c.pressure, "hPa"],
        },
        [v, unit] = map[type] || [null, ""];
      content = `<div class="detail-temperature">${num(v, type === "uv" ? 1 : 0)}<span> ${unit}</span></div>${!valid(v) ? `<p>${t("unavailableDetail")}</p>` : ""}${
        type === "feels"
          ? stats([
              [t("temperature"), this._temp(c.temperature)],
              [t("humidity"), `${num(c.humidity)}%`],
              [t("wind"), `${num(c.wind_speed)} km/h`],
            ])
          : type === "humidity"
            ? stats([[t("dew"), this._temp(c.dew_point)]])
            : ""
      }`;
    }
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.querySelector(".dialog-inner").innerHTML =
      `<div class="dialog-header"><h2 id="detail-title">${esc(title)}</h2><button class="close" data-action="close" aria-label="${t("close")}">×</button></div>${content}`;
    if (!dialog.open) dialog.showModal();
    if (type === "moon") this._drawMoon(dialog.querySelector(".moon"));
    if (type === "radar") {
      if (!d.radar.frames.length) {
        dialog.querySelector(".radar-stage").textContent = t("mapError");
        dialog.querySelector(".radar-controls").remove();
        return;
      }
      const frames = d.radar.frames;
      this._radarFrame = Math.max(
        0,
        frames.findIndex((f) => new Date(f.time) >= new Date()) - 1,
      );
      dialog.querySelector(".radar-overlay").src = this._safeMedia(
        d.radar.overlay,
      );
      dialog.querySelector(".radar-slider").oninput = (e) => {
        this._radarPlaying = false;
        clearInterval(this._radarTimer);
        this._radarFrame = Number(e.target.value);
        this._paintRadar();
      };
      this._radarPlaying = !this._reduced.matches;
      this._startRadar();
    }
  }
  _safeMedia(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" &&
        (u.hostname === "app.meteo.be" || u.hostname === "cdn.meteo.be")
        ? u.href
        : "";
    } catch {
      return "";
    }
  }
  _paintRadar() {
    const dialog = this.shadowRoot.querySelector("dialog"),
      frame = this._data.radar.frames[this._radarFrame];
    if (!frame || !dialog.open) return;
    const img = dialog.querySelector(".radar-frame");
    if (!img) return;
    img.onerror = () => {
      dialog.querySelector(".radar-error").hidden = false;
    };
    img.onload = () => {
      dialog.querySelector(".radar-error").hidden = true;
    };
    img.src = this._safeMedia(frame.url);
    dialog.querySelector(".radar-time").textContent = this._time(frame.time);
    dialog.querySelector(".radar-slider").value = this._radarFrame;
  }
  _startRadar() {
    clearInterval(this._radarTimer);
    this._paintRadar();
    if (this._radarPlaying && this._data.radar.frames.length > 0)
      this._radarTimer = setInterval(() => {
        if (document.hidden || !this.shadowRoot.querySelector("dialog").open)
          return;
        this._radarFrame =
          (this._radarFrame + 1) % this._data.radar.frames.length;
        this._paintRadar();
      }, 900);
  }
  _showMap(layer) {
    let host = this.shadowRoot.querySelector("dialog .map-host");
    if (!host) return;
    const d = this._data,
      url = new URL("https://embed.windy.com/embed.html");
    url.search = new URLSearchParams({
      type: "map",
      location: "coordinates",
      metricWind: "km/h",
      metricTemp: "°C",
      zoom: "7",
      overlay: layer,
      product: "ecmwf",
      level: "surface",
      lat: d.latitude.toFixed(2),
      lon: d.longitude.toFixed(2),
      detailLat: d.latitude.toFixed(2),
      detailLon: d.longitude.toFixed(2),
      marker: "true",
      calendar: "now",
    }).toString();
    host.innerHTML = `<iframe title="${this._t(layer === "wind" ? "windmap" : "rainmap")}" src="${esc(url.href)}" referrerpolicy="no-referrer" loading="lazy" allowfullscreen></iframe><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Windy ↗</a>`;
    host.scrollIntoView({
      block: "nearest",
      behavior: this._reduced.matches ? "instant" : "smooth",
    });
  }
  _hourChart(hours, field = "temperature") {
    const values = hours.map((h) => h[field]).filter(valid);
    if (!values.length) return "";
    const min = Math.min(...values),
      max = Math.max(...values),
      range = Math.max(1, max - min),
      unit =
        field === "temperature"
          ? "°"
          : field === "wind_speed"
            ? " km/h"
            : " mm";
    return `<div class="detail-chart"><svg viewBox="0 0 500 130" role="img" aria-label="${this._t(field === "temperature" ? "temperature" : field === "wind_speed" ? "wind" : "rain")}"><path d="M10 110H490M10 55H490" stroke="white" stroke-opacity=".13"/><polyline points="${hours
      .filter((h) => valid(h[field]))
      .map(
        (h, i) =>
          `${10 + (i * 480) / Math.max(1, hours.length - 1)},${105 - ((h[field] - min) / range) * 85}`,
      )
      .join(
        " ",
      )}" fill="none" stroke="#9cdef1" stroke-width="3" stroke-linejoin="round"/>${hours
      .filter((h, i) => i % Math.max(1, Math.floor(hours.length / 5)) === 0)
      .map(
        (h) =>
          `<text x="${10 + (hours.indexOf(h) * 480) / Math.max(1, hours.length - 1)}" y="126" fill="#cadbea" font-size="11" text-anchor="middle">${this._time(h.datetime, { minute: undefined })}</text>`,
      )
      .join(
        "",
      )}</svg><div class="chart-times"><span>${num(min, field === "precipitation" ? 1 : 0)}${unit}</span><span>${num(max, field === "precipitation" ? 1 : 0)}${unit}</span></div></div>`;
  }
}

class AtmosphereCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setConfig(config) {
    this._config = config;
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    this._render();
  }
  _render() {
    if (!this._hass || !this._config) return;
    const entities = Object.values(this._hass.states).filter(
      (e) =>
        e.entity_id.startsWith("weather.") && e.attributes.atmosphere_entry_id,
    );
    this.shadowRoot.innerHTML = `<style>label{display:grid;gap:8px;margin:16px 0}select,input{padding:12px;font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px}</style><label>Atmosphere location<select id="entity">${entities.map((e) => `<option value="${esc(e.entity_id)}" ${this._config.entity === e.entity_id ? "selected" : ""}>${esc(e.attributes.friendly_name || e.entity_id)}</option>`).join("")}</select></label><label>Name<input id="name" value="${esc(this._config.name || "")}"/></label><label>Card language<select id="language"><option value="auto">Location language</option><option value="nl">Nederlands</option><option value="en">English</option></select></label>`;
    this.shadowRoot.querySelector("#language").value =
      this._config.language || "auto";
    this.shadowRoot.querySelectorAll("input,select").forEach((el) =>
      el.addEventListener("change", () => {
        const config = { ...this._config, [el.id]: el.value };
        if (el.id === "language" && el.value === "auto") delete config.language;
        this._config = config;
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
          }),
        );
      }),
    );
  }
}
if (!customElements.get("atmosphere-card"))
  customElements.define("atmosphere-card", AtmosphereCard);
if (!customElements.get("atmosphere-card-editor"))
  customElements.define("atmosphere-card-editor", AtmosphereCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "atmosphere-card"))
  window.customCards.push({
    type: "atmosphere-card",
    name: "Atmosphere Weather",
    description: "Animated skies, KMI forecasts and local warnings.",
    preview: true,
  });
