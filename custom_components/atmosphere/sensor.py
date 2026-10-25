"""Useful automation sensors accompanying the card."""

from datetime import datetime

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity

from .entity import AtmosphereEntity

SENSORS = {
    "feels_like": (
        "Feels like",
        SensorDeviceClass.TEMPERATURE,
        "°C",
        "current",
        "apparent_temperature",
    ),
    "air_quality": ("European air quality index", None, None, "air", "european_aqi"),
    "updated": (
        "Forecast updated",
        SensorDeviceClass.TIMESTAMP,
        None,
        None,
        "updated_at",
    ),
}


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([AtmosphereSensor(entry.runtime_data, key) for key in SENSORS])


class AtmosphereSensor(AtmosphereEntity, SensorEntity):
    def __init__(self, coordinator, key):
        super().__init__(coordinator, key)
        self.key = key
        (
            self._attr_name,
            self._attr_device_class,
            self._attr_native_unit_of_measurement,
            self.section,
            self.field,
        ) = SENSORS[key]

    @property
    def native_value(self):
        data = self.coordinator.data
        value = (
            data.get(self.section, {}).get(self.field)
            if self.section
            else data.get(self.field)
        )
        return (
            datetime.fromisoformat(value) if self.key == "updated" and value else value
        )
