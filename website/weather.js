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

async function loadWeather(community) {
  const { lat, lon } = COMMUNITIES[community];
  $("locationLabel").textContent = `${community.toUpperCase()}, NC`;
  $("condition").textContent = "Loading current conditions…";
  $("alertBanner").hidden = true;

  try {
    const point = await getJson(`https://api.weather.gov/points/${lat},${lon}`);
    const properties = point.properties;

    const [hourly, daily, stations, alerts] = await Promise.all([
      getJson(properties.forecastHourly),
      getJson(properties.forecast),
      getJson(properties.observationStations),
      getJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`)
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
    const wind = obs?.windSpeed?.value != null
      ? `${Math.round(obs.windSpeed.value * 0.621371)} mph`
      : `${currentHour.windDirection} ${currentHour.windSpeed}`;
    const humidity = obs?.relativeHumidity?.value != null
      ? `${Math.round(obs.relativeHumidity.value)}%`
      : "Unavailable";
    const rainChance = currentHour.probabilityOfPrecipitation?.value ?? 0;

    $("temperature").textContent = `${temperature}°`;
    $("feelsLike").textContent = `${feelsLike}°`;
    $("condition").textContent = condition;
    $("weatherIcon").textContent = weatherSymbol(condition);
    $("wind").textContent = wind;
    $("humidity").textContent = humidity;
    $("rainChance").textContent = `${rainChance}%`;
    $("todayHigh").textContent = `${today.temperature}°`;
    $("tonightLow").textContent = `${tonight.temperature}°`;
    $("visibility").textContent = obs?.visibility?.value != null ? `${metersToMiles(obs.visibility.value)} mi` : "Unavailable";
    $("pressure").textContent = obs?.barometricPressure?.value != null ? `${pascalsToInHg(obs.barometricPressure.value)} in` : "Unavailable";
    $("updatedTime").textContent = obs?.timestamp ? `Observed ${formatTime(obs.timestamp)} · National Weather Service` : "National Weather Service forecast";
    $("marineSummary").textContent = `Today: ${today.detailedForecast}`;
    $("forecastDiscussion").textContent = `${today.detailedForecast} Tonight: ${tonight.detailedForecast}`;

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
  }
}

communitySelect.addEventListener("change", (event) => loadWeather(event.target.value));
loadWeather(communitySelect.value);
