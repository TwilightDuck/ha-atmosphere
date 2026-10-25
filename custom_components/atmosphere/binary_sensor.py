"""A true safety sensor for active local warnings, never 'clear' on failure."""

from datetime import datetime

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.util import dt as dt_util

from .entity import AtmosphereEntity


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([AtmosphereWarnings(entry.runtime_data)])


class AtmosphereWarnings(AtmosphereEntity, BinarySensorEntity):
    _attr_name = "Weather warning"
    _attr_device_class = BinarySensorDeviceClass.SAFETY

    def __init__(self, coordinator):
        super().__init__(coordinator, "warnings")

    @property
    def is_on(self):
        now = dt_util.utcnow()
        return any(
            datetime.fromisoformat(w["starts_at"])
            <= now
            < datetime.fromisoformat(w["ends_at"])
            for w in self.coordinator.data["warnings"]
        )

    @property
    def extra_state_attributes(self):
        return {
            "warnings": self.coordinator.data["warnings"],
            "updated_at": self.coordinator.data["warnings_updated_at"],
            "attribution": "KMI / IRM — warnings returned for this location; see affected areas in the warning text",
        }
