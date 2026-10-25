"""UI configuration for a standalone weather location."""

import asyncio
from zoneinfo import ZoneInfo

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from irm_kmi_api import IrmKmiApiError

from .client import AtmosphereClient, UnsupportedLocation
from .const import DOMAIN


class AtmosphereConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure a weather location without another weather integration."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            latitude = user_input["latitude"]
            longitude = user_input["longitude"]
            await self.async_set_unique_id(f"{latitude:.5f}_{longitude:.5f}")
            self._abort_if_unique_id_configured()
            client = AtmosphereClient(async_get_clientsession(self.hass))
            try:
                async with asyncio.timeout(25):
                    await client.refresh_forecasts_coord(
                        {"lat": latitude, "long": longitude}
                    )
                if client.get_country() not in ("BE", "LU"):
                    errors["base"] = "unsupported_location"
                elif not client.get_hourly_forecast(ZoneInfo("Europe/Brussels")):
                    errors["base"] = "cannot_connect"
                else:
                    return self.async_create_entry(
                        title=user_input["name"], data=user_input
                    )
            except UnsupportedLocation:
                errors["base"] = "unsupported_location"
            except (IrmKmiApiError, TimeoutError, ValueError, KeyError, TypeError):
                errors["base"] = "cannot_connect"
        defaults = user_input or {}
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "name",
                        default=defaults.get("name", self.hass.config.location_name),
                    ): str,
                    vol.Required(
                        "latitude",
                        default=defaults.get("latitude", self.hass.config.latitude),
                    ): vol.All(vol.Coerce(float), vol.Range(min=-90, max=90)),
                    vol.Required(
                        "longitude",
                        default=defaults.get("longitude", self.hass.config.longitude),
                    ): vol.All(vol.Coerce(float), vol.Range(min=-180, max=180)),
                    vol.Required(
                        "language", default=defaults.get("language", "nl")
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=["nl", "en", "fr", "de"])
                    ),
                }
            ),
            errors=errors,
        )

    async def async_step_reconfigure(self, user_input=None):
        entry = self._get_reconfigure_entry()
        if user_input is not None:
            return self.async_update_reload_and_abort(entry, data_updates=user_input)
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(
                {
                    vol.Required("name", default=entry.data["name"]): str,
                    vol.Required("language", default=entry.data["language"]): vol.In(
                        ["nl", "en", "fr", "de"]
                    ),
                }
            ),
        )
