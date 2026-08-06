const COMMUNITIES = {
  Rodanthe: { lat: 35.5935, lon: -75.4671 },
  Waves: { lat: 35.5663, lon: -75.4685 },
  Salvo: { lat: 35.5402, lon: -75.4685 },
  Avon: { lat: 35.3510, lon: -75.5104 },
  Buxton: { lat: 35.2677, lon: -75.5424 },
  Frisco: { lat: 35.2357, lon: -75.6285 },
  Hatteras: { lat: 35.2193, lon: -75.6904 }
};

const $ = (id) => document.getElementById(id);
const communitySelect = $("communitySelect");

function weatherSymbol(description = "") {
  const text = description.toLowerCase();
  if (text.includes("thunder")) return "⚡";
  if (text.includes("snow") || text.includes("sleet")) return "❄";
  if (text.includes("rain") || text.includes("shower")) return "☂";
  if (text.includes("fog") || text.includes("mist")) return "≋";
  if (text.includes("cloud") || text.includes("overcast")) return "☁";
  if (text.includes("sun") || text.includes("clear")) return "☀";
  return "◌";
}

function cToF(value) {
  return Math.round((value * 9) / 5 + 32);
}

function metersToMiles(value) {
  return value == null ? null : (value / 1609.344).toFixed(1);
}

function pascalsToInHg(value) {
  return value == null ? null : (value / 3386.39).toFixed(2);
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function degreesToCompass(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16];
}

function quantityToInches(quantity) {
  const value = quantity?.value;
  if (!Number.isFinite(value)) return null;
  const unit = quantity.unitCode || "";
  if (unit.endsWith(":m")) return value * 39.3701;
  if (unit.endsWith(":mm")) return value / 25.4;
  return null;
}

function durationToMilliseconds(duration) {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(duration || "");
  if (!match) return 0;
  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);
  return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
}

function sumNext24HourPrecipitation(gridData) {
  const property = gridData?.properties?.quantitativePrecipitation;
  const values = property?.values;
  if (!Array.isArray(values) || !values.length) return null;

  const now = Date.now();
  const end = now + 24 * 60 * 60 * 1000;
  let totalMillimeters = 0;
  let hasCoverage = false;

  for (const entry of values) {
    const [startText, durationText] = String(entry.validTime || "").split("/");
    const start = new Date(startText).getTime();
    const duration = durationToMilliseconds(durationText);
    const periodEnd = start + duration;
    const overlapStart = Math.max(start, now);
    const overlapEnd = Math.min(periodEnd, end);

    if (!Number.isFinite(start) || !duration || overlapEnd <= overlapStart || !Number.isFinite(entry.value)) continue;

    const overlapFraction = (overlapEnd - overlapStart) / duration;
    totalMillimeters += entry.value * overlapFraction;
    hasCoverage = true;
  }

  return hasCoverage ? totalMillimeters / 25.4 : null;
}

function formatRainfall(inches) {
  if (!Number.isFinite(inches)) return "Unavailable";
  if (inches < 0.005) return "0.00 in";
  return `${inches.toFixed(2)} in`;
}

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/geo+json, application/json" } });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function renderHourly(periods) {
  $("hourlyForecast").innerHTML = periods.slice(0, 12).map((period) => `
    <article class="hour-card">
      <span>${formatTime(period.startTime)}</span>
      <div class="icon">${weatherSymbol(period.shortForecast)}</div>
      <strong>${period.temperature}°</strong>
      <span>${period.probabilityOfPrecipitation?.value ?? 0}% rain</span>
    </article>
  `).join("");
}

function renderDaily(periods) {
  const daytime = periods.filter((period) => period.isDaytime).slice(0, 7);
  $("dailyForecast").innerHTML = daytime.map((period) => `
    <article class="day-card">
      <span>${new Date(period.startTime).toLocaleDateString([], { weekday: "short" })}</span>
      <div class="icon">${weatherSymbol(period.shortForecast)}</div>
      <strong>${period.temperature}°</strong>
      <span>${period.shortForecast}</span>
    </article>
  `).join("");
}

function setUnavailableState() {
  ["windSpeed", "windDirection", "rainPrevious24", "rainNext24", "visibility", "pressure"].forEach((id) => {
    $(id).textContent = "Unavailable";
  });
  $("sourceUpdated").textContent = "Data request failed";
  $("sourceAvailability").textContent = "Temporarily unavailable";
  $("sourceAvailability").classList.add("error-text");
}

