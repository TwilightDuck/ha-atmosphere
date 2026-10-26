import SunCalc from "suncalc";
import { drawMoon } from "./moon.js";
import { skyState, drawSkyAccents } from "./sky-effects.js";
import { styles } from "./styles.js";

import { glyph } from "./icons.js";
import { smoothPath } from "./curves.js";

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
    currentLocation: "Current location",
    homeLocation: "Saved location",
    back: "Back",
    todayForecast: "Expected today",
    rainPossible: "Rain is possible in the next 90 minutes",
    locating: "Getting your location…",
    locationDenied:
      "Location permission is needed. Enable it in your browser or choose your app device.",
    locationFailed: "Your location could not be retrieved.",
    unsupported: "KMI weather is available in Belgium and Luxembourg.",
    chooseDevice: "Choose your GPS device",
    staleLocation:
      "Location is old or not precise enough. Refresh your Companion app with Exact location enabled.",
    appLocation: "Use app location",
    reported: "Reported",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
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
    rainUnavailable: "Rain forecast unavailable",
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
    closeLocation: "Dismiss location message",
    radarLayer: "Radar",
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
    currentLocation: "Huidige locatie",
    homeLocation: "Opgeslagen locatie",
    back: "Terug",
    todayForecast: "Vandaag verwacht",
    rainPossible: "Kans op regen in de komende 90 minuten",
    locating: "Je locatie wordt opgehaald…",
    locationDenied:
      "Locatietoestemming is nodig. Schakel die in je browser in of kies je app-apparaat.",
    locationFailed: "Je locatie kon niet worden opgehaald.",
    unsupported: "KMI-weer is beschikbaar in België en Luxemburg.",
    chooseDevice: "Kies je GPS-apparaat",
    staleLocation:
      "De locatie is te oud of niet nauwkeurig genoeg. Ververs de Companion-app met Exacte locatie ingeschakeld.",
    appLocation: "App-locatie gebruiken",
    reported: "Gemeld",
    zoomIn: "Inzoomen",
    zoomOut: "Uitzoomen",
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
    rainUnavailable: "Regenverwachting niet beschikbaar",
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
    closeLocation: "Locatiemelding sluiten",
    radarLayer: "Radar",
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
  return `<svg class="weather-icon" width="${size}" height="${size}" viewBox="-2 -2 46 48" aria-hidden="true">${body}</svg>`;
}
const sections = [
  "current",
  "warnings",
  "hourly",
  "daily",
  "feels",
  "sun",
  "air",
  "wind",
  "uv",
  "rain",
  "radar",
  "moon",
  "humidity",
  "visibility",
  "pressure",
];

const defaultSections = sections.filter(
  (key) =>
    !["feels", "humidity", "visibility", "pressure", "rain"].includes(key),
);

const overviewSections = ["current", "warnings", "hourly", "radar"];
const configuredSections = (config) =>
  config.show ||
  (config.type === "custom:atmosphere-overview-card"
    ? overviewSections
    : defaultSections);

class AtmosphereCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._mode = "temperature";
    this._fetching = false;
    this._reduced = matchMedia("(prefers-reduced-motion: reduce)");
    this.shadowRoot.innerHTML = `<style>${styles}</style><ha-card><div class="atmosphere"><div class="sky" aria-hidden="true"><div class="sun-orb"></div><div class="rays"></div><div class="stars"></div><div class="clouds far"></div><div class="clouds near"></div><div class="clouds bank"></div><canvas class="sky-moon" width="240" height="240"></canvas><canvas class="precipitation"></canvas><div class="horizon"></div><div class="sky-aura"></div><div class="sky-ribbon"></div><div class="sky-event"></div></div><div class="body"></div></div></ha-card><dialog aria-labelledby="detail-title"><div class="dialog-inner"></div></dialog>`;
    this.shadowRoot.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");
      if (button) {
        this._keyboardAction = e.detail === 0;
        this._action(button.dataset.action, button.dataset.value);
      }
    });
    this.shadowRoot.querySelector("dialog").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) this._closeDetail(false);
    });
    this.shadowRoot
      .querySelector("dialog")
      .addEventListener("cancel", (event) => {
        event.preventDefault();
        this._closeDetail(true);
      });
    this._onVisibility = () => this._animate();
    this._onMotion = () => {
      this._animate();

      this._render();
    };
    this.shadowRoot.querySelector("dialog").addEventListener("close", () => {
      const dialog = this.shadowRoot.querySelector("dialog");
      // A queued close event must not unload a map that was just reopened.
      if (!dialog.open)
        dialog.querySelectorAll("iframe").forEach((frame) => frame.remove());
    });
    this._skyTime = 0;
  }
  setConfig(config) {
    if (config.entity && !config.entity.startsWith("weather."))
      throw new Error("Select an Atmosphere weather entity.");
    this._config = { ...config };
    this._locationGeneration = (this._locationGeneration || 0) + 1;
    this._locationBusy = false;
    this._locationError = null;
    this._deviceCoords = null;
    this._locationNote = null;
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

    cancelAnimationFrame(this._raf);
    this._observer?.disconnect();
    this._resize?.disconnect();
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._reduced.removeEventListener("change", this._onMotion);
  }
  async _fetch() {
    if (!this._hass || !this._config || this._fetching) return;
    this._fetching = true;
    const config = this._config,
      locationGeneration = this._locationGeneration;
    try {
      const entity = this._entity();
      if (this._config.entity && !entity)
        throw new Error(`Entity unavailable: ${this._config.entity}`);
      const data = await this._hass.callWS(
        this._deviceCoords
          ? {
              type: "atmosphere/location",
              ...this._deviceCoords,
              language: this._data?.language || "nl",
            }
          : {
              type: "atmosphere/data",
              ...(entity?.attributes?.atmosphere_entry_id
                ? { entry_id: entity.attributes.atmosphere_entry_id }
                : {}),
            },
      );
      if (
        config !== this._config ||
        locationGeneration !== this._locationGeneration
      )
        return;
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
    return `<button class="panel ${classes}" data-section="${title === "sunrise" || title === "sunset" ? "sun" : title}" data-action="detail" data-value="${esc(action)}"><h2>${this._t(title)}<span class="chevron" aria-hidden="true">${glyph("chevron", 14)}</span></h2>${content}</button>`;
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
    const scene = skyState(d);
    this._scene = scene;
    sky.dataset.period = scene.period;
    sky.dataset.events = scene.events.join(" ");
    sky.dataset.effects = scene.effects.join(" ");
    const edge = Math.min(
      Math.abs(Date.now() - new Date(d.sun.sunrise)),
      Math.abs(Date.now() - new Date(d.sun.sunset)),
    );
    sky.style.setProperty(
      "--twilight",
      String(clamp(1 - edge / (85 * 60000), 0, 1) * (!night ? 0.6 : 0.25)),
    );
    sky.classList.toggle(
      "paused",
      this._reduced.matches || !this._visible || document.hidden,
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
    const hasRain = rainNext.some(
      (r) => valid(r.precipitation) && r.precipitation > 0,
    );
    const willRain = rainNext.some(
      (r) => (r.precipitation || 0) > 0 || r.might_rain,
    );
    body.innerHTML = `
      <div class="toolbar"><button class="location-pin ${this._deviceCoords ? "selected" : ""}" data-action="locate" aria-label="${this._t("currentLocation")}" aria-busy="${!!this._locationBusy}" title="${this._t("currentLocation")}">${glyph("location", 20)}</button><span>${this._date(new Date(), { weekday: "long", day: "numeric", month: "long" })}</span>${this._deviceCoords ? `<button class="home-location" data-action="home" aria-label="${this._t("homeLocation")}">${glyph("back", 18)}<span>${this._t("back")}</span></button>` : ""}</div>

      ${stale ? `<div class="connection-status" role="status">${this._t("stale")} · ${this._t("warnUnavailable")}<button data-action="refresh">${this._t("refresh")}</button></div>` : ""}
      ${this._locationBusy || this._locationError ? `<div class="location-status" role="status"><div class="location-message">${esc(this._locationBusy ? this._t("locating") : this._locationError)}${!this._locationBusy && this._appTrackers().length ? `<button data-action="app-location">${this._t("appLocation")}</button>` : ""}</div><button class="close location-dismiss" data-action="dismiss-location" aria-label="${this._t("closeLocation")}">${glyph("close", 18)}</button></div>` : ""}
      ${this._locationNote ? `<div class="location-note">${esc(this._locationNote)}</div>` : ""}
      <div class="overview">
      <header class="hero" data-section="current"><div class="hero-place"><h1>${esc(this._deviceCoords ? d.name : this._config.name || d.name)}</h1></div><div class="hero-reading"><div class="temperature">${this._temp(c.temperature)}</div><div class="hero-weather"><span class="live-weather-icon" aria-hidden="true">${icon(condition, night, 40)}</span><button class="condition" data-action="detail" data-value="current" aria-label="${this._t("current")}">${this._condition(condition)}${glyph("chevron", 14)}</button><div class="hero-range">${valid(c.apparent_temperature) ? `<span>${this._t("feels")} ${this._temp(c.apparent_temperature)}</span>` : ""}<span>${valid(today.temperature) ? `${this._t("high")} ${this._temp(today.temperature)}` : ""} ${valid(today.templow) ? `${this._t("low")} ${this._temp(today.templow)}` : ""}</span></div></div></div></header>
        <button data-section="warnings" class="panel warning ${warnings.length ? "has-warning" : ""} level-${warnings[0]?.level || 0}" data-action="detail" data-value="warnings"><h2><span aria-hidden="true">${glyph(warnings.length ? "warnings" : "check", 18)}</span>${this._t("warnings")}<span class="chevron" aria-hidden="true">${glyph("chevron", 14)}</span></h2>${warnings.length ? `<div class="warning-title">${esc(warnings[0].friendly_name)}</div><div class="warning-line"><span class="severity-dot"></span>${this._t(stale ? "stale" : new Date(warnings[0].starts_at) <= new Date() ? "active" : "upcoming")} · ${this._time(warnings[0].starts_at)} – ${this._time(warnings[0].ends_at)}</div><p class="warning-preview">${esc(warnings[0].text)}</p>${warnings.length > 1 ? `<span class="warning-count">+${warnings.length - 1}</span>` : ""}` : `<div class="warning-title">${this._t(stale ? "warnUnavailable" : "clear")}</div><div class="warning-line">KMI / IRM</div>`}</button>
      </div>
      <div class="forecast-grid">

        <section data-section="hourly" class="panel hourly"><div class="panel-header"><h2>${this._t("hourly")}</h2><div class="segmented" data-mode="${this._mode}" role="group" aria-label="${this._t("hourly")}">${["temperature", "rain", "wind"].map((m, i) => `<button data-action="mode" data-value="${m}" aria-label="${this._t(m)}" aria-pressed="${this._mode === m}">${glyph(m, 18)}</button>`).join("")}</div></div><div class="hours">${hourly.map((f, i) => `<button class="hour" data-action="hour" data-value="${esc(f.datetime)}"><span>${i === 0 ? this._t("now") : this._time(f.datetime, { minute: undefined })}</span>${icon(f.condition, !f.is_daytime, 32)}<span class="chance">${valid(f.precipitation_probability) ? num(f.precipitation_probability) + "%" : "—"}</span><strong>${this._mode === "temperature" ? this._temp(f.temperature) : this._mode === "rain" ? num(f.precipitation, 1) : num(f.wind_speed)}</strong>${this._mode !== "temperature" ? `<small>${this._mode === "rain" ? "mm" : "km/h"}</small>` : ""}</button>`).join("")}</div></section>
        <section data-section="daily" class="panel daily"><h2>${d.daily.length} ${this._nl ? "dagen" : "days"}</h2><div class="days">${this._dailyRows(d.daily)}</div></section>
        <div class="observations"><div class="metrics">
          ${this._panel("feels", `<div class="metric-value">${this._temp(c.apparent_temperature)}</div><div class="metric-note">${this._nl ? "Werkelijk" : "Actual"} ${this._temp(c.temperature)}</div><div class="feels-line"><span style="left:${clamp(50 + ((c.apparent_temperature ?? c.temperature) - c.temperature) * 4, 5, 95)}%"></span></div>`)}
          ${this._panel(sunKey, `<div class="metric-value">${this._time(sunNext)}</div>${this._sunArc()}<div class="metric-note sun-note">${this._t(sunKey === "sunset" ? "sunrise" : "sunset")} ${this._time(d.sun[sunKey === "sunset" ? "sunrise" : "sunset"])}</div>`, "sun")}
          ${this._panel("air", `<div class="aq-head"><span class="metric-value">${num(aq)}</span><span class="aq-category">${aqTitle}</span></div><div class="spectrum aqi"><i style="left:${clamp(((aq || 0) / 120) * 100, 2, 98)}%"></i></div><div class="metric-note">European AQI</div>`)}
          ${this._panel("wind", `<div class="wind-layout"><div><span class="metric-value">${num(c.wind_speed)}</span><span class="unit">km/h</span></div><div class="compass"><span class="north">N</span><span class="west">W</span><span class="east">E</span><span class="south">S</span><div class="needle" style="transform:rotate(${valid(c.wind_bearing) ? c.wind_bearing : 0}deg)"></div><b>${windDirection}</b></div></div><div class="metric-note">${this._t("gusts")} ${num(c.wind_gust_speed)} km/h</div>`)}
          ${this._panel("uv", `<div class="metric-value">${num(uv, 1)}</div><div class="metric-note">${uvTitle}</div><div class="spectrum uv"><i style="left:${clamp(((uv || 0) / 12) * 100, 2, 98)}%"></i></div>`)}
          ${this._panel(
            "rain",
            `<div class="rain-summary"><div><div class="metric-value">${num(today.precipitation, 1)}<span class="unit">mm</span></div><div class="metric-note">${this._t("today")}</div></div>${this._hourChart(hourly, "precipitation")}</div>`,
          )}
        </div>
        ${this._panel("moon", `<div class="moon-layout"><div><div class="moon-phase">${this._moonName(moon.phase)}</div><div class="metric-note">${num(moon.fraction * 100)}% ${this._t("illuminated")}</div><div class="moon-date">${this._date(this._nextFullMoon(), { day: "numeric", month: "short" })}<span>${this._t("nextFull")}</span></div></div><canvas class="moon" width="240" height="240" aria-hidden="true"></canvas></div>`, "moon", "moon-panel")}
        </div>
        <section data-section="radar" class="panel radar-panel"><div class="panel-header"><h2>${this._t("radar")}</h2><button class="text-button" data-action="detail" data-value="radar">${this._t("rainmap")} <span aria-hidden="true">${glyph("arrow", 14)}</span></button></div><div class="rainfall"><button class="rain-total" data-action="detail" data-value="rain"><strong>${num(today.precipitation, 1)}<span> mm</span></strong><span>${this._t("todayForecast")}${glyph("chevron", 14)}</span></button><div class="nowcast"><button class="rain-outlook" data-action="detail" data-value="radar"><span>${this._t(!rainNext.some((r) => valid(r.precipitation) || r.might_rain) ? "rainUnavailable" : hasRain ? "rainSoon" : willRain ? "rainPossible" : "noRain")}</span><span aria-hidden="true">${glyph("chevron", 14)}</span></button>${hasRain ? this._rainChart(rainNext) : ""}</div></div></section>

        <div class="small-metrics">${this._panel("humidity", `<div class="small-value">${num(c.humidity)}<span>%</span></div><div class="metric-note">${this._t("dew")} ${this._temp(c.dew_point)}</div>`)}${this._panel("visibility", `<div class="small-value">${num(c.visibility, 1)}<span>km</span></div>`)}${this._panel("pressure", `<div class="small-value">${num(c.pressure)}<span>hPa</span></div><div class="pressure-scale"><span>980</span><i style="left:${clamp((((c.pressure || 1013) - 980) / 60) * 100, 0, 100)}%"></i><span>1040</span></div>`)}</div>
      </div><footer><span>${this._t("updated")} ${this._time(d.updated_at)} · KMI / IRM</span><button data-action="detail" data-value="source">${this._t("source")} ⓘ</button></footer>`;
    body.querySelector(".hours").scrollLeft = oldScroll;
    body.querySelector(".days").scrollTop = scrollTop;
    this._applyVisibility();
    this._drawMoon(body.querySelector(".moon"));
    this._drawMoon(this.shadowRoot.querySelector(".sky-moon"));
    this._sizeCanvas();
    this._animate();
  }
  _dailyRows(days) {
    return days
      .map(
        (f, i) =>
          `<button class="day" data-action="day" data-value="${i}" aria-label="${esc(this._date(`${f.datetime.slice(0, 10)}T12:00:00`, { weekday: "long" }))}: ${this._temp(f.templow)} – ${this._temp(f.temperature)}"><span class="day-name">${i === 0 ? this._t("today") : this._date(`${f.datetime.slice(0, 10)}T12:00:00`, { weekday: "short" })}</span><span class="day-condition">${icon(f.condition, false, 28)}<small>${valid(f.precipitation_probability) ? num(f.precipitation_probability) + "%" : ""}</small></span><span class="day-description">${this._condition(f.condition)}</span><span class="day-temperatures"><span class="low">${this._temp(f.templow)}</span><span class="high">${this._temp(f.temperature)}</span></span></button>`,
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
    const arc = smoothPath(
      Array.from({ length: 25 }, (_, i) => {
        const x = -10 + (i * 220) / 24;
        return [x, 57 - Math.sin(((x - 10) / 180) * Math.PI) * 47];
      }),
    );
    return `<svg class="sun-arc" viewBox="0 0 200 76" aria-hidden="true"><path d="${arc}" fill="none" stroke="white" stroke-opacity=".22" stroke-width="5"/><path d="M0 57h200" stroke="white" stroke-opacity=".3"/><circle cx="${x}" cy="${y}" r="6" fill="#fff8d9" style="filter:drop-shadow(0 0 6px #fff)"/></svg>`;
  }
  _rainChart(rain) {
    const samples = rain.filter((r) => valid(r.precipitation));
    if (!samples.length) return "";
    const max = Math.max(
      0.1,
      Math.ceil(Math.max(...samples.map((r) => r.precipitation)) * 10) / 10,
    );
    const unit = samples.find((r) => r.unit)?.unit || "";
    const points = samples
      .map((r) => [
        clamp(
          ((new Date(r.datetime) - Date.now()) / (90 * 60000)) * 500,
          0,
          500,
        ),
        60 - (r.precipitation / max) * 54,
      ])
      .filter((p, i, a) => !i || p[0] > a[i - 1][0]);
    const curve = smoothPath(points),
      area = curve + `L${points.at(-1)[0]},62L${points[0][0]},62Z`;
    return `<div class="rain-plot"><div class="rain-scale" aria-hidden="true"><span>${num(max, 1)}<small>${esc(unit)}</small></span><span>0</span></div><div><div class="rain-chart"><svg viewBox="0 0 500 64" preserveAspectRatio="none" role="img" aria-label="${this._t("rainAmount")}: 0–${num(max, 1)} ${esc(unit)}"><defs><linearGradient id="nowcast-fill" x2="0" y2="1"><stop stop-color="#9ce1ee" stop-opacity=".5"/><stop offset="1" stop-color="#9ce1ee" stop-opacity=".02"/></linearGradient></defs><path d="M0 62H500M0 6H500" stroke="white" stroke-opacity=".1"/><path d="${area}" fill="url(#nowcast-fill)"/><path d="${curve}" fill="none" stroke="#aeeaf3" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div><div class="chart-times"><span>${this._t("now")}</span><span>+45 min</span><span>+90 min</span></div></div></div>`;
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
    return drawMoon(canvas, SunCalc.getMoonIllumination(new Date()).phase);
  }
  _sizeCanvas() {
    const canvas = this.shadowRoot.querySelector(".precipitation"),
      rect = this.getBoundingClientRect();
    if (
      canvas.width !== Math.round(rect.width) ||
      canvas.height !== Math.round(Math.min(rect.height, 330))
    ) {
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(Math.min(rect.height, 330));
    }
  }
  _animate() {
    cancelAnimationFrame(this._raf);
    this._raf = null;
    const moving =
      this.isConnected &&
      this._visible &&
      !document.hidden &&
      !this._reduced.matches;
    this.shadowRoot
      .querySelector(".atmosphere")
      .classList.toggle("paused", !moving);
    const canvas = this.shadowRoot.querySelector(".precipitation"),
      ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const condition = this._data?.current?.condition || "";
    if (!moving || !this._data) return;
    const night =
      this.shadowRoot.querySelector(".atmosphere").dataset.night === "true";
    const precipitation = /(rain|pour|snow|hail|lightning)/.test(condition),
      snow = condition === "snowy";
    const wind = clamp((this._data?.current?.wind_speed || 12) / 22, 0.55, 2.5);
    const clouds = this.shadowRoot.querySelectorAll(".clouds"),
      sun = this.shadowRoot.querySelector(".sun-orb"),
      rays = this.shadowRoot.querySelector(".rays"),
      horizon = this.shadowRoot.querySelector(".horizon");
    const aura = this.shadowRoot.querySelector(".sky-aura"),
      ribbon = this.shadowRoot.querySelector(".sky-ribbon"),
      eventGlow = this.shadowRoot.querySelector(".sky-event"),
      heroIcon = this.shadowRoot.querySelector(".live-weather-icon"),
      scene = this._scene || skyState(this._data);
    const eventTargets = scene.events
      .map((event) => {
        const selector = {
          warning: ".warning h2",
          "incoming-rain": ".radar-panel h2",
          sunrise: '[data-section="sun"] h2',
          sunset: '[data-section="sun"] h2',
          "full-moon": ".moon-panel h2",
          "new-moon": ".moon-panel h2",
          heat: ".condition",
          frost: ".condition",
          gusts: '[data-section="wind"] h2',
        }[event];
        return this.shadowRoot.querySelector(selector);
      })
      .filter(Boolean);
    const has = (effect) => scene.effects.includes(effect);
    const mode =
      has("rain-streaks") || has("dense-rain")
        ? "rain"
        : has("falling-snow")
          ? "snow"
          : has("star-twinkle") || (scene.night && !precipitation)
            ? "stars"
            : has("wind-streams")
              ? "wind"
              : has("light-motes")
                ? "motes"
                : "none";
    const signature = `${mode}:${canvas.width}:${canvas.height}`;
    if (this._particleSignature !== signature) {
      this._particleSignature = signature;
      const count =
        mode === "none"
          ? 0
          : mode === "stars"
            ? 95
            : mode === "rain"
              ? has("dense-rain")
                ? 210
                : 125
              : mode === "snow"
                ? 80
                : 32;
      this._particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: 0.4 + Math.random(),
        r: 0.7 + Math.random() * 1.6,
        phase: i * 2.39,
      }));
    }
    let last = null;
    const frame = (time) => {
      // Media/visibility events can arrive after a queued frame; recheck before drawing.
      if (
        !this.isConnected ||
        !this._visible ||
        document.hidden ||
        this._reduced.matches
      ) {
        this._raf = null;
        return;
      }
      const dt = last === null ? 0 : Math.min((time - last) / 1000, 0.05);
      last = time;
      this._skyTime += dt;
      const t = this._skyTime,
        far = 0.5 - 0.5 * Math.cos(((t * wind) / 19) * Math.PI),
        near = 0.5 + 0.5 * Math.cos(((t * wind) / 28) * Math.PI);
      const cloudTravel = has("cloud-parallax") ? 24 : 20;
      clouds[0].style.transform = `translateX(${-8 + cloudTravel * far}%) translateY(${Math.sin(t / 17) * 5}px) scale(${1.02 + 0.07 * far})`;
      clouds[1].style.transform = `translateX(${-12 + 25 * near}%) translateY(${Math.cos(t / 13) * 9}px) scale(${1.05 + 0.08 * near})`;
      clouds[2].style.transform = `translateX(${Math.sin((t * wind) / 23) * 13}%) translateY(${Math.sin(t / 11) * 13}px) scale(1.12)`;
      sun.style.transform = `translateX(-50%) translateY(${Math.sin(t / 12) * 5}px) scale(${1 + 0.04 * Math.sin(t / 9)})`;
      rays.style.transform = `rotate(${16 + Math.sin(t / 18) * 5}deg) translateX(${Math.sin(t / 10) * 15}px)`;
      if (has("cloud-edge-light"))
        clouds[1].style.opacity = String(
          0.35 + 0.15 * (0.5 + 0.5 * Math.sin(t / 6)),
        );
      if (has("rolling-cloud-bank"))
        clouds[2].style.opacity = String(0.25 + 0.1 * Math.sin(t / 7));
      if (has("gust-parallax"))
        clouds[1].style.transform = `translateX(${-18 + 36 * near}%) scale(1.12)`;
      if (has("sunbeams") || has("rising-rays"))
        rays.style.opacity = String(0.16 + 0.08 * Math.sin(t / 6));
      horizon.style.opacity = String(
        (has("horizon-afterglow") ? 0.8 : 0.65) + 0.2 * Math.sin(t / 13),
      );
      horizon.style.transform = `translateX(${Math.sin(t / 31) * 3}%)`;
      aura.style.transform = `translateX(${Math.sin(t / 8) * 8}%) scale(${1 + Math.sin(t / 11) * 0.05})`;
      aura.style.opacity = String(
        (has("lunar-haze") ? 0.07 : has("solar-haze") ? 0.11 : 0.16) +
          0.035 * Math.sin(t / 5),
      );
      ribbon.style.transform = `translateX(${Math.sin(t / (has("night-airglow") ? 14 : has("daylight-drift") ? 9 : 7)) * 10}%) translateY(${Math.cos(t / 6) * 8}px)`;
      ribbon.style.opacity = String(
        0.05 + 0.035 * (0.5 + 0.5 * Math.sin(t / 4)),
      );
      eventGlow.style.transform = `scale(${1.1 + 0.1 * Math.sin(t / 5)})`;
      eventGlow.style.opacity = scene.events.some((event) =>
        ["full-moon", "sunrise", "sunset", "heat", "warning"].includes(event),
      )
        ? String(0.1 + 0.06 * (0.5 + 0.5 * Math.sin(t / 4)))
        : "0";
      if (heroIcon) {
        heroIcon.style.transform = `translateY(${Math.sin(t * (precipitation ? 1.6 : 0.7)) * (precipitation ? 2 : 1)}px) rotate(${Math.sin(t / 3) * (condition.includes("wind") ? 5 : 1.5)}deg)`;
        heroIcon.style.opacity = String(
          0.82 + 0.18 * (0.5 + 0.5 * Math.sin(t / 3)),
        );
      }
      for (const target of eventTargets)
        target.style.opacity = String(
          0.8 + 0.2 * (0.5 + 0.5 * Math.sin(t / 3)),
        );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of this._particles) {
        ctx.beginPath();
        if (mode === "stars") {
          ctx.globalAlpha =
            (0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.7 + p.phase))) *
            clamp(1 - p.y / canvas.height, 0.15, 1);
          ctx.fillStyle = "#edf6ff";
          ctx.arc(p.x, p.y, p.r * 0.65, 0, Math.PI * 2);
          ctx.fill();
        } else if (mode === "motes") {
          p.y -= dt * 5 * p.s;
          p.x += dt * 8 * p.s;
          ctx.globalAlpha = 0.13 + 0.1 * Math.sin(t + p.phase);
          ctx.fillStyle = "#fff9df";
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (mode === "wind") {
          p.x += dt * 80 * wind * p.s;
          p.y += dt * Math.sin(t + p.phase) * 3;
          ctx.globalAlpha = 0.06;
          ctx.strokeStyle = "#e4f3ff";
          ctx.lineWidth = 0.65;
          ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x + 20, p.y - 3, p.x + 55 * p.s, p.y);
          ctx.stroke();
        } else if (mode === "snow") {
          p.y += dt * 25 * p.s;
          p.x += dt * (Math.sin(t / 2 + p.phase) * 10 - 15 * wind);
          ctx.globalAlpha = 0.35 + p.s * 0.3;
          ctx.fillStyle = "#eef8ff";
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.y += dt * (has("dense-rain") ? 740 : 570) * p.s;
          p.x -= dt * 85 * wind;
          ctx.globalAlpha = 0.14 + p.s * 0.16;
          ctx.strokeStyle = "#d6edff";
          ctx.lineWidth = 0.65;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + wind * 3, p.y - 18 * p.s);
          ctx.stroke();
        }
        if (p.y > canvas.height + 30) p.y = -30;
        if (p.y < -35) p.y = canvas.height + 25;
        if (p.x > canvas.width + 60) p.x = -60;
        if (p.x < -65) p.x = canvas.width + 60;
      }
      ctx.globalAlpha = 1;
      if (night && !precipitation) {
        const phase = t % 37;
        if (phase > 27 && phase < 28.5) {
          const progress = (phase - 27) / 1.5,
            x = canvas.width * (0.2 + 0.5 * progress),
            y = 35 + progress * 150;
          ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.65;
          const streak = ctx.createLinearGradient(x - 60, y - 22, x, y);
          streak.addColorStop(0, "transparent");
          streak.addColorStop(1, "#ecf7ff");
          ctx.strokeStyle = streak;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x - 60, y - 22);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      drawSkyAccents(ctx, scene, t, wind, canvas.width, canvas.height);
      this._raf = requestAnimationFrame(frame);
    };
    this._raf = requestAnimationFrame(frame);
  }
  _action(action, value) {
    if (action === "refresh") return this._fetch();
    if (action === "dismiss-location") {
      this._locationGeneration++;
      this._locationBusy = false;
      this._locationError = null;
      this._render();
      this.shadowRoot
        .querySelector(".location-pin")
        .focus({ preventScroll: true });
      return;
    }
    if (action === "locate") return this._locate();
    if (action === "app-location") return this._chooseAppLocation();
    if (action === "use-tracker") return this._useTracker(value);
    if (action === "home") {
      this._locationGeneration++;
      this._locationBusy = false;
      this._deviceCoords = null;
      this._locationNote = null;
      this._locationError = null;
      this._fetch();
      return;
    }
    if (action === "mode") {
      this._mode = value;
      const old = this.shadowRoot.querySelector(".segmented");
      const focused = old?.contains(this.shadowRoot.activeElement);
      const hours = this.shadowRoot.querySelector(".hours");
      this._render();
      const next = this.shadowRoot.querySelector(".segmented");
      if (old && next) {
        next.replaceWith(old);
        old.getBoundingClientRect();
        old
          .querySelectorAll("button")
          .forEach((button) =>
            button.setAttribute(
              "aria-pressed",
              String(button.dataset.value === value),
            ),
          );
        old.dataset.instant = String(
          !!this._keyboardAction || this._reduced.matches,
        );
        old.dataset.mode = value;
        if (focused)
          old
            .querySelector(`[data-value="${value}"]`)
            .focus({ preventScroll: true });
      }
      if (hours && !this._keyboardAction && !this._reduced.matches) {
        this.shadowRoot
          .querySelectorAll(".hour .weather-icon")
          .forEach((el, i) =>
            el.animate(
              [
                { opacity: 0.45, transform: "translateY(3px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 160,
                delay: Math.min(i, 4) * 20,
                easing: "cubic-bezier(0.23, 1, 0.32, 1)",
              },
            ),
          );
      }
      return;
    }
    if (action === "close") {
      this._closeDetail();
      return;
    }
    if (action === "map") {
      this._showMap(value);
      return;
    }
    this._openDetail(action === "detail" ? value : action, value);
  }
  async _closeDetail(instant = this._keyboardAction) {
    const dialog = this.shadowRoot.querySelector("dialog");
    if (!dialog.open) return;
    if (instant) {
      dialog.dataset.instant = "true";
      dialog.close();
      return;
    }
    const transition = (this._dialogTransition =
      (this._dialogTransition || 0) + 1);
    dialog.dataset.closing = "";
    // Keep the native top layer until the exit finishes, including on Safari.
    await Promise.race([
      Promise.allSettled(
        dialog.getAnimations({ subtree: true }).map((a) => a.finished),
      ),
      new Promise((resolve) => setTimeout(resolve, 220)),
    ]);
    if (transition === this._dialogTransition) dialog.close();
  }
  _openDetail(type, value) {
    const d = this._data,
      c = d.current,
      t = this._t.bind(this);
    let title = t(type),
      content = "";
    const stats = (rows) =>
      `<dl class="detail-stats">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
    if (type === "current") {
      title = t("current");
      content = `<div class="current-detail">${icon(c.condition, false, 60)}<div class="detail-temperature">${this._temp(c.temperature)}</div><p>${this._condition(c.condition)}</p></div>${stats(
        [
          [t("feels"), this._temp(c.apparent_temperature)],
          [t("humidity"), num(c.humidity) + "%"],
          [t("dew"), this._temp(c.dew_point)],
          [t("visibility"), num(c.visibility, 1) + " km"],
          [t("pressure"), num(c.pressure) + " hPa"],
          [t("wind"), num(c.wind_speed) + " km/h"],
        ],
      )}`;
    } else if (type === "warnings") {
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
          ...(valid(f.templow) ? [[t("low"), this._temp(f.templow)]] : []),
          [
            t("rain"),
            `${num(f.precipitation, 1)} mm · ${num(f.precipitation_probability)}%`,
          ],
          [t("wind"), `${num(f.wind_speed)} km/h`],
          [t("gusts"), `${num(f.wind_gust_speed)} km/h`],
        ],
      )}`;
    } else if (type === "radar" || type === "map") {
      title = t(type === "map" && value === "wind" ? "windmap" : "radar");
      content = `<div class="map-switch" role="group" aria-label="${t("details")}"><button data-action="map" data-value="radar">${t("radarLayer")}</button><button data-action="map" data-value="rain">${t("forecast")}</button><button data-action="map" data-value="wind">${t("wind")}</button></div><div class="map-host"></div>`;
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
      content = `<p>${esc(d.attribution)}</p><p>${this._nl ? "Voorspellingen en waarschuwingen worden elke 7 minuten opgehaald. Aanvullende modelgegevens elke 30 minuten. Waarschuwingen kunnen een ruimer gebied betreffen: lees de waarschuwingstekst." : "Forecasts and warnings refresh every 7 minutes; supplementary model data every 30 minutes. Warnings may concern a wider area: read the warning text."}</p><p>${this._nl ? "Windkaarten worden op verzoek geladen van Windy. Zon- en maangegevens worden lokaal berekend. Maanbeelden: NASA/LRO." : "Wind maps load from Windy on request. Sun and moon information is calculated locally. Moon imagery: NASA/LRO."}</p><p>${t("updated")}: ${this._time(d.updated_at)}${this._isStale() ? " · " + t("stale") : ""}</p><a href="https://github.com/TwilightDuck/ha-atmosphere" target="_blank" rel="noopener noreferrer">Atmosphere 1.5.2 ↗</a>`;
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
      `<div class="dialog-header"><h2 id="detail-title">${esc(title)}</h2><button class="close" data-action="close" aria-label="${t("close")}">${glyph("close", 20)}</button></div>${content}`;
    this._dialogTransition = (this._dialogTransition || 0) + 1;
    delete dialog.dataset.closing;
    dialog.dataset.instant = String(!!this._keyboardAction);
    if (!dialog.open) dialog.showModal();
    if (type === "moon") this._drawMoon(dialog.querySelector(".moon"));
    dialog.dataset.detail = type;
    dialog.classList.toggle("map-dialog", type === "radar" || type === "map");
    if (type === "radar" || type === "map")
      this._showMap(type === "map" ? value : "radar");
  }
  _showMap(layer) {
    const dialog = this.shadowRoot.querySelector("dialog");
    if (!dialog.classList.contains("map-dialog"))
      return this._openDetail("map", layer);
    const host = dialog.querySelector(".map-host"),
      d = this._data,
      url = new URL("https://embed.windy.com/embed.html");
    url.search = new URLSearchParams({
      type: "map",
      location: "coordinates",
      metricWind: "km/h",
      metricTemp: "°C",
      metricRain: "mm",
      zoom: "11",
      overlay: layer,
      product: "ecmwf",
      level: "surface",
      lat: d.latitude.toFixed(4),
      lon: d.longitude.toFixed(4),
      detailLat: d.latitude.toFixed(4),
      detailLon: d.longitude.toFixed(4),
      marker: "true",
      calendar: "now",
      message: "false",
    }).toString();
    dialog.querySelector("#detail-title").textContent = this._t(
      layer === "wind" ? "windmap" : layer === "rain" ? "rain" : "radar",
    );
    dialog
      .querySelectorAll('[data-action="map"]')
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.value === layer),
        ),
      );
    host.innerHTML = `<iframe title="${this._t(layer === "wind" ? "windmap" : "rainmap")}" src="${esc(url.href)}" referrerpolicy="no-referrer" allowfullscreen></iframe><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Windy ${glyph("arrow", 13)}</a>`;
  }
  _applyVisibility() {
    const root = this.shadowRoot,
      show = configuredSections(this._config);
    root
      .querySelectorAll("[data-section]")
      .forEach(
        (el) =>
          (el.hidden =
            Array.isArray(show) && !show.includes(el.dataset.section)),
      );
    if (!this._isStale() && !this._warnings().length)
      root.querySelector(".warning").hidden = true;
    for (const selector of [".metrics", ".small-metrics"]) {
      const el = root.querySelector(selector);
      const count = [...el.children].filter((c) => !c.hidden).length;
      el.hidden = count === 0;
      el.dataset.count = count;
    }
    const observations = root.querySelector(".observations");
    observations.hidden =
      root.querySelector(".metrics").hidden &&
      root.querySelector(".moon-panel").hidden;
    for (const pair of [[".daily", ".observations"]]) {
      const [a, b] = pair.map((s) => root.querySelector(s));
      if (a.hidden && !b.hidden) b.style.gridColumn = "1 / -1";
      if (b.hidden && !a.hidden) a.style.gridColumn = "1 / -1";
    }
  }
  _appTrackers() {
    const states = this._hass?.states || {},
      user = this._hass?.user?.id;
    if (!user) return [];
    const ids = new Set(
      Object.values(states)
        .filter(
          (e) =>
            e.entity_id.startsWith("person.") && e.attributes.user_id === user,
        )
        .flatMap((e) => e.attributes.device_trackers || []),
    );
    return [...ids]
      .map((id) => states[id])
      .filter(
        (e) =>
          e?.attributes.source_type === "gps" &&
          valid(e.attributes.latitude) &&
          valid(e.attributes.longitude),
      );
  }
  _trackerFresh(e) {
    const a = e?.attributes || {};
    return (
      e &&
      !["unknown", "unavailable"].includes(e.state) &&
      valid(a.latitude) &&
      valid(a.longitude) &&
      valid(a.gps_accuracy) &&
      a.gps_accuracy >= 0 &&
      a.gps_accuracy <= 250 &&
      Date.now() - new Date(e.last_updated).getTime() <= 15 * 60000
    );
  }
  _chooseAppLocation() {
    const trackers = this._appTrackers();
    if (trackers.length === 1 && this._trackerFresh(trackers[0]))
      return this._useTracker(trackers[0].entity_id);
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.classList.remove("map-dialog");
    delete dialog.dataset.detail;
    dialog.querySelector(".dialog-inner").innerHTML =
      `<div class="dialog-header"><h2 id="detail-title">${this._t("chooseDevice")}</h2><button class="close" data-action="close" aria-label="${this._t("close")}">${glyph("close", 20)}</button></div>${trackers.map((e) => `<button class="tracker-choice" data-action="use-tracker" data-value="${esc(e.entity_id)}" ${this._trackerFresh(e) ? "" : "disabled"}><strong>${esc(e.attributes.friendly_name || e.entity_id)}</strong><span>${this._t("reported")} ${this._time(e.last_updated)} · ±${num(e.attributes.gps_accuracy)} m</span></button>`).join("")}<p>${this._t("staleLocation")}</p>`;
    this._dialogTransition = (this._dialogTransition || 0) + 1;
    delete dialog.dataset.closing;
    dialog.dataset.instant = String(!!this._keyboardAction);
    if (!dialog.open) dialog.showModal();
  }
  async _useTracker(entityId) {
    const entity = this._appTrackers().find((e) => e.entity_id === entityId);
    if (!this._trackerFresh(entity)) {
      this._locationError = this._t("staleLocation");
      this._render();
      return;
    }
    await this._closeDetail();
    await this._loadLocation(
      entity.attributes,
      `${entity.attributes.friendly_name || entityId} · ${this._t("reported")} ${this._time(entity.last_updated)} · ±${num(entity.attributes.gps_accuracy)} m`,
    );
  }
  async _locate() {
    if (this._locationBusy) return;
    const generation = this._locationGeneration;
    if (
      (window.externalApp || window.webkit?.messageHandlers?.externalBus) &&
      this._appTrackers().length
    )
      return this._chooseAppLocation();
    this._locationBusy = true;
    this._locationError = null;
    this._render();
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation
          ? navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              maximumAge: 60000,
              timeout: 12000,
            })
          : reject({ code: 2 }),
      );
      if (generation !== this._locationGeneration) return;
      if (!valid(position.coords.accuracy) || position.coords.accuracy > 1000)
        throw { code: 2 };
      await this._loadLocation(
        position.coords,
        `${this._t("currentLocation")} · ±${num(position.coords.accuracy)} m`,
      );
    } catch (error) {
      if (generation !== this._locationGeneration) return;
      this._locationError = this._t(
        error.code === 1 ? "locationDenied" : "locationFailed",
      );
    } finally {
      if (generation === this._locationGeneration) {
        this._locationBusy = false;
        this._render();
      }
    }
  }
  async _loadLocation(coords, note) {
    let generation = this._locationGeneration;
    this._locationBusy = true;
    this._locationError = null;
    this._render();
    try {
      const coordinate = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      const data = await this._hass.callWS({
        type: "atmosphere/location",
        ...coordinate,
        language: this._data?.language || "nl",
      });
      if (generation !== this._locationGeneration) return;
      generation = ++this._locationGeneration;
      this._deviceCoords = coordinate;
      this._data = data;
      this._locationNote = note;
      this._error = null;
    } catch (error) {
      if (generation !== this._locationGeneration) return;
      this._locationError = this._t(
        error.code === "unsupported_location"
          ? "unsupported"
          : "locationFailed",
      );
    } finally {
      if (generation === this._locationGeneration) {
        this._locationBusy = false;
        this._render();
      }
    }
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
    const start = new Date(hours[0].datetime).getTime(),
      duration = Math.max(1, new Date(hours.at(-1).datetime) - start);
    const x = (h) => 12 + ((new Date(h.datetime) - start) / duration) * 476;
    const points = hours
      .filter((h) => valid(h[field]))
      .map((h) => [x(h), 100 - ((h[field] - min) / range) * 75])
      .filter((p, i, a) => !i || p[0] > a[i - 1][0]);
    const curve = smoothPath(points),
      area = curve + `L${points.at(-1)[0]},110L${points[0][0]},110Z`;
    const ticks = hours.filter(
      (h, i) => i % Math.max(1, Math.floor(hours.length / 5)) === 0,
    );
    return `<div class="detail-chart"><svg viewBox="0 0 500 140" preserveAspectRatio="none" role="img" aria-label="${this._t(field === "temperature" ? "temperature" : field === "wind_speed" ? "wind" : "rain")}"><defs><linearGradient id="forecast-fill" x2="0" y2="1"><stop stop-color="#a5e8f3" stop-opacity=".3"/><stop offset="1" stop-color="#a5e8f3" stop-opacity="0"/></linearGradient></defs><path d="M12 110H488M12 65H488M12 20H488" stroke="white" stroke-opacity=".1"/><path d="${area}" fill="url(#forecast-fill)"/><path data-forecast-curve d="${curve}" fill="none" stroke="#aeeaf3" stroke-width="3" stroke-linecap="round"/>${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#e4faff" stroke="#3b6888" stroke-width="1.5"/>`).join("")}${ticks.map((h) => `<text x="${x(h)}" y="133" fill="#cadbea" font-size="11" text-anchor="middle">${this._time(h.datetime, { minute: undefined })}</text>`).join("")}</svg><div class="chart-times"><span>${num(min, field === "precipitation" ? 1 : 0)}${unit}</span><span>${num(max, field === "precipitation" ? 1 : 0)}${unit}</span></div></div>`;
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
    this.shadowRoot.innerHTML = `<style>.section-toggle{display:flex;gap:8px;margin:8px 0}fieldset{border:1px solid var(--divider-color);border-radius:10px}label{display:grid;gap:8px;margin:16px 0}select,input{padding:12px;font:inherit;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px}</style><label>Atmosphere location<select id="entity">${entities.map((e) => `<option value="${esc(e.entity_id)}" ${this._config.entity === e.entity_id ? "selected" : ""}>${esc(e.attributes.friendly_name || e.entity_id)}</option>`).join("")}</select></label><label>Name<input id="name" value="${esc(this._config.name || "")}"/></label><label>Card language<select id="language"><option value="auto">Location language</option><option value="nl">Nederlands</option><option value="en">English</option></select></label><fieldset><legend>Visible panels</legend>${sections.map((key) => `<label class="section-toggle"><input type="checkbox" data-section-choice="${key}" ${configuredSections(this._config).includes(key) ? "checked" : ""}/>${words.en[key] || (key === "sun" ? "Sunrise and sunset" : key)}</label>`).join("")}</fieldset>`;
    this.shadowRoot.querySelectorAll("[data-section-choice]").forEach((el) =>
      el.addEventListener("change", () => {
        const show = [
          ...this.shadowRoot.querySelectorAll("[data-section-choice]:checked"),
        ].map((e) => e.dataset.sectionChoice);
        this._config = { ...this._config, show };
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
          }),
        );
      }),
    );
    this.shadowRoot.querySelector("#language").value =
      this._config.language || "auto";
    this.shadowRoot
      .querySelectorAll("input:not([type=checkbox]),select")
      .forEach((el) =>
        el.addEventListener("change", () => {
          const config = { ...this._config, [el.id]: el.value };
          if (el.id === "language" && el.value === "auto")
            delete config.language;
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
class AtmosphereOverviewCard extends AtmosphereCard {
  getCardSize() {
    return 7;
  }
  static getStubConfig(hass) {
    return {
      ...super.getStubConfig(hass),
      type: "custom:atmosphere-overview-card",
    };
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

if (!customElements.get("atmosphere-overview-card"))
  customElements.define("atmosphere-overview-card", AtmosphereOverviewCard);
if (!window.customCards.some((c) => c.type === "atmosphere-overview-card"))
  window.customCards.push({
    type: "atmosphere-overview-card",
    name: "Atmosphere Overview",
    description: "Current weather, warnings, hourly forecast and radar.",
    preview: true,
  });
