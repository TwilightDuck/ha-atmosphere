"""KMI client with isolated caching and strict warning-feed validation."""

from datetime import datetime

from irm_kmi_api import IrmKmiApiClientHa, IrmKmiApiError


class UnsupportedLocation(IrmKmiApiError):
    """The requested coordinates are outside KMI coverage."""


class AtmosphereClient(IrmKmiApiClientHa):
    def __init__(self, session):
        super().__init__(
            session,
            "Atmosphere/1.0 HomeAssistant github.com/TwilightDuck/ha-atmosphere",
        )
        # The dependency's class-level URL-only cache otherwise mixes locations.
        self._cache = {}
        self.radar_center = [0.5, 0.5]

    async def get_forecasts_coord(self, coord):
        result = await super().get_forecasts_coord(coord)
        if result.get("country") not in ("BE", "LU"):
            raise UnsupportedLocation("KMI forecasts cover Belgium and Luxembourg")
        animation = result.get("animation", {})
        if isinstance(animation, dict):
            self.radar_center = [
                animation.get("localisationLayerRatioX", 0.5),
                animation.get("localisationLayerRatioY", 0.5),
            ]
        forecast = result.get("for", {})
        if not isinstance(forecast, dict) or not isinstance(
            forecast.get("warning"), list
        ):
            raise IrmKmiApiError("KMI warning feed missing; warning status is unknown")
        for warning in forecast["warning"]:
            try:
                int(warning["warningType"]["id"])
                start = datetime.fromisoformat(warning["fromTimestamp"])
                end = datetime.fromisoformat(warning["toTimestamp"])
                if start.tzinfo is None or end.tzinfo is None or end <= start:
                    raise ValueError("Invalid warning validity period")
            except (KeyError, TypeError, ValueError) as err:
                raise IrmKmiApiError(
                    "KMI returned a malformed warning; warning status is unknown"
                ) from err
        return result
