"""Read-only provider probe using the real Home Assistant coordinator runtime."""

import asyncio
import json
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from types import MappingProxyType

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from homeassistant import bootstrap, loader
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from custom_components.atmosphere.coordinator import AtmosphereCoordinator


async def main():
    with TemporaryDirectory() as config:
        hass = HomeAssistant(config)
        loader.async_setup(hass)
        await bootstrap.async_from_config_dict(
            {
                "homeassistant": {
                    "latitude": 51.30,
                    "longitude": 4.75,
                    "time_zone": "Europe/Brussels",
                    "country": "BE",
                },
                "network": {},
            },
            hass,
        )
        entry = ConfigEntry(
            data={
                "latitude": 51.30,
                "longitude": 4.75,
                "name": "Malle",
                "language": "nl",
            },
            domain="atmosphere",
            source="user",
            title="Malle",
            unique_id="51.30_4.75",
            version=1,
            minor_version=1,
            options={},
            discovery_keys=MappingProxyType({}),
            subentries_data=[],
        )
        coordinator = AtmosphereCoordinator(hass, entry)
        try:
            data = await coordinator._async_update_data()
            assert data["current"]["temperature"] is not None
            assert len(data["hourly"]) >= 24
            assert len(data["daily"]) >= 5
            assert data["radar"]["frames"]
            for item in data["warnings"]:
                assert item["starts_at"] < item["ends_at"]
            data.pop("daily_native")
            data.pop("hourly_native")
            data["available"] = True
            Path(
                sys.argv[1] if len(sys.argv) > 1 else "/tmp/atmosphere-live.json"
            ).write_text(json.dumps(data, ensure_ascii=False, indent=2))
            print(
                json.dumps(
                    {
                        "temperature": data["current"]["temperature"],
                        "days": len(data["daily"]),
                        "hours": len(data["hourly"]),
                        "warnings": len(data["warnings"]),
                        "radar_frames": len(data["radar"]["frames"]),
                        "air": data["air"],
                    }
                )
            )
        finally:
            await hass.async_stop()


asyncio.run(main())