async function loadWeather(community) {
  const { lat, lon } = COMMUNITIES[community];
  $("locationLabel").textContent = `${community.toUpperCase()}, NC`;
  $("condition").textContent = "Loading current conditions…";
  $("condition").classList.remove("error-text");
  $("alertBanner").hidden = true;
  $("sourceAvailability").textContent = "Live";
  $("sourceAvailability").classList.remove("error-text");
  $("sourceUpdated").textContent = "Loading…";

  try {
    const point = await getJson(`https://api.weather.gov/points/${lat},${lon}`);
    const properties = point.properties;

    const [hourly, daily, stations, alerts, gridData] = await Promise.all([
      getJson(properties.forecastHourly),
      getJson(properties.forecast),
      getJson(properties.observationStations),
      getJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`),
      getJson(properties.forecastGridData)
    ]);

    let observation = null;
    const stationUrl = stations.features?.[0]?.id;
    if (stationUrl) {
      try {
        observation = await getJson(`${stationUrl}/observations/latest`);
      } catch (error) {
        console.warn("Observation unavailable; using forecast data.", error);
      }
    }

    const currentHour = hourly.properties.periods[0];
    const periods = daily.properties.periods;
    const today = periods.find((period) => period.isDaytime) || periods[0];
    const tonight = periods.find((period) => !period.isDaytime) || periods[1];
    const obs = observation?.properties;

    const temperature = Number.isFinite(obs?.temperature?.value)
      ? cToF(obs.temperature.value)
      : currentHour.temperature;
    const feelsLike = Number.isFinite(obs?.heatIndex?.value)
      ? cToF(obs.heatIndex.value)
      : Number.isFinite(obs?.windChill?.value)
        ? cToF(obs.windChill.value)
        : temperature;
    const condition = obs?.textDescription || currentHour.shortForecast;

    const observedWindMph = Number.isFinite(obs?.windSpeed?.value)
      ? Math.round(obs.windSpeed.value * 0.621371)
      : null;
    const observedGustMph = Number.isFinite(obs?.windGust?.value)
      ? Math.round(obs.windGust.value * 0.621371)
      : null;
    const observedDirection = degreesToCompass(obs?.windDirection?.value);
    const windDirection = observedDirection || currentHour.windDirection || "Variable";
    const windSpeed = observedWindMph != null ? `${observedWindMph} mph` : currentHour.windSpeed;
    const windSummary = `${windDirection} at ${windSpeed}${observedGustMph != null ? `, gusts ${observedGustMph} mph` : ""}`;

    const humidity = obs?.relativeHumidity?.value != null
      ? `${Math.round(obs.relativeHumidity.value)}%`
      : "Unavailable";
    const rainChance = currentHour.probabilityOfPrecipitation?.value ?? 0;
    const previous24Rain = quantityToInches(obs?.precipitationLast24Hours);
    const next24Rain = sumNext24HourPrecipitation(gridData);
    const stationId = stationUrl?.split("/").pop();

    $("temperature").textContent = `${temperature}°`;
    $("feelsLike").textContent = `${feelsLike}°`;
    $("condition").textContent = condition;
    $("weatherIcon").textContent = weatherSymbol(condition);
    $("wind").textContent = windSummary;
    $("humidity").textContent = humidity;
    $("rainChance").textContent = `${rainChance}%`;
    $("todayHigh").textContent = `${today.temperature}°`;
    $("tonightLow").textContent = `${tonight.temperature}°`;
    $("windSpeed").textContent = observedGustMph != null ? `${windSpeed}, gusts ${observedGustMph} mph` : windSpeed;
    $("windDirection").textContent = windDirection;
    $("rainPrevious24").textContent = formatRainfall(previous24Rain);
    $("rainPreviousNote").textContent = stationId ? `Nearest station: ${stationId}` : "Nearest reporting station";
    $("rainNext24").textContent = formatRainfall(next24Rain);
    $("visibility").textContent = obs?.visibility?.value != null ? `${metersToMiles(obs.visibility.value)} mi` : "Unavailable";
    $("pressure").textContent = obs?.barometricPressure?.value != null ? `${pascalsToInHg(obs.barometricPressure.value)} in` : "Unavailable";
    $("updatedTime").textContent = obs?.timestamp ? `Observed ${formatTime(obs.timestamp)} · National Weather Service` : "National Weather Service forecast";
    $("marineSummary").textContent = `Today: ${today.detailedForecast}`;
    $("forecastDiscussion").textContent = `${today.detailedForecast} Tonight: ${tonight.detailedForecast}`;

    const sourcePage = `https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lon}`;
    $("weatherSourceLink").href = sourcePage;
    $("sourceUpdated").textContent = obs?.timestamp ? formatDateTime(obs.timestamp) : formatDateTime(hourly.properties.updated);

    renderHourly(hourly.properties.periods);
    renderDaily(periods);

    if (alerts.features.length) {
      const first = alerts.features[0].properties;
      $("alertBanner").hidden = false;
      $("alertBanner").textContent = `${first.event}: ${first.headline || first.description}`;
    }
  } catch (error) {
    console.error(error);
    $("condition").textContent = "Weather data is temporarily unavailable.";
    $("condition").classList.add("error-text");
    $("forecastDiscussion").textContent = "The National Weather Service request could not be completed. Try refreshing the page in a moment.";
    setUnavailableState();
  }
}

communitySelect.addEventListener("change", (event) => loadWeather(event.target.value));
loadWeather(communitySelect.value);
