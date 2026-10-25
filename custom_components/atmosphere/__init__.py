"""Atmosphere: one integration for weather data and its bundled dashboard card."""

from pathlib import Path

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace import LOVELACE_DATA
from homeassistant.core import callback

from .const import CARD_URL, DOMAIN, PLATFORMS
from .coordinator import AtmosphereCoordinator


async def async_setup(hass, config):
    """Serve the self-contained card and register an authenticated data endpoint."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig("/atmosphere", str(Path(__file__).parent / "frontend"), True)]
    )
    websocket_api.async_register_command(hass, websocket_data)
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
