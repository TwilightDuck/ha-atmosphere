"""Fetch KMI forecasts and warnings; supplement details independently."""

import asyncio
import logging
from datetime import timedelta
from zoneinfo import ZoneInfo

from aiohttp import ClientError
from astral import Observer
from astral.sun import sun
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util
from irm_kmi_api import IrmKmiApiError, RadarStyle

from .client import AtmosphereClient

_LOGGER = logging.getLogger(__name__)
TZ = ZoneInfo("Europe/Brussels")


def normalise(forecast):
    """Use a single documented SI schema in the card and native HA schema in weather."""
    item = dict(forecast)
    for field in (
        "temperature",
        "templow",
        "precipitation",
        "pressure",
        "wind_speed",
        "wind_gust_speed",
        "apparent_temperature",
        "dew_point",
    ):
        item[field] = item.get(f"native_{field}")
    return item


def daily_periods(periods):
    """Combine KMI daytime/nighttime periods on the same calendar date."""
    days = {}
    for item in periods:
        key = item["datetime"][:10]
        if key not in days:
            days[key] = dict(item)
            continue
        day = days[key]
        highs = [
            v
            for v in (day.get("native_temperature"), item.get("native_temperature"))
            if v is not None
        ]
        lows = [
            v
            for v in (day.get("native_templow"), item.get("native_templow"))
            if v is not None
        ]
        day["native_temperature"] = max(highs) if highs else None
        day["native_templow"] = min(lows) if lows else None
        # Keep daytime condition/text, but include the nighttime precipitation.
        amounts = [
            v
            for v in (day.get("native_precipitation"), item.get("native_precipitation"))
            if v is not None
        ]
        day["native_precipitation"] = sum(amounts) if amounts else None
        chances = [
            v
            for v in (
                day.get("precipitation_probability"),
                item.get("precipitation_probability"),
            )
            if v is not None
        ]
        day["precipitation_probability"] = max(chances) if chances else None
    return list(days.values())


