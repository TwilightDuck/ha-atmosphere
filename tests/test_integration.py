"""Feature checks at the HA config-flow/entity/forecast lifecycle boundary."""

import json
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import aiohttp
import pytest
from homeassistant import bootstrap, loader
from homeassistant.components.weather import DOMAIN as WEATHER_DOMAIN
from homeassistant.core import HomeAssistant
from irm_kmi_api import IrmKmiApiClient, IrmKmiApiError

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.asyncio
async def test_standalone_config_flow_entities_forecasts_and_outage(tmp_path):
    from custom_components.atmosphere.coordinator import AtmosphereCoordinator

    # A captured public KMI response exercises the real dependency's parsers.
    raw = json.loads((ROOT / "tests/kmi-response.json").read_text())
    sample = json.loads((ROOT / "tests/live-sample.json").read_text())
    hass = HomeAssistant(str(tmp_path))
    hass.config.skip_pip = True
    loader.async_setup(hass)

    async def get_raw(self, coord):
        return json.loads(json.dumps(raw))

    async def optional_json(self, url, params):
        if "air-quality" in url:
            return {"current": sample["air"]}
        assert "uv_index" in params["hourly"].split(",")
        return {
            "current": {"relative_humidity_2m": 63, "apparent_temperature": 7.1},
            "hourly": {
                "time": [datetime.now(timezone.utc).timestamp()],
                "uv_index": [1.2],
            },
        }

    try:
        with (
            patch.object(IrmKmiApiClient, "get_forecasts_coord", get_raw),
            patch.object(AtmosphereCoordinator, "_json", optional_json),
        ):
            await bootstrap.async_from_config_dict(
                {
                    "homeassistant": {
                        "latitude": 51.30,
                        "longitude": 4.75,
                        "country": "BE",
                        "time_zone": "Europe/Brussels",
                    },
                    "http": {"server_host": "127.0.0.1", "server_port": 18765},
                    "frontend": {},
                    "lovelace": {},
                },
                hass,
            )
            result = await hass.config_entries.flow.async_init(
                "atmosphere", context={"source": "user"}
            )
            assert result["type"] == "form"
            result = await hass.config_entries.flow.async_configure(
                result["flow_id"],
                {
                    "name": "Malle",
                    "latitude": 51.30,
                    "longitude": 4.75,
                    "language": "nl",
                },
            )
            assert result["type"] == "create_entry"
            await hass.async_block_till_done()
            entry = result["result"]
            assert entry.state.value == "loaded", entry.reason
            states = hass.states.async_all()
            weather = next(
                s
                for s in states
                if s.entity_id.startswith("weather.")
                and s.attributes.get("atmosphere_entry_id") == entry.entry_id
            )
            warning = next(
                s
                for s in states
                if s.entity_id.startswith("binary_sensor.")
                and s.attributes.get("warnings")
            )
            assert weather.state not in ("unknown", "unavailable")
            assert weather.attributes["uv_index"] == 1.5
            # The live KMI response omits its UV module outside the main season.
            raw["module"] = [m for m in raw["module"] if m.get("type") != "uv"]
            await entry.runtime_data.async_refresh()
            assert hass.states.get(weather.entity_id).attributes.get("uv_index") == 1.2
            entry.runtime_data.supplement["hourly"]["uv_index"] = [0]
            await entry.runtime_data.async_refresh()
            assert hass.states.get(weather.entity_id).attributes.get("uv_index") == 0
            assert warning.attributes["warnings"][0]["friendly_name"]
            forecast = await hass.services.async_call(
                WEATHER_DOMAIN,
                "get_forecasts",
                {"entity_id": weather.entity_id, "type": "daily"},
                blocking=True,
                return_response=True,
            )
            assert len(forecast[weather.entity_id]["forecast"]) >= 5
            hourly = await hass.services.async_call(
                WEATHER_DOMAIN,
                "get_forecasts",
                {"entity_id": weather.entity_id, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
            assert len(hourly[weather.entity_id]["forecast"]) >= 24
            from homeassistant.components.lovelace import LOVELACE_DATA

            resources = hass.data[LOVELACE_DATA].resources.async_items()
            assert (
                len([r for r in resources if r["url"].startswith("/atmosphere/")]) == 1
            )
            # Exercise current-location lookup over the actual authenticated WS protocol.
            await hass.async_start()
            await hass.auth.async_create_user("Owner", group_ids=["system-admin"])
            user = await hass.auth.async_create_user(
                "Weather viewer", group_ids=["system-users"]
            )
            refresh = await hass.auth.async_create_refresh_token(
                user, client_id="http://localhost/weather-test"
            )
            token = hass.auth.async_create_access_token(refresh)
            before_entries = len(hass.config_entries.async_entries("atmosphere"))
            async with (
                aiohttp.ClientSession() as session,
                session.ws_connect("http://127.0.0.1:18765/api/websocket") as ws,
            ):
                assert (await ws.receive_json())["type"] == "auth_required"
                await ws.send_json({"type": "auth", "access_token": token})
                assert (await ws.receive_json())["type"] == "auth_ok"
                command = {
                    "id": 1,
                    "type": "atmosphere/location",
                    "latitude": 50.85,
                    "longitude": 4.35,
                    "language": "nl",
                }
                await ws.send_json(command)
                reply = await ws.receive_json()
                assert reply["success"], reply
                assert reply["result"]["latitude"] == 50.85
                assert reply["result"]["longitude"] == 4.35
                assert reply["result"]["radar"]["center"] == [0.643, 0.2422]
                await ws.send_json(command | {"id": 2})
                cached = await ws.receive_json()
                assert cached["result"]["updated_at"] == reply["result"]["updated_at"]
                await ws.send_json(command | {"id": 3, "latitude": 91})
                assert not (await ws.receive_json())["success"]
                await ws.send_json(command | {"id": 4, "latitude": 50.9})
                assert (await ws.receive_json())["error"]["code"] == "rate_limited"
            assert (
                len(hass.config_entries.async_entries("atmosphere")) == before_entries
            )
            assert (
                hass.states.get(weather.entity_id).attributes["atmosphere_entry_id"]
                == entry.entry_id
            )
            # Optional radar failure preserves successful forecasts and warnings.
            broken = json.loads(json.dumps(raw))
            broken.pop("animation", None)

            async def no_radar(self, coord):
                return broken

            with patch.object(IrmKmiApiClient, "get_forecasts_coord", no_radar):
                await entry.runtime_data.async_refresh()
                assert entry.runtime_data.last_update_success
                assert entry.runtime_data.data["radar"]["frames"] == []

            # Feed failure must make the native warning sensor unavailable.
            async def outage(self, coord):
                raise IrmKmiApiError("fixture outage")

            with patch.object(IrmKmiApiClient, "get_forecasts_coord", outage):
                await entry.runtime_data.async_refresh()
                assert hass.states.get(warning.entity_id).state == "unavailable"
            # A response with no warning field is not accepted as an all-clear.
            missing = json.loads(json.dumps(raw))
            missing["for"].pop("warning")

            async def no_warning_feed(self, coord):
                return missing

            with patch.object(IrmKmiApiClient, "get_forecasts_coord", no_warning_feed):
                await entry.runtime_data.async_refresh()
                assert not entry.runtime_data.last_update_success
            await hass.config_entries.async_reload(entry.entry_id)
            await hass.async_block_till_done()
            assert entry.state.value == "loaded"
            assert (
                len(
                    [
                        r
                        for r in hass.data[LOVELACE_DATA].resources.async_items()
                        if r["url"].startswith("/atmosphere/")
                    ]
                )
                == 1
            )
            assert await hass.config_entries.async_unload(entry.entry_id)
    finally:
        await hass.async_stop()
