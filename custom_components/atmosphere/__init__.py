"""Atmosphere: one integration for weather data and its bundled dashboard card."""

import asyncio
import math
from pathlib import Path
from time import monotonic

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace import LOVELACE_DATA
from homeassistant.core import callback
from homeassistant.helpers.update_coordinator import UpdateFailed

from .client import UnsupportedLocation
from .const import CARD_URL, DOMAIN, PLATFORMS
from .coordinator import AtmosphereCoordinator


async def async_setup(hass, config):
    """Serve the self-contained card and register an authenticated data endpoint."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig("/atmosphere", str(Path(__file__).parent / "frontend"), True)]
    )
    websocket_api.async_register_command(hass, websocket_data)
    websocket_api.async_register_command(hass, websocket_location)
    hass.data.setdefault(
        DOMAIN,
        {"location_cache": {}, "location_pending": set(), "location_last_request": {}},
    )
    return True


async def async_setup_entry(hass, entry):
    coordinator = AtmosphereCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    lovelace = hass.data[LOVELACE_DATA]
    if lovelace.resource_mode == "storage":
        resources = lovelace.resources
        if not resources.loaded:
            await resources.async_load()
            resources.loaded = True
        existing = next(
            (
                r
                for r in resources.async_items()
                if r["url"].split("?")[0] == CARD_URL.split("?")[0]
            ),
            None,
        )
        if existing and existing["url"] != CARD_URL:
            await resources.async_update_item(
                existing["id"], {"url": CARD_URL, "res_type": "module"}
            )
        elif not existing:
            await resources.async_create_item({"url": CARD_URL, "res_type": "module"})
    return True


async def async_unload_entry(hass, entry):
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


@websocket_api.websocket_command(
    {vol.Required("type"): "atmosphere/data", vol.Optional("entry_id"): str}
)
@callback
def websocket_data(hass, connection, msg):
    """Deliver forecasts on demand without recording large sensor attributes."""
    entries = hass.config_entries.async_entries(DOMAIN)
    entry = (
        next((e for e in entries if e.entry_id == msg.get("entry_id")), None)
        if msg.get("entry_id")
        else next(iter(entries), None)
    )
    if (
        entry is None
        or not hasattr(entry, "runtime_data")
        or entry.runtime_data.data is None
    ):
        connection.send_error(
            msg["id"], "not_loaded", "Atmosphere location is not loaded"
        )
        return
    data = dict(entry.runtime_data.data)
    data.pop("daily_native", None)
    data.pop("hourly_native", None)
    data["available"] = entry.runtime_data.last_update_success
    data["entry_id"] = entry.entry_id
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "atmosphere/location",
        vol.Required("latitude"): vol.All(
            vol.Coerce(float), vol.Range(min=-90, max=90)
        ),
        vol.Required("longitude"): vol.All(
            vol.Coerce(float), vol.Range(min=-180, max=180)
        ),
        vol.Optional("language", default="nl"): vol.In(["nl", "en", "fr", "de"]),
    }
)
@websocket_api.async_response
async def websocket_location(hass, connection, msg):
    """Fetch one explicit GPS location; no entity, config entry, or recorder writes."""
    if not all(math.isfinite(msg[field]) for field in ("latitude", "longitude")):
        connection.send_error(msg["id"], "invalid_format", "Coordinates must be finite")
        return
    store = hass.data[DOMAIN]
    user_id = connection.user.id
    key = (round(msg["latitude"], 4), round(msg["longitude"], 4), msg["language"])
    cached = store["location_cache"].get(user_id)
    if cached and cached["key"] == key and monotonic() - cached["time"] < 420:
        connection.send_result(msg["id"], cached["data"])
        return
    if user_id in store["location_pending"] or (
        monotonic() - store["location_last_request"].get(user_id, 0) < 10
    ):
        connection.send_error(
            msg["id"],
            "rate_limited",
            "Wait a moment before requesting another location",
        )
        return
    store["location_pending"].add(user_id)
    store["location_last_request"][user_id] = monotonic()
    location = {
        "latitude": msg["latitude"],
        "longitude": msg["longitude"],
        "language": msg["language"],
        "name": "Current location",
    }
    try:
        coordinator = AtmosphereCoordinator(hass, None, location=location)
        async with asyncio.timeout(55):
            data = await coordinator._async_update_data()
        data.pop("daily_native", None)
        data.pop("hourly_native", None)
        data["available"] = True
        record = {"key": key, "time": monotonic(), "data": data}
        store["location_cache"][user_id] = record

        def expire():
            if store["location_cache"].get(user_id) is record:
                store["location_cache"].pop(user_id, None)

        hass.loop.call_later(420, expire)
        connection.send_result(msg["id"], data)
    except UpdateFailed as err:
        code = (
            "unsupported_location"
            if isinstance(err.__cause__, UnsupportedLocation)
            else "cannot_connect"
        )
        connection.send_error(
            msg["id"], code, "Current-location weather could not be retrieved"
        )
    except TimeoutError:
        connection.send_error(
            msg["id"], "cannot_connect", "Current-location request timed out"
        )
    finally:
        store["location_pending"].discard(user_id)
