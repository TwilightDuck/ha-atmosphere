"""Native weather entity with hourly and daily forecast subscriptions."""

from homeassistant.components.weather import (
    SingleCoordinatorWeatherEntity,
    WeatherEntityFeature,
)
from homeassistant.const import (
    UnitOfLength,
    UnitOfPressure,
    UnitOfSpeed,
    UnitOfTemperature,
)

from .entity import AtmosphereEntity


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([AtmosphereWeather(entry.runtime_data)])


class AtmosphereWeather(AtmosphereEntity, SingleCoordinatorWeatherEntity):
    _attr_name = "Weather"
    _attr_attribution = (
        "Royal Meteorological Institute of Belgium (KMI/IRM); Open-Meteo"
    )
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_native_pressure_unit = UnitOfPressure.HPA
    _attr_native_wind_speed_unit = UnitOfSpeed.KILOMETERS_PER_HOUR
    _attr_native_visibility_unit = UnitOfLength.KILOMETERS
    _attr_native_precipitation_unit = UnitOfLength.MILLIMETERS
    _attr_supported_features = (
        WeatherEntityFeature.FORECAST_DAILY | WeatherEntityFeature.FORECAST_HOURLY
    )

    def __init__(self, coordinator):
        super().__init__(coordinator, "weather")

    @property
    def extra_state_attributes(self):
        return {
            "atmosphere_entry_id": self.coordinator.entry.entry_id,
            "updated_at": self.coordinator.data["updated_at"],
        }

    @property
    def condition(self):
        return self.coordinator.data["current"].get("condition")

    @property
    def native_temperature(self):
        return self.coordinator.data["current"].get("temperature")

    @property
    def native_apparent_temperature(self):
        return self.coordinator.data["current"].get("apparent_temperature")

    @property
    def humidity(self):
        return self.coordinator.data["current"].get("humidity")

    @property
    def native_pressure(self):
        return self.coordinator.data["current"].get("pressure")

    @property
    def native_wind_speed(self):
        return self.coordinator.data["current"].get("wind_speed")

    @property
    def native_wind_gust_speed(self):
        return self.coordinator.data["current"].get("wind_gust_speed")

    @property
    def wind_bearing(self):
        return self.coordinator.data["current"].get("wind_bearing")

    @property
    def uv_index(self):
        return self.coordinator.data["current"].get("uv_index")

    @property
    def native_visibility(self):
        return self.coordinator.data["current"].get("visibility")

    @property
    def native_dew_point(self):
        return self.coordinator.data["current"].get("dew_point")

    def _async_forecast_daily(self):
        return self.coordinator.data["daily_native"]

    def _async_forecast_hourly(self):
        return self.coordinator.data["hourly_native"]