class AtmosphereCoordinator(DataUpdateCoordinator):
    """One polling job per location; optional sources never hide KMI warnings."""

    def __init__(self, hass, entry, *, location=None):
        super().__init__(
            hass,
            _LOGGER,
            name="Atmosphere",
            config_entry=entry,
            update_interval=timedelta(minutes=7),
        )
        self.entry = entry
        self.location = location or entry.data
        self.session = async_get_clientsession(hass)
        self.api = AtmosphereClient(self.session)
        self.supplement = {}
        self.air = {}
        self.optional_at = None

    async def _json(self, url, params):
        async with asyncio.timeout(18):
            async with self.session.get(url, params=params) as response:
                response.raise_for_status()
                return await response.json()

    async def _optional(self, latitude, longitude):
        now = dt_util.utcnow()
        if self.optional_at and now - self.optional_at < timedelta(minutes=30):
            return
        params = {
            "latitude": round(latitude, 2),
            "longitude": round(longitude, 2),
            "timezone": "Europe/Brussels",
            "timeformat": "unixtime",
        }
        results = await asyncio.gather(
            self._json(
                "https://api.open-meteo.com/v1/forecast",
                params
                | {
                    "current": "relative_humidity_2m,apparent_temperature,is_day",
                    "hourly": "visibility,dew_point_2m,uv_index",
                    "forecast_days": 2,
                },
            ),
            self._json(
                "https://air-quality-api.open-meteo.com/v1/air-quality",
                params
                | {
                    "current": "european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone",
                },
            ),
            return_exceptions=True,
        )
        for attr, result in zip(("supplement", "air"), results):
            if isinstance(result, Exception):
                _LOGGER.debug("Optional %s source unavailable: %s", attr, result)
                # Never silently keep an old AQI/feels-like reading as current.
                setattr(self, attr, {})
            else:
                setattr(self, attr, result)
        self.optional_at = now

    async def _async_update_data(self):
        latitude, longitude = self.location["latitude"], self.location["longitude"]
        language = self.location["language"]
        try:
            async with asyncio.timeout(25):
                self.api.expire_cache()
                await self.api.refresh_forecasts_coord(
                    {"lat": latitude, "long": longitude}
                )
            current = self.api.get_current_weather(TZ)
            hourly = self.api.get_hourly_forecast(TZ)
            periods = self.api.get_daily_forecast(TZ, language)
            warnings = self.api.get_warnings(language)

            if current.get("temperature") is None or not hourly:
                raise ValueError("KMI returned an incomplete forecast")
        except (
            IrmKmiApiError,
            ClientError,
            TimeoutError,
            ValueError,
            KeyError,
            TypeError,
        ) as err:
            raise UpdateFailed(f"KMI forecast/warnings unavailable: {err}") from err
        await self._optional(latitude, longitude)
        now = dt_util.utcnow()
        supplement = self.supplement.get("current", {})
        current.update(
            {
                "humidity": supplement.get("relative_humidity_2m"),
                "apparent_temperature": supplement.get("apparent_temperature"),
            }
        )
        details = self.supplement.get("hourly", {})
        timestamps = details.get("time", [])
        if timestamps:
            idx = min(
                range(len(timestamps)),
                key=lambda i: abs(timestamps[i] - now.timestamp()),
            )
            current["visibility"] = (
                (details["visibility"][idx] / 1000)
                if details.get("visibility", [None] * len(timestamps))[idx] is not None
                else None
            )
            current["dew_point"] = details.get(
                "dew_point_2m", [None] * len(timestamps)
            )[idx]
            # KMI may omit UV; use the model value for this hour, including zero at night.
            if current.get("uv_index") is None:
                current["uv_index"] = details.get(
                    "uv_index", [None] * len(timestamps)
                )[idx]
        for warning in warnings:
            warning["starts_at"] = warning["starts_at"].isoformat()
            warning["ends_at"] = warning["ends_at"].isoformat()
        today = now.astimezone(TZ).date()
        suns = sun(Observer(latitude, longitude), date=today, tzinfo=TZ)
        daily = daily_periods(periods)
        # These are astronomical times; avoid provider wall-clock/DST ambiguity.
        if daily:
            daily[0]["sunrise"] = suns["sunrise"].isoformat()
            daily[0]["sunset"] = suns["sunset"].isoformat()
        # Public API access, not an integration dependency. Returned URLs remain provider-owned.
        try:
            radar = self.api.get_radar_forecast()
            animation = self.api.get_animation_data(
                TZ, language, RadarStyle.OPTION_STYLE_STD, True
            )
        except (ValueError, KeyError, TypeError):
            radar, animation = [], {}
        return {
            "name": self.location["name"]
            if self.entry
            else (self.api.get_city() or self.location["name"]),
            "latitude": latitude,
            "longitude": longitude,
            "language": language,
            "timezone": "Europe/Brussels",
            "updated_at": now.isoformat(),
            "current": current,
            "daily_native": daily,
            "hourly_native": hourly,
            "daily": [normalise(f) for f in daily],
            "hourly": [normalise(f) for f in hourly],
            "warnings": warnings,
            "warnings_updated_at": now.isoformat(),
            "rain": [normalise(f) for f in radar],
            "radar": {
                "center": self.api.radar_center,
                "frames": [
                    {"time": f["time"].isoformat(), "url": f["image"]}
                    for f in animation.get("sequence", [])
                ],
                "overlay": animation.get("location"),
                "unit": animation.get("unit"),
            },
            "sun": {key: value.isoformat() for key, value in suns.items()},
            "air": self.air.get("current", {}),
            "supplement_updated_at": self.optional_at.isoformat()
            if self.optional_at
            else None,
            "attribution": "Forecasts, warnings & radar: KMI / IRM · Details: Open-Meteo · Air quality: CAMS ENSEMBLE via Open-Meteo",
        }
